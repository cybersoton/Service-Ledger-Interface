'use strict';

var url = require('url');

var Monitoring = require('./MonitoringService');

module.exports.monitoringReadPOST = function monitoringReadPOST (req, res, next) {
  Monitoring.monitoringReadPOST(req.swagger.params, res, next);
};

module.exports.monitoringStorePOST = function monitoringStorePOST (req, res, next) {
  Monitoring.monitoringStorePOST(req.swagger.params, res, next);
};
