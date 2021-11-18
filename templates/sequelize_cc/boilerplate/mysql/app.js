const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
global.__basedir = __dirname;
const ejs = require('ejs');
const listEndpoints = require('express-list-endpoints');
const passport = require('passport');
const seeder = require('./seeders');
//all routes
const routes =  require('./routes/index');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const models = require('./model');
const { devicePassportStrategy } = require('./config/devicePassportStrategy');
const { adminPassportStrategy } = require('./config/adminPassportStrategy');

const app = express();
 
const corsOptions = { origin: process.env.ALLOW_ORIGIN, };
app.use(cors(corsOptions));

//template engine
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

devicePassportStrategy(passport);
adminPassportStrategy(passport);

if (process.env.NODE_ENV !== 'test' ) {
  models.sequelize.sync({ alter:true }).then(()=>{
    app.use(routes);
    const allRegisterRoutes = listEndpoints(app);
    seeder(allRegisterRoutes).then(()=>{console.log('Seeding done.');});
  });
  app.listen(process.env.PORT,()=>{
    console.log(`your application is running on ${process.env.PORT}`);
  });
} else {
  module.exports = app;
}