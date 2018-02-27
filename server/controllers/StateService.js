'use strict';

var rp = require('request-promise');
var config = require('config');
var url = require('url');

var request_parameters = config.get('request_parameters');
var utils = require('../util/utils.js');

var debug = true;


exports.stateDeleteKeyPOST = function(args, res, next) {
  /**
   * Remove the pair identified by the key
   *
   * body Query-request Body in JSON
   * returns ack-response
    **/
  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var examples = {};

  var options = {
        "key": args.body.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_delete
      }),
      body: options,
      header: {'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          console.log("---->response from Service-Ledger: ");
          console.log(response);
      }
      examples['application/json'] = response;
      if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
        res.statusCode = 400;
        res.end(JSON.stringify({error: "unexpected error in the delete operation"}));
      }
  }).catch(err => {
    console.log(err)
    res.statusCode = 400;
    res.end(JSON.stringify({error: "unexpected error in the delete operation"}));
    }
  );
}

exports.stateGetKeysPOST = function(args, res, next) {
  /**
   * Get all the key of a category
   *
   * body Key-get-body Body in JSON
   * returns key-response
   **/
  var examples = {};
  examples['application/json'] = {};
	/*
  "list" : [ {
    "keyId" : "aeiou"
  } ]
	};*/

  var options = {
    "key" : args.body.value.keyType
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_getAllKeys
      }),
      body: options,
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      //var value_content = JSON.parse(response.message);
      //if(debug) console.log(value_content);

      console.log(response.message);

      examples = {
        "list" : [response.message]
      };

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples));
    }).catch(err => {
      	console.log('ERRROR');
        if (err.statusCode == 404)
        {
            if(debug) console.log("---->Key not found!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "none";
        } else {
            if(debug) console.log("---->key not found!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "key not found";
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });
}


exports.stateMember_readPOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-member-request-body
   **/

  if(debug) console.log('---->SLI: state_Member_read method called');

  var examples = {};
  examples['application/json'] = {
      "name" : "member_read failed",
      "id" : "member_read failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
        res.writeHead(401);
        res.end('The authentication token is not valid!');
  }

  var options = {
      "key": args.body.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
      }),
      body: options,
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      var value_content = JSON.parse(response.message);
      if(debug) console.log(value_content);

      examples['application/json'].id = args.body.value.dataId;
      examples['application/json'].name = value_content.name;

     if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
    }).catch(err => {
        if(err.statusCode == 404)
        {
            if(debug) console.log("---->Member not found!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "none";
        } else {
            if(debug) console.log("---->error when request!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "error";
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });
}

exports.stateMember_storePOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body State-member-store-body Body in JSON
   * returns ack-response
   **/

  if (debug) console.log("-----> SLI: state_Member_Store method called");

  var examples = {};
  examples['application/json'] = {
    "message" : "Member Store failed!"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var options = {
    "key": 'MEMBER_'+ args.body.value.id,
    "value": JSON.stringify({
              name: args.body.value.name
  })};

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_put
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}

exports.stateService_readPOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-service-request-body
   **/
  if (debug) console.log("-----> SLI: state_Service_Read method called");
  var examples = {};
  examples['application/json'] = {
  "protocol" : "undefined",
  "tenantID" : "undefined",
  "name" : "undefined",
  "serviceID" : "undefined"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
        res.writeHead(401);
        res.end('The authentication token is not valid!');
  }

  var options = {
      "key": args.body.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
      }),
      body: options,
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      var value_content = JSON.parse(response.message);
      if(debug) console.log(value_content);

      examples['application/json'].serviceID = args.body.value.dataId
      examples['application/json'].tenantID = value_content.tenantID;
      examples['application/json'].name = value_content.name;
      examples['application/json'].protocol = value_content.protocol;

     if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
    }).catch(err => {
        if(err.statusCode == 404)
        {
            if(debug) console.log("---->Service not found!");
            examples['application/json'].serviceID = args.body.value.dataId;
            examples['application/json'].tenantID = "none";
            examples['application/json'].name = "none";
            examples['application/json'].protocol = "none";
        } else {
            if(debug) console.log("---->error when request!");
            examples['application/json'].serviceID = args.body.value.dataId;
            examples['application/json'].tenantID = "error";
            examples['application/json'].name = "error";
            examples['application/json'].protocol = "error";
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });
}

