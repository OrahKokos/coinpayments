const { expect } = require(`chai`);

const CoinpaymentsError = require(`../../lib/error`);

const { credentials } = require(`../config`);

const helper = require(`../helpers`);

it(`Should not initilize with missing public key`, function() {
  try {
    helper.getClient(Object.assign({}, credentials, { key: undefined }));
  } catch (exception) {
    expect(exception).to.be.instanceOf(CoinpaymentsError);
    expect(exception.message).to.equal(`Missing public key`);
  }
});

it(`Should not initilize with missing private key`, function() {
  try {
    helper.getClient(Object.assign({}, credentials, { secret: undefined }));
  } catch (exception) {
    expect(exception).to.be.instanceOf(CoinpaymentsError);
    expect(exception.message).to.equal(`Missing private key`);
  }
});

it(`Should initilize valid payload`, function() {
  const client = helper.getClient(credentials);
  expect(client).to.have.property(`credentials`);
  expect(client.credentials).to.have.property(`key`, `x`);
  expect(client.credentials).to.have.property(`secret`, `y`);
});
