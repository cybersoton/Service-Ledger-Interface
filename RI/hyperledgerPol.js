/**
 * This file is part of SUNFISH Registry Interface.
 *
 * SUNFISH Registry Interface is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SUNFISH Registry Interface is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 */

//Author: Md Sadek Ferdous

var express = require('express');
var fs = require('fs');
var url = require( "url" );
var sleep = require('sleep');

var ini = require('ini');
var log4js = require('log4js');
var logger = log4js.getLogger('POLICY');

var hfc = require('fabric-client');
var utils = require('fabric-client/lib/utils.js');
var Peer = require('fabric-client/lib/Peer.js');
var Orderer = require('fabric-client/lib/Orderer.js');
var EventHub = require('fabric-client/lib/EventHub.js');

var config = require('./config.json');
var helper = require('./helper.js');

var express = require('express');
var https = require('https');
var http = require('http');
var queryString = require( "querystring" );

var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  key = new Buffer('eeng4ge0woobohgooqu4ieriwohgoo6C'); 

var querystring = require('querystring');

var configIni = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

logger.setLevel('INFO');

var client = new hfc();
var chain;
var eventhub;
var tx_id = null;

var start = true;

var index = 1202;

dockerIP = configIni.dockerIP;

var MemcachePlus = require('memcache-plus');

var memCacheClient = new MemcachePlus(dockerIP + ':11211');

memCacheClient
.flush()
.then(function() {
    logger.info('Successfully cleared all data');
});

process.on('SIGINT', function() {
    logger.info("Caught interrupt signal");

    memCacheClient
    .disconnect()
    .then(function() {
        logger.info('Successfully disconnected from all memCacheClients!');
    });
    process.exit();
});

init();

function init() {
	chain = client.newChain(config.chainName);
	chain.addOrderer(new Orderer(config.orderer.orderer_url));
	eventhub = new EventHub();
	eventhub.setPeerAddr(config.events[0].event_url);
	eventhub.connect();
	for (var i = 0; i < config.peers.length; i++) {
		chain.addPeer(new Peer(config.peers[i].peer_url));
	}
}

eventhub.registerChaincodeEvent("policy", 'storePolicy', function(result){
  logger.info('======Store chaincode event received!======');
  var id = result.payload.toString('utf8');
  logger.info("Store Policy Event:" + id);

  memCacheClient
  .get("store-"+id)
  .then(function(data) {
    if(data != null){
      memCacheClient
        .delete("store-"+id)
        .then(function() {
          logger.info('Successfully removed the policy ID-txHash mapping from the cache!');
      });
    }
  });

  memCacheClient
  .get("serv-"+id)
  .then(function(serviceID) {
    if(serviceID != null){
      memCacheClient
      .delete(serviceID)
      .then(function() {
        logger.info('Successfully removed the serviceID  mapping from the cache!');          
      });
    }
  });
});

eventhub.registerChaincodeEvent("policy", 'updatePolicy', function(result){
  logger.info('======Update chaincode event received!======');
  var id = result.payload.toString('utf8');
  logger.info("Update Policy Event:" + id);

  memCacheClient
  .delete("update-"+id)
  .then(function() {
    logger.info('Successfully removed the policy update-id  mapping from the cache!');          
  });

  memCacheClient
  .get("serv-"+id)
  .then(function(serviceID) {
    logger.info("Here2!");
    if(serviceID != null){
      memCacheClient
      .delete(serviceID)
      .then(function() {
        logger.info('Successfully removed the serviceID  mapping from the cache!');          
      });
    }
  });
});

eventhub.registerChaincodeEvent("policy", 'deletePolicy', function(result){
  logger.info('======Delete chaincode event received!========');
  var id = result.payload.toString('utf8');
  logger.info("Delete Policy Event:" + id);
  memCacheClient
  .get("delete-"+id)
  .then(function(data) {
    if(data != null){
      memCacheClient
        .delete("delete-"+id)
        .then(function() {
          logger.info('Successfully removed the policy delete-id mapping from the cache!');
      });
    }
  });

  memCacheClient
  .get("serv-"+id)
  .then(function(serviceID) {
    if(serviceID != null){
      memCacheClient
      .delete(serviceID)
      .then(function() {
        logger.info('Successfully removed the serviceID  mapping from the cache!');          
      });
    }
  });
});

