'use strict';

var url = require('url');

var Anonymisation = require('./AnonymisationService');

module.exports.anonymisationRegisterPOST = function anonymisationRegisterPOST (req, res, next) {
  Anonymisation.anonymisationRegisterPOST(req.swagger.params, res, next);
};

module.exports.anonymisationStatisticsPOST = function anonymisationStatisticsPOST (req, res, next) {
  Anonymisation.anonymisationStatisticsPOST(req.swagger.params, res, next);
};
