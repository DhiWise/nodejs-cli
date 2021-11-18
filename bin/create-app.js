#! /usr/bin/env node
let program = require('commander');
const path = require('path');
const prompts = require('prompts');
global.__basedir = __dirname;
const question = require('../questions');
const constant = require('../constant');
const codeGenerator = require('../codeGenerator');

async function main() {
    try {
        let destinationPath = program.args.shift() || '.';
        // App name
        let projectPath = path.resolve(destinationPath);
        // projectPath = path.join(projectPath,'project_cc_mon');
        let projectType = await prompts(question.SELECT_PROJECT_TYPE);
        projectType = projectType.value;
        let db = await prompts(question.SELECT_DATABASE);
        db = db.value;

        let ormType;
        if(db === constant.DB.MONGODB){
            ormType = constant.ORM.MONGOOSE;
        }else if(db === constant.DB.MSSQL || db === constant.DB.MYSQL || db === constant.DB.PGSQL){
            ormType = constant.ORM.SEQUELIZE;
        }
        const codeGen = new codeGenerator({ projectType: projectType, ormType: ormType, operation: constant.CREATE_APP, projectPath, db });
        await codeGen.updateApp();
    } catch (error) {
        console.log(`\x1b[31m error \x1b[0m :${error.message}`);
    }
}
module.exports = main;