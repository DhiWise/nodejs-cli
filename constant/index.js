module.exports = {
    CREATE_MODEL: 1,
    CREATE_API: 2,
    CREATE_MODULE: 3,
    CREATE_APP: 4,
    ORM: {
        SEQUELIZE: "sequelize",
        MONGOOSE: "mongoose"
    },
    PROJECT_TYPE: {
        MVC: "MVC",
        CC: "CC"
    },
    DB: {
        MONGODB: "mongodb",
        MYSQL: "mysql",
        PGSQL: "postgres",
        MSSQL: "mssql"
    },
    MONGOOSE_TYPE: {
        string: "String",
        array: "Array",
        number: "Number",
        mixed: "Schema.Types.Mixed",
        objectId: "Schema.Types.objectId",
        date: "Date",
        buffer: "Buffer",
        map: "Map",
        boolean: "Boolean"
    },
    STATIC_KEYS_MONGOOSE: {
        isActive: {
            type: "Boolean"
        },
        isDeleted: {
            type: "Boolean"
        }
    },
    STATIC_KEYS_SEQUELIZE: {
        isActive: {
            type: "DataTypes.BOOLEAN"
        },
        isDeleted: {
            type: "DataTypes.BOOLEAN"
        }
    },
    SEQUELIZE_TYPE: {
        string: "DataTypes.STRING",
        text: "DataTypes.TEXT",
        char: "DataTypes.CHAR",
        boolean: "DataTypes.BOOLEAN",
        integer: "DataTypes.INTEGER",
        bigint: "DataTypes.BIGINT",
        float: "DataTypes.FLOAT",
        real: "DataTypes.REAL",
        double: "DataTypes.DOUBLE",
        decimal: "DataTypes.DECIMAL",
        date: "DataTypes.DATE",
        dateonly: "DataTypes.DATEONLY",
        enum: "DataTypes.ENUM",
        json: "DataTypes.JSON",
        geometry: "DataTypes.GEOMETRY",
        geography: "DataTypes.GEOGRAPHY",
        tinystring: "DataTypes.TINYSTRING",
        tinyint: "DataTypes.TINYINTEGER"
    },
    SEQUELIZE_JOI_VALIDATION: {
        string: "joi.string()",
        text: "joi.string()",
        char: "joi.string().max(1)",
        boolean: "joi.boolean()",
        integer: "joi.number().integer()",
        bigint: "joi.number()",
        float: "joi.number()",
        real: "joi.number()",
        double: "joi.number()",
        decimal: "joi.number()",
        date: "joi.date()",
        dateonly: "joi.date()",
        enum: "joi.any()",
        json: "joi.object()",
        geometry: "joi.any()",
        geography: "joi.any()",
        tinystring: "joi.string()",
        tinyint: "joi.number().integer()"
    },
    MONGOOSE_JOI_VALIDATION: {
        string: "joi.string()",
        array: "joi.array()",
        number: "joi.number()",
        mixed: "joi.object()",
        objectId: "joi.string().regex(/^[0-9a-fA-F]{24}$/)",
        date: "joi.date()",
        buffer: "joi.any()",
        map: "joi.any()",
        boolean: "joi.boolean()"
    },
    STATIC_SEQUELIZE_JOI_VALIDATION: {
        isActive: "joi.boolean()",
        isDeleted: "joi.boolean()"
    },
    STATIC_MONGOOSE_JOI_VALIDATION: {
        isActive: "joi.boolean()",
        isDeleted: "joi.boolean()"
    },
    STATIC_REQUEST_FOR_POSTMAN: {
        "name": "",
        "request": {
            "url": "",
            "method": "",
            "header": [
                {
                    "key": "Content-Type",
                    "value": "application/json",
                    "description": ""
                }
            ],
            "body": {
                "mode": "raw",
                "raw": "{}"
            },
            "description": ""
        },
        "response": [
        ],
        "_postman_isSubFolder": true
    }
}