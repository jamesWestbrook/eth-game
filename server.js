'use strict';

const express = require('express');

// Constants
const PORT = 8080;

// App
const app = express();

// Set up directory to expose static files from
app.use(express.static('.'));

app.listen(PORT);