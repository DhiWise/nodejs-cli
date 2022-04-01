/**
 * app.js
 * Use `app.js` to run your app.
 * To start the server, run: `node app.js`.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const postmanToOpenApi = require('postman-to-openapi');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
dotenv.config({ path:'.env' });
global.__basedir = __dirname;
const ejs = require('ejs');
const listEndpoints = require('express-list-endpoints');
const passport = require('passport');
const seeder = require('./seeders');
//all routes 
const routes =  require('./routes');

const models = require('./model');
let logger = require('morgan');

const { devicePassportStrategy } = require('./config/devicePassportStrategy');
const { adminPassportStrategy } = require('./config/adminPassportStrategy');

const app = express();
app.use(require('./utils/response/responseHandler'));

const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

//template engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
devicePassportStrategy(passport);
adminPassportStrategy(passport);

app.get('/', (req, res) => {
  res.render('index');
});

if (process.env.NODE_ENV !== 'test' ) {
  models.sequelize.sync({ alter:true }).then(()=>{
        
  }).finally(()=>{
    app.use(routes);
    const allRegisterRoutes = listEndpoints(app);
    seeder(allRegisterRoutes).then(()=>{console.log('Seeding done.');});
    //swagger Documentation
    postmanToOpenApi('postman/postman-collection.json', path.join('postman/swagger.yml'), { defaultTag: 'General' }).then(data => {
      let result = YAML.load('postman/swagger.yml');
      result.servers[0].url = '/';
      app.use('/swagger', swaggerUi.serve, swaggerUi.setup(result));
    }).catch(e=>{
      console.log('Swagger Generation stopped due to some error');
    });
  });
  app.listen(process.env.PORT,()=>{
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}
