const { expect } = require(`chai`);

const helper = require(`../helpers`),
  CoinpaymentsError = require(`../../lib/error`);

let client, mock;

const defaultPayload = {
  cmd: `create_withdrawal`
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
    amount: `1`,
    currency: `BTC`,
    address: `SomeAddress`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.createWithdrawal(payload, function(err, response) {
    expect(err).equal(null);
    expect(response).equal(true);
    return done();
  });
});

it(`Should be valid payload promise`, function(done) {
  const payload = {
    amount: `1`,
    currency: `BTC`,
    pbntag: `somePbntag`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.createWithdrawal(payload).then(function(response) {
    expect(response).equal(true);
    return done();
  });
});

it(`Should return error on bad payload (merchant/pbntag)`, function(done) {
  const payload = {
    amount: `1`,
    currency: `BTC`,
    pbntag: `somePbntag`,
    address: `SomeAddress`
  };
  client.createWithdrawal(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (address or pbntag)`, function(done) {
  const payload = {
    amount: `1`,
    currency: `BTC`
  };
  client.createWithdrawal(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (amount)`, function(done) {
  const payload = {
    pbntag: `SomePbntag`,
    currency: `BTC`
  };
  client.createWithdrawal(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (currency)`, function(done) {
  const payload = {
    amount: `1`,
    pbntag: `SomePbntag`
  };
  client.createWithdrawal(payload, function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});
