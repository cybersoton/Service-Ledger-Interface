'use strict';

var url = require('url');

var Policy = require('./PolicyService');

module.exports.policyDeletePOST = function policyDeletePOST (req, res, next) {
  Policy.policyDeletePOST(req.swagger.params, res, next);
};

module.exports.policyPolServicePOST = function policyPolServicePOST (req, res, next) {
  Policy.policyPolServicePOST(req.swagger.params, res, next);
};

module.exports.policyReadPOST = function policyReadPOST (req, res, next) {
  Policy.policyReadPOST(req.swagger.params, res, next);
};

module.exports.policyStorePOST = function policyStorePOST (req, res, next) {
  Policy.policyStorePOST(req.swagger.params, res, next);
};
