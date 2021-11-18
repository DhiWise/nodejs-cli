const path = require("path");
const fse = require('fs-extra');
const renderEJS = require('./render');
const constant = require("../constant");

class createBoilerplate extends renderEJS {
    constructor({ projectPath, setup, orm, projectType, db }) {
        super(projectPath);
        this.projectPath = this.renderPath;
        this.setup = setup;
        this.orm = orm;
        this.projectType = projectType;
        this.db = db;
        this.boilerplateDir = this.setup.templateRegistry.boilerplate;
    }
    async renderBoilerplate({ projectName }) {
        // project Name
        let srcDir;
        if (this.orm === constant.ORM.SEQUELIZE) {
            srcDir = path.join(this.TEMPLATE_DIR, this.setup.templateFolderName, this.boilerplateDir,this.db);
        } else {
            srcDir = path.join(this.TEMPLATE_DIR, this.setup.templateFolderName, this.boilerplateDir)
        }
        this.mkdir(this.projectPath, projectName);

        const destDir = path.join(this.projectPath, projectName);
        if (fse.existsSync(path.join(srcDir, 'package.json'))) {
            let pkg = fse.readFileSync(path.join(srcDir, 'package.json'));
            pkg = JSON.parse(pkg);
            pkg.name = projectName;
            fse.writeFileSync(path.join(srcDir, 'package.json'), JSON.stringify(pkg, null, 2));
        }
        fse.copySync(srcDir, destDir);
    }

}

module.exports = createBoilerplate;