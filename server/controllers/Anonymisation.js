'use strict';

var url = require('url');

var Anonymisation = require('./AnonymisationService');

module.exports.anonymisationQueryOldRes = function anonymisationQueryOldRes (req, res, next) {
  Anonymisation.anonymisationQueryOldRes(req.swagger.params, res, next);
};

module.exports.anonymisationReceiveAnonyRes = function anonymisationReceiveAnonyRes (req, res, next) {
  Anonymisation.anonymisationReceiveAnonyRes(req.swagger.params, res, next);
};

module.exports.anonymisationRegisterToRegistry = function anonymisationRegisterToRegistry (req, res, next) {
  Anonymisation.anonymisationRegisterToRegistry(req.swagger.params, res, next);
};

module.exports.anonymisationUpdateLedger = function anonymisationUpdateLedger (req, res, next) {
  Anonymisation.anonymisationUpdateLedger(req.swagger.params, res, next);
};
