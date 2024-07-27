const express = require('express')
const app = express()
const cors = require("cors")

require('dotenv').config();
var corsOptionsDelegate = function (req, callback) {
  var corsOptions = { origin: true };
  callback(null, corsOptions);
};

//connect dbs
require('./dbs/mongo')

const bodyParser = require('body-parser');
const swagger = require('./swagger');


app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptionsDelegate));
app.use(require('./routes/index'))

swagger(app);

module.exports = app