var common = require('../common.js');
var expect = require('chai').expect

it("Should get tx info", function (done) {
	this.timeout(10 * 1000);
	common.merchant.conn.getTx(common.merchant.transactions[0].txn_id, function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.have.property('time_created');
		expect(result).to.have.property('time_expires');
		expect(result).to.have.property('status');
		expect(result).to.have.property('status_text');
		expect(result).to.have.property('type');
		expect(result).to.have.property('coin');
		expect(result).to.have.property('amount');
		expect(result).to.have.property('amountf');
		expect(result).to.have.property('received');
		expect(result).to.have.property('receivedf');
		expect(result).to.have.property('recv_confirms');
		expect(result).to.have.property('payment_address');
		return done();
	});
});


it("Should get tx multi", function (done) {
	this.timeout(10 * 1000);
	common.merchant.conn.getTxMulti(common.merchant.transactions.map(function (t) {return t.txn_id}), 
		function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.be.an('object');
		for (var tx in result) {
			expect(result[tx]).to.have.property('error');
			expect(result[tx]).to.have.property('time_created');
			expect(result[tx]).to.have.property('time_expires');
			expect(result[tx]).to.have.property('status');
			expect(result[tx]).to.have.property('status_text');
			expect(result[tx]).to.have.property('type');
			expect(result[tx]).to.have.property('coin');
			expect(result[tx]).to.have.property('amount');
			expect(result[tx]).to.have.property('amountf');
			expect(result[tx]).to.have.property('received');
			expect(result[tx]).to.have.property('receivedf');
			expect(result[tx]).to.have.property('recv_confirms');
			expect(result[tx]).to.have.property('payment_address');
		}
		return done();
	});
});

it("Should get tx list", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.getTxList(function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.be.an('array');
		expect(result).length.to.be.above(0);
		return done();
	});
});