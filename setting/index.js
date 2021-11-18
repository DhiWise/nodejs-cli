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
            modelPath: path.join(projectPath, 'model'),
            routePath: path.join(projectPath, 'routes', '{{ platform }}', '{{ model }}Routes.js'),
            controllerPath: path.join(projectPath, 'controller', '{{ platform }}', '{{ model }}', '{{ model }}.js'),
            controllerIndexPath: path.join(projectPath, 'controller', '{{ platform }}', '{{ model }}'),
            routePlatformIndexPath: path.join(projectPath, 'routes', '{{ platform }}', 'index.js'),
            validationPath: path.join(projectPath, 'validation', '{{ model }}Validation.js'),
            entityPath: path.join(projectPath, 'entity', '{{ model }}.js'),
            configPath: path.join(projectPath, 'config'),
        }
    } else if (constant.PROJECT_TYPE.MVC === projectType) {
        return {
            modelPath: path.join(projectPath, 'model'),
            routePath: path.join(projectPath, 'routes', '{{ platform }}', '{{ model }}Routes.js'),
            controllerPath: path.join(projectPath, 'controller', '{{ platform }}', '{{ model }}Controller.js'),
            routePlatformIndexPath: path.join(projectPath, 'routes', '{{ platform }}', 'index.js'),
            validationPath: path.join(projectPath, 'utils', 'validation', '{{ model }}Validation.js'),
            configPath: path.join(projectPath, 'config'),
        }
    }
}

module.exports = setup;
