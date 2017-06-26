var common = require('../common.js');
var expect = require('chai').expect

it("Should withdraw to merchant transaction", function(done) {
	this.timeout(10 * 1000);
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
	this.timeout(10 * 1000);
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

it("Should do mass withdrawal (merchant -> client) ", function(done) {
	this.timeout(20 * 1000);
	var withdrawalArray = [];
	common.merchant.conn.balances(function (err, balances) {
		expect(err).to.be.equal(null);
		if (!Object.keys(balances).length) return done();
		function createWithdrawalElement(currency) {
			common.client.conn.getDepositAddress(currency, function (err, depositAddress) {
				expect(err).to.be.equal(null);
				withdrawalArray.push({
					amount: balances[currency].balancef,
					currency: currency,
					address: depositAddress.address
				})
				if(withdrawalArray.length == Object.keys(balances).length){
					return massWithdraw();
				} 
			});
		}

		function massWithdraw() {
			common.merchant.conn.createMassWithdrawal(withdrawalArray, function (err, mwd) {
				expect(err).to.be.equal(null);
				expect(Object.keys(mwd)).to.have.length(withdrawalArray.length);
				return done();
			})
		}

		for (var currency in balances) {
			createWithdrawalElement(currency);
		}
	})
});