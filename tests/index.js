function runTest(name, path) {
  describe(name, function() {
    require(`./segment/` + path);
  });
}

describe(`Coinpayments tests`, function() {
  runTest(`Init Coinpayments client`, `init.js`);
  runTest(`Coinpayments auth`, `auth.js`);
  runTest(`Coinpayments util`, `util.js`);
  runTest(`Coinpayments command getBasicInfo`, `get-basic-info.js`);
  runTest(`Coinpayments command balances`, `balances.js`);
  runTest(`Coinpayments command rates`, `rates.js`);
  runTest(`Coinpayments command getDepositAddress`, `get-deposit-address.js`);
  runTest(`Coinpayments command createTransaction`, `create-transaction.js`);
  runTest(`Coinpayments command getCallbackAddress`, `get-callback-address.js`);
  runTest(`Coinpayments command getTx`, `get-transaction.js`);
  runTest(`Coinpayments command getTxList`, `get-transaction-list.js`);
  runTest(`Coinpayments command createTransfer`, `create-transfer.js`);
  runTest(`Coinpayments command convertCoins`, `convert-coins.js`);
  runTest(`Coinpayments command convertLimits`, `convert-limits.js`);
  runTest(`Coinpayments command createWithdrawal`, `create-withdrawal.js`);
  runTest(
    `Coinpayments command getWithdrawalHistory`,
    `get-withdrawal-history.js`
  );
  runTest(`Coinpayments command getWithdrawalInfo`, `get-withdrawal-info.js`);
  runTest(`Coinpayments command getConversionInfo`, `get-conversion-info.js`);
  runTest(`Coinpayments command getProfile`, `get-profile.js`);
  runTest(`Coinpayments command tagList`, `tag-list.js`);
  runTest(`Coinpayments command claimTag`, `claim-tag.js`);
  runTest(`Coinpayments command updateTagProfile`, `update-tag-profil.js`);
  runTest(`Coinpayments command getTxMulti`, `get-transaction-multi.js`);
  runTest(`Coinpayments command createMassWithdrawal`, `mass-withdrawal.js`);
  runTest(`Coinpayments response errors`, `error.js`);
});
