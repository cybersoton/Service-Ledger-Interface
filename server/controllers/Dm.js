'use strict';

var url = require('url');

var Dm = require('./DmService');

module.exports.dmDeletePOST = function dmDeletePOST (req, res, next) {
  Dm.dmDeletePOST(req.swagger.params, res, next);
};

module.exports.dmReadPOST = function dmReadPOST (req, res, next) {
  Dm.dmReadPOST(req.swagger.params, res, next);
};

module.exports.dmStorePOST = function dmStorePOST (req, res, next) {
  Dm.dmStorePOST(req.swagger.params, res, next);
};
