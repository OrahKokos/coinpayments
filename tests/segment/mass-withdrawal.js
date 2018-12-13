const { expect } = require(`chai`);

const helper = require(`../helpers`);

let client, mock;

const defaultPayload = {
  cmd: `create_mass_withdrawal`
};

before(function() {
  client = helper.getClient();
});

afterEach(function() {
  expect(mock.isDone()).equals(true);
});

it(`Should be valid payload`, function(done) {
  const expectedPayload = [
    {
      currency: `BTC`,
      amount: `1`,
      address: `SomeAddress1`
    },
    {
      currency: `LTC`,
      amount: `1`,
      address: `SomeAddress2`,
      dest_tag: `DestTag`
    },
    {
      currency: `NEM`,
      amount: `1`,
      address: `SomeAddress3`,
      dest_tag: `DestTag`
    },
    {
      currency: `XRP`,
      amount: `1`,
      address: `SomeAddress4`,
      dest_tag: `DestTag`
    }
  ];
  const mockPayload = Object.assign({}, defaultPayload);

  mock = helper.prepareMock(mockPayload);
  client.createMassWithdrawal(expectedPayload, function(err, response) {
    expect(err).equal(null);
    expect(response).equal(true);
    return done();
  });
});

it(`Should be invalid payload`, function(done) {
  const expectedPayload = [
    {
      address: `SomeAddress1`
    },
    {
      currency: `LTC`,
      address: `SomeAddress2`
    },
    {
      currency: `NEM`,
      amount: `1`
    }
  ];

  client.createMassWithdrawal(expectedPayload, function(err) {
    expect(!!err).equal(true);
    return done();
  });
});
it(`Should be wrong payload`, function(done) {
  const expectedPayload = 123;

  client.createMassWithdrawal(expectedPayload, function(err) {
    expect(!!err).equal(true);
    return done();
  });
});
