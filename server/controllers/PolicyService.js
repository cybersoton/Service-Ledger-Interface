'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');

var request_parameters = config.get('request_parameters');
//utils
var utils = require('../util/utils.js');

var debug = true;

exports.policyDeletePOST = function(args, res, next) {
  /**
   * Deleting a policy by its id
   *
   * policyId Query-request Body in JSON
   * returns ack-response
   **/
  if(debug) console.log('---->SLI: policyDeletePOST method called');

  var token = args.policyId.value.token;
  var reqId = args.policyId.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
  };

  var options = {
      "key": args.policyId.value.dataId
  };

  // read the SERVICEID in the Policy spec
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
          console.log("---->response from Service-Ledger: ");
          console.log(response.message);
      }

      // the value representing the policy in the KeyValueStore
      var policy_content = JSON.parse(response.message);
      var _service = "POL_" + policy_content.serviceID;

      //retrieve the list of policy of the _service <serviceID, [policyID]
      rp({
           method: 'POST',
           uri: url.format({
              protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
          }),
        body: {"key": _service},
        header: {'User-Agent': 'Service-Ledger-Interface'},
        json: true
      }).then(response => {
          console.log("Retrieved current policy assigned to the SERVICEID: ")
          console.log(response);

          var policyIdArr = new Array();
          policyIdArr = response.message.split(';');
          var str_new  = "";
          for(var i = 0; i < policyIdArr.length; i++) {
              if(policyIdArr[i] != args.policyId.value.dataId) {
                  str_new = str_new + policyIdArr[i];
                  // console.log(str_new);
                  if(i != policyIdArr.length-1)
                      str_new = str_new + ';';
              }
          }
          console.log("New list " + str_new);
          rp({
              method: 'POST',
              uri: url.format({
                                protocol: 'http',
                                hostname: request_parameters.registry.ip,
                                port: request_parameters.registry.port,
                                pathname: request_parameters.path.registry_put
                              }),
              body: {
                "key": _service,
                "value": str_new
              },
              header:{'User-Agent': 'Service-Ledger-Interface'},
              json: true
          }).then(response => {
            // delete <PolicyId, meta-data> pair
            rp({
                method: 'POST',
                uri: url.format({
                     protocol: 'http',
                     hostname: request_parameters.registry.ip,
                     port: request_parameters.registry.port,
                     pathname: request_parameters.path.registry_delete
                }),
                body: options,
                header: {'User-Agent': 'Service-Ledger-Interface'},
                json: true
            }).then(response => {
                if(debug) {
                    console.log("---->response from Service-Ledger: ");
                    console.log(response);
                }
                examples['application/json'].message = response.message;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));

            }).catch (err =>{
              res.statusCode = 400;
              res.end(JSON.stringify({error: "unexpected error in the delete operation!"}));
            });
            /* */
          }).catch (err => {
            res.statusCode = 400;
            res.end(JSON.stringify({error: "Issue in updating managed services! Deletion aborted!"}));
          });
      }).catch(err => {
        res.statusCode = 400;
        res.end(JSON.stringify({error: "List of managed services not found! Deletion aborted!"}));
      });
  }).catch(err => {
      if(err.statusCode == 400){
        console.log("---->Policy not found!");
        //console.log(err)
        res.statusCode = 400;
        res.end(JSON.stringify({error: "unexpectedly policy not found"}));
      } else {
        //console.log(err)
        res.statusCode = 400;
        res.end(JSON.stringify({error: "unexpected error in the delete operation"}));
      }
  });
}

exports.policyPolServicePOST = function(args, res, next) {
  /**
   * Retrieving policies associated to a service
   *
   * serviceId Policy-ofservice-body Body in JSON
   * returns policy-ofservice-response
   **/
  if(debug) console.log('---->SLI: policyPolServicePOST method called');

  var token = args.serviceId.value.token;
  var reqId = args.serviceId.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var listToReturn = {};
  listToReturn['application/json'] = {
  "list" : []
  };

  var options = {
      "key": "POL_" + args.serviceId.value.serviceID
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
          console.log("---->response from Service-Ledger: ");
          console.log(response);
      }

      // check policy type here
      var policy_arr = response.message.split(";");
      var itemsProcessed = 0;
      policy_arr.forEach(function(value){  
        var each_policy = value.split(",");
        console.log("Searching info for policy "+ each_policy[0]);

        rp({
            method: 'POST',
            uri: url.format({
                 protocol: 'http',
                 hostname: request_parameters.registry.ip,
                 port: request_parameters.registry.port,
                 pathname: request_parameters.path.registry_get
            }),
            body: {"key" : each_policy[0]},
            header:{'User-Agent': 'Service-Ledger-Interface'},
            json: true
        }).then(response => {
            if(debug) {
                console.log("---->response GET from Service-Ledger: ");
                console.log(response);
            }

            console.log("Retrieved info on the policy: " + response.message);

            var policy_content = JSON.parse(response.message);

            listToReturn['application/json'].list.push(
              {"policyId": each_policy[0],
               "policy": policy_content.policy,
               "policyType": policy_content.policyType
              });

            console.log(JSON.stringify(listToReturn));
            itemsProcessed = itemsProcessed + 1;
            if(itemsProcessed === policy_arr.length) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(listToReturn[Object.keys(listToReturn)[0]] || {}, null, 2));
            }
        }).catch(err => {
            console.log(err)
            res.statusCode = 400;
            res.end(JSON.stringify({error: "unexpectedly policy not found"}));
        });
      });
  }).catch(err => {
      if(err.statusCode == 400){
          console.log("---->Policy not found!");
          console.log(err)
          res.statusCode = 400;
          res.end(JSON.stringify({error: "unexpectedly policy not found"}));
      } else {
        console.log(err)
        res.statusCode = 400;
        res.end(JSON.stringify({error: "unexpected error in the search operation"}));
      }
  });
}

