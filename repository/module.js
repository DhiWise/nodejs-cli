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
    async renderModule({ model, platform, modelPermission, attributes, isNewModel }) {

        let routeTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/routes.js`);
        let controllerTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controller.js`);
        let platformIndex = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/platformIndex.js`);
        platformIndex.locals.MODEL = model;
        let validation = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/validation.js`);

        // modelIndex
        if (isNewModel) {
            let modelPath = this.setup.userDirectoryPaths.modelPath;
            let modelTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/model.js`);
            modelTemplate.locals.DB_MODEL = model;
            if (this.orm === constant.ORM.SEQUELIZE) {
                this.modelObject = await utility.getSQLModelAttribute(attributes || '');
                this.modelValidation = await utility.getSequelizeJoiValidation(attributes || '');
                modelTemplate.locals.SCHEMA = this.modelObject;
                this.write(path.join(modelPath, `${model}.js`), modelTemplate.render(), MODE_0666);
                let modelIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/index.js`);
                modelIndex.locals.MODEL = model;
                let indexModelPath = path.join(this.projectPath, 'model', 'index.js');
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


            // entity
            if (this.projectType === constant.PROJECT_TYPE.CC) {
                let entityTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/entity.js`);
                entityTemplate.locals.MODEL = model;

                let entityPath = this.setup.userDirectoryPaths.entityPath;
                entityPath = replace(entityPath, { model });
                this.write(entityPath, entityTemplate.render(), MODE_0666);
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

                routeTemplate.locals.MODEL = model;
                routeTemplate.locals.METHODS = modelPermission;
                routeTemplate.locals.PLATFORM = plt;
                if (plt === "admin") {
                    routeTemplate.locals.ROUTE_PREFIX = `${plt}/${model}`
                } else {
                    routeTemplate.locals.ROUTE_PREFIX = `${plt}/api/v1/${model}`
                }

                controllerTemplate.locals.MODEL = model;
                controllerTemplate.locals.METHODS = modelPermission;
                controllerTemplate.locals.PLATFORM = plt;


                if (this.projectType === constant.PROJECT_TYPE.CC) {
                    let controllerIndexTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controllerIndex.js`);
                    controllerIndexTemplate.locals.MODEL = model;
                    let controllerIndexPath = this.setup.userDirectoryPaths.controllerIndexPath;
                    controllerIndexPath = replace(controllerIndexPath, { platform: plt, model });
                    this.mkdir(controllerIndexPath, '');
                    this.write(path.join(controllerIndexPath, 'index.js'), controllerIndexTemplate.render(), MODE_0666);
                }

                routePath = replace(routePath, { platform: plt, model });
                controllerPath = replace(controllerPath, { model, platform: plt })
                this.write(routePath, routeTemplate.render(), MODE_0666);
                this.write(controllerPath, controllerTemplate.render(), MODE_0666);

                let platformIndexPath = path.join(this.projectPath, 'routes', plt, 'index.js');
                let newCodePlatformIndex = utility.appendCodeInRoute(platformIndexPath, platformIndex.render());
                if (newCodePlatformIndex) {
                    this.write(platformIndexPath, newCodePlatformIndex, MODE_0666);
                }
            })
        }

        // postman collection
        let postman = JSON.parse(fs.readFileSync(`${this.projectPath}/postman/postman-collection.json`));
        let requests = this.setPostmanObject(modelPermission, platform, model);
        postman = await utility.setMultipleApiInPostman(postman, requests, model);
        fs.writeFileSync(`${this.projectPath}/postman/postman-collection.json`, JSON.stringify(postman, null, 2))

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