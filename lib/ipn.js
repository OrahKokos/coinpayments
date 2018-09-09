"use strict";

var qs = require("querystring"),
    crypto = require("crypto");

module.exports = function () {

  console.warn("Coinpayments version 2.0.0 is here. Please migrate: https://github.com/OrahKokos/coinpayments/issues/24");

  function IPN(_ref) {
    var _this = this;

    var merchantId = _ref.merchantId,
        merchantSecret = _ref.merchantSecret,
        _ref$rawBodyIndex = _ref.rawBodyIndex,
        rawBodyIndex = _ref$rawBodyIndex === undefined ? "body" : _ref$rawBodyIndex;

    if (!merchantId || !merchantSecret) {
      throw "Merchant ID and Merchant Secret are needed";
    }

    var getPrivateHeadersIPN = function getPrivateHeadersIPN(parameters) {
      if (typeof parameters === "object") //if no rawBody provided, fallback to original usage.
        parameters = qs.stringify(parameters).replace(/%20/g, "+");

      return crypto.createHmac("sha512", merchantSecret).update(parameters).digest("hex");
    };

    return function (req, res, next) {
      if (!req.get("HMAC") || !req.body || !req.body.ipn_mode || req.body.ipn_mode !== "hmac" || merchantId !== req.body.merchant) {
        return next("COINPAYMENTS_INVALID_REQUEST");
      }

      var hmac = getPrivateHeadersIPN(req[rawBodyIndex]);

      if (hmac !== req.get("HMAC")) {
        return next("COINPAYMENTS_INVALID_REQUEST");
      }
      res.end();
      if (req.body.status < 0) {
        _this.emit("ipn_fail", req.body);
        return next();
      }
      if (req.body.status < 100) {
        _this.emit("ipn_pending", req.body);
        return next();
      }
      if (req.body.status == 100) {
        _this.emit("ipn_complete", req.body);
        return next();
      }
    };
  }

  return IPN;
}();