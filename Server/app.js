const fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')
var mount = require('mount-routes')

var app = express()

/**
 * Initialize Public System
 */
app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended: true}))

/**
 * Initialize database modular
 */
// var database = require()

