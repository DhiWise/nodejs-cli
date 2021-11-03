const prompts = require('prompts');
const path = require("path");
const fs = require("fs");
const setting = require("./setting");
const questions = require('./questions');
const constant = require("./constant")
const createModel = require("./repository/model");
const customAPI = require("./repository/api");
const createModule = require("./repository/module");

class codeGenerator {

    constructor({ projectType, ormType, operation, projectPath }) {
        this.ormType = ormType;
        this.projectType = projectType;
        this.projectPath = projectPath;
        this.setup = setting(projectType, ormType, projectPath);
        this.operation = operation;
    }
    async updateApp() {

        // let operation = await prompts(questions.SELECT_OPERATION);
        switch (this.operation) {
            case constant.CREATE_MODEL:
                let cm = new createModel({
                    projectPath: this.projectPath,
                    setup: this.setup,
                    orm: this.ormType,
                    projectType: this.projectType
                });
                let model = await prompts(questions.ASK_MODEL_NAME);
                if (!model || !model.value) {
                    throw new Error("please provide model name");
                }
                await cm.renderModel(model.value);
                break;
            case constant.CREATE_API:
                let models = await this.getModelNames(path.join(`${this.projectPath}`, 'model'));
                if (!models.length) {
                    throw new Error("we are not able to find existing model");
                }
                let modelName = await prompts(questions.GET_EXISTING_MODEL(models));
                if (!modelName || !modelName.value) {
                    throw new Error("please select model.");
                }
                let platform = await this.getPlatformName(path.join(`${this.projectPath}`, 'routes'));
                if (!platform.length) {
                    throw new Error("we are not able to find existing platform");
                }
                let platformName = await prompts(questions.GET_EXISTING_PLATFORM(platform));
                if (!platformName || !platformName.value) {
                    throw new Error("please select platform.");
                }
                let routeMethod = await prompts(questions.SELECT_ROUTE_METHOD);
                if (!routeMethod || !routeMethod.value) {
                    routeMethod = { value: 'get' }
                }
                let routePattern = await prompts(questions.ASK_ROUTE_PATTERN);
                if (!routePattern || !routePattern.value) {
                    routePattern = { value: '/<your-pattern>' }
                }
                let controllerFunctionName = await prompts(questions.ASK_CONTROLLER_FUNCTION_NAME);
                if (!controllerFunctionName || !controllerFunctionName.value) {
                    controllerFunctionName = { value: 'functionName' }
                }

                let route = new customAPI({ projectPath: this.projectPath, setup: this.setup, orm: this.ormType, projectType: this.projectType });
                await route.renderRoute({
                    model: modelName.value,
                    platform: platformName.value,
                    routeMethod: routeMethod.value,
                    routePattern: routePattern.value,
                    controllerFunctionName: controllerFunctionName.value
                });
                break;
            case constant.CREATE_MODULE:
                let moduleModels = await this.getModelNames(path.join(`${this.projectPath}`, 'model'));
                let moduleModelName = await prompts(questions.GET_EXISTING_MODEL(moduleModels, true));
                if (moduleModelName.value === 1) {
                    moduleModelName = await prompts(questions.ASK_MODEL_NAME);
                    //    need to ask for attribute
                }
                let modulePlatform = await this.getPlatformName(path.join(`${this.projectPath}`, 'routes'));
                let modulePlatformName = await prompts(questions.GET_EXISTING_PLATFORM(modulePlatform, "multiselect"));
                let modelPermission = await prompts(questions.SELECT_ROUTE_API);

                if (!moduleModelName || !moduleModelName.value) {
                    throw new Error("please provide model name.");
                }
                if (!modulePlatformName || !modulePlatformName.value || !modulePlatformName.value.length) {
                    throw new Error("please select at least one platform.");
                }
                if (!modelPermission || !modelPermission.value || !modelPermission.value.length) {
                    modelPermission = { value: ["C"] }
                }

                let module = new createModule({ projectPath: this.projectPath, setup: this.setup, orm: this.ormType, projectType: this.projectType });
                module.renderModule({
                    model: moduleModelName.value,
                    platform: modulePlatformName.value,
                    modelPermission: modelPermission.value
                });
                break;
        }
    }
    async getModelNames(modelPath) {
        let models = fs.readdirSync(modelPath);
        let existingModel = [];
        models.forEach(file => {
            if (path.extname(file) == ".js") {
                existingModel.push(path.parse(file).name);
            }
        })
        return existingModel;
    }
    async getPlatformName(routesPath) {
        return fs.readdirSync(routesPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    }

}
module.exports = codeGenerator;