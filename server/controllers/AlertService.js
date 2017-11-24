'use strict';

exports.alertReadPOST = function(args, res, next) {
  /**
   * This endpoint is used to retrieve the stored alert using the index. The body contains the alert id received by the store api 
   *
   * body Query-request Body in JSON
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

exports.alertStorePOST = function(args, res, next) {
  /**
   * This endpoint is used to store alerts. 
   *
   * body Alert-store Body in JSON
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

