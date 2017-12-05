'use strict';

exports.proposalGetProposalPOST = function(args, res, next) {
  /**
   * getting a proposal 
   *
   * body Get-proposal-body Body in JSON
   * returns get-proposal-response
   **/
  var examples = {};
  examples['application/json'] = {
  "proposal" : [ {
    "proposerId" : "aeiou",
    "proposalQuorum" : "aeiou",
    "proposalDescription" : "aeiou"
  } ],
  "proposalStatus" : "aeiou",
  "typeProposal" : "aeiou",
  "proposalID" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.proposalSubmitProposalPOST = function(args, res, next) {
  /**
   * Submitting a proposal  
   *
   * body Submit-proposal-body Body in JSON
   * returns ack-response
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.proposalVoteProposalPOST = function(args, res, next) {
  /**
   * Submitting a proposal  
   *
   * body Vote-proposal-body Body in JSON
   * returns ack-response
   **/
  var examples = {};
  examples['application/json'] = {
  "message" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

