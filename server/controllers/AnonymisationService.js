'use strict';

var request = require('request-promise');

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
