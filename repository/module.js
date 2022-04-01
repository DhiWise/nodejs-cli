const path = require("path");
const renderEJS = require('./render');
const utility = require("../utils/index");
const replace = require('key-value-replace');
const constant = require("../constant");
const fs = require('fs');

class createModule extends renderEJS {
    constructor({ projectPath, setup, orm, projectType }) {
        super(projectPath);
        this.projectPath = this.renderPath;
        this.setup = setup;
        this.orm = orm;
        this.projectType = projectType;
    }
    async renderModule({ model, platform, modelPermission, attributes, isNewModel, modelPath }) {
        // modelIndex
        if (isNewModel) {
            let validation = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/validation.js`);
            let modelTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/model.js`);
            modelTemplate.locals.DB_MODEL = model;
            if (this.orm === constant.ORM.SEQUELIZE) {
                this.modelObject = await utility.getSQLModelAttribute(attributes || '');
                this.modelValidation = await utility.getSequelizeJoiValidation(attributes || '');
                modelTemplate.locals.SCHEMA = this.modelObject;
                this.write(path.join(modelPath, `${model}.js`), modelTemplate.render(), MODE_0666);
                let modelIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/index.js`);
                modelIndex.locals.MODEL = model;
                let indexModelPath = path.join(modelPath, 'index.js');
                let newCodeModelIndex = utility.appendCodeInRoute(indexModelPath, modelIndex.render());
                if (newCodeModelIndex) {
                    this.write(indexModelPath, newCodeModelIndex, MODE_0666);
                }
            } else {
                this.modelObject = await utility.getMongooseModelAttribute(attributes || '');
                this.modelValidation = await utility.getMongooseJoiValidation(attributes || '');
                modelTemplate.locals.SCHEMA = this.modelObject;
                this.write(path.join(modelPath, `${model}.js`), modelTemplate.render(), MODE_0666);
            }


            if (this.projectType === constant.PROJECT_TYPE.CC) {
                // entity
                let entityTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/entity.js`);
                entityTemplate.locals.MODEL = model;
                entityTemplate.locals.SCHEMA = this.modelObject ? Object.keys(this.modelObject) : [];

                let entityPath = this.setup.userDirectoryPaths.entityPath;
                entityPath = replace(entityPath, { model });
                this.write(entityPath, entityTemplate.render(), MODE_0666);

                // data-access
                let dataAccessTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/data-access.js`);
                dataAccessTemplate.locals.MODEL = model;
                let dataAccessPath = this.setup.userDirectoryPaths.dataAccessPath;
                dataAccessPath = replace(dataAccessPath, { model });
                this.write(dataAccessPath, dataAccessTemplate.render(), MODE_0666);

            }

            let validationPath = this.setup.userDirectoryPaths.validationPath;
            validationPath = replace(validationPath, { model });

            // joi validation
            if (this.modelValidation) {
                validation.locals.SCHEMA = this.modelValidation;
            }
            this.write(validationPath, validation.render(), MODE_0666);

        }

        if (platform.length) {
            platform.forEach((plt) => {

                let routePath = this.setup.userDirectoryPaths.routePath;
                let controllerPath = this.setup.userDirectoryPaths.controllerPath;
                let controllerIndexPath = this.setup.userDirectoryPaths.controllerIndexPath;
                
                if (plt !== 'admin') {
                    routePath = replace(routePath, { platform: plt, model, version: 'v1' });
                    controllerPath = replace(controllerPath, { model, platform: plt,version:'v1' })
                    if(controllerIndexPath){
                        controllerIndexPath = replace(controllerIndexPath, { platform: plt, model , version:'v1' });
                    }
                } else {
                    routePath = replace(routePath, { platform: plt, model, version: '' });
                    controllerPath = replace(controllerPath, { model, platform: plt,version:'' })
                    if(controllerIndexPath){
                        controllerIndexPath = replace(controllerIndexPath, { platform: plt, model , version:'' });
                    }
                }
                routePath = path.join(routePath, `${model}Routes.js`);
                
                if (this.projectType === constant.PROJECT_TYPE.CC) {
                    controllerPath = path.join(controllerPath,model,`${model}.js`);
                    controllerIndexPath = path.join(controllerIndexPath,model);
                }else{
                    controllerPath = path.join(controllerPath,`${model}Controller.js`);
                }
                
                if (fs.existsSync(routePath)) {
                    // load other template
                    let routeTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/existRoute.js`);
                    routeTemplate.locals.MODEL = model;
                    routeTemplate.locals.METHODS = modelPermission;
                    routeTemplate.locals.PLATFORM = plt;
                    if (plt === "admin") {
                        routeTemplate.locals.ROUTE_PREFIX = `${plt}/${model}`
                    } else {
                        routeTemplate.locals.ROUTE_PREFIX = `${plt}/api/v1/${model}`
                    }

