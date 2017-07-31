'use strict';

exports.sLAMetricsReadPOST = function(args, res, next) {
  /**
   * This endpoint is used to retrieve the stored metrics using the index. 
   *
   * body Sla-read-body Body in JSON
   * returns sla-read-response
   **/
  var examples = {};
  examples['application/json'] = {
  "timeStamp" : "aeiou",
  "memorySize" : "aeiou",
  "requestorID" : "aeiou",
  "CPUPower" : "aeiou",
  "bandwidth" : "aeiou",
  "responseTime" : "aeiou",
  "diskSpace" : "aeiou",
  "elasticity" : "aeiou",
  "availability" : "aeiou",
  "throughput" : "aeiou",
  "connections" : "aeiou",
  "token" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.sLAMetricsStorePOST = function(args, res, next) {
  /**
   * This endpoint is used to store performance metrics. 
   *
   * body Sla-store-body Body in JSON
   * returns sla-store-response
   **/
  var examples = {};
  examples['application/json'] = {
  "index" : 123
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

