const fs = require("fs");
const path = require("path");
const traverse = require("@babel/traverse").default;
const parse = require("@babel/parser").parse;
const generate = require('@babel/generator').default;
const types = require('@babel/types');
const astConstant = require("../constant/astConstant")
const constant = require("../constant/index")


function getProjectTypeAndOrmType(projectPath) {
    let projectType = "";
    let ormType = "";

    let entityPath = path.join(projectPath, 'entity');
    let helperPath = path.join(projectPath, 'helpers');
    if (fs.existsSync(entityPath) && fs.existsSync(helperPath)) {
        projectType = constant.PROJECT_TYPE.CC;
    } else {
        projectType = constant.PROJECT_TYPE.MVC;
    }

    let pkgJsonPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
        let pkg = fs.readFileSync(pkgJsonPath);
        pkg = JSON.parse(pkg);
        if (pkg.dependencies.mongoose) {
            ormType = constant.ORM.MONGOOSE;
        } else if (pkg.dependencies.sequelize) {
            ormType = constant.ORM.SEQUELIZE;
        }
    }
    return { projectType, ormType };
}

function appendCodeInRoute(filePath, newCode) {
    let finalCode = false;
    let data = fs.readFileSync(filePath, 'utf-8');
    let ast = parse(data);
    traverse(ast, {
        Program({ node }) {
            if (node.body.length) {
                let existedRoutes = [], needToPush = true;
                for (let j = 0; j < node.body.length; j++) {
                    const element = node.body[j];
                    if (element.expression?.arguments?.[0]?.arguments?.[0].value) {
                        existedRoutes.push(element.expression.arguments[0].arguments[0].value);
                    }
                }
                existedRoutes.forEach((v) => {
                    if (newCode.includes(v)) {
                        needToPush = false;
                    }
                })
                if (needToPush) {
                    for (let index = node.body.length - 1; index > 0; index--) {
                        const element = node.body[index];
                        if (types.isExpressionStatement(element)) {
                            if (element.expression.operator === "=") {
                                if (element.expression?.left?.object?.name === "module" && element.expression?.left?.property?.name === "exports" && element.expression?.right?.name === "router") {
                                    let newBody = parse(newCode);
                                    if (newBody.program.body.length) {
                                        ast.program.body.splice(index, 0, newBody.program.body[0]);
                                        let { code } = generate(ast, {
                                            comments: false,
                                            minified: false,
                                            jsonCompatibleStrings: true
                                        }, data);
                                        finalCode = code;
                                        break;

                                    }
                                } else if (types.isMemberExpression(element.expression?.left) && types.isCallExpression(element.expression?.right)) {
                                    if (element.expression?.left.object?.name === "db" && types.isIdentifier(element.expression?.left.property)) {
                                        if (element.expression.right?.callee?.name === "require" || element.expression.right?.callee?.callee?.name === "require") {
                                            let newBody = parse(newCode);
                                            if (newBody.program.body.length) {
                                                ast.program.body.splice(index + 1, 0, newBody.program.body[0]);
                                                let { code } = generate(ast, {
                                                    comments: false,
                                                    minified: false,
                                                    jsonCompatibleStrings: true
                                                }, data);
                                                finalCode = code;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    })
    return finalCode;
}

function appendCodeInController(filePath, newCode, controllerFunctionName) {
    let finalCode = false;
    let data = fs.readFileSync(filePath, 'utf-8');
    let ast = parse(data);
    traverse(ast, {
        Program({ node }) {
            if (node.body.length) {
                for (let index = node.body.length; index > 0; index--) {
                    const element = node.body[index];
                    if (types.isExpressionStatement(element)) {
                        if (element.expression.operator === "=") {
                            if (element.expression?.left?.object?.name === "module" && element.expression?.left?.property?.name === "exports") {
                                let newBody = parse(newCode);
                                if (newBody.program.body.length) {
                                    astConstant.CONTROLLER_EXPORT_AST.key.name = controllerFunctionName;
                                    astConstant.CONTROLLER_EXPORT_AST.value.name = controllerFunctionName;
                                    element.expression?.right?.properties.push(astConstant.CONTROLLER_EXPORT_AST);
                                    ast.program.body.splice(index, 0, newBody.program.body[0]);
                                    let { code } = generate(ast, {
                                        comments: false,
                                        minified: false,
                                        jsonCompatibleStrings: true
                                    }, data);
                                    finalCode = code;
                                    break;
                                    // append to module.exports = {controllerFunctionName}
                                    // return code;
                                }
                            }
                        }
                    }

                }
            }
        }
    })
    return finalCode;
}

function appendCodeInCleanCodeController(filePath, newCode, controllerFunctionName) {
    let finalCode = false;
    let data = fs.readFileSync(filePath, 'utf-8');
    let ast = parse(data, { allowReturnOutsideFunction: true });
    traverse(ast, {
        Program({ node }) {
            if (node.body.length) {
                for (let index = node.body.length; index > 0; index--) {
                    const element = node.body[index];
                    if (types.isFunctionDeclaration(element)) {
                        if (element.body.body.length) {
                            let functionBody = element.body.body;
                            for (let j = functionBody.length - 1; j > 0; j--) {
                                const functionElement = functionBody[j];
                                if (types.isReturnStatement(functionElement)) {
                                    if (functionElement?.argument?.callee?.object?.name === "Object" && functionElement?.argument?.callee?.property?.name === "freeze") {
                                        astConstant.CONTROLLER_EXPORT_AST.key.name = controllerFunctionName;
                                        astConstant.CONTROLLER_EXPORT_AST.value.name = controllerFunctionName;
                                        functionElement.argument.arguments[0].properties.push(astConstant.CONTROLLER_EXPORT_AST);
                                        let newBody = parse(newCode, { allowReturnOutsideFunction: true });
                                        ast.program.body[index].body.body.splice(j, 0, newBody.program.body[0]);

                                        let { code } = generate(ast, {
                                            comments: false,
                                            minified: false,
                                            jsonCompatibleStrings: true
                                        }, data);
                                        finalCode = code;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }
    })
    return finalCode;
}

async function getMongooseModelAttribute(attribute) {
    attribute = attribute.split(",");
    let modelAttr = {}
    attribute.forEach((v) => {
        v = v.split(":")
        modelAttr[v[0]] = v[1];
    })
    for (let i in modelAttr) {
        if (!Object.keys(constant.MONGOOSE_TYPE).includes(modelAttr[i])) {
            modelAttr[i] = { type: 'String' };
        } else {
            modelAttr[i] = { type: constant.MONGOOSE_TYPE[modelAttr[i]] };
        }
    }
    // console.dir(JSON.stringify(modelAttr))
    modelAttr = { ...modelAttr, ...constant.STATIC_KEYS_MONGOOSE }
    return modelAttr;
}

async function getSQLModelAttribute(attribute) {
    attribute = attribute.split(",");
    let modelAttr = {}
    attribute.forEach((v) => {
        v = v.split(":")
        modelAttr[v[0]] = v[1];
    })
    for (let i in modelAttr) {
        if (!Object.keys(constant.SEQUELIZE_TYPE).includes(modelAttr[i])) {
            modelAttr[i] = { type: 'DataTypes.STRING' };
        } else {
            modelAttr[i] = { type: constant.SEQUELIZE_TYPE[modelAttr[i]] };
        }
    }
    // console.dir(JSON.stringify(modelAttr))
    modelAttr = { ...modelAttr, ...constant.STATIC_KEYS_SEQUELIZE }
    return modelAttr;
}

async function getSequelizeJoiValidation(attribute) {
    attribute = attribute.split(",");
    let modelAttr = {}
    attribute.forEach((v) => {
        v = v.split(":")
        modelAttr[v[0]] = v[1];
    });

    for (const key in modelAttr) {
        const element = modelAttr[key];
        let joi = constant.SEQUELIZE_JOI_VALIDATION[element];
        if (joi) {
            modelAttr[key] = joi;
        } else {
            modelAttr[key] = constant.SEQUELIZE_JOI_VALIDATION['string'];
        }
    }
    modelAttr = { ...modelAttr, ...constant.STATIC_SEQUELIZE_JOI_VALIDATION }
    return modelAttr;
}

async function getMongooseJoiValidation(attribute) {
    attribute = attribute.split(",");
    let modelAttr = {}
    attribute.forEach((v) => {
        v = v.split(":")
        modelAttr[v[0]] = v[1];
    });

    for (const key in modelAttr) {
        const element = modelAttr[key];
        let joi = constant.MONGOOSE_JOI_VALIDATION[element];
        if (joi) {
            modelAttr[key] = joi;
        } else {
            modelAttr[key] = constant.MONGOOSE_JOI_VALIDATION['string'];
        }
    }
    modelAttr = { ...modelAttr, ...constant.STATIC_MONGOOSE_JOI_VALIDATION }
    return modelAttr;
}


async function setSingleApiInPostman(postman, obj) {
    postman.item.forEach((platformItem) => {
        if (platformItem.name === obj.platform) {
            let modelItem = platformItem.item;
            let isModelFound = true;
            for (let index = 0; index < modelItem.length; index++) {
                let modelArr = modelItem[index];
                if (modelArr.name === obj.model) {
                    let req = { ...constant.STATIC_REQUEST_FOR_POSTMAN };
                    req.name = obj.name;
                    req.request.url = `{{url}}${obj.url}`
                    req.request.method = obj.method;
                    modelArr.item.push(req);
                    return postman;
                } else {
                    isModelFound = false;
                }
            }
            if (!isModelFound) {
                let newModelObj = {
                    name: obj.model,
                    description: `${obj.model} Model APIs`,
                    item: []
                }
                let req = { ...constant.STATIC_REQUEST_FOR_POSTMAN };
                req.name = obj.name;
                req.request.url = `{{url}}${obj.url}`
                req.request.method = obj.method;
                newModelObj.item.push(req);
                platformItem.item.push(newModelObj);
            }
        }
    })
    return postman;
}

async function setMultipleApiInPostman(postman, obj, model) {
    const platformWise = groupBy(obj, 'platform');
    postman.item.forEach((platformItem) => {
        for (const platform in platformWise) {
            if (platformItem.name === platform) {
                let newModelObj = {
                    name: model,
                    description: `${model} Model APIs`,
                    item: []
                }
                const byPlatform = platformWise[platform];
                byPlatform.forEach((reqObj) => {
                    let req = { ...constant.STATIC_REQUEST_FOR_POSTMAN };
                    req.name = reqObj.name;
                    req.request.url = `{{url}}${reqObj.url}`
                    req.request.method = reqObj.method;
                    newModelObj.item.push(req);
                })
                platformItem.item.push(newModelObj);
            }
        }
    })

    return postman;
}

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

module.exports = {
    getProjectTypeAndOrmType,
    appendCodeInRoute,
    appendCodeInController,
    appendCodeInCleanCodeController,
    getMongooseModelAttribute,
    getSQLModelAttribute,
    getSequelizeJoiValidation,
    getMongooseJoiValidation,
    setSingleApiInPostman,
    setMultipleApiInPostman
}