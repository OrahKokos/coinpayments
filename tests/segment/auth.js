const { expect } = require(`chai`);
const helper = require(`../helpers`);

it(`Should generate proper headers using _getPrivateHeaders`, function() {
  const client = helper.getClient();
  const params = { prop: 1 };
  const result = client._getPrivateHeaders(params);
  expect(result).to.have.property(
    `Content-Type`,
    `application/x-www-form-urlencoded`
  );
  expect(result).to.have.property(`HMAC`);
  expect(result.HMAC.length).to.equal(128);
});
