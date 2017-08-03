'use strict';

// output service configuration
var config = require('config');
var assert = require('assert');
var registry_ip = config.get('registry.ip');
var registry_port = config.get('registry.port');

var registry_url = 'http://' + registry_ip + ':' + registry_port + '/' + 'r' + '/';

var request = require('request');

exports.dmDeletePOST = function(args, res, next) {
  /**
   * Delete a stored key 
   *
   * body Dm-delete-body 
   * returns ack-response
   **/
   var examples = {};
    examples['application/json'] = {
    "message" : "aeiou"
  };
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
}



exports.dmReadPOST = function(args, res, next) {
  /**
   * Retrieving a stored key 
   *
   * body Query-request Body in JSON
   * returns dm-read-response
   **/	
  var examples = {};
  examples['application/json'] = {
  "dataID" : "aeiou",
  "key" : "aeiou",
  "timestamp" : "aeiou"
};

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.dmStorePOST = function(args, res, next) {
  /**
   * Storing encryption/tokenization key 
   *
   * body Dm-store-body Body in JSON
   * returns ack-response
   **/

	// Set the headers
	var headers = {
	    'Content-Type': 'application/json'
	}

	var body_post = {};
    body_post = {
		"key": "string",
		"value": "string"
	};
   
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
			console.log(error)
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

/*    request.post(url, body, function(result) {
	  console.log(result);
      res.setHeader('Content-Type', 'application/json');
	  res.end(JSON.stringify(result));
  	});
    /*if (Object.keys(result).length > 0) {
  		  res.setHeader('Content-Type', 'application/json');
  		  res.end(JSON.stringify(result[Object.keys(result)[0]] || {}, null, 2));
  	  } else {
  	      res.end();
  	  }*/
}





