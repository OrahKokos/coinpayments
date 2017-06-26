var common = require('../common.js');
var expect = require('chai').expect


function getMinimalCurrencyAmount() {
	let min;
	if (process.env.COINPAYMENTS_FIXED_AMOUNT.indexOf('.') != -1) {
		min = parseFloat(process.env.COINPAYMENTS_FIXED_AMOUNT);
	} else {
		min = parseInt(process.env.COINPAYMENTS_FIXED_AMOUNT)
	}
	return min * 3;
}

let balance;

it("Should return balance for client", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.balances(function(err, response) {
		expect(err).to.be.equal(null);
		balance = parseFloat(response[process.env.COINPAYMENTS_CURRENCY].balancef);
		return done();
	});
});

it("Client should have at least " + getMinimalCurrencyAmount() + " " + process.env.COINPAYMENTS_CURRENCY, function () {
	expect(getMinimalCurrencyAmount()).to.be.below(balance);
});