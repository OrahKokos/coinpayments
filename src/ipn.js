const
  qs     = require(`querystring`),
  crypto = require(`crypto`);

module.exports = (function () {

  function IPN ({merchantId, merchantSecret, rawBodyIndex=`body`}) {
    if(!merchantId || !merchantSecret) {
      throw `Merchant ID and Merchant Secret are needed`;
    }

    let getPrivateHeadersIPN = function (parameters) {
      if(typeof parameters === `object`) //if no rawBody provided, fallback to original usage.
        parameters = qs.stringify(parameters).replace(/%20/g, `+`);

      return crypto.createHmac(`sha512`, merchantSecret).update(parameters).digest(`hex`);
    };

    return (req,res,next) => {
      if(!req.get(`HMAC`) || !req.body || !req.body.ipn_mode || req.body.ipn_mode !== `hmac` || merchantId !== req.body.merchant) {
        return next(`COINPAYMENTS_INVALID_REQUEST`);
      }
      
      const hmac = getPrivateHeadersIPN(req[rawBodyIndex]);

      if(hmac !== req.get(`HMAC`)) {
        return next(`COINPAYMENTS_INVALID_REQUEST`);
      }
      res.end();
      if(req.body.status < 0) {
        this.emit(`ipn_fail`, req.body);
        return next();
      }
      if(req.body.status < 100){
        this.emit(`ipn_pending`, req.body);
        return next();
      }
      if(req.body.status == 100) {
        this.emit(`ipn_complete`, req.body);
        return next();
      }
    };
  }

  return IPN;

})();