exports.stateService_storePOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body State-service-store-body Body in JSON
   * returns ack-response
   **/
  if (debug) console.log("-----> SLI: state_Service_Store method called");
  var examples = {};
  examples['application/json'] = {
    "message" : "Service_store failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var options = {
    "key": 'SERVICE_'+ args.body.value.serviceID,
    "value": JSON.stringify({
              "tenantID" : args.body.value.tenantID,
              "name": args.body.value.name,
              "protocol": args.body.value.protocol
             })
  };

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_put
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });


}

exports.stateTenant_addMemberPOST = function(args, res, next) {
  /**
   * Creating a tenant
   *
   * body State-tenant-store-member-body Body in JSON
   * returns ack-response
   **/
  if (debug) console.log("-----> SLI: state_Tenant_addMember method called");
  var examples = {};
  examples['application/json'] = {
  "message" : "add tenant member failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var options = {
    "key": args.body.value.id
  };

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_get
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        if(debug) console.log("---->response from Service-Ledger: ");
        if(debug) console.log(response);
    }

    var value_content = JSON.parse(response.message);
    if(debug) console.log(value_content);

    //add member to the tenant
    //console.log(value_content.cloudMemberIDs);
    value_content.cloudMemberIDs.push({"memberId": args.body.value.cloudMemberID});

    //store the new tenant state
    options = {
      "key": args.body.value.id,
      "value": JSON.stringify({
                name: value_content.name,
                cloudMemberIDs: value_content.cloudMemberIDs
    })};

    rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_put
      }),
      body: options,
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
    }).then(response => {
      if(debug) {
          console.log("---->response from Service-Ledger: ");
          console.log(response);
      }

      examples['application/json'].message = response.message;

      if (Object.keys(examples).length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
        res.end();
      }
    }).catch();
  }).catch(err => {
      if(err.statusCode == 404)
      {
          if(debug) console.log("---->Tenant not found!");
          examples['application/json'].message = "Tenant not found";
      } else {
          if(debug) console.log("---->error when request!");
          console.log(err);
          examples['application/json'].message = "error when get tenant";
      }
      if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
  });

}

exports.stateTenant_createPOST = function(args, res, next) {
  /**
   * Creating a tenant
   *
   * body State-tenant-store-body Body in JSON
   * returns ack-response
   **/

  if (debug) console.log("-----> SLI: state_Create_Tenant method called");

  var examples = {};
  examples['application/json'] = {
  "message" : "create tenant failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var options = {
    "key": 'TENANT_'+ args.body.value.id,
    "value": JSON.stringify({
              name: args.body.value.name,
              cloudMemberIDs: []
  })};

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_put
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });

}

