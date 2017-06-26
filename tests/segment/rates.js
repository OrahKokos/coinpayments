var common = require('../common.js');
var expect = require('chai').expect


it("Should return rates data", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.rates(function(err, response) {
		expect(err).to.be.equal(null);
		for (var currency in response) {
			expect(response[currency]).to.have.property('is_fiat');
			expect(response[currency]).to.have.property('rate_btc');
			expect(response[currency]).to.have.property('last_update');
			expect(response[currency]).to.have.property('tx_fee');
			expect(response[currency]).to.have.property('status');
			expect(response[currency]).to.have.property('name');
			expect(response[currency]).to.have.property('confirms');
			expect(response[currency]).to.have.property('can_convert');
			expect(response[currency]).to.have.property('capabilities');
		}
		return done();
	});
});