exports.policyReadPOST = function(args, res, next) {
  /**
   * Retrieving a policy by its id
   *
   * policyId Query-request Body in JSON
   * returns policy-response
   **/
  if(debug) console.log('---->SLI: policyReadPOST method called');

  var token = args.policyId.value.token;
  var reqId = args.policyId.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

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
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from Service-Ledger: ");
          console.log(response);
      }

      var policy_content = JSON.parse(response.message);
      console.log(policy_content);

      examples['application/json'].expirationTime = policy_content.expirationTime;
      examples['application/json'].policy = policy_content.policy;
      examples['application/json'].message = policy_content.serviceID;

      if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  }).catch(err => {
      if(err.statusCode == 400)
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
  if(debug) console.log('--->SLI: policyStorePOST method called');
  // if(debug) console.log(request_parameters);
  // if(debug) console.log(args.policySpec.value);

  var token = args.policySpec.value.token;
  var reqId = args.policySpec.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var examples = {};

  examples['application/json'] = {
    "expirationTime" : args.policySpec.value.expirationTime,
    "policy" : args.policySpec.value.policy
  };

  var policy_key = args.policySpec.value.policyType + "_" + args.policySpec.value.policyId;

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
      }),
    body: {"key": policy_key},
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
    // policy alread exists
    /*examples['application/json'] = {
             "expirationTime" : "null",
             "policy" : "policy alread exists, can't update directly!"
    };
    if (Object.keys(examples).length > 0) {
             res.setHeader('Content-Type', 'application/json');
             res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
             res.end();
    }
    */
    console.log("Error Policy Already exists");
    res.statusCode = 409;
    res.end(JSON.stringify({error: "policy alread exists"}));
  }).catch(err => {
    if(err.statusCode == 400)
    {
        console.log("(1 of 2) Store policy as <POLICY_<policyID>, metadeta>")
        // policy not exists, so we store it
        var options = {
            "key": policy_key,
            "value": JSON.stringify({
                      policy: args.policySpec.value.policy,
                      serviceID: args.policySpec.value.serviceID,
                      expirationTime: args.policySpec.value.expirationTime,
                      policyType: args.policySpec.value.policyType
                    })
        };

        // store <policyId, Meta-data> pair
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
                console.log("----> response on policy storage from Service-Ledger: ");
                console.log(response);
            }
        }).catch(err => {
              console.log(err)
              res.statusCode = 400;
              res.end(JSON.stringify({error: "unexpected error while saving the policy!"}));
            }
        );

        console.log("(2 of 2) Adding the policy to the serviceID reference");
        // read the existing <serviceId, [policyId]> pair
        var _service = "POL_" + args.policySpec.value.serviceID
        rp({
            method: 'POST',
            uri: url.format({
                 protocol: 'http',
                 hostname: request_parameters.registry.ip,
                 port: request_parameters.registry.port,
                 pathname: request_parameters.path.registry_get
            }),
            body: {"key":_service },
            header:{'User-Agent': 'Service-Ledger-Interface'},
            json: true
        }).then(response => {
            // if old result exists
            console.log("Previos pair for the SERVICE with id " + args.policySpec.value.serviceID);
            console.log(response);
            var policyIdList = response.message + ';' + policy_key;
            console.log("List of policy already referred to the service: "+ policyIdList);

            options = {
                "key": _service,
                "value": policyIdList
            };

            console.log("Upading the pair <serviceID, [policyId]>");

            // store <serviceID, [policyId]> pair
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
              if (Object.keys(examples).length > 0) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
              } else {
                  res.end();
              }
          }).catch(err => {
            console.log(err)
            res.statusCode = 400;
            res.end(JSON.stringify({error: "unexpected error while saving the policy!"}));
          });
        }).catch(err => {
          console.log("First time the service is registered! Creating the tuple!");
              options = {
                  "key": _service,
                  "value": policy_key
              };

              console.log("---->store <serviceID, [policyId]>");
              console.log(options);

              // store <serviceID, [policyId]> pair
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
                  if (Object.keys(examples).length > 0) {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
                  } else {
                      res.end();
                  }
              }).catch(err => {
                console.log(err)
                res.statusCode = 400;
                res.end(JSON.stringify({error: "unexpected error while saving the policy!"}));
              });
        });
      } else {
        // unexpected error
        console.log("unexpected error!")
        res.statusCode = 400;
        res.end(JSON.stringify({error: "unexpected error"}));
      }
  });
}
