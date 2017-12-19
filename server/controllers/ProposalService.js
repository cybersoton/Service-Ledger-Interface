'use strict';

exports.proposalCountVotesPOST = function(args, res, next) {
  /**
   * Request a votes counting to validate a stored proposal  
   *
   * body Countvotes-proposal-body Body in JSON
   * returns countvotes-proposal-response
   **/
  var examples = {};
  examples['application/json'] = {
  "requestorID" : "aeiou",
  "proposalStatus" : "aeiou",
  "proposalID" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.proposalGetProposalPOST = function(args, res, next) {
  /**
   * getting a proposal 
   *
   * body Get-proposal-body Body in JSON
   * returns get-proposal-response
   **/
  var examples = {};
  examples['application/json'] = {
  "requestorID" : "aeiou",
  "proposalStatus" : "aeiou",
  "votersNumber" : "aeiou",
  "proposalType" : "aeiou",
  "proposalQuorum" : "aeiou",
  "proposalID" : "aeiou",
  "proposalDescription" : "aeiou"
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
   * vote for a submitted a proposal  
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

