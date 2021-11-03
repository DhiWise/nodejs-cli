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
        routePath = replace(routePath, { platform, model });

        let controllerPath = this.setup.userDirectoryPaths.controllerPath;
        controllerPath = replace(controllerPath, { model, platform })

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
            platformIndexPath = replace(platformIndexPath,{platform});
            let newCodePlatformIndex = utility.appendCodeInRoute(platformIndexPath, platformIndex.render());
            this.write(platformIndexPath, newCodePlatformIndex, MODE_0666);
        }
        if (fs.existsSync(controllerPath)) {
            controller.locals.IS_EXIST = true;
            // return valu call
            let newControllerCode = await this.setControllerInExistingFile(controllerPath, controller, controllerFunctionName);
            if (newControllerCode) {
                this.write(controllerPath, newControllerCode, MODE_0666);
            }
        } else {
            if (this.projectType === constant.PROJECT_TYPE.CC) {
                let controllerIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.customAPI}/controllerIndex.js`);
                controllerIndex.locals.MODEL = model;
                let controllerIndexPath = this.setup.userDirectoryPaths.controllerIndexPath;
                controllerIndexPath = replace(controllerIndexPath, { platform, model })
                this.mkdir(controllerIndexPath, '');
                this.write(path.join(controllerIndexPath, 'index.js'), controllerIndex.render(), MODE_0666);
            }
            // create controller index file
            this.write(controllerPath, controller.render(), MODE_0666);
        }
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
        if (constant.PROJECT_TYPE.CC === this.projectType) {
            let newCode = utility.appendCodeInCleanCodeController(controllerFilePath, controller.render(), controllerFunctionName);
            return newCode;
        }
        let newCode = utility.appendCodeInController(controllerFilePath, controller.render(), controllerFunctionName);
        return newCode;
    }


}

module.exports = createAPI;