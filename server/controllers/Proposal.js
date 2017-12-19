'use strict';

var url = require('url');

var Proposal = require('./ProposalService');

module.exports.proposalCountVotesPOST = function proposalCountVotesPOST (req, res, next) {
  Proposal.proposalCountVotesPOST(req.swagger.params, res, next);
};

module.exports.proposalGetProposalPOST = function proposalGetProposalPOST (req, res, next) {
  Proposal.proposalGetProposalPOST(req.swagger.params, res, next);
};

module.exports.proposalSubmitProposalPOST = function proposalSubmitProposalPOST (req, res, next) {
  Proposal.proposalSubmitProposalPOST(req.swagger.params, res, next);
};

module.exports.proposalVoteProposalPOST = function proposalVoteProposalPOST (req, res, next) {
  Proposal.proposalVoteProposalPOST(req.swagger.params, res, next);
};
