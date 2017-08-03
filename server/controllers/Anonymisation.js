'use strict';

var url = require('url');

var Anonymisation = require('./AnonymisationService');

module.exports.registerToRegistry = function registerToRegistry(req, res, next) {
  Anonymisation.registerToRegistry(req.swagger.params, res, next);
};

module.exports.queryOldRes = function queryOldRes(req, res, next) {
  Anonymisation.queryOldRes(req.swagger.params, res, next);
};

module.exports.receiveAnonyRes = function receiveAnonyRes(req, res, next) {
  Anonymisation.receiveAnonyRes(req.swagger.params, res, next);
};
