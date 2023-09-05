const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const createData = require('./createDatabase')
const port = 8080

app.use(bodyParser());

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.use('/',connection);
app.use('/',createData);




app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;