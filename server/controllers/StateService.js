'use strict';

exports.stateMember_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-member-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "name" : "aeiou",
  "id" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.stateMember_storePOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body State-member-store-body Body in JSON
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

exports.stateService_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-service-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "protocol" : "aeiou",
  "tenantID" : "aeiou",
  "name" : "aeiou",
  "serviceID" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.stateService_storePOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body State-service-store-body Body in JSON
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

exports.stateTenant_addMemberPOST = function(args, res, next) {
  /**
   * Creating a tenant 
   *
   * body State-tenant-store-member-body Body in JSON
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

exports.stateTenant_createPOST = function(args, res, next) {
  /**
   * Creating a tenant 
   *
   * body State-tenant-store-body Body in JSON
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

exports.stateTenant_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-tenant-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "cloudMemberIDs" : [ {
    "memberId" : "aeiou"
  } ],
  "name" : "aeiou",
  "id" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.stateVm_readPOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body Query-request Body in JSON cotaining the vm id
   * returns state-vm-request-body
   **/
  var examples = {};
  examples['application/json'] = {
  "disk" : "aeiou",
  "os" : "aeiou",
  "name" : "aeiou",
  "id" : "aeiou",
  "cloudMemberID" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.stateVm_storePOST = function(args, res, next) {
  /**
   * Storing federated services 
   *
   * body State-vm-store-body Body in JSON
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

