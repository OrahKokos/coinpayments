const { expect } = require(`chai`);

const helper = require(`../helpers`),
  CoinpaymentsError = require(`../../src/error`);

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