function validate(token){
  //TODO write the code to validate token...
  return true;
}

function updateServiceID(id){
  //write the code to check if there is already a policy with the supplied id in the registry. If so, return true, else false

  memCacheClient.set("serv-"+id, serviceID, function(err) {
    if(err){    
      logger.info("Problem storing the policy-service mapping at updateServiceID!");
    } else {
      logger.info('Successfully stored the policy-service mapping at updateServiceID!');
    }               
  });

  hfc.newDefaultKeyValueStore({
    path: config.keyValueStore
  }).then(function(store) {
      client.setStateStore(store);
      return helper.getSubmitter(client);
  }).then(
      function(admin) {          
          var targets = [];
          for (var i = 0; i < config.peers.length; i++) {
              targets.push(config.peers[i]);
          }

          var args = [
          "read",
          id
          ];
          //chaincode query request
          var request = {
              targets: targets,
              chaincodeId: "policy",
              chainId: "sunfish",
              txId: utils.buildTransactionID(),
              nonce: utils.getNonce(),
              fcn: "invoke",
              args: args
          };
          // Query chaincode
          return chain.queryByChaincode(request);
      }
  ).then(
      function(response_payloads) {
        serviceID = "";

        for (let i = 0; i < 1; i++) {          
          var logs = response_payloads[i].toString('utf8').split(",");                      
          serviceID = logs[1];
        }

        memCacheClient
        .get(serviceID)
        .then(function(data) {
          if(data != null){
            logger.info("Data received at updateServiceID!");
            memCacheClient
              .delete(serviceID)
              .then(function() {
                logger.info('Successfully removed the service from the cache at updateServiceID!');
            });
          }
        });                
      }
  ).catch(
      function(err) {
          logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
      }
  );  
}

function policyFoundTest(id, req, res, op){
  //The code to check if there is already a policy with the supplied id in the registry. If so, return true, else false  

  hfc.newDefaultKeyValueStore({
    path: config.keyValueStore
  }).then(function(store) {
      client.setStateStore(store);
      return helper.getSubmitter(client);
  }).then(
      function(admin) {          
          var targets = [];
          for (var i = 0; i < config.peers.length; i++) {
              targets.push(config.peers[i]);
          }

          var args = [
          "read",
          id
          ];
          //chaincode query request
          var request = {
              targets: targets,
              chaincodeId: "policy",
              chainId: "sunfish",
              txId: utils.buildTransactionID(),
              nonce: utils.getNonce(),
              fcn: "invoke",
              args: args
          };
          // Query chaincode
          return chain.queryByChaincode(request);
      }
  ).then(
      function(response_payloads) {
        logger.info("payload length:" + response_payloads.length);
        if (response_payloads === undefined || response_payloads.length === 0){
          if(op === 'read')readAfterCheck(req, res, false);
          else if (op === 'store')storeAfterCheck(req, res, false);
          else if (op === 'update')updateAfterCheck(req, res, false);
          else if (op === 'service')serviceAfterCheck(req, res, false);
          else if (op === 'delete')deleteAfterCheck(req, res, false);
        } else {
          logger.info("Returning true!");
          if(op === 'read')readAfterCheck(req, res, true);
          else if (op === 'store')storeAfterCheck(req, res, true);
          else if (op === 'update')updateAfterCheck(req, res, true);
          else if (op === 'service')serviceAfterCheck(req, res, true);
          else if (op === 'delete')deleteAfterCheck(req, res, true);
        }         
      }
  ).catch(
      function(err) {
          logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
      }
  );  
}

