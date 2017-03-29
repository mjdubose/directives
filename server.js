'use strict';
var Server = require('./frontend/server.js');
var express = require('express');
var path = require('path');
var app = Server.app();
var _ = require('underscore');
module.exports = app;
app.use('/', express.static(path.join(__dirname, "../Public")));
const port = process.env.PORT ? process.env.PORT : (process.env.NODE_ENV === 'test' ? 4000 : 3000);
console.log('running on port', port);
app.listen(port);
//                                
//http://media.blizzard.com/d3/icons/items/large/unique_gloves_set_02_p2_demonhunter_male.png 
// icons are available for skills or items (items take large or small sizes, skills have pixel size allotments 21, 42 or 64);
//.png name is stored in items or skills database table under icon.