'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');

var request_parameters = config.get('request_parameters');
var utils = require('../util/utils.js');

var debug = true;

exports.stateMember_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-member-request-body
   **/

  if(debug) console.log('---->SLI: stateMember_read method called');

  var examples = {};
  examples['application/json'] = {
      "name" : "member_read failed",
      "id" : "member_read failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {    
        res.writeHead(401);
        res.end('The authentication token is not valid!'); 
  }

  var options = {
      "key": args.body.value.dataId
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
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      var value_content = JSON.parse(response.message);
      if(debug) console.log(value_content);
     
      examples['application/json'].id = args.body.value.dataId;
      examples['application/json'].name = value_content.name;

     if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
    }).catch(err => {
        if(err.statusCode == 404) 
        {
            if(debug) console.log("---->Member not found!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "none";
        } else { 
            if(debug) console.log("---->error when request!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "error";
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });
}

exports.stateMember_storePOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body State-member-store-body Body in JSON
   * returns ack-response
   **/

  if (debug) console.log("-----> SLI: stateMember_Store method called");

  var examples = {};
  examples['application/json'] = {
    "message" : "Member Store failed!"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {    
      res.writeHead(401);
      res.end('The authentication token is not valid!'); 
  }

  var options = {
    "key": args.body.value.id,
    "value": JSON.stringify({
              name: args.body.value.name
  })};

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_put
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}

exports.stateService_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-service-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "protocol" : "undefined",
  "tenantID" : "undefined",
  "name" : "undefined",
  "serviceID" : "undefined"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {    
        res.writeHead(401);
        res.end('The authentication token is not valid!'); 
  }

  var options = {
      "key": args.body.value.dataId
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
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      var value_content = JSON.parse(response.message);
      if(debug) console.log(value_content);
     
      examples['application/json'].serviceID = args.body.value.dataId
      examples['application/json'].tenantID = value_content.tenantID;
      examples['application/json'].name = value_content.name;
      examples['application/json'].protocol = value_content.protocol;

     if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
    }).catch(err => {
        if(err.statusCode == 404) 
        {
            if(debug) console.log("---->Member not found!");
            examples['application/json'].serviceID = args.body.value.dataId;
            examples['application/json'].tenantID = "none";
            examples['application/json'].name = "none";
            examples['application/json'].protocol = "none";
        } else { 
            if(debug) console.log("---->error when request!");
            examples['application/json'].serviceID = args.body.value.dataId;
            examples['application/json'].tenantID = "error";
            examples['application/json'].name = "error";
            examples['application/json'].protocol = "error";
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });
}

exports.stateService_storePOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body State-service-store-body Body in JSON
   * returns ack-response
   **/
  var examples = {};
  examples['application/json'] = {
    "message" : "Service_store failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {    
      res.writeHead(401);
      res.end('The authentication token is not valid!'); 
  }

  var options = {
    "key": args.body.value.serviceID,
    "value": JSON.stringify({
              "tenantID" : args.body.value.tenantID,
              "name": args.body.value.name,
              "protocol": args.body.value.protocol
             })
  };

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_put
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });


}

exports.stateTenant_addMemberPOST = function(args, res, next) {
  /**
   * Creating a tenant 
   *
   * body State-tenant-store-member-body Body in JSON
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

exports.stateTenant_createPOST = function(args, res, next) {
  /**
   * Creating a tenant 
   *
   * body State-tenant-store-body Body in JSON
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

exports.stateTenant_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-tenant-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "cloudMemberIDs" : [ {
    "memberId" : "aeiou"
  } ],
  "name" : "aeiou",
  "id" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.stateVm_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the vm id
   * returns state-vm-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "disk" : "aeiou",
  "os" : "aeiou",
  "name" : "aeiou",
  "id" : "aeiou",
  "cloudMemberID" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.stateVm_storePOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body State-vm-store-body Body in JSON
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

