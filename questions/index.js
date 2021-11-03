const constant = require("../constant")
module.exports = {
    SELECT_PROJECT_TYPE: {
        type: 'select',
        name: 'value',
        message: 'Select Your Project Type',
        choices: [
            { title: 'MVC (Model View Controller)', value: 'MVC' },
            { title: 'CC (Clean Code)', value: 'CC' },
        ],
        hint: '- Space to select. Return to submit'
    },
    SELECT_ORM_TYPE: {
        type: 'select',
        name: 'value',
        message: 'Select Your ORM Type',
        choices: [
            { title: 'Mongoose', value: 'mongoose' },
            { title: 'Sequelize', value: 'sequelize' },
        ],
        hint: '- Space to select. Return to submit'
    },
    SELECT_OPERATION: {
        type: 'select',
        name: 'value',
        message: 'Select Operation',
        choices: [
            { title: 'Create Model', value: constant.CREATE_MODEL },
            { title: 'Create API', value: constant.CREATE_API },
            { title: 'Create MODULE', value: constant.CREATE_MODULE },
        ],
        hint: '- Space to select. Return to submit'
    },
    ASK_MODEL_NAME: {
        type: 'text',
        name: 'value',
        message: 'Please enter model name'
    },
    SELECT_ROUTE_METHOD: {
        type: 'select',
        name: 'value',
        message: 'Select route method (default GET)',
        choices: [
            { title: 'POST', value: 'post' },
            { title: 'GET', value: 'get' },
            { title: 'PUT', value: 'put' },
            { title: 'DELETE', value: 'delete' },
        ],
        hint: '- Space to select. Return to submit'
    },
    ASK_ROUTE_PATTERN: {
        type: 'text',
        name: 'value',
        message: 'Please enter route endpoint'
    },
    GET_EXISTING_MODEL: function (models, isNewAllowedToCreate = false) {
        let ch = [];
        if (isNewAllowedToCreate) {
            ch.push({ title: "create new model", value: 1 })
        }
        models.forEach(element => {
            let obj = {};
            obj.title = element;
            obj.value = element;
            ch.push(obj);
        });
        return {
            type: 'autocomplete',
            name: 'value',
            message: `Select / Search model ${isNewAllowedToCreate?"or select <create new model> option for create new model":""}`,
            choices: ch,
            hint: '- Space to select. Return to submit'
        }
    },
    GET_EXISTING_PLATFORM: function (platform, type = "select") {
        let ch = [];
        platform.forEach(element => {
            let obj = {};
            obj.title = element;
            obj.value = element;
            ch.push(obj);
        });
        return {
            type: type,
            name: 'value',
            message: 'Select platform',
            choices: ch,
            hint: '- Space to select. Return to submit'
        }
    },
    ASK_CONTROLLER_FUNCTION_NAME: {
        type: 'text',
        name: 'value',
        message: 'Please enter controller function name'
    },
    SELECT_ROUTE_API: {
        type: 'multiselect',
        name: 'value',
        message: 'Select API methods',
        choices: [
            { title: 'CREATE', value: 'C', selected: true },
            { title: 'UPDATE', value: 'U', selected: true },
            { title: 'FIND ALL', value: 'FALL', selected: true },
            { title: 'FIND BY ID', value: 'FBYID', selected: true },
            { title: 'COUNT', value: 'COUNT', selected: true },
            { title: 'DELETE', value: 'D', selected: true },
            { title: 'BULK CREATE', value: 'BC', selected: true },
            { title: 'BULK UPDATE', value: 'BU', selected: true },
            // { title: 'UPSERT', value: 'UP', selected: true },
            { title: 'DELETE MANY', value: 'DMANY', selected: true },
            { title: 'SOFT DELETE', value: 'SD', selected: true },
            { title: 'SOFT DELETE MANY', value: 'SDMANY', selected: true },
        ],
        hint: '- Space to select or deselect. Return to submit'
    },

}