function policyFound(id){
  //The code to check if there is already a policy with the supplied id in the registry. If so, return true, else false  

  hfc.newDefaultKeyValueStore({
    path: config.keyValueStore
  }).then(function(store) {
      client.setStateStore(store);
      return helper.getSubmitter(client);
  }).then(
      function(admin) {          
          var targets = [];
          for (var i = 0; i < config.peers.length; i++) {
              targets.push(config.peers[i]);
          }

          var args = [
          "read",
          id
          ];
          //chaincode query request
          var request = {
              targets: targets,
              chaincodeId: "policy",
              chainId: "sunfish",
              txId: utils.buildTransactionID(),
              nonce: utils.getNonce(),
              fcn: "invoke",
              args: args
          };
          // Query chaincode
          return chain.queryByChaincode(request);
      }
  ).then(
      function(response_payloads) {
        if (response_payloads === undefined || response_payloads.length === 0){
          return false;
        } else {
          return true;          
        }         
      }
  ).catch(
      function(err) {
          logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
      }
  );  
}

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,key)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,key)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports.store = function(req,res){
  
  requestorID = req.body.requestorID;
  token = req.body.token;
  policy = req.body.policy;
  expirationTime = req.body.expirationTime;
  id = req.body.id;
  serviceID = req.body.serviceID;
  policyType = req.body.policyType;
  

  /**
   * At first check if the required parameters are there. If not send a 400 response, else proceed...
   * Then, validate the token. If unsuccessful, send a 401 response, else proceed....
   * Then, check if there is already a policy with the ID. If so, send a 409 response, else proceed....    
   */
  if (requestorID == undefined || token == undefined || policy == undefined || expirationTime == undefined
    || id == undefined || serviceID == undefined || policyType == undefined) {
    res.writeHead(400);
    res.end('Invalid request, required parameter(s) missing!\n');
  } if(!validate(token)) {    
    res.writeHead(401);
    res.end('The operation is not allowed (unauthorised access, the token is invalid, etc.).\n');  
  } else {
    policyFoundTest(id, req, res, "store");
  }  
}

function storeAfterCheck(req, res, flag){
  if(flag){
    res.writeHead(409);
    res.end('The operation is not allowed as the policy already exists!\n');  
  } else {
    requestorID = req.body.requestorID;
    token = req.body.token;
    policy = req.body.policy;
    expirationTime = req.body.expirationTime;
    id = req.body.id;
    serviceID = req.body.serviceID;
    policyType = req.body.policyType;  

    /*
      * Due to the latency involved in storing the value in the smart-contract, at first, it is checked if the
      * same policy is bening added here. If so, reject the request, else proceed on...
      */ 

    memCacheClient
    .get("store-"+id)
    .then(function(data) {
      if(data != null){
        res.writeHead(409);
        res.end('The operation is not allowed as the policy is in the process of being stored!\n'); 
      } else {
          /**          
           * The code to save the collected information into the smart-contract goes below.....
           * At first, encrypt the policy...
           */

        // Storing in the cache the corresponding serviceID for the policy....
              
        memCacheClient.set("serv-"+id, serviceID, function(err) {
          if(err){    
            logger.info("Problem storing the policy-service mapping!");
          } else {
            logger.info('Successfully stored the policy-service mapping!');
          }               
        });                             

        encryptedPolicy = encrypt(policy);

        var args = [
          "save",
          id,
          serviceID,
          expirationTime,
          policyType,
          encryptedPolicy            
        ]         

        hfc.newDefaultKeyValueStore({
          path: config.keyValueStore        
        }).then(function(store) {
          client.setStateStore(store);
          return helper.getSubmitter(client);
        }).then(
          function(admin) {            
            tx_id = helper.getTxId();
            var nonce = utils.getNonce();
            
            var request = {
              chaincodeId: "policy",
              fcn: "invoke",
              args: args,
              chainId: "sunfish",
              txId: tx_id,
              nonce: nonce
            };
            return chain.sendTransactionProposal(request);
          }
        ).then(
          function(results) {
            return helper.processProposal(chain, results, 'move');
          }
        ).then(
          function(response) {
            if (response.status === 'SUCCESS') {                

              logger.info('Successfully stored the value!');                
              
              // if there is cache involving the submitted serviceID, the cache needs to be updated, hence removed...
              memCacheClient
              .get(serviceID)
              .then(function(data) {
                if(data != null){
                  memCacheClient
                    .delete(serviceID)
                    .then(function() {
                      logger.info('Successfully removed service from the cache!');                    
                  });
                }
              });  

              //add the mapping of the policy ID and the transaction hash to be used by the Hyperledger filter...
              memCacheClient.set("store-"+id, id, function(err) {
                if(err){    
                  logger.info("Problem storing the policy-id mapping!");
                } else {
                  logger.info('Successfully stored the policy-id mapping!');
                }               
              });                                                                      

              returnMessage = "Data has been stored in the registry!";

              res.writeHead(200, {"Content-Type": "application/json"});
              
              var json = JSON.stringify({ 
                "message": returnMessage    
              });
              
              res.end(json + '\n');              

            }
          }
        ).catch(
          function(err) {
            logger.info("Are we here error:" + err.stack ? err.stack : err);
            eventhub.disconnect();              
          }
        );
      }
  });          
  }  
}

