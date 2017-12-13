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

exports.monitoringReadPOST = function(args, res, next) {
  /**
   * This endpoint is used to read the relevant monitoring data. 
   *
   * body Query-request Body in JSON
   * returns monitoring-response
   **/
/*  var examples = {};
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
};*/
  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;

  if(!utils.reqValidate(reqId, token)) {
    res.writeHead(401);
    res.end("The authentication token is not valid!");
  }

  var dataId = args.body.value.dataId;
  if(reqId == undefined || dataId == undefined) {
    res.writeHead(401);
    res.end("Invalid request! Required parameter(s) missing!");
  }

  var body_post = {
    "key": dataId
  };

  var headers = {
    "Content-Type": "application/json"
  };

  var options = {
    "url": registry_url + "get",
    "method": "POST",
    "headers": headers,
    "json": body_post
  };

  var body_response = {};

  request(options, function(error, response, body) {
    if(error) {
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({"message": error}));
    }
    else if(response.statusCode == 200) {
      console.log(body);
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(body.message);
    }
  });
}

exports.monitoringStorePOST = function(args, res, next) {
  /**
   * This endpoint is used to store relevant monitoring data. 
   *
   * body Monitoring-store Body in JSON
   * returns ack-response
   **/

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if(!utils.reqValidate(reqId, token)) {
    res.writeHead(401);
    res.end("The authentication token is not valid!");
  }

  var monitoringId = args.body.value.monitoringID;
  var loggerId = args.body.value.loggerID;
  var timeStamp = args.body.value.timeStamp;
  var dataType = args.body.value.dataType;
  var data = args.body.value.data;

  if(
   monitoringId == undefined ||
   loggerId == undefined ||
   timeStamp == undefined ||
   dataType == undefined ||
   data == undefined
  ) {
    res.writeHead(400);
    res.end("Invalid request! Required parameters missing!");
  }

  var body_post = {
    "key": monitoringId,
    "value": JSON.stringify({
      "loggerID": loggerId,
      "timeStamp": timeStamp,
      "dataType": dataType,
      "data": data
    })
  };

  var headers = {
    "Content-Type": "application/json"
  }

  var options = {
    "url": registry_url + "put",
    "method": "POST",
    "headers": headers,
    "json": body_post
  };

  request(options, function(error, response, body) {
    if(error) {
      res.writeHead(400, {"Content-Type": "application/json"});
      res.end(JSON.stringify({"message": error}));
    }
    else if(response.statusCode == 200) {
      res.writeHead(200, {"Content-Type": "application/json"});
      res.end(JSON.stringify(body));
    }
  });
}

