const { expect } = require(`chai`);

const helper = require(`../helpers`),
  CoinpaymentsError = require(`../../lib/error`);

let client, mock;

const defaultPayload = {
  cmd: `get_tx_info`
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
    txid: `SomeTxId`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.getTx(payload, function(err, response) {
    expect(err).equal(null);
    expect(response).equal(true);
    return done();
  });
});

it(`Should be valid payload promise`, function(done) {
  const payload = {
    txid: `SomeTxId`
  };
  const mockPayload = Object.assign({}, defaultPayload, payload);

  mock = helper.prepareMock(mockPayload);
  client.getTx(payload).then(function(response) {
    expect(response).equal(true);
    return done();
  });
});

it(`Should return error on bad payload (txid)`, function(done) {
  const payload = {};
  client.getTx(payload).catch(function(err) {
    expect(err).to.be.an.instanceof(CoinpaymentsError);
    expect(err).to.have.property(`name`);
    expect(err).to.have.property(`message`);
    expect(err).to.have.property(`extra`);
    return done();
  });
});
