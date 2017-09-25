'use strict';
var sleep = require('sleep');

var rp = require('request-promise');
var config = require('config');
var url = require('url');

var request_parameters = config.get('request_parameters');

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
  
  var options = {
      "key": args.policyId.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_delete
      }),
      body: options,
      header:{'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from Registry: ");
          console.log(response);
      }
      examples['application/json'].message = response.message;
      if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  }).catch(err => console.log(err));

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
  "policy" : "aeiou",
  "message": "aeiou"
  };

  var options = {
      "key": args.policyId.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
      }),
      body: options,
      header:{'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from Registry: ");
          console.log(response);
      }

      var policy_content = JSON.parse(response.message);
      console.log(policy_content);
       
      examples['application/json'].expirationTime = policy_content.expirationTime;
      examples['application/json'].policy = policy_content.policy;
      examples['application/json'].message = "Policy found";

      if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  }).catch(err => {
      if(err.statusCode == 404) 
      {
          console.log("---->Policy not found!");
          examples['application/json'].expirationTime = "0";
          examples['application/json'].policy = "none";
          examples['application/json'].message = "Policy not found";
      } else { 
          console.log("---->error when request!");
          examples['application/json'].expirationTime = "0";
          examples['application/json'].policy = "none";
          examples['application/json'].message = "error when request!";
      }
      if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  });


}

exports.policyStorePOST = function(args, res, next) {
  /**
   * Storing a new policy 
   *
   * policySpec Policy-request-body Body in JSON
   * returns policy-response
   **/
  if(debug) console.log('---->RI: policyStorePOST method called');
  if(debug) console.log(request_parameters);
  if(debug) console.log(args.policySpec.value);

  var examples = {};
  
  examples['application/json'] = {
    "expirationTime" : args.policySpec.value.expirationTime,
    "policy" : args.policySpec.value.policy
  };
  
  var options = {
      "key": args.policySpec.value.policyId,
      "value": JSON.stringify({
                  policy: args.policySpec.value.policy,
                  requestorID: args.policySpec.value.requestorID,
                  expirationTime: args.policySpec.value.expirationTime,
                  policyType: args.policySpec.value.policyType
      })
  };

  if(debug) console.log("---->store <policy, meta-data>");

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_put
      }),
      body: options,
      header:{'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from Registry: ");
          console.log(response);
      }
  }).catch(err => console.log(err));
  
  options = {
      "key": args.policySpec.value.serviceID,
      "value": args.policySpec.value.policy
  };

  if(debug) console.log("---->store <serviceID, policy>");

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_put
      }),
      body: options,
      header:{'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from Registry: ");
          console.log(response);
      }
  }).catch(err => console.log(err));

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

