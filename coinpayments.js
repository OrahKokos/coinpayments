var https = require('https'),
	crypto = require('crypto'),
	events = require('events'),
	qs = require('querystring'),
	eventEmitter = new events.EventEmitter();

	module.exports = (function () {
		"use strict";

	    var version         = 1,
	        API_HOST        = 'www.coinpayments.net',
	        API_PATH        = '/api.php';

        function CoinPayments(options){
        	
	        if (!options) {
	            throw 'Please pass in options';
	        }
	        if (!options.key || !options.secret) {
	            throw 'Missing public key and/or secret';
	        }

        	var coinpayments = Object.create(eventEmitter);
        	coinpayments.options = options;

        	coinpayments._getPrivateHeaders = function (parameters) {

	            var paramString, signature;
	            var secret = this.options.secret;

	            parameters.key = this.options.key;

	            paramString = qs.stringify(parameters);

	            signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');

	            return {
	            	'Content-Type': 'application/x-www-form-urlencoded',
	                'HMAC': signature
	            };
	        };

	        coinpayments._getPrivateHeadersIPN = function(parameters) {

	        	var signature, paramString;
	        	var secret = this.options.merchantSecret;

	        	paramString = Object.keys(parameters).map(function (param) {
                	return param + '=' + RFC1736Encode(parameters[param]);
	            }).join('&');

	        	signature = crypto.createHmac('sha512', secret).update(paramString).digest('hex');

	        	return signature;

	        	function RFC1736Encode(string){
	        		return string.replace(/\!/g, '%21')
	        					 .replace(/\#/g, '%23')
	        					 .replace(/\$/g, '%24')
	        					 .replace(/\&/g, '%26')
	        					 .replace(/\'/g, '%27')
        					 	 .replace(/\(/g, '%28')
        					 	 .replace(/\)/g, '%29')
    					 	 	 .replace(/\*/g, '%2A')
    					 	 	 .replace(/\ /g, '+')
    					 	 	 .replace(/\,/g, '%2C')
    					 	 	 .replace(/\//g, '%2F')
    					 	 	 .replace(/\:/g, '%3A')
    					 	 	 .replace(/\;/g, '%3B')
    					 	 	 .replace(/\=/g, '%3D')
    					 	 	 .replace(/\?/g, '%3F')
    					 	 	 .replace(/\@/g, '%40')
    					 	 	 .replace(/\[/g, '%5B')
    					 	 	 .replace(/\]/g, '%5D');
	        	}
	        };

	        coinpayments.ipn = function(options) {
	        	if(!options || !options.hasOwnProperty('merchantId') || !options.hasOwnProperty('merchantSecret')) {
	                throw "Merchant ID and Merchant Secret are needed";
	            }
	            var root = this;
            	var hmac;

            	this.options.merchantId = options.merchantId;
            	this.options.merchantSecret = options.merchantSecret;

	            return function(req,res,next) {
	                if(!req.get('HMAC')) {
	                    return next('No HMAC signature sent');
	                }
	                if(!req.body) {
	                    return next('No POST body sent');
	                }
	                if(!req.body.ipn_mode && req.body.ipn_mode != 'hmac') {
	                	return next('IPN mode is not HMAC');
	                }
	                if(options.merchantId != req.body.merchant) {
	                	return next('No or incorrect Merchant ID passed');
	                }

	            	hmac = root._getPrivateHeadersIPN(req.body);

	                if(hmac != req.get('HMAC')) {
	                    return next('HMAC signiture does not match');
	                }

	                res.end();

	                if(req.body.status < 0) {
	                	root.emit('ipn_fail', req.body);
	                	return next();
	                }
	                if(req.body.status < 100){
	                	root.emit('ipn_pending', req.body);
	                	return next();
	                }
	                if(req.body.status == 100) {
		                root.emit('ipn_complete', req.body);
		                return next();
	                }
	            };
	        };

	        if(options.autoIpn){
		        coinpayments._transactions = [];
		        coinpayments._partials = [];
	        }

	        coinpayments._autoIPN = function (txn_id) {

	        	var root = this;
	            var loop_time = (root.options.ipnTime) ? root.options.ipnTime : 30;

	            if(txn_id){
	            	root._transactions.push(txn_id);
	            }

	            if (root._transactions.length === 1) {
	            	var interval = setInterval(function () {
	            	if(root._transactions.length){
		            	root.getTxMulti(root._transactions, function(err,result){
		            		if(err) return root.emit('ipn_error', err);
	            			for(var key in result){
	            				if(result[key].error != 'ok') root.emit('ipn_error', result[key]);
	            				if(result[key].status < 0){
	            					root._transactions.splice(root._transactions.indexOf(key), 1);
	            					root._clearPartial(result[key]);
	            					delete result[key].error;
	            					root.emit('ipn_fail', result[key]);
	            				}
	            				if(result[key].received > 0 && result[key].amount > result[key].received){
	            					result[key].txn_id = key;
	            					delete result[key].error;
	            					if(!root._checkPartial(result[key])){
		            					root.emit('ipn_pending', result[key]);
	            					}
	            				}
	            				if(result[key].status > 0){
	            					root._transactions.splice(root._transactions.indexOf(key), 1);
	            					root._clearPartial(result[key]);
	            					result[key].txn_id = key;
	            					delete result[key].error;
	            					root.emit('ipn_complete', result[key]);
	            				}
	            			}
	            			if(root._transactions.length === 0){
	            				return clearInterval(interval);
	            			}
		            	});
	            	}
            	}, loop_time * 1000);
            	}
        	};

	        coinpayments._checkPartial = function(partial_payment){
	        	for (var i = 0; i < this._partials.length; i++) {
	        		if(this._partials[i].txn_id == partial_payment.txn_id){
	        			if(this._partials[i].received == partial_payment.received){
	        				return true;
	        			} else {
	    					this._partials[i] = partial_payment;
	        				return false;
	        			}
	        		}
	        	}
				this._partials.push(partial_payment);	
	        	return false;
	        };

	        coinpayments._clearPartial = function(partial_payment){
			    for (var i = 0; i < this._partials.length; i++) {
			        if (this._partials.txn_id === partial_payment.txn_id) {
			            this._partials.splice(i,1);
			        }
			    }
	        };

	        var coinpaymentsAPI = Object.create(coinpayments);

	        coinpaymentsAPI._settings = function(cmd) {
	            switch(cmd) {
	                case 'get_withdrawal_info':
	                    return ['id'];
	                case 'get_tx_info':
	                    return ['txid'];
                    case 'get_tx_info_multi':
	                    return ['txid'];
	                case 'create_withdrawal':
	                    return ['amount', 'currency', 'address'];
	                case 'create_transaction':
	                    return ['amount', 'currency1', 'currency2'];
	                case 'rates':
	                    return [];
	                case 'balances':
	                    return [];
	                default:
	                    return false;
	            }
	        };

	        coinpaymentsAPI._assert = function(obj, allowArray) {
	            var flag = true;
	            var msg = 'Missing options: ';
	            for(var i = 0; i<allowArray.length; i++) {
	                if(!obj.hasOwnProperty(allowArray[i])) {
	                    flag = false;
	                    msg += allowArray[i] + ', ';
	                }
	            }
	            return (flag) ? null : msg;
	        };

	        coinpaymentsAPI.request = function(cmd, parameters, callback) {

	            if(typeof parameters == 'function') {
	                callback = parameters;
	                parameters = {};
	            }
	            var root = this;
	            var reqs = this._settings(cmd);
	            if(!reqs) return callback(new Error('No such method ' + cmd));

	            var assert = this._assert(parameters, reqs);
	            if(assert) return callback(new Error(assert));
	            
	            parameters.cmd = cmd;
	            parameters.version = version;

	            options = {
	                method: 'POST',
	                host: API_HOST,
	                path: API_PATH,
	                headers: this._getPrivateHeaders(parameters)
	            };

	            parameters = qs.stringify(parameters);

	            var req = https.request(options, function(res) {
	            	var data = '';

	            	res.setEncoding('utf8');

	            	res.on('data', function(chunk){
	            		data += chunk;
	            	});
	            	res.on('end', function(){
	            		data = JSON.parse(data);
	            		if(data.error != 'ok') return callback(data);
		                if(root.options.autoIpn && cmd == 'create_transaction') {
		                    root._autoIPN(data.result.txn_id);
		                }
		                delete data.error;
		                data = data.result;
	                	return callback(null, data);
	            	});
	            });
	            req.on('error', callback);
	            req.write(parameters);
	            req.end();
	        };

	        var abstractionAPI = Object.create(coinpaymentsAPI);

	        abstractionAPI.createTransaction = function(){
	        	this.request('create_transaction', arguments[0], arguments[1]);	
	        };

	        abstractionAPI.rates = function(){
	        	this.request('rates', arguments[0], arguments[1]);
	        };

	        abstractionAPI.balances = function(){
	        	this.request('balances', arguments[0], arguments[1]);
	        };

	        abstractionAPI.createWithdrawal = function(){
	        	this.request('create_withdrawal', arguments[0], arguments[1]);
        	};
															
	        abstractionAPI.getTx = function(){
	        	this.request('get_tx_info',{txid : arguments[0]}, arguments[1]);
	    	  };
								
	        abstractionAPI.getWithdrawalInfo = function(){
	        	this.request('get_withdrawal_info',{id : arguments[0]}, arguments[1]);
	        };

	        abstractionAPI.getTxMulti = function(){
	        	this.request('get_tx_info_multi', {txid : arguments[0].join("|")}, arguments[1]);
	        };

	        return abstractionAPI;
        }
        return CoinPayments;
    })();