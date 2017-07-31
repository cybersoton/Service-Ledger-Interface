'use strict';

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
  var body_post = {};
  body_post['application/json'] = {"key": "string", "value": "string"};

  var request = require('request');
  request.post('http://localhost:8081/put', body_post);	
	
	
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

exports.dmUpdatePOST = function(args, res, next) {
  /**
   * Update a stored key 
   *
   * body Dm-update-body Body in JSON
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

