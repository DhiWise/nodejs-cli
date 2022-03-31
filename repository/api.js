const path = require("path");
const renderEJS = require('./render');
const fs = require("fs");
const utility = require("../utils");
const constant = require("../constant/index");
const replace = require('key-value-replace');
class createAPI extends renderEJS {
    constructor({ projectPath, setup, orm, projectType }) {
        super(projectPath);
        this.projectPath = this.renderPath;
        this.setup = setup;
        this.orm = orm;
        this.projectType = projectType;
    }
    async renderRoute({ model, platform, routeMethod, routePattern, controllerFunctionName }) {
        let routePath = this.setup.userDirectoryPaths.routePath;
        let controllerPath = this.setup.userDirectoryPaths.controllerPath;
        let controllerIndexPath = this.setup.userDirectoryPaths.controllerIndexPath;
        
        if (platform !== 'admin') {
            routePath = replace(routePath, { platform, model, version: 'v1' });
            controllerPath = replace(controllerPath, { model, platform, version: 'v1' });
            if(controllerIndexPath){
                controllerIndexPath = replace(controllerIndexPath, { platform, model, version: 'v1' });
            }
        } else {
            routePath = replace(routePath, { platform, model, version: '' });
            controllerPath = replace(controllerPath, { model, platform, version: '' });
            if(controllerIndexPath){
                controllerIndexPath = replace(controllerIndexPath, { platform, model, version: '' });
            }
        }

        routePath = path.join(routePath, `${model}Routes.js`);
        if (this.projectType === constant.PROJECT_TYPE.CC) {
            controllerPath = path.join(controllerPath, model,`${model}.js`);
            controllerIndexPath = path.join(controllerIndexPath,model);
        }else{
            controllerPath = path.join(controllerPath,`${model}Controller.js`);         
        }
        let route = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/route.js`);
        let controller = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/controller.js`);

        route.locals.MODEL = model;
        route.locals.ROUTE_PATTERN = routePattern;
        route.locals.ROUTE_METHOD = routeMethod;
        route.locals.CONTROLLER_FUNCTION_NAME = controllerFunctionName;
        route.locals.PLATFORM = platform;
        route.locals.IS_EXIST = false;

        controller.locals.CONTROLLER_FUNCTION_NAME = controllerFunctionName;
        controller.locals.IS_EXIST = false;
        controller.locals.MODEL = model;
        controller.locals.PLATFORM = platform;

        if (fs.existsSync(routePath)) {
            route.locals.IS_EXIST = true;
            let newRouteCode = await this.setRouteInExistingFile(routePath, route);
            if (newRouteCode) {
                this.write(routePath, newRouteCode, MODE_0666);
            }
        } else {
            let platformIndex = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/platformIndex.js`);
            platformIndex.locals.MODEL = model;
            this.write(routePath, route.render(), MODE_0666);
            let platformIndexPath = this.setup.userDirectoryPaths.routePlatformIndexPath;
            if (platform !== 'admin') {
                platformIndexPath = replace(platformIndexPath, { platform, version: 'v1' });
            } else {
                platformIndexPath = replace(platformIndexPath, { platform, version: '' });
            }
            platformIndexPath = path.join(platformIndexPath, 'index.js');
            let newCodePlatformIndex = await this.setRouteInExistingFile(platformIndexPath, platformIndex);
            this.write(platformIndexPath, newCodePlatformIndex, MODE_0666);
        }



        if (fs.existsSync(controllerPath)) {
            controller.locals.IS_EXIST = true;
            // return valu call
            let newControllerCode = await this.setControllerInExistingFile(controllerPath, controller, controllerFunctionName);
            if (newControllerCode) {
                this.write(controllerPath, newControllerCode, MODE_0666);
            }
            if (this.projectType === constant.PROJECT_TYPE.CC) {
                // append index
                let controllerIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/controllerIndex.js`);
                controllerIndex.locals.MODEL = model;
                controllerIndex.locals.IS_EXIST = true;
                controllerIndex.locals.CONTROLLER_FUNCTION_NAME = controllerFunctionName;
                controllerIndex.locals.PLATFORM = platform;
                // append code in controller index
                controllerIndexPath = path.join(controllerIndexPath, 'index.js');
                let newControllerIndexCode = await this.setControllerInExistingFile(controllerIndexPath, controllerIndex, controllerFunctionName);
                if (newControllerIndexCode) {
                    this.write(controllerIndexPath, newControllerIndexCode, MODE_0666);
                }
            }
        } else {
            if (this.projectType === constant.PROJECT_TYPE.CC) {
                let controllerIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/controllerIndex.js`);
                controllerIndex.locals.MODEL = model;
                controllerIndex.locals.CONTROLLER_FUNCTION_NAME = controllerFunctionName;
                controllerIndex.locals.PLATFORM = platform;
                controllerIndex.locals.IS_EXIST = false;
                this.mkdir(controllerIndexPath, '');
                controllerIndexPath = path.join(controllerIndexPath, 'index.js');
                this.write(controllerIndexPath, controllerIndex.render(), MODE_0666);
            }
            // create controller index file
            this.write(controllerPath, controller.render(), MODE_0666);
        }

        // use-case add
        if (this.projectType === constant.PROJECT_TYPE.CC) {
            let useCasePath = this.setup.userDirectoryPaths.useCasePath;
            useCasePath = replace(useCasePath, { model });
            if(!fs.existsSync(useCasePath)){
                this.mkdir(useCasePath,'');
            }
            useCasePath = path.join(useCasePath, `${controllerFunctionName}.js`);
            let useCase = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/use-case.js`);
            useCase.locals.CONTROLLER_FUNCTION_NAME = controllerFunctionName;
            useCase.locals.MODEL = model;
            if(!fs.existsSync(useCasePath)){
                this.write(useCasePath, useCase.render(), MODE_0666);
            }
        }

        // add postman
        let postman = JSON.parse(fs.readFileSync(`${this.projectPath}/postman/postman-collection.json`));
        let request = {
            platform: platform,
            model: model,
            name: controllerFunctionName,
            url: routePattern,
            method: routeMethod.toUpperCase(),
        }
        postman = await utility.setSingleApiInPostman(postman, request);
        fs.writeFileSync(`${this.projectPath}/postman/postman-collection.json`, JSON.stringify(postman, null, 2))
    }

    // ast call and merge code here
    async setRouteInExistingFile(routeFilePath, route) {
        if (!fs.existsSync(routeFilePath)) {
            throw new Error("Route file can not find");
        }
        let newCode = utility.appendCodeInRoute(routeFilePath, route.render());
        return newCode;
    }

    async setControllerInExistingFile(controllerFilePath, controller, controllerFunctionName) {
        if (!fs.existsSync(controllerFilePath)) {
            throw new Error("Controller file can not find");
        }
        let newCode = utility.appendCodeInController(controllerFilePath, controller.render(), controllerFunctionName);
        return newCode;
    }


}

module.exports = createAPI;