function readAfterCheck(req, res, flag){
  if(!flag){    
    res.writeHead(404);
    res.end('The respective policy is not found!\n');
  } else {
    requestorID = req.body.requestorID;
    token = req.body.token;  
    id = req.body.id;

    /**     
     * At first, check in the cache using the id...if found retrieve data and send over the body
     * 
     * If not found in the cache, retrieve the data from the registry...
     */

      /*
      *cache checking...
      */

    logger.info("Checking memcache!");

    memCacheClient
    .get(id)
    .then(function(data) {
        if(data == null) {
          
          /**
           * Not found in the cache, retrive from the registry, cache it, decrypt it and return it...
           */                        


          hfc.newDefaultKeyValueStore({
            path: config.keyValueStore
          }).then(function(store) {
              client.setStateStore(store);
              return helper.getSubmitter(client);
          }).then(
              function(admin) {                  
                  var targets = [];
                  for (var i = 0; i < config.peers.length; i++) {
                      targets.push(config.peers[i]);
                  }

                  var args = [
                  "read",
                  id
                  ];
                  //chaincode query request
                  var request = {
                      targets: targets,
                      chaincodeId: "policy",
                      chainId: "sunfish",
                      txId: utils.buildTransactionID(),
                      nonce: utils.getNonce(),
                      fcn: "invoke",
                      args: args
                  };
                  // Query chaincode
                  return chain.queryByChaincode(request);
              }
          ).then(
              function(response_payloads) {                  
                  for (let i = 0; i < 1; i++) {                      
                      var logs = response_payloads[i].toString('utf8').split(",");                      
                      serviceID = logs[1];
                      returnExpirationTime = logs[2];
                      encryptedPolicy = logs[4];

                      returnPolicy = decrypt(encryptedPolicy);        
                      
                      var cacheJson = JSON.stringify({ 
                        policy: encryptedPolicy,
                        expirationTime: returnExpirationTime
                      });

                      logger.info("Not found in the cache, so caching this:" + cacheJson);          

                      memCacheClient.set(id, cacheJson, function(err) {
                        if(err){    
                          logger.info("Problem storing the value!");
                        } else {
                          logger.info('Successfully stored the value for key:person2!');
                        } 
                          
                      });                      

                      res.writeHead(200, {"Content-Type": "application/json"});
                      
                      var json = JSON.stringify({ 
                        'policy': returnPolicy,
                        'expirationTime': returnExpirationTime
                      });        
                      
                      res.end(json + '\n');
                  }
              }
          ).catch(
              function(err) {
                  logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
              }
          );               
        } else {

          logger.info("Found in the cache:" + data);

          /**
           * Found in the cache, decrypt it and then return it....
           */

          var obj = JSON.parse(data);
          encryptedPolicy = obj['policy'];          

          expirationTime = obj['expirationTime'];        
          returnPolicy = decrypt(encryptedPolicy);

          res.writeHead(200, {"Content-Type": "application/json"});
          
          var json = JSON.stringify({ 
            'policy': returnPolicy,
            'expirationTime': expirationTime
          });
          
          res.end(json + '\n');
        }
    });
  }  
}

