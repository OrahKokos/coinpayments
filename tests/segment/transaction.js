var common = require('../common.js');
var expect = require('chai').expect

let tags = [];

it("Should create transaction", function (done) {
	this.timeout(10 * 1000);
	common.merchant.conn.createTransaction({
		amount: process.env.COINPAYMENTS_FIXED_AMOUNT,
		currency1: process.env.COINPAYMENTS_CURRENCY,
		currency2: process.env.COINPAYMENTS_CURRENCY
	}, function (err, result){
		expect(err).to.be.equal(null);
		expect(result).to.have.property('amount');
		expect(result).to.have.property('txn_id');
		expect(result).to.have.property('address');
		expect(result).to.have.property('confirms_needed');
		expect(result).to.have.property('timeout');
		expect(result).to.have.property('status_url');
		expect(result).to.have.property('qrcode_url');
		common.merchant.transactions.push(result);
		return done();
	})
})

it("Should get callback address for " + process.env.COINPAYMENTS_CURRENCY, function (done) {
	this.timeout(10 * 1000);
	common.client.conn.getCallbackAddress(process.env.COINPAYMENTS_CURRENCY, function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.have.property('address');
		return done();
	})
})

it("Should create transfer", function (done) {
	this.timeout(10 * 1000);
	let options = {
		amount: process.env.COINPAYMENTS_FIXED_AMOUNT,
		currency: process.env.COINPAYMENTS_CURRENCY
	};
	if (process.env.COINPAYMENTS_MERCHANT_PBNTAG) {
		options.pbntag = process.env.COINPAYMENTS_MERCHANT_PBNTAG
	}
	if (process.env.COINPAYMENTS_MERCHANT_PBNTAG) {
		options.merchant = process.env.COINPAYMENTS_MERCHANT_ID
	}
	common.merchant.conn.createTransfer(options, function (err, response) {
	  expect(err).to.be.equal(null);
		expect(response).to.have.property('id');
		expect(response).to.have.property('status');
		return done();
	})
})