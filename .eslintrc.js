module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "indent": [
      "error",
      2
    ],
    "quotes": [
      "error",
      "backtick"
    ],
    "semi": [
      "error",
      "always"
    ]
  },
  "parserOptions":{
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }
  }
};