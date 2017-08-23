'use strict';

// output service configuration
var config = require('config');
var assert = require('assert');
var registry_ip = config.get('request_parameters.registry.ip');
var registry_port = config.get('request_parameters.registry.port');
//registry url
var registry_url = 'http://' + registry_ip + ':' + registry_port + '/' + 'r' + '/';

//utils
var utils = require('../util/utils.js');

var request = require('request');

exports.dmDeletePOST = function(args, res, next) {
  /**
   * Delete a stored key 
   *
   * body Dm-delete-body 
   * returns ack-response
   **/
	//Parse the input request_body and create the body for the registry back-end	
	var token = args.body.value.token;
	if (!utils.tokenValidate(token)) {    
	    res.writeHead(401);
		res.end('The authentication token is not valid!'); 
    }
	
	var reqId = args.body.value.requestorID;
	var dataId = args.body.value.dataId;
  
    if (reqId == undefined || dataId == undefined) {
        res.writeHead(400);
		res.end('Invalid request! Required parameter(s) missing');
    }
	
	var body_post = {};
    body_post = {
		"key": reqId + '_' + dataId ,
	};
	 
	// Set the headers
	var headers = {
	    'Content-Type': 'application/json'
	}
   
	// Configure the request
	var options = {
	    url: registry_url + 'delete',
	    method: 'POST',
	    headers: headers,
	    json: body_post
	}

	var body_reponse = {};

	// Start the request
	request(options, function (error, response, body) {
		if (error){
			//console.log(error)
     		res.writeHead(400,{'Content-Type':'application/json'});
    		res.end(JSON.stringify({'message': 'error'}));	
		}
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	        console.log(body)
    		res.writeHead(200,{'Content-Type':'application/json'});
    		res.end(JSON.stringify(body));
	    }
	})
}



exports.dmReadPOST = function(args, res, next) {
  /**
   * Retrieving a stored key 
   *
   * body Query-request Body in JSON
   * returns ack-response
   **/	
	
	//Parse the input request_body and create the body for the registry back-end	
	var token = args.body.value.token;
	if (!utils.tokenValidate(token)) {    
	    res.writeHead(401);
		res.end('The authentication token is not valid!'); 
    }
	
	var reqId = args.body.value.requestorID;
	var dataId = args.body.value.dataId;
  
    if (reqId == undefined || dataId == undefined) {
        res.writeHead(400);
		res.end('Invalid request! Required parameter(s) missing');
    }
	
	var body_post = {};
    body_post = {
		"key": reqId + '_' + dataId ,
	};
	 
	// Set the headers
	var headers = {
	    'Content-Type': 'application/json'
	}
   
	// Configure the request
	var options = {
	    url: registry_url + 'get',
	    method: 'POST',
	    headers: headers,
	    json: body_post
	}

	var body_reponse = {};

	// Start the request
	request(options, function (error, response, body) {
		if (error){
			//console.log(error)
     		res.writeHead(400,{'Content-Type':'application/json'});
    		res.end(JSON.stringify({'message': 'error'}));	
		}
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	        //console.log(body)
    		res.writeHead(200,{'Content-Type':'application/json'});
			/*
			Decrypt the received dm key and return in the body resposne 
			*/
			body_reponse = { "message": utils.decrypt(body.message)};
    		res.end(JSON.stringify(body_reponse));
	    }
	})
}

exports.dmStorePOST = function(args, res, next) {
  /**
   * Storing encryption/tokenization key 
   *
   * body Dm-store-body Body in JSON
   * returns ack-response
   **/

	//Parse the input request_body and create the body for the registry back-end	
	var token = args.body.value.token;
	if (!utils.tokenValidate(token)) {    
	    res.writeHead(401);
		res.end('The authentication token is not valid!'); 
    }
	
	var reqId = args.body.value.requestorID;
	var dataId = args.body.value.dataID;
	var key = args.body.value.key;  
  
    if (reqId == undefined || dataId == undefined || key == undefined) {
        res.writeHead(400);
		res.end('Invalid request! Required parameter(s) missing');
    }
	
	var body_post = {};
    body_post = {
		"key": reqId + '_' + dataId ,
		"value": utils.encrypt(key)
	};
	 
	// Set the headers
	var headers = {
	    'Content-Type': 'application/json'
	}
   
	// Configure the request
	var options = {
	    url: registry_url + 'put',
	    method: 'POST',
	    headers: headers,
	    json: body_post
	}

	// Start the request
	request(options, function (error, response, body) {
		if (error){
			//console.log(error)
     		res.writeHead(400,{'Content-Type':'application/json'});
    		res.end(JSON.stringify({'message': 'error'}));	
		}
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	        //console.log(body)
    		res.writeHead(200,{'Content-Type':'application/json'});
    		res.end(JSON.stringify(body));
	    }
	})
}





