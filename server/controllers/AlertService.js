'use strict';

// output service configuration
var config = require("config");
var assert = require("assert");
var registry_ip = config.get("request_parameters.registry.ip");
var registry_port = config.get("request_parameters.registry.port");

var request_parameters = config.get('request_parameters');


// registry url
var registry_url = "http://" + registry_ip + ":" + registry_port ;

// utils
var utils = require("../util/utils.js");
var request = require("request");

exports.alertReadPOST = function(args, res, next) {
  /**
   * This endpoint is used to retrieve the stored alert using the index. The body contains the alert id received by the store api 
   *
   * body Query-request Body in JSON
   * returns ack-response
   **/

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if(!utils.reqValidate(reqId, token)) {
    res.writeHead(401);
    res.end("The authentication token is not valid!");
  }

  var dataId = args.body.value.dataId;
  if(reqId == undefined || dataId == undefined) {
    res.writeHead(401);
    res.end("Invalid request! Required parameter(s) missing");
  }

  var body_post = {
    "key": dataId
  };

  var headers = {
    "Content-Type": "application/json"
  }

  var options = {
    "url": registry_url + request_parameters.path.registry_get,
    "method": "POST",
    "headers": headers,
    "json": body_post
  };

  var body_response = {};

  request(options, function(error, response, body) {
    if(error) {
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({"message": "error"}));
    }
    else if(response.statusCode == 200) {
      console.log(body);
      res.writeHead(200, {"Content-type": "application/json"});
      res.end(body.message);
    }
  });
}

exports.alertStorePOST = function(args, res, next) {
  /**
   * This endpoint is used to store alerts. 
   *
   * body Alert-store Body in JSON
   * returns ack-response
   **/
  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if(!utils.reqValidate(reqId,token)) {
    res.writeHead(401);
    res.end("The authentication token is not valid!");
  }

  var alertId = args.body.value.alertID;
  var alertType = args.body.value.alertType;
  var alertSource = args.body.value.alertSource;
  var alertBody = args.body.value.alertBody;
  
  if(
    alertId == undefined ||
    reqId == undefined ||
    alertType == undefined ||
    alertSource == undefined ||
    alertBody == undefined
  ) {
    res.writeHead(400);
    res.end("Invalid request! Required parameter(s) missing!");
  }

  var body_post = {
    "key": alertId,
    "value": JSON.stringify({
      "alertType": alertType,
      "alertSource": alertSource,
      "alertBody": alertBody
    })
  };

  // set the headers
  var headers = {
    "Content-Type": "application/json"
  };

  // configure the request
  var options = {
    "url": registry_url + request_parameters.path.registry_put,
    "method": "POST",
    "headers": headers,
    "json": body_post
  }

  // start the request 
  request(options, function(error, response, body) {
    if(error) {
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({"message": "error"}));
    }
    else if(response.statusCode == 200) {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(body));
    }
  });
}

