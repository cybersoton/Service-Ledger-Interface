'use strict';

var url = require('url');

var Alert = require('./AlertService');

module.exports.alertReadPOST = function alertReadPOST (req, res, next) {
  Alert.alertReadPOST(req.swagger.params, res, next);
};

module.exports.alertStorePOST = function alertStorePOST (req, res, next) {
  Alert.alertStorePOST(req.swagger.params, res, next);
};
