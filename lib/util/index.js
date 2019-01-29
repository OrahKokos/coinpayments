const CoinpaymentsError = require(`../error`);
const schema = require(`../config/schema`);

const OR_OPERATOR = `|`;

module.exports = {
  getSchema: function(cmd) {
    return schema[cmd];
  },
  assertPayload: function(data) {
    const cmd = data.cmd;
    const payload = Object.assign({}, data);
    delete payload.cmd;
    if (!cmd) return new CoinpaymentsError(`No method passed`);
    const cmdSchema = this.getSchema(cmd);
    if (cmdSchema === undefined)
      return new CoinpaymentsError(`No such method ${cmd}`);

    let error = `Missing parameters: `;
    let isError = false;

    if (cmd === `create_mass_withdrawal`) {
      isError = !this.validateMassWithDrawal(payload);
      if (isError) {
        error = `Invalid mass withdrawal payload`;
      }
      return { isError, error };
    }

    for (const key in cmdSchema) {
      if (isError) break;
      const rule = cmdSchema[key];

      if (rule.indexOf(OR_OPERATOR) === -1) {
        isError = !this.hasOne(rule, payload);
      } else {
        isError = !this.xor(rule.split(OR_OPERATOR), payload);
      }

      if (isError) {
        error += `${rule}, `;
      }
    }

    if (isError) {
      error = new CoinpaymentsError(error.slice(0, -2));
    }

    return { isError, error };
  },
  validateMassWithDrawal(payload) {
    const regex = /wd\[wd[0-9]*\]\[(amount|address|currency|dest_tag)\]/;
    for (const key in payload) {
      if (!regex.test(key)) return false;
    }
    return true;
  },
  hasOne: function(rule, payload) {
    return payload[rule] !== undefined;
  },
  xor: function(rules, payload) {
    let flag = false;
    for (const rule in rules) {
      if (payload[rules[rule]] !== undefined) {
        if (flag) return false;
        flag = true;
      }
    }
    return flag;
  }
};
