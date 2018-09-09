const { expect } = require(`chai`);

const helper = require(`../helpers`),
  CoinpaymentsError = require(`../../lib/error`);

let client, mock;

before(function() {
  client = helper.getClient();
});

afterEach(function() {
  expect(mock.isDone()).equals(true);
});

it(`Should handle error non json response callback`, function(done) {
  mock = helper.prepareMock(undefined, 1, `not-json`);

  client.rates(function(err) {
    expect(err).to.be.instanceOf(CoinpaymentsError);
    return done();
  });
});

it(`Should handle error non json response promise`, function(done) {
  mock = helper.prepareMock(undefined, 1, `not-json`);

  client.rates().catch(function(err) {
    expect(err).to.be.instanceOf(CoinpaymentsError);
    return done();
  });
});

it(`Should handle coinpayments error callback`, function(done) {
  mock = helper.prepareMock(undefined, 1, {
    code: 500,
    payload: {
      error: `error`
    }
  });

  client.rates(function(err) {
    expect(err).to.be.instanceOf(CoinpaymentsError);
    return done();
  });
});

it(`Should handle coinpayments error promise`, function(done) {
  mock = helper.prepareMock(undefined, 1, {
    code: 500,
    payload: {
      error: `error`
    }
  });

  client.rates().catch(function(err) {
    expect(err).to.be.instanceOf(CoinpaymentsError);
    return done();
  });
});

it(`Should have proper customer error implementation`, function () {
  const extra = { prop: 1 };
  const err = new CoinpaymentsError(`My custom message`, extra);
  expect(err.name).equals(`CoinpaymentsError`);
  expect(err).to.be.instanceOf(CoinpaymentsError);
  expect(err).to.be.instanceOf(Error);
  expect(require(`util`).isError(err)).equals(true);
  expect(!!err.stack).equals(true);
  expect(err.toString()).equals(`CoinpaymentsError: My custom message`);
  expect(err.stack.split(`\n`)[0]).equals(`CoinpaymentsError: My custom message`);
  expect(err.extra).equals(extra);
});