function updateAfterCheck(req, res, flag){
  if(!flag){
    res.writeHead(404);
    res.end('The respective policy is not found!\n');
  } else {
    requestorID = req.body.requestorID;
    token = req.body.token;
    policy = req.body.policy;  
    id = req.body.id;

    /**
     * Due to the latency involved in updating the value in the smart-contract, at first, it is checked if the
     * same policy is bening updated here. If so, reject the request, else proceed on...
     */

    memCacheClient
    .get("update-"+id)
    .then(function(data) {
      if(data != null){
        res.writeHead(409);
        res.end('The operation is not allowed as the policy is in the process of being stored!\n'); 
      } else {          
          
          /**
            * Update policy in the registry
            */             

          encryptedPolicy = encrypt(policy);

          var args = [
              "update",
              id,            
              encryptedPolicy            
            ]         

            hfc.newDefaultKeyValueStore({
              path: config.keyValueStore        
            }).then(function(store) {
              client.setStateStore(store);
              return helper.getSubmitter(client);
            }).then(
              function(admin) {                
                tx_id = helper.getTxId();
                var nonce = utils.getNonce();
                
                var request = {
                  chaincodeId: "policy",
                  fcn: "invoke",
                  args: args,
                  chainId: "sunfish",
                  txId: tx_id,
                  nonce: nonce
                };
                return chain.sendTransactionProposal(request);
              }
            ).then(
              function(results) {
                return helper.processProposal(chain, results, 'move');
              }
            ).then(
              function(response) {
                if (response.status === 'SUCCESS') {                

                  logger.info('Successfully updated the value!');

                  //add the mapping of the policy ID and the transaction hash to be used by the Ethereum filter...
                  memCacheClient.set("update-"+id, id, function(err) {
                    if(err){    
                      logger.info("Problem storing the update-id mapping!");
                    } else {
                      logger.info('Successfully stored the update-id mapping!');
                    }               
                  });

                  /**
                   * Check if the policy is cached. If so, delete the cache containing the policy ID and service ID...
                   */

                  memCacheClient
                    .get(id)
                    .then(function(data) {
                      if(data != null){                        
                        memCacheClient
                          .delete(id)
                          .then(function() {
                            logger.info('Successfully removed the policy from the cache!');                    
                        });
                                      
                      }
                  });

                  serviceID = "";

                  memCacheClient
                    .get("serv-"+id)
                    .then(function(serviceID) {                      
                      if(serviceID != null){
                        serviceID = serviceID;                                    
                        memCacheClient
                        .get(serviceID)
                        .then(function(data) {
                          if(data != null){
                            memCacheClient
                              .delete(serviceID)
                              .then(function() {
                                logger.info('Successfully removed the service from the cache!');                    
                            });
                          }
                        });                                                    
                      } else {
                        updateServiceID(id);
                      }
                  });                                      
                  
                  returnMessage = "The policy has been updated into the registry!";

                  res.writeHead(200, {"Content-Type": "application/json"});
                  
                  var json = JSON.stringify({ 
                    "message": returnMessage    
                  });
                  
                  res.end(json + '\n');
                }
              }
            ).catch(
              function(err) {
                logger.info("error:" + err.stack ? err.stack : err);
                eventhub.disconnect();
              }
            );
      }
    });                                                                                
  }
}

