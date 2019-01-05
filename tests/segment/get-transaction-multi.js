const { expect } = require(`chai`);

const helper = require(`../helpers`);

let client, mock;

const defaultPayload = {
  cmd: `get_tx_info_multi`
};

before(function() {
  client = helper.getClient();
});

afterEach(function() {
  expect(mock.isDone()).equals(true);
});

it(`Should be valid payload`, function(done) {
  const expectedPayload = [1, 2, 3];
  const mockPayload = Object.assign({}, defaultPayload);

  mock = helper.prepareMock(mockPayload);
  client.getTxMulti(expectedPayload, function(err, response) {
    expect(err).equal(null);
    expect(response).equal(true);
    return done();
  });
});

it(`Should be invalid payload`, function(done) {
  const expectedPayload = [];

  client.getTxMulti(expectedPayload, function(err) {
    expect(!!err).equal(true);
    return done();
  });
});

it(`Should be wrong payload`, function(done) {
  const expectedPayload = undefined;

  client.getTxMulti(expectedPayload, function(err) {
    expect(!!err).equal(true);
    return done();
  });
});
