const common = require('../common.js');
const expect = require('chai').expect

it("Should withdraw to merchant transaction", function(done) {
	this.timeout(60 * 1000);
	common.client.conn.createWithdrawal({
		amount: process.env.COINPAYMENTS_FIXED_AMOUNT,
		currency: process.env.COINPAYMENTS_CURRENCY,
		address: common.merchant.transactions[0].address
	}, function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.have.property('id');
		expect(result).to.have.property('status');
		expect(result).to.have.property('amount');
		common.client.withdrawals.push(result.id);
		return done();
	})
});

it("Should get withdrawal info", function(done) {
	this.timeout(60 * 1000);
	common.client.conn.getWithdrawalInfo(common.client.withdrawals[0], function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.have.property('time_created');
		expect(result).to.have.property('status');
		expect(result).to.have.property('status_text');
		expect(result).to.have.property('coin');
		expect(result).to.have.property('amount');
		expect(result).to.have.property('amountf');
		return done();
	})
});