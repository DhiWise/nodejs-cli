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
    let ast = parse(data,{allowReturnOutsideFunction:true});
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
                                        let newBody = parse(newCode,{allowReturnOutsideFunction:true});
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

module.exports = {
    getProjectTypeAndOrmType,
    appendCodeInRoute,
    appendCodeInController,
    appendCodeInCleanCodeController
}