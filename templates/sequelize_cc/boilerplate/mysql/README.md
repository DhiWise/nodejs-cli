# NodeJS, Sequelize, Express Project in Clean-Code Architecture

**Supported version of nodejs >= 12**,
**Supported version of sequelize >= 6**

## About 
- This is a Node application, developed using Clean-Code Architecture with Node.js, ExpressJS, and Sequelize ORM. 
- A Sql database is used for data storage, with object modeling provided by Sequelize.
- Supported SQL Databases are - MSSQL, MySql, PostgreSQL 

## Initial
1. ```$ npm install```
2. ```$ npm start```
3. Credentials

       - One user with User role,
	   # Default User credentials
	   **username** : Nicolas40
	   **password** : 0PxYhyx0OY9sL3t


       - One user with Admin role,
	   # Default Admin credentials
	   **username** : Alice.Wolff
	   **password** : jidIHGgUypAr4Nb


## How to use generated APIs:
[Click here to visit documentation](<https://docs.dhiwise.com/knowledgehub/generated-node.js-apis> "API Documentation")

## How to run with Docker ? :
- if you have docker file you can execute following command

- build the image
	```$ docker build --pull --rm -f "Dockerfile" -t <imageName>:latest "." ```
	
- execute the command
	```$ docker run -p 3000:3000 <imageName> ```

## Folder structure:
```
├── app.js              			- starting point of the application
├── constants         				- contains commonly used constants
├── controller         				- contains execution logic for a single web route only
├── data-access         			- contains model wise dbService specification
	├── db                			- contains database related information
		├── sequelize             	- folder created as per ORM
			├── models              - model schemas
			├── dbService.js        - contains database related functions
			├── connection.js      	- contains database connection
├── entities                		- contains entity files for each folder
├── helpers            				- contains files which is helping us to manage framework independence
├── jobs                 			- contains file of CRON jobs/Schedulers
├── middleware                		- contains middleware files
├── postman                			- contains postman collection, environment files and swagger file.
├── routes                			- contains all routes of application
├── seeders                			- contains file which seeds data when application starts
├── services                		- contains common files for services like sending Email/SMS, etc.
├── use-case                		- contains pure business logic
├── utils                			- contains common files
	├── response                	- contains files work with usecase responses
├── validation                		- contains validation related files
	├── schema                		- contains joi validation files for models
├── view                			- contains all views file

```

## Detail Description of Files and folders

1. app.js
	- entry point of application.

2. constants
	- constants used across application.

3. controller
	- Controller files contains execution logic for a single web route only.
```
	├── controller
		└── platform
			└── model  - contains files for model
				├── model.js  	- contains business logic
				└── index.js  	- contains dependency injection
```

4. data-access
	- This folder contains model wise dbService specification

5. db
	- Contains file needed to work with database
	```
	├── db
		└── sequelize
			├── model  				- contains schema file of model
			├── connection.js  		- contains connections of database
			└── dbService.js  		- contains functions related to work with database
```

6. entities
	- These are the business objects of your application. These should not be affected by any change external to them, and these should be the most stable code within your application. These can be POJOs, objects with methods, or even data structures.

7. helpers
	- helper function, used to assist in providing some functionality, which is not the main goal of the application or class in which they are used.

8. jobs
	- this contains file created for each CRON job/Scheduler.

9. middleware
	- Middleware files for authentication, authorization and role-access.

10. postman
	- Contains Postman API file, environment file, swagger file and HTML doc of generated APIs.
	- Import postman-collection.json file into postman application to run and test generated APIs.

11. routes
	- index.js file, exports platform routes, imported into app.js to access all the routes.
```
	├── routes
		├── platform
			├── modelNameRoutes.js   - contains CRUD operation routes
			└── index.js             - exports model routes
		└── index.js                 - exports platform routes
```

12. seeders
	- Contains file which seeds data into collection.

13. services
```
	├── services
		├── jobs             - CRON job/scheduler service files
		├── email            - service file for sending email
		├── fileUpload       - service file for uploading file
		└── sms              - service file for sending sms
```

14. use-case
	- Contains pure business logic which is unaware of the framework/platform(web,cli,etc) and database (mongo,mysql,etc)

15. utils
	- contains common utility files used in application
```
	├── utils
		├── response     - files to handle response
```

16. validation
	- Joi validations files for each model
	```
	├── validation
		├── schema      - joi  validation schema for each model
```

17. env files
	- You can add credentials and port, database values as per your environment(Development/Production).
	- If you are running test environment then test cases will run using test database,and its configuration is there inside app.js
		