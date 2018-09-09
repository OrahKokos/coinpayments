const { expect } = require(`chai`);

const helper = require(`../helpers`),
  CoinpaymentsError = require(`../../lib/error`);

let client, mock;

const defaultPayload = {
  cmd: `create_transaction`
};

before(function() {
  client = helper.getClient();
});

afterEach(function() {
  if (mock) expect(mock.isDone()).equals(true);
  mock = false;
});

it(`Should be valid payload callback`, function(done) {
  const payload = {
    currency1: `BTC`,
    currency2: `BTC`,
    amount: `1`,
    buyer_email: `buyer@email.com`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.createTransaction(payload, function(err, response) {
    expect(err).equal(null);
    expect(response).equal(true);
    return done();
  });
});

it(`Should be valid payload promise`, function(done) {
  const payload = {
    currency1: `BTC`,
    currency2: `BTC`,
    amount: `1`,
    buyer_email: `buyer@email.com`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.createTransaction(payload).then(function(response) {
    expect(response).equal(true);
    return done();
  });
});

it(`Should return error on bad payload (currency1)`, function(done) {
  const payload = {
    currency2: `BTC`,
    amount: `1`
  };
  client.createTransaction(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (currency2)`, function(done) {
  const payload = {
    currency1: `BTC`,
    amount: `1`
  };
  client.createTransaction(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (amount)`, function(done) {
  const payload = {
    currency1: `BTC`,
    currency2: `BTC`
  };
  client.createTransaction(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (buyer_email)`, function(done) {
  const payload = {
    currency1: `BTC`,
    currency2: `BTC`,
    amount: `1`
  };
  client.createTransaction(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

