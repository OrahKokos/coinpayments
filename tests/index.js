const
  env = require('dotenv'),
  expect = require('chai').expect

const
  Coinpayments = require('../lib');

const
  common = require('./common.js');

env.config();

// process.env.COINPAYMENTS_API_KEY_1 = '3732484672e78323db166c2e2b81506dfdd9233ca633a3da5bc7f73a9ffbd97e';
// process.env.COINPAYMENTS_API_SECRET_1 = '9B2C8ebF47Bde255241C331d1D56d47ee1b81048672eDf98B30671dd23fe6f4a';
// process.env.COINPAYMENTS_API_KEY_2 = '21ea8e25f733934be31b743c2beefe528185caef29caf7a6ace50cb92aec4d68';
// process.env.COINPAYMENTS_API_SECRET_2 = '30415409Fb0C676Bd6a0319fd1699e3d313ce0CB8f8d787dE8afFeb78f970343';
// process.env.COINPAYMENTS_FIXED_AMOUNT = '0.3';
// process.env.COINPAYMENTS_CURRENCY = 'LTCT';
// process.env.COINPAYMENTS_MERCHANT_ID = '831b8d495071e5b0e1015486f5001150';
// process.env.COINPAYMENTS_MERCHANT_PBNTAG = 'orahkokos';


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

    expect(
      process.env.COINPAYMENTS_MERCHANT_PBNTAG || 
      process.env.COINPAYMENTS_MERCHANT_ID
    ).to.not.equal(undefined);
	});

  runTest('Init Coinpayments client', 'init.js');
  runTest('Test rates API', 'rates.js');
  runTest('Test balance API', 'balance.js');
  runTest('Test profile API', 'profile.js');
  runTest('Test transaction API', 'transaction.js');
  runTest('Test tx API', 'tx.js');

  if(process.env.COINPAYMENTS_CURRENCY !== 'LTCT') {
    runTest('Test conversion API', 'conversion.js');  
  }

  runTest('Test withdrawal API', 'withdrawal.js');

});