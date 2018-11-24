const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParsar = require('body-parser');
const config = require('./config');
const cors = require('cors');



//init express
const app = express();
//init bodyparsar to read data from front end 
app.use(bodyParsar.json());
app.use(bodyParsar.urlencoded({ extended: false }));
//morgan to read the dev app
app.use(morgan('dev'));
//cors for allowing using same host as developer 
app.use(cors());


//connecting to mongodb 
mongoose.connect('mongodb://127.0.0.1:27017/myapp' ,{ useNewUrlParser: true }).then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  });
var MyModel = mongoose.model('myapp', new mongoose.Schema({ name: String }));
// Works
MyModel.findOne(function(error, result) { console.log(result)});



//routers  accounts 
const userAccount = require('./router/account');
app.use('/api/accounts', userAccount);



//server  and port
app.listen(config.port, (err) => {
    console.log("server started in port :" + config.port);
});

