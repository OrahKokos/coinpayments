# CoinPayments NodeJS client

<p align="left">
  <a href="https://travis-ci.org/OrahKokos/coinpayments">
    <img src="https://travis-ci.org/OrahKokos/coinpayments.svg?branch=master"
         alt="build status">
  </a>
  <a href="https://codecov.io/github/OrahKokos/coinpayments">
    <img src="https://codecov.io/github/OrahKokos/coinpayments/coverage.svg?branch=master">
  </a>
</p>

![alt text](https://www.coinpayments.net/images/logo.png "CoinPayments")

CoinPayments is a cloud wallet solution that offers an easy way to integrate a checkout system for numerous cryptocurrencies. Coinpayments now also offers coin conversion via Shapeshift.io.
For more information visit their website [here](https://www.coinpayments.net/index.php?ref=831b8d495071e5b0e1015486f5001150).

<a name="table" />

Table of contents
=================

- Table of contents
  - [Installation](#installation)
  - [Setup](#setup)
  - [API Reference](#api-reference)
    - [Init](#init)
    - [Get Basic Account Information](#get-basic-account-information)
    - [Get Profile Info](#get-profile-info)
    - [Get Tag list](#get-tag-list)
    - [Claim tag](#claim-tag)
    - [Update Tag Profile](#update-tag-profile)
    - [Get Deposit Address](#get-deposit-address)
    - [Get Callback Address](#get-callback-address)
    - [Rates](#rates)
    - [Balances](#balances)
    - [Create Transaction](#create-transaction)
    - [Get Transaction Info](#get-transaction-info)
    - [Get Transaction Multi](#get-transaction-multi)
    - [Get Transaction List](#get-transaction-list)
    - [Get Conversion Limits](#get-conversion-limits)
    - [Convert Coins](#convert-coins)
    - [Create Transfer](#create-transfer)
    - [Create Withdrawal](#create-withdrawal)
    - [Create Mass Withdrawal](#create-mass-withdrawal)
    - [Get Withdrawal History](#get-withdrawal-history)
  - [Local development](#development)
  - [Instant Paymnt Notifications](#ipn)
  - [License](#license)
  - [Support/Donate](#supportdonate)

<a name="installation" />

## Installation

No deps, clean nodejs.

```bash 
npm install coinpayments
```

<a name="setup" />

## Setup

- Create an account on [www.coinpayments.net](https://www.coinpayments.net/index.php?ref=831b8d495071e5b0e1015486f5001150)
- Go to **My Account -> Coin Acceptance Settings**
- Check the coins you wish to accept.
    - You can setup your payment address, so you can use coinpayments as a pass thru service, rather then a cloud wallet (Payout mode ASAP/Nightly).
    - **Payout Made** (To Balance/ASAP/Nightly)
      - **To Balance:** Received payments are stored in your account for later withdrawal at your leisure. 
      - **ASAP:** Received payments are sent to the address you specify as soon as they are received and confirmed.
      - **Nightly:** Received payments are grouped together and sent daily (at approx. midnight EST GMT -0500). The main benefit of this options is it will save you coin TX fees
    - **Discount (%)**
      - **Positive Numbers:** Gives buyers a discount for paying with a coin. Good promotional tool if you want to give extra support to a particular coin.
      - **Negative Numbers:** Adds a certain percentage for paying with a coin. This could be used to cover your crypto/fiat conversation costs, make adjustments to match your local exchange, etc.
- Go to **My Account -> API Keys** , generate API key pair 
- **Edit permissions** on the generated **API KEY** and enable all options
- Get some Litecoin testnet coins [here](https://www.coinpayments.net/help-testnet)

[back to top](#table)

<a name="reference" />

## API Reference

- All methods support Promise and Callback
- All metods have bound context
- All errors are instances of `CoinpaymentsError`
```javascript
const CoinpaymentsError = require(`coinpayments/lib/error`);
```

<a name="init" />

## Init

```javascript
const Coinpayments = require('coinpayments');
const client = new Coinpayments(options); 
```
- ``options`` **required**
- ``options.key`` - **required** Public API key
- ``options.secret`` - **required** Private API key

[back to top](#table)

<a name="getbasicinfo" />

## Get Basic Account Information

Get your basic account information.
```javascript
// callback (err, result)
client.getBasicInfo(callback);

// promise
client.getBasicInfo().then().catch();

// async/await
await client.getBasicInfo();
```

Example response from server
```json
{ 
  "uername": "OrahKokos",
  "username": "OrahKokos",
  "merchant_id": "831b8d495071e5b0e1015486f5001150",
  "email": "marko.paroski.ns@gmail.com",
  "public_name": "OrahKokos",
  "time_joined": 1417611250 
}
```
- ``uername`` - Some sort of username
- ``username`` - Username
- ``merchant_id`` - Your merchant ID
- ``email`` - Your merchant email
- ``public_name`` - Your merchant public name
- ``time_joined`` - User joined timestamp

[back to top](#table)

<a name="getprofile" />

## Get Profile Info

Get $PayByName Profile Information

```javascript
// callback (err, result)
client.getProfile(options, callback);

// promise
client.getProfile(options).then().catch();

// async/await
await client.getProfile(options);
```
- ``options.pbntag`` - ***required*** Coinpayments merchant pbntag.


Example response from server
```json
{ 
  "pbntag": "$orahkokos",
  "merchant": "831b8d495071e5b0e1015486f5001150",
  "profile_name": "",
  "profile_url": "",
  "profile_email": "",
  "profile_image": "",
  "member_since": 1417611250,
  "feedback": 
   { "pos": 160,
     "neg": 0,
     "neut": 0,
     "total": 160,
     "percent": "100%",
     "percent_str": "<span style='color: #5cb85c;'><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i><i class='fa fa-star' aria-hidden='true'></i></span> <span style='color: #5cb85c;'>(100%)</span>" } }
```
- ``pbntag`` - This is the $PayByName tag in the same case as the owner entered it. It is recommended to display the tag this way versus how it was entered by a viewing user.
- ``merchant`` - This is the owner's merchant ID. It can be used to send transfers or payments to the owner.
- ``profile_name`` - This is the owner's name (may be a store name, nickname, real name, etc.)
- ``profile_url`` - This is the owner's website URL.
- ``profile_email`` - This is the owner's email.
- ``profile_image`` - The URL of the owner's profile picture.
- ``member_since`` - The time (Unix timestamp) of when the user signed up for CoinPayments.
- ``feedback`` - The owners current feedback. The 'percent' field with either be a percent as seen or 'No Rating' if the user has no feedback.

[back to top](#table)

<a name="gettaglist" />

## Get Tag list

Get a list of owned tags.

```javascript
// callback (err, result)
client.tagList(callback);

// promise
client.tagList().then().catch();

// async/await
await client.tagList();
```

Example response from server
```json
[  
  {  
     "tagid":"e893b55c2216a20e6761b1a9f32409df",
     "pbntag":"Test1",
     "time_expires":2147483647
  },
  {  
     "tagid":"4293b55c2216a20e6761b1a9f32409de",
     "pbntag":"Test2",
     "time_expires":2147483647
  },
  {  
     "tagid":"35df17c48fc16cff8dcee35cedd42d2d",
     "pbntag":"",
     "time_expires":1497037845
  }
]
```
- ``tagid`` - This is the unique identifier of the tag in the system. This is the identifier you will use with the 'update_pbn_tag' and 'claim_pbn_tag' API calls.
- ``pbntag`` - This is the $PayByName tag. An empty string means the tag is unclaimed. (Note that the tags do not have a $ at the front.)
- ``time_expires`` - The time (Unix timestamp) of when the tag expires.

[back to top](#table)

<a name="claimtag" />

## Claim tag

Claim $PayByName Tag

```javascript
// callback (err, result)
client.claimTag(options, callback);

// promise
client.claimTag(options).then().catch();

// async/await
await client.claimTag(options);
```
- ``options`` - ***required***.
- ``options.tagid`` - ***required***. Unique tag ID.
- ``options.name`` - ***required*** Name for the tag; for example a value of 'Apple' would be the PayByName tag $Apple. Make sure to use the case you want the tag displayed with.

Example response from server
```json
[]
```

[back to top](#table)

<a name="updatetagprofile" />

## Update Tag Profile

Update $PayByName Profile

```javascript
// callback (err, result)
client.updateTagProfile(options, callback);

// promise
client.updateTagProfile(options).then().catch();

// async/await
await client.updateTagProfile(options);
```
- ``options`` - ***required***. Any enabled currency.
- ``options.tagid`` - ***required***. Unique tag ID
- ``options.name`` - ***optional***. Name for the profile. If field is not supplied the current name will be unchanged.
- ``options.email`` - ***optional***. Email for the profile. If field is not supplied the current email will be unchanged.
- ``options.url`` - ***optional***. Website URL for the profile. If field is not supplied the current URL will be unchanged.
- ``options.image`` - ***NOT SUPPORTED***. HTTP POST with a JPG or PNG image 250KB or smaller. This is an actual "multipart/form-data" file POST and not a URL to a file. If field is not supplied the current image will be unchanged.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)
Example response from server
```json
[]
```

[back to top](#table)

<a name="getdeposit" />

## Get Deposit Address

Get a deposit address. This action does not include a fee and will not trigger IPN
```javascript
// callback (err, result)
client.getDepositAddress(options, callback);

// promise
client.getDepositAddress(options).then().catch();

// async/await
await client.getDepositAddress(options);

```
- ``options`` - **required**
- ``options.currency`` - **required**. Any enabled currency.

Example response from server
```json
{ 
  "address":"1BitcoinAddress"
}
```
- ``address`` - Deposit address

[back to top](#table)

<a name="getcallback" />

## Get Callback Address

Get a callback address. This action does a fee and will trigger IPN.
```javascript
// callback (err, result)
client.getCallbackAddress(options, callback);

// promise
client.getCallbackAddress(options).then().catch();

// async/await
await client.getCallbackAddress(options);
```
- ``options`` - **required**
- ``options.currency`` - **required**. Any enabled currency.
- ``options.ipn_url`` -  **optional** explicit URL for the IPN to send POST requests to.

Example response from server
```json
{ 
  "address":"1BitcoinAddress",
}
```
- ``address`` - Callback address

[back to top](#table)

<a name="rates" />

## Rates
----
Get Exchange Rates / Supported Coins
```javascript
// callback (err, result)
client.rates(options, callback);

// promise
client.rates(options).then().catch();

// async/await
await client.rates(options);
```
- ``options`` - ***optional***
- ``options.short`` - ***optional*** If set to ``1``, the response won't include the full coin names and number of confirms needed to save bandwidth. (default ``0``)
- ``options.accepted`` - ***optional*** If set to ``1``, the response will include only those coins which are enabled for acceptance on your Coin Acceptance Page. (default ``0``)

Example Response from server:
```json
{
    "BTC": {
      "is_fiat": 0,
      "rate_btc": "1.000000000000000000000000",
      "last_update": "1375473661",
      "tx_fee": "0.00100000",
      "status": "online",
      "name": "Bitcoin",
      "confirms": "2",
      "capabilities": [
        "payments",
        "wallet",
        "transfers",
        "convert"
      ]
    },
    "LTC": {
      "is_fiat": 0,
      "rate_btc": "0.018343387500000000000000",
      "last_update": "1518463609",
      "tx_fee": "0.00100000",
      "status": "online",
      "name": "Litecoin",
      "confirms": "3",
      "capabilities": [
        "payments",
        "wallet",
        "transfers",
        "convert"
      ]
    },
    "USD": {
      "is_fiat": 1,
      "rate_btc": "0.000114884285404190000000",
      "last_update": "1518463609",
      "tx_fee": "0.00000000",
      "status": "online",
      "name": "United States Dollar",
      "confirms": "1",
      "capabilities": []
    },
    ...
  }
```
- ``name`` - The coin's full/display name.
- ``rate_btc`` - The exchange rate to Bitcoin.
- ``is_fiat`` - If the coin is a fiat currency. You can use fiat currencies in your buttons so you don't get to get conversion rates yourself.
- ``confirms`` - The number of confirms a coin has to have in our system before we send it to you.
- ``accepted`` - 1 if you have the coin enabled for acceptance, 0 otherwise.
- ``tx_fee`` - Transaction fee.
- ``status`` - Cloud wallet/network status ```online``` or ```offline```.
- ``capabilities`` - Offered services for the given cryptocurrency. Can be: ```"payments"```, ```"wallet"```, ```"transfers"```, ```"dest_tag"```, ```"convert"```

[back to top](#table)

<a name="balances" />

## Balances
---
Coin Balances
```javascript
// callback (err, result)
client.balances(options, callback);

// promise
client.balances(options).then().catch();

// async/await
await client.balances(options);
```
- ``options`` - **optional**
- ``options.all`` - **optional** If set to ``1``, the response will include all coins, even those with 0 balance. (default ``0``)

Example Response from server:
```json
{
  "BTC": { 
    "balance": 10000000,
    "balancef": "0.10000000",
    "status": "available",
    "coin_status": "online" 
  },
  POT: {
    "balance": 499594333,
    "balancef": "4.99594333",
    "status": "available",
    "coin_status": "online" 
  }
}
```

- ``balance`` - The coin balance as an integer (in Satoshis).
- ``balancef`` - The coin balance as a floating point number.
- ``status`` - ```available``` or ```unavailable```
- ``coin_status`` - Cloud wallet/network status ```online``` or ```offline```

[back to top](#table)

<a name="createtransaction" />

## Create Transaction
---
Create Transaction
```javascript
// callback (err, result)
client.createTransaction(options, callback);

// promise
client.createTransaction(options).then().catch();

// async/await
await client.createTransaction(options);
```
- ``options`` - **required**
- ``options.currency1`` - **required** The original currency (displayed currency) in which the price is presented 
- ``options.currency2`` - **required** The currency the buyer will be sending.
- ``options.amount`` - **required** Expected amount to pay, where the price is expressed in ``options.currency1`` 
- ``options.buyer_email`` - **required** Set the buyer's email address. This will let us send them a notice if they underpay or need a refund. We will not add them to our mailing list or spam them or anything like that.

If ``options.currency1`` is not equal to ``options.currency2`` the expected payment amount in the response of the request will auto convert to the expected amount in ``options.currency2``

- ``options.address`` - **optional** Address to send the funds to ( if not set, it will use the wallet address of your coinpayments cloud wallet ) **Must be payment address from** ``options.currency2`` **network** 
- ``options.buyer_name`` - **optional** Set buyer name for your reference
- ``options.item_name`` - **optional** Set item name for your reference, included in IPN
- ``options.item_number`` - **optional** Set item number for your reference, included in IPN
- ``options.invoice`` - **optional** Custom field, included in IPN
- ``options.custom`` - **optional** Custom field, included in IPN
- ``options.ipn_url`` - **optional** explicit URL for the IPN to send POST requests to.

Example Response from server:
```json
{ 
  "amount": "1.21825881",
  "txn_id": "d17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c",
  "address": "PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx",
  "confirms_needed": "5",
  "timeout": 5400,
  "status_url": "https://www.coinpayments.net/index.php?cmd=status&id=d17a8ee84b1de669bdd0f15b38f,
  "qrcode_url": "https://www.coinpayments.net/qrgen.php?id=CPBF4COHLYGEZZYIGFDKFY9NDP&key=90e5561c1e8cd4452069f7726d3e0370"
}
```

- ``amount`` - The amount for the buyer to send in the destination currency (currency2).
- ``address`` - The address the buyer needs to send the coins to.
- ``txn_id`` - The CoinPayments.net transaction ID.
- ``confirms_needed`` - The number of confirms needed for the transaction to be complete.
- ``timeout`` - How long the buyer has to send the coins and have them be confirmed in seconds.
- ``status_url`` - A URL where the buyer can view the payment progress and leave feedback for you.
- ``qrcode_url`` - A URL to a generated QR code.

[back to top](#table)

<a name="gettx" />

## Get Transaction Info
---
Query the server for transaction and returns the status of the payment. 
```javascript
// callback (err, result)
client.getTx(options, callback);

// promise
client.getTx(options).then().catch();

// async/await
await client.getTx(options);
```
- ``txid`` - **required** - transaction hash value 
- ``full`` - **optional** - Set to 1 to also include the raw checkout and shipping data for the payment if available. (default: 0)
  
Example Response from server:
```json
{ 
  "time_created": 1424436678,
  "time_expires": 1424442078,
  "status": 0,
  "status_text": "Waiting for buyer funds...",
  "type": "coins",
  "coin": "POT",
  "amount": 121700023,
  "amountf": "1.21700023",
  "received": 0,
  "receivedf": "0.00000000",
  "recv_confirms": 0,
  "payment_address": "PWP4gKLRLVQv9dsvcN4sZn5pZaKQGothXm" 
}
```
- ``time_created`` - The time the transaction request was created.
- ``time_expires`` - The time the transaction request expires.
- ``status`` - Status of the payment (-1 = Cancelled, 0 = Pending, 1 == Success)
- ``status_text`` - Status expressed in human readable text.
- ``type`` - fiat or coins
- ``amount`` - Amount to send (in Satoshis).
- ``amountf`` - Amount to send (as a floating point number).
- ``received`` - Received amount (in Satoshis).
- ``receivedf`` - Received amount (as a floating point number).
- ``recv_confirms`` - Received confirms.
- ``payment_address`` - Address to send the fund to.

[back to top](#table)

<a name="gettxmulti" />

## Get Transaction Multi

Get multiple transaction status.
```javascript
// callback (err, result)
client.getTxMulti(txn_id_array, callback);

// promise
client.getTxMulti(txn_id_array).then().catch();

// async/await
await client.getTxMulti(txn_id_array);
```
- ``txn_id_array`` - **required**. Array of transaction ids.

Example response from server
```json
"CPBF23CBUSHKKOMV1OPMRBNEFV": { 
  "error": "ok",
  "amount": "1.21825881",
  "txn_id": "d17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c",
  "address": "PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx",
  "confirms_needed": "5",
  "timeout": 5400,
  "status_url": "https://www.coinpayments.net/index.php?cmd=status&id=d17a8ee84b1de669bdd0f15b38f,
  "qrcode_url": "https://www.coinpayments.net/qrgen.php?id=CPBF4COHLYGEZZYIGFDKFY9NDP&key=90e5561c1e8cd4452069f7726d3e0370"
},
...
```
- ``Object.keys(response) -> ids`` - Transaction IDs
- ``response[id]`` - Object same as getTx with transaction information.

[back to top](#table)

<a name="gettxlist" />

## Get Transaction LIST

Get a list of transaction ids.

```javascript
// callback (err, result)
client.getTxList(options, callback);

// promise
client.getTxList(options).then().catch();

// async/await
await client.getTxList(options);
```
- ``options`` - **optional**. Any enabled currency.
- ``options.limit`` - The maximum number of transaction IDs to return from 1-100. (default: 25)
- ``options.start`` - What transaction # to start from (for iteration/pagination.) (default: 0, starts with your newest transactions.)
- ``options.newer`` - Return transactions started at the given Unix timestamp or later. (default: 0)
- ``options.all`` - By default we return an array of TX IDs where you are the seller for use with get_tx_info_multi or get_tx_info. If all is set to 1 returns an array with TX IDs and whether you are the seller or buyer for the transaction.

Example response from server
```javascript
[ 
  'CPBF23CBUSHKKOMV1OPMRBNEFV',
  'CPBF4COHLYGEZZYIGFDKFY9NDP',
  'CPBF6BFPJTSLC3Z49CT82NVYJ8',
  'CPBF2L8QSXIG2YGKLVO5N0WTXJ',
  ... 
]
```
Each element in the array represents a ``txn_id``

[back to top](#table)

<a name="get-conversion-limits" />

## Get Conversion Limits

Get conversion limits.

```javascript
// callback (err, result)
client.convertLimits(options, callback);

// promise
client.convertLimits(options).then().catch();

// async/await
await client.convertLimits(options);
```
- ``options`` - **required**.
- ``options.from`` - **required** From currency.
- ``options.to`` - **required** To currency.

Example response from server
```json
{ 
  "min": "0.00301250", 
  "max": "0.80637488" 
}
```
- ``min`` - Min conversion 
- ``max`` - Max conversion

*Note1* that a 'max' value of 0.00000000 is valid and means there is no known upper limit available.

*Note2*: Due to provider fluctuation limits do vary often.

[back to top](#table)

<a name="convertcoins" />

## Convert Coins

Convert coins. Coinpayments utilizes [Shapeshift.io](https://shapeshift.io) services.

```javascript
// callback (err, result)
client.convertCoins(options, callback);

// promise
client.convertCoins(options).then().catch();

// async/await
await client.convertCoins(options);
```
- ``options`` - **required**.
- ``options.amount`` - **required**. The amount convert in the 'from' currency below.
- ``options.from`` - **required** From currency.
- ``options.to`` - **required** To currency.
- ``options.address`` - **optional** The address to send the funds to. If blank or not included the coins will go to your CoinPayments Wallet.
- ``options.dest_tag`` - **optional** The destination tag to use for the withdrawal (for Ripple.) If 'address' is not included this has no effect.

Example response from server
```json
{
  "id":"string"
}
```
- ``id`` - Conversion transaction ID

[back to top](#table)

<a name="createtransfer" />

## Create Transfer

Transfers are performed as internal coin transfers/accounting entries when possible. For coins not supporting that ability a withdrawal is created instead.

```javascript
// callback (err, result)
client.createTransfer(options, callback);

// promise
client.createTransfer(options).then().catch();

// async/await
await client.createTransfer(options);
```
- ``options`` - **required**. Any enabled currency.
- ``options.amount`` - **required** The amount of the transfer in the currency below.
- ``options.currency`` - **required** The cryptocurrency to withdraw. (BTC, LTC, etc.)
- ``options.merchant`` - **optional** The merchant ID to send the funds to, either this OR pbntag must be specified. Remember: this is a merchant ID and not a username.
- ``options.pbntag`` - **optional** The $PayByName tag to send the funds to, either this OR merchant must be specified.
- ``options.auto_confirm`` - **optional** If set to ``0`` the withdrawal will require an email confirmation in order for withdraw funds to go forth. (default ``1``)

Example response from server
```json
{
  "id":"string",
  "status":0
}
```
- ``id`` - The CoinPayments transfer/withdrawal ID. (This is not a coin network TX ID.)
- ``status`` - status = 0 or 1. 0 = Transfer created, waiting for email confirmation. 1 = Transfer created with no email confirmation needed.

[back to top](#table)

<a name="createwithdrawal" />

## Create Withdrawal
---
Makes a withdrawal of funds from server to a determined wallet address.
```javascript
// callback (err, result)
client.createWithdrawal(options, callback);

// promise
client.createWithdrawal(options).then().catch();

// async/await
await client.createWithdrawal(options);
```
- ``options`` - **required**
- ``options.amount`` - **required** The amount to withdraw
- ``options.currency`` - **required** The currency to withdraw  
- ``options.add_tx_fee`` - **optional** If set to 1, add the coin TX fee to the withdrawal amount so the sender pays the TX fee instead of the receiver.  
- ``options.address`` - **required** Wallet address to send the funds to. **Must be wallet address from the same network as = `options.currency`
- ``options.auto_confirm`` - **optional** If set to ``0`` the withdrawal will require an email confirmation in order for withdraw funds to go forth. (default ``1``)
- ``options.ipn_url`` - **optional**  explicit URL for the IPN to send POST requests to.
- ``options.note`` - **optional**  This lets you set the note for the withdrawal.

Example Response from server:
```json
{
  "id": "98a5ff631da2089985594789dc9fb85648596599816ac8ce1ce00fd082798967",
  "amount": "1.00000000",
  "status": 0 
}
```

- ``id`` - The CoinPayments.net withdrawal ID.
- ``amount`` - Amount to be withdrawn
- ``status`` - 0 or 1. 0 = Withdrawal created, waiting for email confirmation. 1 = Withdrawal created with no email confirmation needed

[back to top](#table)

<a name="createmasswithdrawal" />

## Create Mass Withdrawal

Create a mass withdrawal

```javascript
// callback (err, result)
client.createMassWithdrawal(withdrawalArray, callback);

// promise
client.createMassWithdrawal(withdrawalArray).then().catch();

// async/await
await client.createMassWithdrawal(withdrawalArray);
```
- ``withdrawalArray`` - **required**. An array with withdrawal object.
- ``withdrawalArray[n].amount`` - **required**. Every withdrawal object needs to have amount of currency below.
- ``withdrawalArray[n].address`` - **required**. Every withdrawal object needs to have address to withdraw funds to.
- ``withdrawalArray[n].currency`` - **required**. Every withdrawal object needs to have currency.
- ``withdrawalArray[n].dest_tag`` - **optional**. Some currencies need dest_tag in order to withdraw.


Example response from server
```json
{ 
  "wd1": { 
    "error": "ok",
    "id": "CWBF3UECUQFCCNFIRUS73G5VON",
    "status": 1,
    "amount": "1.00000000" 
  },
  "wd2": { "error": "That amount is larger than your balance!" }
```
- ``wd[n]`` - Represents mapped withdrawalArray
- ``wd[n].error`` - Error
- ``wd[n].status`` - status = 0 or 1. 0 = Withdrawal created, waiting for email confirmation. 1 = Withdrawal created with no email confirmation needed.
- ``wd[n].amount`` - Withdrawal amount

[back to top](#table)

<a name="getwithdrawalinfo" />

##Get Withdrawal Info

Query the server for Withdraw ID status.
```javascript
// callback (err, result)
client.getWithdrawalInfo(options, callback);

// promise
client.getWithdrawalInfo(options).then().catch();

// async/await
await client.getWithdrawalInfo(options);
```
- ``options.id`` - **required** (String) - Withdrawal id.

Example Response from server:
```json
{ 
  "time_created": 1424436465,
  "status": 2,
  "status_text": "Complete",
  "coin": "POT",
  "amount": 10000000000,
  "amountf": "100.00000000",
  "send_address": "PVtAyX2HgVmYk8BCw9NGvtaDNdkX2phrVA",
  "send_txid": "b601e7839c4c237f0fac36e93f98d648cfec402b8f8dbce617c675dac247599e" 
}
```

- ``time_created`` - The time the withdrawal request was submitted.
- ``status`` - The status of the withdrawal (-1 = Cancelled, 0 = Waiting for email confirmation, 1 = Pending, 2 = Complete).
- ``status_text`` - The status of the withdrawal in text format.
- ``coin`` - The ticker symbol of the coin for the withdrawal.
- ``amount`` - The amount of the withdrawal (in Satoshis).
- ``amountf`` - The amount of the withdrawal (as a floating point number).
- ``send_address`` - The address the withdrawal was sent to. (only in response if status == 2)
- ``send_txid`` - The coin TX ID of the send. (only in response if status == 2)

[back to top](#table)

<a name="getwithdrawalhistory" />

## Get Withdrawal History

Get withdrawal histroy

```javascript
// callback (err, result)
client.getWithdrawalHistory(options, callback);

// promise
client.getWithdrawalHistory(options).then().catch();

// async/await
await client.getWithdrawalHistory(options);
```
- ``options`` - **optional**. Any enabled currency.
- ``options.limit`` - **optional** The maximum number of withdrawals to return from 1-100. (default: 25)
- ``options.start`` - **optional** What withdrawals # to start from (for iteration/pagination.) (default: 0, starts with your newest withdrawals.)
- ``options.newer`` - **optional** Return withdrawals submitted at the given Unix timestamp or later. (default: 0)

Example response from server
```json
[
  { 
    "id": "CWBF3UECUQFCCNFIRUS73G5VON",
    "time_created": 1498437967,
    "status": 2,
    "status_text": "Complete",
    "coin": "POT",
    "amount": 100000000,
    "amountf": "1.00000000",
    "send_address": "PTVFPeSvccpdnT5PTyXrfU5XR6UShcRJYt",
    "send_txid": "1e5be68fdac7acafb68082099ba4d1ca2c881866ce8ee575202419ad1ff55bd8" 
  },
  { 
    "id": "CWBF0ZRSKG8R4ASD7JFXFIS5YH",
    "time_created": 1498429199,
    "status": 2,
    "status_text": "Complete",
    "coin": "POT",
    "amount": 10000000,
    "amountf": "0.10000000",
    "send_address": "PMmPaNBzQEmJSZ6XYSDeXYxAC8MVJx3nGM",
    "send_txid": "8d990f0a833c8c61177ed0b0a7e5ff2e3fa03cc28a9cf5d1dfb171c45b0712c3" 
  },
  ...
]
```

[back to top](#table)

<a name="development" />

## Local development
Payment notifications are not available for local development. However, there is a feature which is outside of scope of this module.
Most Coinpayment buttons [(Frontend form submissions)](https://www.coinpayments.net/merchant-tools-simple) have a bunch of handy parameters. Most handy would be: `success_url`, `cancel_url`.
Like most eCommerce systems, there are usually two endpoints, one for callback URL ( client triggered ) and POST notifications ( payment processor confirmations ). Preferably on local development, using forms requests should be enought, however staging/production environments should include notifications.

<a name="ipn" />

## Instant payment notifications
This is a separate npm package. 
[coinpayments-ipn](https://github.com/OrahKokos/coinpayments-ipn)
 

<a name="license" />

## License

The MIT License (MIT)

Copyright (c) 2015-present Marko Paroški

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[back to top](#table)

<a name="support" />

## Support/Donate

**Disclaimer**: I have no connections to the company Coinpayments.

Support the development of opensource projects.

Coinpayments merchant id ``831b8d495071e5b0e1015486f5001150``
