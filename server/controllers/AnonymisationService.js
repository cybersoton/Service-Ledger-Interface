'use strict';

var request = require('request-promise');

exports.registerToRegistry = function(args, res, next) {
  /**
   * This endpoint is used to register a data-sharing event. 
   *
   * body Anony-register-body Body in JSON
   * returns anony-register-response
   **/
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

exports.queryOldRes = function(args, res, next) {
  /**
   * This endpoint is used to query the anonymised statistical result given  the DataId and requested budget. 
   *
   * body Anony-query-body Body in JSON
   * returns anony-query-response
   **/
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

exports.receiveAnonyRes = function(args, res, next) {
  /**
   * This endpoint is used to receive the result from the Anonymisation
   * Interface.
   *
   * body receive-anony-res body in JSON
   * returns receive-anony-res-response
   **/
  var examples = {};
  examples['application/json'] = {
  "final_status": 111,
  "final_result": 111
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}
