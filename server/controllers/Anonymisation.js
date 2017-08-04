'use strict';

var url = require('url');

var Anonymisation = require('./AnonymisationService');

module.exports.anonymisationQueryOldResPOST = function anonymisationQueryOldResPOST (req, res, next) {
  Anonymisation.anonymisationQueryOldResPOST(req.swagger.params, res, next);
};

module.exports.anonymisationReceiveAnonyResPOST = function anonymisationReceiveAnonyResPOST (req, res, next) {
  Anonymisation.anonymisationReceiveAnonyResPOST(req.swagger.params, res, next);
};

module.exports.anonymisationRegisterPOST = function anonymisationRegisterPOST (req, res, next) {
  Anonymisation.anonymisationRegisterPOST(req.swagger.params, res, next);
};
