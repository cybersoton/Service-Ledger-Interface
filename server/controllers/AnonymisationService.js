'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');
var request_parameters = config.get('request_parameters');

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

  rp({
      method: 'POST',
      // uri: 'http://localhost:XXXX/r/put',
      uri: url.format({
            protocol: 'http',
            hostname: request_parameters.registry.ip,
            port: request_parameters.registry.port,
            pathname: request_parameters.path.registry_put
      }),
      body: {
                "key": JSON.stringify(args.body.value),
                "value": JSON.stringify(args.body.value)
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
    "data_provider" : "test_provider",
    "data_consumer" : "test_consumer",
    "time_stamp" : "2006-01-02 15:04:05",
    "dataID" : "test_data_007",
    "ifExist": 0,
    "budget_used": 10
  };

  var options = args.body.value;
  if(debug) {
      console.log("---->RI send request to Registry [options]: ");
      console.log(options);
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
    body: {"key": JSON.stringify(options)},
    header: {'User-Agent': 'Registry-Interface'},
    json: true
  }).then(response => {
    //if old result exist
    if(debug) {
        console.log("---->response the Registry: ");
        console.log(response);
    }
    let old_result_exist = true;
    let small_budget = 0.5;
    if(old_result_exist){
        examples['application/json'].ifExist = 1;
        examples['application/json'].budget_used = small_budget;
    } else {
        //if old result not exist
        examples['application/json'].ifExist = 0;
        let remain_budget = 10;
        if(args.body.value.request_budget < remain_budge){
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
  }).catch(err => {
      if(err.statusCode == 404) {
          console.log("----> Id not found!")

          let old_result_exist = false;
          let small_budget = 0.5;
          if(old_result_exist){
              examples['application/json'].ifExist = 1;
              examples['application/json'].budget_used = small_budget;
          } else {
              //if old result not exist
              examples['application/json'].ifExist = 0;
              let remain_budget = 10;
              if(args.body.value.request_budget < remain_budge){
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

  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MDg3ODcyMDksInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE1MDg3NTEyMDl9.A6UOctlh0msli0jHLtsFQceY1LOhou-k2jPAdiGEdGg";

  //perform utility check here
  var options = {
      "authorization": token, 
      "chaincodeName": "anonymisation_cc",
      "fcn": utilityCheck,
      "args": ["Data01","{'budget':0.5,'funType':'sum'}"]
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
      examples['application/json'].final_result = args.anonymised_result;
      examples['application/json'].final_status = 1; 
      
      if (Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  }).catch(err => {
      console.log("---->error when utility checking")
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
      message: "update ledger not successfully!"
  };

  rp({
      method: 'POST',
      // uri: 'http://localhost:60005/r/put',
      uri: url.format({
               protocol: 'http',
               hostname: request_parameters.registry.ip,
               port: request_parameters.registry.port,
               pathname: request_parameters.path.registry_put
           }),
      body: {
        "key": JSON.stringify(args.body.value),
        "value": JSON.stringify(args.body.value)
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
  }).catch(err => console.log(err));

}


