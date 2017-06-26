var expect = require('chai').expect

var Coinpayments = require('../lib');
var common = require('./common.js');


function runTest(name, path) {
  describe(name, function () {
  	require('./segment/' + path);
  });
}

describe('Coinpayments tests', function() {

	before(function (){
		expect(process.env.COINPAYMENTS_API_KEY_1).to.not.equal(undefined);
		expect(process.env.COINPAYMENTS_API_SECRET_1).to.not.equal(undefined);

		expect(process.env.COINPAYMENTS_API_KEY_2).to.not.equal(undefined);
		expect(process.env.COINPAYMENTS_API_SECRET_2).to.not.equal(undefined);

		expect(process.env.COINPAYMENTS_CURRENCY).to.not.equal(undefined);
		expect(process.env.COINPAYMENTS_FIXED_AMOUNT).to.not.equal(undefined);
    expect(process.env.COINPAYMENTS_CURRENCY_CONVERT).to.not.equal(undefined);
    var hasSomething = false;
    if (process.env.COINPAYMENTS_MERCHANT_PBNTAG) {
      hasSomething = true;
    }
    if (process.env.COINPAYMENTS_MERCHANT_ID) {
      hasSomething = true;
    }
    expect(hasSomething).to.equal(true)
	});

  runTest('Init Coinpayments client', 'init.js');
  runTest('Test rates API', 'rates.js');
  runTest('Test balance API', 'balance.js');
  runTest('Test profile API', 'profile.js');
  runTest('Test transaction API', 'transaction.js');
  runTest('Test tx API', 'tx.js');
  runTest('Test conversion API', 'conversion.js');
  runTest('Test withdrawal API', 'withdrawal.js');

});