#! /usr/bin/env node
let program = require('commander');
const path = require('path');
const prompts = require('prompts');
global.__basedir = __dirname;
const question = require('../questions');
const constant = require('../constant');
const utility = require("../utils/index");
const codeGenerator = require('../codeGenerator');

async function main() {
    try {
        let destinationPath = program.args.shift() || '.';
        // App name
        let projectPath = path.resolve(destinationPath);
        // projectPath = path.join(projectPath,'project_mvc_seq');
        let projectInformation = utility.getProjectTypeAndOrmType(projectPath);
        let projectType = projectInformation.projectType;
        let ormType = projectInformation.ormType;

        if(!projectType){
            projectType = await prompts(question.SELECT_PROJECT_TYPE);
            projectType = projectType.value;
        }
        if(!ormType){
            ormType = await prompts(question.SELECT_ORM_TYPE);
            ormType = ormType.value;
        }
        const codeGen = new codeGenerator({ projectType: projectType, ormType: ormType, operation: constant.CREATE_API, projectPath });
        await codeGen.updateApp();
    } catch (error) {
        console.log(`\x1b[31m error \x1b[0m :${error.message}`);
    }
}
module.exports = main;