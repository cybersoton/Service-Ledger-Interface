'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');

var debug = true;

exports.policyDeletePOST = function(args, res, next) {
  /**
   * Deleting a policy by its id 
   *
   * policyId Query-request Body in JSON
   * returns ack-response
   **/
  if(debug) console.log('---->RI: policyDeletePOST method called');

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

exports.policyPolServicePOST = function(args, res, next) {
  /**
   * Retrieving policies associated to a service 
   *
   * serviceId Policy-ofservice-body Body in JSON
   * returns policy-ofservice-response
   **/
  if(debug) console.log('---->RI: policyPolServicePOST method called');

  var examples = {};
  examples['application/json'] = {
  "list" : [ {
    "id" : "aeiou",
    "policy" : "aeiou"
  } ]
  };
  
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.policyReadPOST = function(args, res, next) {
  /**
   * Retrieving a policy by its id 
   *
   * policyId Query-request Body in JSON
   * returns policy-response
   **/
  if(debug) console.log('---->RI: policyReadPOST method called');

  var examples = {};
  examples['application/json'] = {
  "expirationTime" : "aeiou",
  "policy" : "aeiou"
  };

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.policyStorePOST = function(args, res, next) {
  /**
   * Storing a new policy 
   *
   * policySpec Policy-request-body Body in JSON
   * returns policy-response
   **/
  if(debug) console.log('---->RI: policyStorePOST method called');

  var examples = {};
  
  examples['application/json'] = {
    "expirationTime" : "aeiou",
    "policy" : "aeiou"
  };

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