function deleteAfterCheck(req, res, flag){
  if(!flag){
    res.writeHead(404);
    res.end('The respective policy is not found!\n');
  } else {
    requestorID = req.body.requestorID;
    token = req.body.token;  
    id = req.body.id;

    logger.info("=========Now at deleteAfterCheck, for polID:" + id  +"==========");


    /**
     * Due to the latency involved in deleting the value in the smart-contract, at first, it is checked if the
     * same policy is bening deleted here. If so, reject the request, else proceed on...
     */

    memCacheClient
    .get("delete-"+id)
    .then(function(data) {
      if(data != null){
        res.writeHead(409);
        res.end('The operation is not allowed as the policy is in the process of being deleted!\n'); 
      } else {                             

        var args = [
            "delete",
            id                        
          ]         
          hfc.newDefaultKeyValueStore({
            path: config.keyValueStore        
          }).then(function(store) {                          
            client.setStateStore(store);
            return helper.getSubmitter(client);
          }).then(
            function(admin) {              
              tx_id = helper.getTxId();
              var nonce = utils.getNonce();
              
              var request = {
                chaincodeId: "policy",
                fcn: "invoke",
                args: args,
                chainId: "sunfish",
                txId: tx_id,
                nonce: nonce
              };
              return chain.sendTransactionProposal(request);
            }
          ).then(
            function(results) {
              return helper.processProposal(chain, results, 'move');
            }
          ).then(
            function(response) {
              if (response.status === 'SUCCESS') {                

                logger.info('Successfully deleted the value!');

                //add the mapping of the policy ID and the transaction hash to be used by the Ethereum filter...
                memCacheClient.set("delete-"+id, id, function(err) {
                  if(err){    
                    logger.info("Problem storing the value!");
                  } else {
                    logger.info('Successfully set delete-id mapping at delete!');
                  }               
                });

                /**
                 * Check if the policy is cached. If so, delete the cache containing the policy ID and service ID...
                 */

                memCacheClient
                  .get(id)
                  .then(function(data) {
                    if(data != null){                        
                      memCacheClient
                        .delete(id)
                        .then(function() {
                          logger.info('Successfully removed policy from the cache!');                    
                      });
                                    
                    }
                });
                serviceID = "";
                memCacheClient
                  .get("serv-"+id)
                  .then(function(serviceID) {
                    if(serviceID != null){
                      serviceID = serviceID;
                      memCacheClient
                      .get(serviceID)
                      .then(function(data) {
                        if(data != null){
                          memCacheClient
                            .delete(serviceID)
                            .then(function() {
                              logger.info('Successfully removed the service from the cache at delete!');                    
                          });
                        }
                      });                
                                    
                    } else {
                      updateServiceID(id);
                    }
                });
                  
                returnMessage = "The policy has been deleted from the registry!";

                res.writeHead(200, {"Content-Type": "application/json"});
                
                var json = JSON.stringify({ 
                  "message": returnMessage    
                });
                
                res.end(json + '\n');                
              }
            }
          ).catch(
            function(err) {
              logger.info("error:" + err.stack ? err.stack : err);
              eventhub.disconnect();
            }
          );
        }        
    });
  }
}

module.exports.read = function(req,res){
  requestorID = req.body.requestorID;
  token = req.body.token;  
  id = req.body.id;

  /**
   * At first check if the required parameters are there. If not send a 400 response, else proceed...
   * Then, validate the token. If unsuccessful, send a 401 response, else proceed....
   * Then, check if there is already a policy with the ID. If not, send a 404 response, else proceed....    
   */
    
  if (requestorID == undefined || token == undefined || id == undefined) {
    res.writeHead(400);
    res.end('Invalid request, required parameter(s) missing!\n');
  } else  if(!validate(token)) {    
    res.writeHead(401);
    res.end('The operation is not allowed (unauthorised access, the token is invalid, etc.).\n');  
  } else {
    policyFoundTest(id, req, res, "read");
  }    
}

