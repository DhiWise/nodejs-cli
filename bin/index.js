#!/usr/bin/env node
const createModel = require("./create-model");
const createAPI = require("./create-api");
const createApp = require("./create-app");
const createModule = require("./create-module");
const { Command } = require('commander');
const program = new Command();

program.command("create-model").description("Generate model and joi validation file").action(()=>{
    createModel();
})
program.command("create-api").description("Generate platform wise api").action(()=>{
    createAPI();
})
program.command("create-module").description("Generate whole module platform wise which includes model,joi validation,routes and controller").action(()=>{
  createModule();
})
program.command("create-app").description("Generate boilerplate application which has authentication and authorization, seeder, CRUD of single model and more than that.").action(()=>{
  createApp();
})
program.addHelpText('after', `
Example call:
  $ dhiwise create-model`);

program.parse(process.argv);
