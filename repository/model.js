const prompts = require('prompts');
const path = require("path");
const questions = require('../questions');
const constant = require("../constant")
const renderEJS = require('./render');
const utility = require("../utils/index")
class createModel extends renderEJS {
    constructor({ projectPath, setup, orm, projectType }) {
        super(projectPath);
        this.projectPath = this.renderPath;
        this.orm = orm;
        this.projectType = projectType
        this.setup = setup;
        // console.log(this.projectPath, "===> from create model ");
    }
    async renderModel(modelName) {
        let model = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/model.js`);
        model.locals.DB_MODEL = modelName;
        this.write(path.join(this.projectPath, 'model', `${modelName}.js`), model.render(), MODE_0666);
        // return this.render();
        if (constant.ORM.SEQUELIZE === this.orm) {
            let modelIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/index.js`);
            modelIndex.locals.MODEL = modelName;
            let indexModelPath = path.join(this.projectPath, 'model', 'index.js');
            let newCodeModelIndex = utility.appendCodeInRoute(indexModelPath, modelIndex.render());
            if (newCodeModelIndex) {
                this.write(indexModelPath, newCodeModelIndex, MODE_0666);
            }
        }
    }

}

module.exports = createModel;