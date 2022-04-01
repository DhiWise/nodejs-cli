const constant = require("../constant")
const path = require("path");

function setup(projectType, ormType, projectPath, db) {
    let settingJson = {
        templateFolderName: `${ormType}_${projectType.toLowerCase()}`,
        templateRegistry: {
            modelFolderPath: '/model',
            customAPI: '/customAPI',
            modulePath: '/module',
            boilerplate: "/boilerplate",
        },
        userDirectoryPaths: getUserDirectoryPath(projectType, ormType, projectPath),
    }
    return settingJson;
}


function getUserDirectoryPath(projectType, ormType, projectPath) {

    if (constant.PROJECT_TYPE.CC === projectType) {
        return {
            modelPath: path.join(projectPath, 'db','{{ orm }}','models'),
            routePath: path.join(projectPath, 'routes', '{{ platform }}','{{ version }}'),
            controllerPath: path.join(projectPath, 'controller', '{{ platform }}', '{{ version }}'),
            controllerIndexPath: path.join(projectPath, 'controller', '{{ platform }}', '{{ version }}'),
            routePlatformIndexPath: path.join(projectPath, 'routes', '{{ platform }}','{{ version }}'),
            validationPath: path.join(projectPath, 'validation','schema','{{ model }}.js'),
            entityPath: path.join(projectPath, 'entities', '{{ model }}.js'),
            configPath: path.join(projectPath, 'config'),
            dataAccessPath : path.join(projectPath, 'data-access', '{{ model }}Db.js'),
            useCasePath: path.join(projectPath, 'use-case', '{{ model }}'),
        }
    } else if (constant.PROJECT_TYPE.MVC === projectType) {
        return {
            modelPath: path.join(projectPath, 'model'),
            routePath: path.join(projectPath, 'routes', '{{ platform }}', '{{ version }}'),
            controllerPath: path.join(projectPath, 'controller', '{{ platform }}', '{{ version }}'),
            routePlatformIndexPath: path.join(projectPath, 'routes', '{{ platform }}', '{{ version }}'),
            validationPath: path.join(projectPath, 'utils', 'validation', '{{ model }}Validation.js'),
            configPath: path.join(projectPath, 'config'),
        }
    }
}

module.exports = setup;
