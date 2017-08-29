const qs     = require('querystring');
const crypto = require('crypto');

module.exports = (function ()
{
	function IPN({merchantId, merchantSecret})
	{
		if(!merchantId || !merchantSecret)
		{
			throw "Merchant ID and Merchant Secret are needed";
		}

		function validateHMAC(parameters) 
		{
			let signature, paramString;
			paramString = qs.stringify(parameters).replace(/%20/g, '+')
			signature = crypto.createHmac('sha512', merchantSecret).update(paramString).digest('hex');
			return signature;
		}

		let methods = {
			validate: (ProvidedHMAC, ipnParams) =>
			{
				return new Promise((resolve, reject) => {

					if(!ProvidedHMAC || !ipnParams || !ipnParams.ipn_mode || ipnParams.ipn_mode != 'hmac' || merchantId != ipnParams.merchant)
					{
						return resolve({success: false, message: "COINPAYMENTS_INVALID_REQUEST"});
					}

					let ComputedHMAC = this.validateHMAC(ipnParams);
					if(ComputedHMAC != ProvidedHMAC)
					{
						return reject({success: false, message: "COINPAYMENTS_INVALID_REQUEST"});
					}

					if(ipnParams.status < 0)
					{
						return resolve({success: false, ipn: ipnParams, failed: true, message: "COINPAYMENTS_TRANSACTION_FAILED"});
					}

					if(ipnParams.status < 100)
					{
						return resolve({success: false, ipn: ipnParams, pending: true, message: "COINPAYMENTS_TRANSACTION_PENDING"});
					}

					if(ipnParams.status == 100)
					{
						return resolve({success: true, ipn: ipnParams});
					}
					return reject({success: false, message: "COINPAYMENTS_UNKOWN_REQUEST"});
				});
			},
			middleware: (req, res, next) =>
			{
				methods.verify(req.get("HMAC"), req.body).then( result => {
					if(result.success)
					{
						this.emit('ipn_complete', req.body);
					}
					
					if(result.pending)
					{
						this.emit('ipn_pending', req.body);
					}

					if(result.failed)
					{
						this.emit('ipn_fail', req.body);
					}
					return next();
				}).catch( error => {
					return next(error.message);
				});
			}
		};
		return methods;
	}
	return IPN;
})();