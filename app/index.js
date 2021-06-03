
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const models     = require('./models');

// Configuring .env file
require('dotenv').config()

const app = express();

// Configuring middlewares & configs
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defining our main route
app.use(require('./routes'));

const port = process.env.PORT || 3000;
const address = process.env.SERVER_ADDRESS || '127.0.0.1';

// Configuring sequelize ORM to create everything automatically
models.sequelize.sync().then(function () {
	app.listen( port, address, () => console.log(`Server running on http://${address}:${port}`));
});

module.exports = app;