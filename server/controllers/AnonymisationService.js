'use strict';

var rp = require('request-promise');

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
  "message" : "register successfully"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
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
      console.log("---->RI send request to R [options]: ");
      console.log(options);
  }
  // query the registry
  rp({
    method: 'POST',
    uri: 'http://localhost:60005/r/get',
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
        if(args.request_budget < remain_budge){
            examples['application/json'].budget_used = args.request_budget;
        } else {
            examples['application/json'].budget_used = -1;
        }
    }
  }).catch(err => {
      console.error(`---->error when request!`);
      console.log(err);
  });

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
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

  //perform utility check here

  var examples = {};
  examples['application/json'] = {
  "final_status": 1,
  "final_result": 111
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}
