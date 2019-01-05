const url = require(`url`),
  qs = require(`querystring`);

const nock = require(`nock`);

const Coinpayments = require(`../../lib`),
  CoinpaymentsConfig = require(`../../lib/config`);

const { credentials } = require(`../config`);

const { API_VERSION, API_PROTOCOL, API_HOST, API_PATH } = CoinpaymentsConfig;

const mockUrl = url.format({
  protocol: API_PROTOCOL,
  hostname: API_HOST
});

const mock = nock(mockUrl, {
  reqheaders: {
    'Content-Type': `application/x-www-form-urlencoded`,
    HMAC: /^.{128}$/
  }
});

const responseGood = {
  code: 200,
  payload: { error: `ok`, result: true }
};

module.exports = {
  getClient: function(credentialsArg = {}) {
    credentialsArg = Object.assign({}, credentials, credentialsArg);
    return new Coinpayments(credentialsArg);
  },
  prepareMock: function(mockPayload, repeat = 1, forceResponse = false) {
    const fullPayload = Object.assign({}, mockPayload, {
      version: `${API_VERSION}`,
      key: `${credentials.key}`
    });

    const response = forceResponse ? forceResponse : responseGood;

    mock
      .post(API_PATH, function(body) {
        for (const key in fullPayload) {
          /* istanbul ignore if */
          if (fullPayload[key] !== body[key]) {
            return false;
          }
        }
        return true;
      })
      .times(repeat)
      .reply(response.code, JSON.stringify(response.payload));

    return mock;
  }
};
