#! /usr/bin/env node
let program = require('commander');
const path = require('path');
const prompts = require('prompts');
global.__basedir = __dirname;
const constant = require('./questions/index');
const codeGenerator = require('./codeGenerator');

async function main() {
    try {
        let destinationPath = program.args.shift() || '.'
        // App name
        let projectPath = path.resolve(destinationPath);
        let projectType = await prompts(constant.SELECT_PROJECT_TYPE);
        let ormType = await prompts(constant.SELECT_ORM_TYPE);
        const codeGen = new codeGenerator({ projectType: projectType.value, ormType: ormType.value });
        await codeGen.updateApp({projectPath})
    } catch (error) {
        console.log(error);
    }
}
main();