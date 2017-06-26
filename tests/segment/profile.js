var common = require('../common.js');
var expect = require('chai').expect

let tags = [];

it("Should get basic info", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.getBasicInfo(function(err, response) {
		expect(err).to.be.equal(null);
		expect(response).to.have.property('uername');
		expect(response).to.have.property('username');
		expect(response).to.have.property('merchant_id');
		expect(response).to.have.property('email');
		expect(response).to.have.property('public_name');
		expect(response).to.have.property('time_joined');
		return done();
	});
});

it("Should get tag list", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.tagList(function(err, response) {
		expect(err).to.be.equal(null);
		tags = response;
		return done();
	});
});

it("Should update existing tag", function (done) {
	if (!tags.length) return done();
	if (process.env.COINPAYMENTS_EMAIL == tags[0].email) return done()
	this.timeout(10 * 1000);
	common.client.conn.updateTagProfile({
		tagid: tags[0].tagid,
		email: process.env.COINPAYMENTS_EMAIL
	}, function(err, response) {
		expect(err).to.be.equal(null);
		return done();
	});
});

it("Should claim tag", function (done) {
	//tested manually
	return done()
});

it("Should get deposit address for "  + process.env.COINPAYMENTS_CURRENCY, function (done) {
	this.timeout(10 * 1000);
	common.client.conn.getDepositAddress("POT", function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.have.property('address');
		return done();
	})
});

it("Should get profile", function (done) {
	this.timeout(10 * 1000);
	common.client.conn.getProfile('orahkokos', function (err, result) {
		expect(err).to.be.equal(null);
		expect(result).to.have.property('pbntag');
		expect(result).to.have.property('merchant');
		expect(result).to.have.property('profile_name');
		expect(result).to.have.property('profile_url');
		expect(result).to.have.property('profile_email');
		expect(result).to.have.property('profile_image');
		expect(result).to.have.property('member_since');
		expect(result).to.have.property('feedback');
		expect(result.feedback).to.have.property('pos');
		expect(result.feedback).to.have.property('neg');
		expect(result.feedback).to.have.property('neut');
		expect(result.feedback).to.have.property('total');
		expect(result.feedback).to.have.property('percent');
		expect(result.feedback).to.have.property('percent_str');
		return done();
	})
});
