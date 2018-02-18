const common = require('../common.js');
const Coinpayments = require('../../lib');
const expect = require('chai').expect

it('should initilize with no errors', function () {
	common.client.conn = new Coinpayments({
		key: process.env.COINPAYMENTS_API_KEY_1,
		secret: process.env.COINPAYMENTS_API_SECRET_1
	});

	common.merchant.conn = new Coinpayments({
		key: process.env.COINPAYMENTS_API_KEY_2,
		secret: process.env.COINPAYMENTS_API_SECRET_2
	});

});