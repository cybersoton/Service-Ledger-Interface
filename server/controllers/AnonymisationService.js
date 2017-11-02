'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');
var request_parameters = config.get('request_parameters');
var anonymisation_parameters = config.get('anonymisation_parameters');

var debug = true;

exports.anonymisationRegisterToRegistry = function(args, res, next) {
  /**
   * This endpoint is used to register a data-sharing event. 
   *
   * body Anony-register-body Body in JSON
   * returns anony-register-response
   **/
  if(debug) console.log(`--->RI: anonymisationRegisterToRegistry method called`);
  var examples = {};
      examples['application/json'] = {
      "message" : "register failed"
  };

  //store function types
  rp({
      method: 'POST',
      uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_put
      }),
      body: {
                "key": "functionTypes",
                "value": JSON.stringify(args.body.value.function_type)
            },
      header: {'User-Agent': 'Registry-Interface'},
      json: true
  });

  //store privacy budget 
  rp({
      method: 'POST',
      uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_put
      }),
      body: {
                "key": "privacyBudget",
                "value": JSON.stringify(args.body.value.privacy_budget)
            },
      header: {'User-Agent': 'Registry-Interface'},
      json: true
  });

  //store configuration key
  rp({
      method: 'POST',
      uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_put
      }),
      body: {
                "key": "configurationKey",
                "value": JSON.stringify(args.body.value.configuration_key)
            },
      header: {'User-Agent': 'Registry-Interface'},
      json: true
  });
  
  //store file key
  rp({
      method: 'POST',
      uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_put
      }),
      body: {
                "key": "fileKey", 
                "value": JSON.stringify(args.body.value.file_key)
            },
      header: {'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
  
      examples['application/json'].message = response.message;

      if (Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }

  }).catch(err => {
      console.log("---->RI: register to Registry failed!");
      if (Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  });
}

exports.anonymisationQueryOldRes = function(args, res, next) {
  /**
   * This endpoint is used to query the anonymised statistical result given  the DataId and requested budget. 
   *
   * body Anony-query-body Body in JSON
   * returns anony-query-response
   **/
  if(debug) console.log("--->RI: anonymisationQueryOldRes method called!");
  
  var examples = {};
  
  examples['application/json'] = {
    "dataID" : "error",
    "ifExist": 0,
    "budget_used": -1 
  };

  examples['application/json'].dataID = args.body.value.dataID;

  var options = args.body.value;
  if(debug) {
      console.log("---->RI send request to Registry: ");
  }

  var remain_budget = -1;

  rp({
    method: 'POST',
    uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_get
         }),
    body: {"key": "privacyBudget"},
    header: {'User-Agent': 'Registry-Interface'},
    json: true
  }).then(response => {
    var obj = JSON.parse(response.message);
    for (var key in obj) {
        if(key == args.body.value.function_type) {
            remain_budget = obj[key];
        }
    }

    // query the registry
    rp({
        method: 'POST',
        // uri: 'http://localhost:60005/r/get',
        uri: url.format({
              protocol: 'http',
              hostname: request_parameters.registry.ip,
              port: request_parameters.registry.port,
              pathname: request_parameters.path.registry_get
        }),
        body: {"key": args.body.value.function_type},
        header: {'User-Agent': 'Registry-Interface'},
        json: true
    }).then(response => {
    //old result exist
    if(debug) {
        console.log("---->response the Registry: ");
        console.log(response);
    }
    let old_result_exist = true;
    let old_result = response.message;
    let small_budget = anonymisation_parameters.small_budget.value;
    if(old_result_exist) {
        examples['application/json'].ifExist = 1;
        examples['application/json'].budget_used = small_budget;
    } 
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
    }).catch(err => {
    //old result doesn't exist
      if(err.statusCode == 404) {
          console.log("----> old result not found!")

          let old_result_exist = false;
          let small_budget = anonymisation_parameters.small_budget.value;
          if(old_result_exist){
              examples['application/json'].ifExist = 1;
              examples['application/json'].budget_used = small_budget;
          } else {
              //old result not exist
              examples['application/json'].ifExist = 0;
              if(args.body.value.request_budget < remain_budget){
                  examples['application/json'].budget_used = args.body.value.request_budget;
              } else {
                  // budget used up
                  examples['application/json'].budget_used = -1;
              }
          }
          if (Object.keys(examples).length > 0) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
          } else {
              res.end();
          }
      } else {
           console.error(`---->error when request!`);
           // console.log(err);
      }
    });
 
  }).catch(err => {
    console.log("----->initial budgets not defined!")
    if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
        res.end();
    }
  });
}

exports.anonymisationReceiveAnonyRes = function(args, res, next) {
  /**
   * This endpoint is used to receive the result from the Anonymisation
   * Interface.
   *
   * body receive-anony-res body in JSON
   * returns receive-anony-res-response
   **/
  if(debug) console.log(`--->RI: anonymisationReceiveAnonyRes method called`);

  var examples = {};
  examples['application/json'] = {
     "final_status": -1,
     "final_result": -111
  };

  var token = request_parameters.token.chaincode_auth; 
  console.log(token);
  var chaincodeArgs = {
      "budget": args.body.value.budget_used,
      "funType": args.body.value.function_type,
      "result": args.body.value.anonymised_result
  }; 

  var chaincodeArgs_arr = [JSON.stringify(args.body.value.dataID), JSON.stringify(chaincodeArgs)];
  console.log(chaincodeArgs_arr);

  //perform utility check here
  var options = {
      "authorization": token, 
      "chaincodeName": "anonymisation_cc",
      "fcn": "utilityCheck",
      "args": chaincodeArgs_arr 
  };
  rp({
      method: 'POST',
      uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_invoke
      }),
      body: options,
      header: {'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from the utilityCheck chaincode: ");
          console.log(response);
      }
      examples['application/json'].final_result = args.body.value.anonymised_result;
      examples['application/json'].final_status = 1; 
      
      if (Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  }).catch(err => {
      // console.log("---->error when invoke utilityCheck chaincode");
      examples['application/json'].final_result = args.body.value.anonymised_result;
      examples['application/json'].final_status = 1; 
      if (Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
            res.end();
      }
  });
      

}

exports.anonymisationUpdateLedger = function(args, res, next) {

  if(debug) {
      console.log(`--->RI: anonymisationUpdateLedgeer method called. args: `);
      console.log(args);
  }

  
  var examples = {};
  examples['application/json'] = {
      message: "update ledger failed!"
  };

  rp({
      method: 'POST',
      uri: url.format({
               protocol: 'http',
               hostname: request_parameters.registry.ip,
               port: request_parameters.registry.port,
               pathname: request_parameters.path.registry_put
           }),
      body: {
        "key": args.body.value.function_type,
        "value": args.body.value.anonymised_result.toString()
      },
      header: {'User-Agent': 'Registry-Interface'},
      json: true
  }).then(response => {
     if(debug) {
         console.log("---->response from Registry: ");
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
    console.log(err)
    if (Object.keys(examples).length > 0) {
       res.setHeader('Content-Type', 'application/json');
       res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
       res.end();
    }
  });

}


