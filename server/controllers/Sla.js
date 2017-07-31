'use strict';

var url = require('url');

var Sla = require('./SlaService');

module.exports.sLAMetricsReadPOST = function sLAMetricsReadPOST (req, res, next) {
  Sla.sLAMetricsReadPOST(req.swagger.params, res, next);
};

module.exports.sLAMetricsStorePOST = function sLAMetricsStorePOST (req, res, next) {
  Sla.sLAMetricsStorePOST(req.swagger.params, res, next);
};