module.exports.service = function(req,res){
  
  requestorID = req.body.requestorID;
  token = req.body.token;    
  serviceID = req.body.serviceID;
  policyType = req.body.policyType;  

  console.log("=========Now at service, for serviceID:", serviceID, "==========");

  /**
   * At first check if the required parameters are there. If not send a 400 response, else proceed...
   * Then, validate the token. If unsuccessful, send a 401 response, else proceed....   
   */
  if (requestorID == undefined || token == undefined || serviceID == undefined || policyType == undefined) {
    res.writeHead(400);
    res.end('Invalid request, required parameter(s) missing!\n');
  } if(!validate(token)) {    
    res.writeHead(401);
    res.end('The operation is not allowed (unauthorised access, the token is invalid, etc.).\n');  
  } else {    

    /**
     * At first, check in the cache using the serviceID...if found retrieve the data and send over the body
     * 
     * If not found in the cache, retrieve the data from the registry...
     */

    /*
    * cache checking...
    */

    memCacheClient
    .get(serviceID)
    .then(function(data) {
        console.log("Data:" + data);

        if(data == null) {
          
          /*
          * Not found in the cache, retrive from the registry, cache it, decrypt it, build a list and return it as a json array...
          */                  

          
            hfc.newDefaultKeyValueStore({
              path: config.keyValueStore
            }).then(function(store) {
                client.setStateStore(store);
                return helper.getSubmitter(client);
            }).then(
                function(admin) {                    
                    var targets = [];
                    for (var i = 0; i < config.peers.length; i++) {
                        targets.push(config.peers[i]);
                    }

                    var args = [
                    "service",
                    serviceID,
                    policyType
                    ];
                    //chaincode query request
                    var request = {
                        targets: targets,
                        chaincodeId: config.chaincodeID,
                        chainId: config.channelID,
                        txId: utils.buildTransactionID(),
                        nonce: utils.getNonce(),
                        fcn: "invoke",
                        args: args
                    };
                    // Query chaincode
                    return chain.queryByChaincode(request);
                }
            ).then(
                function(response_payloads) {
                    console.log("Response:"+ response_payloads);
                    if(response_payloads === undefined || response_payloads.length === 0) {
                      res.writeHead(404);
                      res.end('There is no entry for the requested service!\n');
                    } else {
                        for (let i = 0; i < 1; i++) {                        
                          var logs = response_payloads[i].toString('utf8');                        
                          var data = JSON.parse(logs);
                          var result = [], cacheResult = [];

                          for(var j = 0; j < data.length; j++){
                            var tempId = data[j].Id;
                            var tempEncPol = data[j].Policy;                          
                            var tempPol = decrypt(tempEncPol);
                            result.push({"id": tempId, "policy":tempPol});

                            cacheResult.push({"id": tempId, "policy":tempEncPol});
                          }

                          var list = {"list":result};
                          var cacheList = {"list":cacheResult};

                          console.log("Not found in the cache, so caching this:" + result);

                          memCacheClient.set(serviceID, cacheList, function(err) {
                            if(err){    
                              console.log("Problem storing the value!");
                            } else {
                              console.log('Successfully stored the value for key:person2!');
                            } 
                              
                          });

                          res.writeHead(200, {"Content-Type": "application/json"});
                          
                          //var json = JSON.stringify(result);
                          var json = JSON.stringify(list);
                          
                          res.end(json + '\n');
                      }
                    }
                    
                }
            ).catch(
                function(err) {
                    logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
                }
            );                     
        } else {

          console.log("Found in the cache:" + JSON.stringify(data));          

          /**
           * Found in the cache, decrypt it and then return it....
           */

          var result = [];

          var list = data['list'];          

          list.forEach(function(obj){            
            var id = obj['id'];
            var encryptedPolicy = obj['policy'];            
            returnPolicy = decrypt(encryptedPolicy);            
            result.push({"id": id, "policy":returnPolicy});  
          });

          var returnList = {"list":result};

          res.writeHead(200, {"Content-Type": "application/json"});
          
          var json = JSON.stringify(returnList);
          
          res.end(json + '\n');          
        }
    });          
  }  
}

module.exports.update = function(req,res){
  requestorID = req.body.requestorID;
  token = req.body.token;
  policy = req.body.policy;  
  id = req.body.id;

  /**
   * At first check if the required parameters are there. If not send a 400 response, else proceed...
   * Then, validate the token. If unsuccessful, send a 401 response, else proceed....
   * Then, check if there is already a policy with the ID. If not, send a 404 response, else proceed....    
   */

  if (requestorID == undefined || token == undefined || policy == undefined || id == undefined) {
    res.writeHead(400);
    res.end('Invalid request, required parameter(s) missing!\n');
  } if(!validate(token)) {    
    res.writeHead(401);
    res.end('The operation is not allowed (unauthorised access, the token is invalid, etc.).\n');  
  } else {
    policyFoundTest(id, req, res, "update");
  }  
}

module.exports.delete = function(req,res){
  
  requestorID = req.body.requestorID;
  token = req.body.token;  
  id = req.body.id;

  /**
   * At first check if the required parameters are there. If not send a 400 response, else proceed...
   * Then, validate the token. If unsuccessful, send a 401 response, else proceed....
   * Then, check if there is already a policy with the ID. If not, send a 404 response, else proceed....    
   */

  if (requestorID == undefined || token == undefined || id == undefined) {
    res.writeHead(400);
    res.end('Invalid request, required parameter(s) missing!\n');
  } if(!validate(token)) {    
    res.writeHead(401);
    res.end('The operation is not allowed (unauthorised access, the token is invalid, etc.).\n');  
  } else {
    policyFoundTest(id, req, res, "delete");
  }
}