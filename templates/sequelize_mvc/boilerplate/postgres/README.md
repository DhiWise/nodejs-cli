# NodeJS, Sequelize, Express Project in MVC Architecture

**Supported version of nodejs >= 12**,
**Supported version of sequelize >= 6**

## About 
- This is a Node application, developed using MVC pattern with Node.js, ExpressJS, and Sequelize ORM.
- SQL database is used for data storage, with object modeling provided by Sequelize.

## Initial
1. ```$ npm install```
2. ```$ npm start```
3. Credentials

       - One user with User role,
	   # Default User credentials
	   **username** : Tiffany10
	   **password** : w686tgH3u1RZPVU


       - One user with Admin role,
	   # Default Admin credentials
	   **username** : Lucie91
	   **password** : dTP5epMbsOGzJsI


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
  ├── app.js       - starting point of the application
  ├── config
  │   └── db.js    - contains api database connection
  ├── constants    - contains commonly used constants 
  ├── controllers               
  │   └── platform - contains business logic
  ├── jobs         - cron jobs
  ├── models       - models of application
  ├── postman      - postman collection files
  ├── routes       - contains all the routes of application
  ├── services     - contains commonly used services
  ├── views        - templates
  └── utils        - contains utility functions    
```

## Detail Description of Files and folders

1. app.js
- entry point of application.

2. config
- passport strategy files
- database connection files

3. constants
- constants used across application.

4. controllers
- Controller files that contains Business logic
```
	├── controller
		└── platform
			└── modelNameController.js        - contains CRUD Operations
```

5. jobs
- Cron jobs

6. middleware
- Middleware files for authentication, authorization and role-access.

7. models
- Database models 

8. postman
- Postman collection of APIs (Import this JSON in Postman to run the APIs)

9. public 
- Assets used in application

10. routes
```
	├── routes
		├── platform
			├── modelNameRoutes.js   - contains CRUD operation routes
			└── index.js             - exports model Routes
		└── index.js                 - exports platform routes

```
- index.js file, exports platform routes, imported into app.js to access all the routes.

11. services
```
	├── services
		├── jobs                     - cron jobs
		└── auth.js                  - Authentication module service

```

12. utils
```
	├── utils
		├── validations              - joi validations files for every model
		├── dbService.js             - Database functions 
		├── messages.js              - Messages used in sending response 
		├── responseCode.js          - response codes 
		└── validateRequest.js       - validate request based on model schema

```

13. env files
- You can add credentials and port, database values as per your environment(Development/Production).
- If you are running test environment then test cases will run using test database,and its configuration is there inside app.js