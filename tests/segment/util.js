const { expect } = require(`chai`),
  sinon = require(`sinon`);

const CoinpaymentsUtil = require(`../../lib/util`);

const CoinpaymentsError = require(`../../lib/error`);

let schemaStub;

afterEach(function() {
  if (schemaStub && schemaStub.reset && CoinpaymentsUtil.getSchema.restore) {
    CoinpaymentsUtil.getSchema.restore();
  }
});

it(`Should return true hasOne`, function() {
  const payload = {
    a: 1
  };
  expect(CoinpaymentsUtil.hasOne(`a`, payload)).to.be.equal(true);
});

it(`Should return false hasOne`, function() {
  const payload = {
    a: 1
  };
  expect(CoinpaymentsUtil.hasOne(`b`, payload)).to.be.equal(false);
});

it(`Should return true xor`, function() {
  const payload = {
    a: 1,
    b: 2,
    c: 3
  };
  expect(CoinpaymentsUtil.xor([`a`, `d`, `e`], payload)).to.be.equal(true);
});

it(`Should return false xor has 2`, function() {
  const payload = {
    a: 1,
    b: 2,
    c: 3
  };
  expect(CoinpaymentsUtil.xor([`a`, `b`, `e`], payload)).to.be.equal(false);
});

it(`Should return false xor has none`, function() {
  const payload = {
    a: 1,
    b: 2,
    c: 3
  };
  expect(CoinpaymentsUtil.xor([`x`, `z`, `e`], payload)).to.be.equal(false);
});

it(`Should return true validateMassWithDrawal`, function() {
  const payload = {
    'wd[wd1][amount]': 1,
    'wd[wd1][currency]': `BTC`,
    'wd[wd1][address]': `SomeBitcoinAddress`
  };
  expect(CoinpaymentsUtil.validateMassWithDrawal(payload)).to.be.equal(true);
});

it(`Should return false validateMassWithDrawal`, function() {
  const payload = {
    'wd[wd1][xxx]': 1,
    'wd[wd1][currency]': `BTC`,
    'wd[wd1][address]': `SomeBitcoinAddress`
  };
  expect(CoinpaymentsUtil.validateMassWithDrawal(payload)).to.be.equal(false);
});

it(`Should throw error on empty cmd`, function() {
  const err = CoinpaymentsUtil.assertPayload({});
  expect(err).to.be.instanceOf(CoinpaymentsError);
});

it(`Should throw error on invalid cmd`, function() {
  const err = CoinpaymentsUtil.assertPayload({ cmd: `unknown` });
  expect(err).to.be.instanceOf(CoinpaymentsError);
});

it(`Should return no error assertPayload has`, function() {
  const rules = [`a`, `b`, `c`];
  const cmd = `test_cmd`;

  schemaStub = sinon
    .stub(CoinpaymentsUtil, `getSchema`)
    .withArgs(cmd)
    .returns(rules);

  const res = CoinpaymentsUtil.assertPayload({
    cmd,
    a: 1,
    b: 1,
    c: 1
  });

  expect(res.isError).to.be.equal(false);
});

it(`Should return error assertPayload has`, function() {
  const rules = [`a`, `b`, `c`];
  const cmd = `test_cmd`;

  schemaStub = sinon
    .stub(CoinpaymentsUtil, `getSchema`)
    .withArgs(cmd)
    .returns(rules);

  const res = CoinpaymentsUtil.assertPayload({
    cmd,
    x: 1,
    b: 1,
    c: 1
  });

  expect(res.isError).to.be.equal(true);
});

it(`Should return no error assertPayload xor`, function() {
  const rules = [`a|b`, `c`];
  const cmd = `test_cmd`;

  schemaStub = sinon
    .stub(CoinpaymentsUtil, `getSchema`)
    .withArgs(cmd)
    .returns(rules);

  const res_1 = CoinpaymentsUtil.assertPayload({
    cmd: `test_cmd`,
    a: 1,
    c: 1
  });

  const res_2 = CoinpaymentsUtil.assertPayload({
    cmd: `test_cmd`,
    b: 1,
    c: 1
  });

  expect(res_1.isError).to.be.equal(false);
  expect(res_2.isError).to.be.equal(false);
});

it(`Should return error assertPayload xor both`, function() {
  const rules = [`a|b`, `c`];
  const cmd = `test_cmd`;

  schemaStub = sinon
    .stub(CoinpaymentsUtil, `getSchema`)
    .withArgs(cmd)
    .returns(rules);

  const res = CoinpaymentsUtil.assertPayload({
    cmd: `test_cmd`,
    a: 1,
    b: 1,
    c: 1
  });

  expect(res.isError).to.be.equal(true);
});

it(`Should return error assertPayload xor none`, function() {
  const rules = [`a|b`, `c`];
  const cmd = `test_cmd`;

  schemaStub = sinon
    .stub(CoinpaymentsUtil, `getSchema`)
    .withArgs(cmd)
    .returns(rules);

  const res = CoinpaymentsUtil.assertPayload({
    cmd: `test_cmd`,
    c: 1
  });

  expect(res.isError).to.be.equal(true);
});

it(`Should return error assertPayload create_mass_withdrawal`, function() {
  const cmd = `create_mass_withdrawal`;
  const payload = {
    unknown: `xxx`
  };
  const result = CoinpaymentsUtil.assertPayload({
    cmd,
    ...payload
  });
  expect(result.isError).equal(true);
});
