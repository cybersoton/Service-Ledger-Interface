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
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require( "url" );
var hyperledgerPol = require("./hyperledgerPol");

var ini = require('ini');

var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))

blockchain = config.blockchain;
module.exports.store = function(req,res){		
	if(blockchain == "hyperledger"){		
		hyperledgerPol.store(req,res);
	} else {
		res.end('hello world storing using another blockchain!!\n');
	}
}

module.exports.read = function(req,res){	    
	if(blockchain == "hyperledger"){		
		hyperledgerPol.read(req,res);
	} else {
		res.writeHead(200);
		res.end('hello world reading using another blockchain!!\n');
	}
}

module.exports.service = function(req,res){	    
	if(blockchain == "hyperledger"){		
		hyperledgerPol.service(req,res);
	} else {
		res.writeHead(200);
		res.end('hello world service using another blockchain!!\n');
	}
}

module.exports.update = function(req,res){	    
	if(blockchain == "hyperledger"){		
		hyperledgerPol.update(req,res);
	} else {
		res.writeHead(200);
		res.end('hello world updating using another blockchain!!\n');
	}
}

module.exports.delete = function(req,res){    
	if(blockchain == "hyperledger"){		
		hyperledgerPol.delete(req,res);
	} else {
		res.writeHead(200);
		res.end('hello world deleting using another blockchain!!\n');
	}
}
