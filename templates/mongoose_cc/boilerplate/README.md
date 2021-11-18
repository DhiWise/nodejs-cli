# NodeJS, Mongoose, Express Project in Clean-Code Architecture

**Supported version of nodejs-15.13.0**,
**Supported version of mongoose-4.0**

## About 
- This is a Node application, developed in Clean-code architecture with Node.js, ExpressJS, and Mongoose ODM.
- A MongoDB database is used for data storage, with object modeling provided by Mongoose.

## Initial
1. ```$ npm install```
2. ```$ npm start```
3. Credentials

       - One user with User role,
	   # Default User credentials
	   **username** : Eugene.Weimann26@hotmail.com
	   **password** : 27tmkOORWhqOi9J


       - One user with Admin role,
	   # Default Admin credentials
	   **username** : Kraig_Kautzer17@hotmail.com
	   **password** : z0TPtiNoUnrtR24


## How to run with Docker ? :
- if you have docker file you can execute following command

- build the image
	```$ docker build --pull --rm -f "Dockerfile" -t <imageName>:latest "." ```
	
- execute the command
	```$ docker run -p 3000:3000 <imageName> ```

## Folder structure:
```
  ├── app.js              - starting point of the application
  ├── config			  - application configuration
  ├── constants           - contains commonly used constants 
  ├── controller         - contains business logic 
  ├── entity              - entity of models
  ├── helper              - helper files
  ├── jobs                - cron jobs
  ├── models       		  - models of application
  ├── postman      		  - postman collection files
  ├── routes       		  - contains all the routes of application
  ├── services     		  - contains commonly used services
  ├── views        		  - templates
  ├── utils        		  - contains utility functions   
  └── validation          - contains validations 
```

### Detail Description of Files and folders

1. app.js
- entry point of application.

2. config
- passport strategy files
- database connection files

3. constants
- constants used across application.

4. controller
- Controller files that contains Business logic
```
	├── controller               
      └── platform
			├── model.js  - contains business logic
			└── index.js  - contains dependency injection
```

5. entity
- These are the business objects of your application. These should not be affected by any change external to them, and these should be the most stable code within your application. 
These can be POJOs, objects with methods, or even data structures.

6. helpers
- helper function, used to assist in providing some functionality, which isn't the main goal of the application or class in which they are used.

7. jobs
- Cron jobs

8. middleware
- Middleware files for authentication, authorization and role-access.

9. models
- Database models 

10. postman
- Postman collection of APIs (Import this JSON in Postman to run the APIs)

11. public 
- Assets used in application

12. routes
```
	├── routes
		├── platform
			├── modelNameRoutes.js   - contains CRUD operation routes
			└── index.js             - exports model Routes
		└── index.js                 - exports platform routes

```
- index.js file, exports platform routes, imported into app.js to access all the routes.

13. services
```
	├── services
		├── jobs                     - cron jobs
		├── mongoDbService.js        - Database service
		└── auth.js                  - Authentication module service

```

14. utils
```
	├── utils
		├── messages.js              - Messages used in sending response 
		├── responseCode.js          - response codes 
		└── validateRequest.js       - validate request based on model schema

```

15. validation
- Joi validations files for every model

16. env files
- You can add credentials and port, database values as per your environment(Development/Production).
- If you are running test environment then testcases will run using test database,and its configuration is there inside app.js

