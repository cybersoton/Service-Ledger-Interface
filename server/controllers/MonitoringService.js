'use strict';

exports.monitoringReadPOST = function(args, res, next) {
  /**
   * This endpoint is used to read the relevant monitoring data. 
   *
   * body Query-request Body in JSON
   * returns monitoring-response
   **/
  var examples = {};
  examples['application/json'] = {
  "requestorID" : "aeiou",
  "list" : [ {
    "timeStamp" : "aeiou",
    "data" : "aeiou",
    "dataType" : "aeiou",
    "loggerID" : "aeiou"
  } ],
  "token" : "aeiou",
  "monitoringID" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.monitoringStorePOST = function(args, res, next) {
  /**
   * This endpoint is used to store relevant monitoring data. 
   *
   * body Monitoring-store Body in JSON
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

