var common = require('../common.js');
var chai = require('chai');
var expect = chai.expect

chai.use(function (_chai, _) {
  _chai.Assertion.addMethod('withMessage', function (msg) {
    _.flag(this, 'message', msg);
  });
});

it("Should convert coins", function (done) {
	this.timeout(20 * 1000);
	common.client.conn.rates(function(err, response) {
		expect(err).to.be.equal(null);
		expect(response[process.env.COINPAYMENTS_CURRENCY]['can_convert']).to.equal(1)
			.withMessage(process.env.COINPAYMENTS_CURRENCY + " is not convertable");
		expect(response[process.env.COINPAYMENTS_CURRENCY_CONVERT]['can_convert']).to.equal(1)
			.withMessage(process.env.COINPAYMENTS_CURRENCY_CONVERT + " is not convertable");
		common.client.conn.convertCoins({
			amount: process.env.COINPAYMENTS_FIXED_AMOUNT,
			from: process.env.COINPAYMENTS_CURRENCY,
			to: process.env.COINPAYMENTS_CURRENCY_CONVERT
		}, function (err, res) {
			expect(err).to.be.equal(null).withMessage("ShapeShift minimal amount error, try raising COINPAYMENTS_FIXED_AMOUNT");
			expect(res).to.have.property('id');
			common.client.conversions.push(res.id);
			return done();
		})
	})
});

it("Should get conversion info", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.getConversionInfo(common.client.conversions[0], function (err, response) {
		expect(err).to.be.equal(null);
		expect(response).to.have.property('time_created');
		expect(response).to.have.property('status');
		expect(response).to.have.property('status_text');
		expect(response).to.have.property('coin1');
		expect(response).to.have.property('coin2');
		expect(response).to.have.property('amount_sent');
		expect(response).to.have.property('amount_sentf');
		expect(response).to.have.property('received');
		expect(response).to.have.property('receivedf');
		return done();
	})
})