exports.stateTenant_readPOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body Query-request Body in JSON cotaining the service id
   * returns state-tenant-request-body
   **/
  if (debug) console.log("-----> SLI: state_Read_Tenant method called");
  var examples = {};
  examples['application/json'] = {
    "cloudMemberIDs" : [ {
        "memberId" : "undefined"
    }],
    "name" : "undefined",
    "id" : "undefined"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
        res.writeHead(401);
        res.end('The authentication token is not valid!');
  }

  var options = {
      "key": args.body.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
      }),
      body: options,
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      var value_content = JSON.parse(response.message);
      if(debug) console.log(value_content);

      examples['application/json'].id = args.body.value.dataId
      examples['application/json'].name = value_content.name;
      examples['application/json'].cloudMemberIDs = value_content.cloudMemberIDs;

     if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
    }).catch(err => {
        if(err.statusCode == 404)
        {
            if(debug) console.log("---->Tenant not found!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "none";
            examples['application/json'].cloudMemberIDs = [{"memberId" : "none"}];
        } else {
            if(debug) console.log("---->error when request!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "error";
            examples['application/json'].cloudMemberIDs = [{"memberId" : "error"}];
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });

}

exports.stateVm_readPOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body Query-request Body in JSON cotaining the vm id
   * returns state-vm-request-body
   **/
  if (debug) console.log("-----> SLI: state_VM_read method called");
  var examples = {};
  examples['application/json'] = {
  "disk" : "undefined",
  "os" : "undefined",
  "name" : "undefined",
  "id" : "undefined",
  "cloudMemberID" : "undefined"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
        res.writeHead(401);
        res.end('The authentication token is not valid!');
  }

  var options = {
      "key": args.body.value.dataId
  };

  rp({
      method: 'POST',
      uri: url.format({
           protocol: 'http',
           hostname: request_parameters.registry.ip,
           port: request_parameters.registry.port,
           pathname: request_parameters.path.registry_get
      }),
      body: options,
      header:{'User-Agent': 'Service-Ledger-Interface'},
      json: true
  }).then(response => {
      if(debug) {
          if(debug) console.log("---->response from Service-Ledger: ");
          if(debug) console.log(response);
      }

      var value_content = JSON.parse(response.message);
      if(debug) console.log(value_content);

      examples['application/json'].id = args.body.value.dataId;
      examples['application/json'].name = value_content.name;
      examples['application/json'].os = value_content.os;
      examples['application/json'].disk = value_content.disk;
      examples['application/json'].cloudMemberID = value_content.cloudMemberID;

     if(Object.keys(examples).length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
      } else {
          res.end();
      }
    }).catch(err => {
        if(err.statusCode == 404)
        {
            if(debug) console.log("---->VM not found!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "none";
            examples['application/json'].os = "none";
            examples['application/json'].disk = "none";
            examples['application/json'].cloudMemberID = "none";
        } else {
            if(debug) console.log("---->error when request!");
            examples['application/json'].id = args.body.value.dataId;
            examples['application/json'].name = "error";
            examples['application/json'].os = "error";
            examples['application/json'].disk = "error";
            examples['application/json'].cloudMemberID = "error";
        }
        if(Object.keys(examples).length > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
        } else {
            res.end();
        }
    });

}

exports.stateVm_storePOST = function(args, res, next) {
  /**
   * Storing federated services
   *
   * body State-vm-store-body Body in JSON
   * returns ack-response
   **/

  if (debug) console.log("-----> SLI: stateVM_Store method called");

  var examples = {};
  examples['application/json'] = {
  "message" : "vm store failed"
  };

  var token = args.body.value.token;
  var reqId = args.body.value.requestorID;
  if (!utils.reqValidate(reqId,token)) {
      res.writeHead(401);
      res.end('The authentication token is not valid!');
  }

  var options = {
    "key": 'VM_'+ args.body.value.id,
    "value": JSON.stringify({
              name: args.body.value.name,
              os: args.body.value.os,
              disk: args.body.value.disk,
              cloudMemberID: args.body.value.cloudMemberID
  })};

  rp({
    method: 'POST',
    uri: url.format({
         protocol: 'http',
         hostname: request_parameters.registry.ip,
         port: request_parameters.registry.port,
         pathname: request_parameters.path.registry_put
    }),
    body: options,
    header:{'User-Agent': 'Service-Ledger-Interface'},
    json: true
  }).then(response => {
    if(debug) {
        console.log("---->response from Service-Ledger: ");
        console.log(response);
    }

    examples['application/json'].message = response.message;

    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  }).catch(err => {
    if(debug) console.log(err);
    if (Object.keys(examples).length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
    } else {
      res.end();
    }
  });
}
