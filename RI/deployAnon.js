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

'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('DEPLOY-ANON');

var hfc = require('fabric-client');
var utils = require('fabric-client/lib/utils.js');
var Peer = require('fabric-client/lib/Peer.js');
var Orderer = require('fabric-client/lib/Orderer.js');
var EventHub = require('fabric-client/lib/EventHub.js');

var config = require('./config.json');
var helper = require('./helper.js');

logger.setLevel('DEBUG');

var client = new hfc();
var chain;
var eventhub;
var tx_id = null;

if (!process.env.GOPATH){
	process.env.GOPATH = config.goPath;
}

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

hfc.newDefaultKeyValueStore({
	path: config.keyValueStore
}).then(function(store) {
	client.setStateStore(store);
	return helper.getSubmitter(client);
}).then(
	function(admin) {
		logger.info('Successfully obtained enrolled user to deploy the chaincode');

		logger.info('Executing Deploy');
		tx_id = helper.getTxId();
		var nonce = utils.getNonce();
		var args = helper.getArgs(config.deployRequest.args);
		var request = {
			chaincodePath: "github.com/anon",
			chaincodeId: "anon",
			fcn: config.deployRequest.functionName,
			args: args,
			chainId: "sunfish",
			txId: tx_id,
			nonce: nonce,
			'dockerfile-contents': config.dockerfile_contents
		};
		return chain.sendDeploymentProposal(request);
	}
).then(
	function(results) {
		logger.info('Successfully obtained proposal responses from endorsers');
		return helper.processProposal(chain, results, 'deploy');
	}
).then(
	function(response) {
		if (response.status === 'SUCCESS') {
			logger.info('Successfully sent deployment transaction to the orderer.');
			var handle = setTimeout(() => {
				logger.error('Failed to receive transaction notification within the timeout period');
				process.exit(1);
			}, parseInt(config.waitTime));

			eventhub.registerTxEvent(tx_id.toString(), (tx) => {
				logger.info('The chaincode transaction has been successfully committed');
				clearTimeout(handle);
				eventhub.disconnect();
			});
		} else {
			logger.error('Failed to order the deployment endorsement. Error code: ' + response.status);
		}
	}
).catch(
	function(err) {
		eventhub.disconnect();
		logger.error(err.stack ? err.stack : err);
	}
);
