var common = require('../common.js');
var Coinpayments = require('../../lib');

it('should not throw error', function () {
	common.client.conn = new Coinpayments({
		key: process.env.COINPAYMENTS_API_KEY_1,
		secret: process.env.COINPAYMENTS_API_SECRET_1
	});

	common.merchant.conn = new Coinpayments({
		key: process.env.COINPAYMENTS_API_KEY_2,
		secret: process.env.COINPAYMENTS_API_SECRET_2
	});

});