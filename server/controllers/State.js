'use strict';

var url = require('url');

var State = require('./StateService');

module.exports.stateGetKeysPOST = function stateGetKeysPOST (req, res, next) {
  State.stateGetKeysPOST(req.swagger.params, res, next);
};

module.exports.stateMember_readPOST = function stateMember_readPOST (req, res, next) {
  State.stateMember_readPOST(req.swagger.params, res, next);
};

module.exports.stateMember_storePOST = function stateMember_storePOST (req, res, next) {
  State.stateMember_storePOST(req.swagger.params, res, next);
};

module.exports.stateService_readPOST = function stateService_readPOST (req, res, next) {
  State.stateService_readPOST(req.swagger.params, res, next);
};

module.exports.stateService_storePOST = function stateService_storePOST (req, res, next) {
  State.stateService_storePOST(req.swagger.params, res, next);
};

module.exports.stateTenant_addMemberPOST = function stateTenant_addMemberPOST (req, res, next) {
  State.stateTenant_addMemberPOST(req.swagger.params, res, next);
};

module.exports.stateTenant_createPOST = function stateTenant_createPOST (req, res, next) {
  State.stateTenant_createPOST(req.swagger.params, res, next);
};

module.exports.stateTenant_readPOST = function stateTenant_readPOST (req, res, next) {
  State.stateTenant_readPOST(req.swagger.params, res, next);
};

module.exports.stateVm_readPOST = function stateVm_readPOST (req, res, next) {
  State.stateVm_readPOST(req.swagger.params, res, next);
};

module.exports.stateVm_storePOST = function stateVm_storePOST (req, res, next) {
  State.stateVm_storePOST(req.swagger.params, res, next);
};
