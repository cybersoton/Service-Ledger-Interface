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
var logger = log4js.getLogger('INF-RI');

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
var request = require('request');


var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  encKey = new Buffer('eeng4ge0woobohgooqu4ieriwohgoo6C');

var querystring = require('querystring');

var configIni = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

logger.setLevel('INFO');

var client = new hfc();
var chain;
var eventhub;
var tx_id = null;


process.on('SIGINT', function() {
    logger.info("Caught interrupt signal");
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

eventhub.registerChaincodeEvent("alert", 'storeAlert', function(result){
    logger.info('======Store Alert chaincode event received at Infrastructure RI!======');
    var id = result.payload;
    logger.info("Store Alert Event at Infrastructure RI:" + id.toString('utf8'));                                      
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
                chaincodeId: "alert",
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
                logger.info("New alert has been stored in the RI!");
                var logs = response_payloads[i].toString('utf8');                
                var jsonLogs = JSON.parse(logs);

                requestorID = jsonLogs.RequestorID;                
                timeStamp = jsonLogs.TimeStamp;
                token = jsonLogs.Token;
                alertID = jsonLogs.AlertID;
                alertType = jsonLogs.AlertType;
                alertSource = jsonLogs.AlertSource;
                alert = jsonLogs.Alert;

                logger.info("Now submitting the alertto FAM!");
                

                /**
                 * The following code submits the post request to the RI
                 */
                
                // TODO Uncomment it and configure with the IP address of the FAM endpoint...
                
                // var options = {
                //     uri: 'https://{FAM_IP}//api/fam/v1/triggerAlert',
                //     method: 'POST',
                //     json: {
                //         "requestorID": requestorID,
                //         "timeStamp": timeStamp,
                //         "token": token,
                //         "alertID": alertID,
                //         "alertType": alertType,
                //         "alertSource": alertSource,
                //         "alert": alert
                //     }
                // }
                
                // request(options, function (error, response, body) {
                //     if (!error && response.statusCode == 200) {
                //         logger.info("Successfully received a response from FAM!")
                //     }
                // });
            }
        }
    ).catch(
        function(err) {
            logger.error('Failed to end to end test with error:' + err.stack ? err.stack : err);
        }
    );
});

eventhub.registerChaincodeEvent("access", 'storeAccess', function(result){
    logger.info('======Store Access chaincode event received at Infrastructure RI!======');
    var id = result.payload.toString('utf8');
    logger.info("Store Access event at Infrastructure RI:" + id.toString('utf8'));
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    loggerID = configIni.loggerIDRI;
    token = configIni.tokenRI;
    frmIP = configIni.frmIP;
    /**
     * The following code submits the post request to the PVE
     */        
    
    var headersOpt = {  
        "content-type": "application/json",
    };

    var options = {
        uri: 'https://' + frmIP + ":8076" +'/frm/pve',
        method: 'POST',
        headers: headersOpt,
        json: {
            "loggerID": loggerID,            
            "token": token,
            "id": id            
        }
    }
    
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            logger.info("Successfully submitted a request to FRM PVE!")
        }
    });    
});
