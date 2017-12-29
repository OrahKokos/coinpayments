const
    qs     = require('querystring'),
    crypto = require('crypto');

module.exports = (function () {

    function IPN ({merchantId, merchantSecret, reqBodyIndex='body'}) {
        if(!merchantId || !merchantSecret) {
            throw "Merchant ID and Merchant Secret are needed";
        }
        let hmac;

        let getPrivateHeadersIPN = function (parameters) {
            let signature, paramString;

            if(typeof reqBodyIndex === "object") {
                paramString = qs.stringify(parameters).replace(/%20/g, '+');
            }

            signature = crypto.createHmac('sha512', merchantSecret).update(paramString).digest('hex');

            return signature;
        };

        return (req,res,next) => {
            if(!req.get('HMAC') || !req.body || !req.body.ipn_mode || req.body.ipn_mode !== 'hmac' || merchantId !== req.body.merchant) {
                return next("COINPAYMENTS_INVALID_REQUEST");
            }
            hmac = getPrivateHeadersIPN(req[reqBodyIndex]);
            if(hmac !== req.get('HMAC')) {
                return next("COINPAYMENTS_INVALID_REQUEST");
            }
            res.end();
            if(req.body.status < 0) {
                this.emit('ipn_fail', req.body);
                return next();
            }
            if(req.body.status < 100){
                this.emit('ipn_pending', req.body);
                return next();
            }
            if(req.body.status === 100) {
                this.emit('ipn_complete', req.body);
                return next();
            }
        }
    }

    return IPN;

})();