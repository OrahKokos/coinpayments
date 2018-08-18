const { expect } = require(`chai`);
sinon = require(`sinon`);

const helper = require(`../helpers`);

let client, stub;

before(function() {
  client = helper.getClient();
});

afterEach(function() {
  if (stub && stub.reset) {
    sinon.restore();
  }
});

it(`Should generate proper headers using _getPrivateHeaders`, function() {
  const params = { prop: 1 };
  const result = client._getPrivateHeaders(params);
  expect(result).to.have.property(
    `Content-Type`,
    `application/x-www-form-urlencoded`
  );
  expect(result).to.have.property(`HMAC`);
  expect(result.HMAC.length).to.equal(128);
});

it(`Should test verify valid`, function() {
  const merchantSecret = `merchantSecret`,
    hmac = `123123123`,
    payload = {
      prop1: 1,
      prop2: 2,
      prop3: 3
    };

  stub = sinon
    .stub(client, `_getIpnHMAC`)
    .withArgs(merchantSecret, payload)
    .returns(hmac);

  const isValid = client.verify(hmac, merchantSecret, payload);

  expect(isValid).equal(true);
});

it(`Should test verify invalid`, function() {
  const merchantSecret = `merchantSecret`,
    hmac = `123123123`,
    payload = {
      prop1: 1,
      prop2: 2,
      prop3: 3
    };

  stub = sinon
    .stub(client, `_getIpnHMAC`)
    .withArgs(merchantSecret, payload)
    .returns(`xxxxxxxxxxx`);

  const isValid = client.verify(hmac, merchantSecret, payload);

  expect(isValid).equal(false);
});

it(`Should test verify invalid on empty`, function() {
  const merchantSecret = `merchantSecret`,
    hmac = undefined,
    payload = {
      prop1: 1,
      prop2: 2,
      prop3: 3
    };

  stub = sinon
    .stub(client, `_getIpnHMAC`)
    .withArgs(merchantSecret, payload)
    .returns(`xxxxxxxxxxx`);

  const isValid = client.verify(hmac, merchantSecret, payload);

  expect(isValid).equal(false);
});

it(`Should test verify wrong payload`, function() {
  const hmac = `123123123`;

  expect(() => client.verify(hmac)).to.throw();
});

it(`Should test _getIpnHMAC valid`, function() {
  const merchantSecret = `merchantSecret`,
    payload = {
      prop1: 1,
      prop2: 2,
      prop3: 3
    };

  const hash = client._getIpnHMAC(merchantSecret, payload);
  expect(hash.length).to.equal(128);
});

it(`Should test _getIpnHMAC invalid`, function() {
  const payload = {
    prop1: 1,
    prop2: 2,
    prop3: 3
  };

  expect(() => client._getIpnHMAC(undefined, payload)).to.throw();
});
