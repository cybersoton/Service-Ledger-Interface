/**
 * This file is part of SUNFISH Registry Interface.
 *
 * SUNFISH Registry Interface is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SUNFISH Registry Interface is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

//Author: Md Sadek Ferdous

var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require( "url" );
var queryString = require( "querystring" );
var sleep = require('sleep');
var policyAPI = require("./policyAPI");
var monitoringAPI = require("./monitoringAPI");
var stateAPI = require("./stateAPI");
var metricsAPI = require("./metricsAPI");
var fedAPI = require("./fedAPI");
var anonAPI = require("./anonAPI");
var alertAPI = require("./alertAPI");
var dmKeyAPI = require("./dmKeyAPI");

var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json());


var crypto = require('crypto'),
  key = new Buffer('eeng4ge0woobohgooqu4ieriwohgoo6C'); 

var Web3 = require('web3');
var web3 = new Web3();
var querystring = require('querystring');

var options = {
  key: fs.readFileSync('key1.pem'),
  cert: fs.readFileSync('cert1.pem')
};


app.use(bodyParser.urlencoded({ extended: true }));

/**
 * endpoints involving policy APIs 
 **/

app.get('/api/prp/policy/store', function(req, res) {
  policyAPI.store(req,res);
});

app.get('/api/prp/policy/read', function(req, res) {
   policyAPI.read(req,res); 
});
app.get('/api/prp/policy/service', function(req, res) {
    policyAPI.service(req,res);
});
app.get('/api/prp/policy/update', function(req, res) {
    policyAPI.update(req,res);
});
app.get('/api/prp/policy/delete', function(req, res) {
    policyAPI.delete(req,res);
});

app.post('/api/prp/policy/store', function(req, res) {
  policyAPI.store(req,res);
});

app.post('/api/prp/policy/read', function(req, res) {
   policyAPI.read(req,res); 
});
app.post('/api/prp/policy/service', function(req, res) {
    policyAPI.service(req,res);
});
app.post('/api/prp/policy/update', function(req, res) {
    policyAPI.update(req,res);
});
app.post('/api/prp/policy/delete', function(req, res) {
    policyAPI.delete(req,res);
});

/**
 * endpoints involving monitoring APIs 
 **/

app.get('/api/monitoring/store', function(req, res) {
  monitoringAPI.store(req,res);
});

app.get('/api/monitoring/read', function(req, res) {
   monitoringAPI.read(req,res); 
});

app.post('/api/monitoring/store', function(req, res) {
  monitoringAPI.store(req,res);
});

app.post('/api/monitoring/read', function(req, res) {
   monitoringAPI.read(req,res); 
});

/**
 * endpoints involving state APIs 
 **/

app.get('/api/state/store', function(req, res) {
  stateAPI.store(req,res);
});

app.get('/api/state/read', function(req, res) {
   stateAPI.read(req,res); 
});

app.get('/api/state/update', function(req, res) {
   stateAPI.read(req,res); 
});

app.get('/api/state/delete', function(req, res) {
   stateAPI.read(req,res); 
});

app.post('/api/state/store', function(req, res) {
  stateAPI.store(req,res);
});

app.post('/api/state/read', function(req, res) {
   stateAPI.read(req,res); 
});

app.post('/api/state/update', function(req, res) {
   stateAPI.read(req,res); 
});

app.post('/api/state/delete', function(req, res) {
   stateAPI.read(req,res); 
});


/**
 * endpoints involving SLA Metrics APIs 
 **/

app.get('/api/metrics/store', function(req, res) {
  metricsAPI.store(req,res);
});

app.get('/api/metrics/read', function(req, res) {
   metricsAPI.read(req,res); 
});

app.post('/api/metrics/store', function(req, res) {
  metricsAPI.store(req,res);
});

app.post('/api/metrics/read', function(req, res) {
   metricsAPI.read(req,res); 
});

/**
 * endpoints involving Federation APIs 
 **/

app.get('/api/fed/create', function(req, res) {
  fedAPI.create(req,res);
});

app.get('/api/fed/add', function(req, res) {
   fedAPI.add(req,res); 
});

app.get('/api/fed/remove', function(req, res) {
   fedAPI.remove(req,res); 
});

app.get('/api/fed/read', function(req, res) {
   fedAPI.read(req,res); 
});

app.post('/api/fed/create', function(req, res) {
  fedAPI.create(req,res);
});

app.post('/api/fed/add', function(req, res) {
   fedAPI.add(req,res); 
});

app.post('/api/fed/remove', function(req, res) {
   fedAPI.remove(req,res); 
});

app.post('/api/fed/read', function(req, res) {
   fedAPI.read(req,res); 
});

/**
 * endpoints involving Anonymisation APIs 
 **/

app.get('/api/anonymisation/register', function(req, res) {
  anonAPI.register(req,res);
});

app.get('/api/anonymisation/read', function(req, res) {
   anonAPI.read(req,res); 
});

app.post('/api/anonymisation/register', function(req, res) {
  anonAPI.register(req,res);
});

app.post('/api/anonymisation/read', function(req, res) {
   anonAPI.read(req,res); 
});

/**
 * endpoints involving Alert APIs 
 **/

app.get('/api/alert/store', function(req, res) {
  alertAPI.store(req,res);
});

app.get('/api/alert/read', function(req, res) {
   alertAPI.read(req,res); 
});

app.post('/api/alert/store', function(req, res) {
  alertAPI.store(req,res);
});

app.post('/api/alert/read', function(req, res) {
   alertAPI.read(req,res); 
});

/**
 * endpoints involving Data Masking Key APIs 
 **/

app.get('/api/dm/register', function(req, res) {
  dmKeyAPI.register(req,res);
});

app.get('/api/dm/read', function(req, res) {
   dmKeyAPI.read(req,res); 
});

app.get('/api/dm/update', function(req, res) {
  dmKeyAPI.update(req,res);
});

app.get('/api/dm/delete', function(req, res) {
   dmKeyAPI.delete(req,res); 
});

app.post('/api/dm/register', function(req, res) {  
  dmKeyAPI.register(req,res);
});

app.post('/api/dm/read', function(req, res) {
   dmKeyAPI.read(req,res); 
});

app.post('/api/dm/update', function(req, res) {
  dmKeyAPI.update(req,res);
});

app.post('/api/dm/delete', function(req, res) {
   dmKeyAPI.delete(req,res); 
});

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(8075);
console.log('Server started!');