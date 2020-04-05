const { expect } = require(`chai`);

const helper = require(`../helpers`),
  CoinpaymentsError = require(`../../lib/error`);

let client, mock;

const defaultPayload = {
  cmd: `create_transfer`
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
    merchant: `merchantId`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.createTransfer(payload, function(err, response) {
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
  client.createTransfer(payload).then(function(response) {
    expect(response).equal(true);
    return done();
  });
});

it(`Should return error on bad payload (merchant/pbntag)`, function(done) {
  const payload = {
    amount: `1`,
    currency: `BTC`,
    pbntag: `somePbntag`,
    merchant: `merchantId`
  };
  client.createTransfer(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (merchant)`, function(done) {
  const payload = {
    amount: `1`,
    currency: `BTC`
  };
  client.createTransfer(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});

it(`Should return error on bad payload (amount)`, function(done) {
  const payload = {
    merchant: `merchantId`,
    currency: `BTC`
  };
  client.createTransfer(payload).catch(function(err) {
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
    merchant: `merchantId`
  };
  client.createTransfer(payload, function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});