                    // this.write(routePath, routeTemplate.render(), MODE_0666);
                    // let platformIndexPath = path.join(this.projectPath, 'routes', plt, 'index.js');
                    let newRouteCode = utility.appendCodeInRoute(routePath, routeTemplate.render());
                    if (newRouteCode) {
                        this.write(routePath, newRouteCode, MODE_0666);
                    }
                } else {
                    let routeTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/routes.js`);
                    routeTemplate.locals.MODEL = model;
                    routeTemplate.locals.METHODS = modelPermission;
                    routeTemplate.locals.PLATFORM = plt;
                    if (plt === "admin") {
                        routeTemplate.locals.ROUTE_PREFIX = `${plt}/${model}`
                    } else {
                        routeTemplate.locals.ROUTE_PREFIX = `${plt}/api/v1/${model}`
                    }

                    this.write(routePath, routeTemplate.render(), MODE_0666);

                    let platformIndexPath = this.setup.userDirectoryPaths.routePlatformIndexPath;
                    if (plt !== 'admin') {
                        platformIndexPath = replace(platformIndexPath, { platform: plt, model, version: 'v1' });
                    } else {
                        platformIndexPath = replace(platformIndexPath, { platform: plt, model, version: '' });
                    }
                    platformIndexPath = path.join(platformIndexPath, 'index.js');
                    let platformIndex = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/platformIndex.js`);
                    platformIndex.locals.MODEL = model;
                    let newCodePlatformIndex = utility.appendCodeInRoute(platformIndexPath, platformIndex.render());
                    if (newCodePlatformIndex) {
                        this.write(platformIndexPath, newCodePlatformIndex, MODE_0666);
                    }
                }

                if (fs.existsSync(controllerPath)) {
                    // load other template
                    let controllerTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controller.js`);
                    controllerTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/existController.js`);
                    controllerTemplate.locals.MODEL = model;
                    controllerTemplate.locals.METHODS = modelPermission;
                    controllerTemplate.locals.PLATFORM = plt;
                    let newCode = '';
                    let controllerFunctionName = utility.getControllerFunctionNames(modelPermission, model, this.projectType, this.orm);
                    newCode = utility.appendCodeInController(controllerPath, controllerTemplate.render(), Object.values(controllerFunctionName));

                    if (newCode) {
                        this.write(controllerPath, newCode, MODE_0666);
                    }

                    if (this.projectType === constant.PROJECT_TYPE.CC) {
                        // append controller index as well
                        let controllerIndexTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controllerIndex.js`);
                        controllerIndexTemplate.locals.MODEL = model;
                        controllerIndexTemplate.locals.IS_EXIST = true;
                        controllerIndexTemplate.locals.METHODS = modelPermission;
                        controllerIndexTemplate.locals.PLATFORM = plt;
                        controllerIndexPath = path.join(controllerIndexPath, 'index.js');
                        let newControllerIndexCode = utility.appendCodeInController(controllerIndexPath, controllerIndexTemplate.render(), Object.values(controllerFunctionName));
                        if (newControllerIndexCode) {
                            this.write(controllerIndexPath, newControllerIndexCode, MODE_0666);
                        }
                    }

                } else {
                    let controllerTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controller.js`);
                    controllerTemplate.locals.MODEL = model;
                    controllerTemplate.locals.METHODS = modelPermission;
                    controllerTemplate.locals.PLATFORM = plt;

                    if (this.projectType === constant.PROJECT_TYPE.CC) {
                        let controllerIndexTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controllerIndex.js`);
                        controllerIndexTemplate.locals.MODEL = model;
                        controllerIndexTemplate.locals.IS_EXIST = false;
                        controllerIndexTemplate.locals.METHODS = modelPermission;
                        controllerIndexTemplate.locals.PLATFORM = plt;
                        this.mkdir(controllerIndexPath, '');
                        this.write(path.join(controllerIndexPath, 'index.js'), controllerIndexTemplate.render(), MODE_0666);
                    }
                    this.write(controllerPath, controllerTemplate.render(), MODE_0666);
                }
            })
        }

        // use-case add
        if (this.projectType === constant.PROJECT_TYPE.CC) {
            if (modelPermission.includes("U")) {
                modelPermission.push('PU');
            }
            let useCaseName = utility.getControllerFunctionNames(modelPermission, model, this.projectType, this.orm);
            for (const operation in useCaseName) {
                if (Object.hasOwnProperty.call(useCaseName, operation)) {
                    let useCasePath = this.setup.userDirectoryPaths.useCasePath;
                    useCasePath = replace(useCasePath, { model });
                    let useCase = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/use-case.js`);
                    useCase.locals.METHOD = operation;
                    useCase.locals.MODEL = model;
                    if(!fs.existsSync(useCasePath)){
                        this.mkdir(useCasePath,'')
                    }
                    useCasePath = path.join(useCasePath, `${useCaseName[operation]}.js`);
                    if(!fs.existsSync(useCasePath)){
                        this.write(useCasePath, useCase.render(), MODE_0666);
                    }
                }
            }
        }

        // postman collection
        let postman = JSON.parse(fs.readFileSync(`${this.projectPath}/postman/postman-collection.json`));
        let requests = this.setPostmanObject(modelPermission, platform, model);
        postman = await utility.setMultipleApiInPostman(postman, requests, model);
        fs.writeFileSync(`${this.projectPath}/postman/postman-collection.json`, JSON.stringify(postman, null, 2)); ``

    }

    setPostmanObject(modelPermission, platforms, model) {
        let request = [];
        let capModel = model.charAt(0).toUpperCase() + model.slice(1);
        modelPermission.forEach((value) => {
            platforms.forEach((plt) => {
                switch (value) {
                    case 'C':
                        request.push({
                            name: `add${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/create` : `${plt}/api/v1/${model}/create`,
                            method: 'POST',
                            platform: plt
                        })
                        break;
                    case 'U':
                        request.push({
                            name: `update${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/update/:id` : `${plt}/api/v1/${model}/update/:id`,
                            method: 'PUT',
                            platform: plt
                        })
                        request.push({
                            name: `partialUpdate${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/create` : `${plt}/api/v1/${model}/create`,
                            method: 'PUT',
                            platform: plt
                        })
                        break;
                    case 'FALL':
                        request.push({
                            name: `findAll${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/list` : `${plt}/api/v1/${model}/list`,
                            method: 'POST',
                            platform: plt
                        })
                        break;
                    case 'FBYID':
                        request.push({
                            name: `get${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/:id` : `${plt}/api/v1/${model}/:id`,
                            method: 'GET',
                            platform: plt
                        })
                        break;
                    case 'COUNT':
                        request.push({
                            name: `get${capModel}Count`,
                            url: plt === 'admin' ? `/${plt}/${model}/count` : `${plt}/api/v1/${model}/count`,
                            method: 'POST',
                            platform: plt
                        })
                        break;
                    case 'D':
                        request.push({
                            name: `delete${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/delete/:id` : `${plt}/api/v1/${model}/delete/:id`,
                            method: 'DELETE',
                            platform: plt
                        })
                        break;
                    case 'BC':
                        request.push({
                            name: `bulkInsert${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/addBulk` : `${plt}/api/v1/${model}/addBulk`,
                            method: 'POST',
                            platform: plt
                        })
                        break;
                    case 'BU':
                        request.push({
                            name: `bulkUpdate${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/updateBulk` : `${plt}/api/v1/${model}/updateBulk`,
                            method: 'PUT',
                            platform: plt
                        })
                        break;
                    case 'DMANY':
                        request.push({
                            name: `deleteMany${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/deleteMany` : `${plt}/api/v1/${model}/deleteMany`,
                            method: 'DELETE',
                            platform: plt
                        })
                        break;
                    case 'SD':
                        request.push({
                            name: `softDelete${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/softDelete/:id` : `${plt}/api/v1/${model}/softDelete/:id`,
                            method: 'PUT',
                            platform: plt
                        })
                        break;
                    case 'SDMANY':
                        request.push({
                            name: `softDeleteMany${capModel}`,
                            url: plt === 'admin' ? `/${plt}/${model}/softDeleteMany` : `${plt}/api/v1/${model}/softDeleteMany`,
                            method: 'POST',
                            platform: plt
                        })
                        break;

                    default:
                        break;
                }
            })
        })
        return request;
    }

}

module.exports = createModule;