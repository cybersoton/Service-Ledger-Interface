'use strict';

// output service configuration
var config = require("config");
var assert = require("assert");
var registry_ip = config.get("request_parameters.registry.ip");
var registry_port = config.get("request_parameters.registry.port");

// registry url
var registry_url = "http://" + registry_ip + ":" + registry_port + "/r/";

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

  var dataId = args.body.value.dataId;
  var alertType = args.body.value.alertType;
  var alertSource = args.body.value.alertSource;
  var alertBody = args.body.value.alertBody;
  
  if(
    dataId == undefined ||
    reqId == undefined ||
    alertType == undefined ||
    alertSource == undefined ||
    alertBody == undefined
  ) {
    res.writeHead(400);
    res.end("Invalid request! Required parameter(s) missing!");
  }

  var body_post = {
    "key": dataId,
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
    "url": registry_url + "put",
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

