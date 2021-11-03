const path = require("path");
const renderEJS = require('./render');
const utility = require("../utils/index");
const replace = require('key-value-replace');
const constant = require("../constant")

class createModule extends renderEJS {
    constructor({ projectPath, setup, orm, projectType }) {
        super(projectPath);
        this.projectPath = this.renderPath;
        this.setup = setup;
        this.orm = orm;
        this.projectType = projectType;
    }
    async renderModule({ model, platform, modelPermission }) {

        let modelPath = this.setup.userDirectoryPaths.modelPath;

        let modelTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/model.js`);
        let routeTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/routes.js`);
        let controllerTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/controller.js`);
        let platformIndex = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/platformIndex.js`);
        platformIndex.locals.MODEL = model;
        let validation = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/validation.js`);
        
        // model
        modelTemplate.locals.DB_MODEL = model;
        this.write(path.join(modelPath, `${model}.js`), modelTemplate.render(), MODE_0666);

        // modelIndex
        if(this.orm === constant.ORM.SEQUELIZE){
            let modelIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/index.js`);
            modelIndex.locals.MODEL = model;
            let indexModelPath = path.join(this.projectPath, 'model', 'index.js');
            let newCodeModelIndex = utility.appendCodeInRoute(indexModelPath, modelIndex.render());
            if (newCodeModelIndex) {
                this.write(indexModelPath, newCodeModelIndex, MODE_0666);
            }
        }

        // entity
        if (this.projectType === constant.PROJECT_TYPE.CC) {
            let entityTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modulePath}/entity.js`);
            entityTemplate.locals.MODEL = model;

            let entityPath = this.setup.userDirectoryPaths.entityPath;
            entityPath = replace(entityPath, { model });
            this.write(entityPath, entityTemplate.render(), MODE_0666);
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
        let validationPath = this.setup.userDirectoryPaths.validationPath;
        validationPath = replace(validationPath, { model });
        this.write(validationPath, validation.render(), MODE_0666);

    }

}

module.exports = createModule;