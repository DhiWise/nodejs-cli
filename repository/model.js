const path = require("path");
const replace = require('key-value-replace');
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
    async renderModel({ modelName, attributes,modelPath }) {

        let model = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/model.js`);
        let validation = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/validation.js`);
        model.locals.DB_MODEL = modelName;
        // return this.render();
        if (constant.ORM.SEQUELIZE === this.orm) {
            this.modelObject = await utility.getSQLModelAttribute(attributes || '');
            this.modelValidation = await utility.getSequelizeJoiValidation(attributes || '');
            model.locals.SCHEMA = this.modelObject;
            // console.log(model.render());
            this.write(path.join(modelPath ,`${modelName}.js`), model.render(), MODE_0666);
            let modelIndex = await this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/index.js`);
            modelIndex.locals.MODEL = modelName;
            let indexModelPath = path.join(modelPath, 'index.js');
            let newCodeModelIndex = utility.appendCodeInRoute(indexModelPath, modelIndex.render());
            if (newCodeModelIndex) {
                this.write(indexModelPath, newCodeModelIndex, MODE_0666);
            }
        } else {
            this.modelObject = await utility.getMongooseModelAttribute(attributes || '');
            this.modelValidation = await utility.getMongooseJoiValidation(attributes || '');
            model.locals.SCHEMA = this.modelObject;
            //console.log(model.render());
            this.write(path.join(modelPath, `${modelName}.js`), model.render(), MODE_0666);
        }


        if (this.projectType === constant.PROJECT_TYPE.CC) {
            let entityTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/entity.js`);
            entityTemplate.locals.MODEL = modelName;
            entityTemplate.locals.SCHEMA = this.modelObject ? Object.keys(this.modelObject) : [];
            let entityPath = this.setup.userDirectoryPaths.entityPath;
            entityPath = replace(entityPath, { model: modelName });
            this.write(entityPath, entityTemplate.render(), MODE_0666);

            // data-access
            let dataAccessTemplate = this.loadTemplate(`${this.setup.templateFolderName}${this.setup.templateRegistry.modelFolderPath}/data-access.js`);
            dataAccessTemplate.locals.MODEL = modelName;
            let dataAccessPath = this.setup.userDirectoryPaths.dataAccessPath;
            dataAccessPath = replace(dataAccessPath, { model: modelName });
            this.write(dataAccessPath, dataAccessTemplate.render(), MODE_0666);

        }


        let validationPath = this.setup.userDirectoryPaths.validationPath;
        validationPath = replace(validationPath, { model: modelName });
        // joi validation
        if (this.modelValidation) {
            validation.locals.SCHEMA = this.modelValidation;
        }
        this.write(validationPath, validation.render(), MODE_0666);

    }

}

module.exports = createModel;