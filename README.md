![alt text](https://www.coinpayments.net/images/logo.png "CoinPayments")
# CoinPayments NodeJS client

[![Build Status](https://travis-ci.org/OrahKokos/coinpayments.svg?branch=master)](https://travis-ci.org/OrahKokos/coinpayments)

CoinPayments is a cloud wallet solution that offers an easy way to integrate a checkout system for numerous cryptocurrencies. Coinpayments now also offers coin conversion via Shapeshift.io.
For more information visit their website [here](https://www.coinpayments.net/).

## Installation

No deps, clean nodejs.

```npm install coinpayments```

<a name="table" />

Table of contents
=================

* [Setup](#setup)
* [API reference](#reference)
  * [Init](#init)
  * [Get Basic Account Information](#getbasicinfo)
  * [Get Profile](#getprofile)
  * [Get Tag list](#gettaglist)
  * [Claim Tag](#claimtag)
  * [Update Tag Profile](#updatetagprofile)
  * [Get Deposit Address](#getdeposit)
  * [Get Callback Address](#getcallback)
  * [Rates](#rates)
  * [Balances](#balances)
  * [Create Transaction](#createtransaction)
  * [Get Transaction Info](#gettx)
  * [Get Transaction Multi](#gettxmulti)
  * [Get Transactions List](#gettxlist)
  * [Coinver Coins](#convercoins)
  * [Create Transfer](#createtransfer)
  * [Create Withdrawal](#createwithdrawal)
  * [Mass Withdrawal](#createmasswithdrawal)
  * [Get Withdrawal Info](#getwithdrawalinfo)
  * [Get Withdrawal History](#getwithdrawalhistory)
* [IPN](#ipn)
  * [Automated IPN](#autoipn)
  * [IPN HTTP(S) POST](#httpipn)
* [Development](#dev)
* [Testing](#testing)
* [License](#license)
* [Support/Donate](#support)

<a name="setup" />

## Setup

- Create an account on [www.coinpayments.net](https://www.coinpayments.net/index.php?ref=831b8d495071e5b0e1015486f5001150)
- Go to **My Account -> Coin Acceptance Settings**
- Check the coins you wish to accept.
  *  **Tips:**
    * You can setup your payment address, so you can use coinpayments as a pass thru service, rather then a cloud wallet (Payout mode ASAP/Nightly).
    * **Payout Made** (To Balance/ASAP/Nightly)
      * **To Balance:** Received payments are stored in your account for later withdrawal at your leisure. 
      * **ASAP:** Received payments are sent to the address you specify as soon as they are received and confirmed.
      * **Nightly:** Received payments are grouped together and sent daily (at approx. midnight EST GMT -0500). The main benefit of this options is it will save you coin TX fees
    * **Discount (%)**
      * **Positive Numbers:** Gives buyers a discount for paying with a coin. Good promotional tool if you want to give extra support to a particular coin.
      * **Negative Numbers:** Adds a certain percentage for paying with a coin. This could be used to cover your crypto/fiat conversation costs, make adjustments to match your local exchange, etc.
* Go to **My Account -> API Keys** , generate API key pair 
* Edit permissions on the generated **API KEY** and enable all options

[back to top](#table)

<a name="reference" />

## API Reference 

<a name="init" />

## Init

```javascript
var Coinpayments = require('coinpayments');
var client = new Coinpayments(options); 
```
- ``options`` ***required***
- ``options.key`` - ***required*** Public API key
- ``options.secret`` - ***required*** Private API key
- ``options.autoIpn`` - ***optional*** Notification system for local development. More on IPNs (Instant Payment Notifications) here. (default ``false``)
- ``options.ipnTime`` - ***optional*** (Requires ``autoIpn`` to be ``true``) Set the loop time for server querying, time is represented in seconds (default ``30`` seconds) 

[back to top](#table)

<a name="getbasicinfo" />

## Get Basic Account Information

Get your basic account information.
```javascript
client.getBasicInfo(callback)
```
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example response from server
```javascript
{ 
  uername: 'OrahKokos',
  username: 'OrahKokos',
  merchant_id: '831b8d495071e5b0e1015486f5001150',
  email: 'marko.paroski.ns@gmail.com',
  public_name: 'OrahKokos',
  time_joined: 1417611250 
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
client.getProfile(pbntag, callback)
```
- ``pbntag`` - ***required*** Coinpayments merchant pbntag.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``).

Example request
```javascript
client.getProfile('orahkokos', function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
{ 
  pbntag: '$orahkokos',
  merchant: '831b8d495071e5b0e1015486f5001150',
  profile_name: '',
  profile_url: '',
  profile_email: '',
  profile_image: '',
  member_since: 1417611250,
  feedback: 
   { pos: 160,
     neg: 0,
     neut: 0,
     total: 160,
     percent: '100%',
     percent_str: '<span style="color: #5cb85c;"><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i></span> <span style="color: #5cb85c;">(100%)</span>' } }
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

Get $PayByName Tag List

```javascript
client.tagList(callback)
```
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.tagList(function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
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
client.claimTag(options, callback)
```
- ``options`` - ***required***.
- ``options.tagid`` - ***required***. Unique tag ID.
- ``options.name`` - ***required*** Name for the tag; for example a value of 'Apple' would be the PayByName tag $Apple. Make sure to use the case you want the tag displayed with.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.claimTag({
  tagid: 'string',
  name: 'some_name'
}, function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
[]
```

[back to top](#table)

<a name="updatetagprofile" />

## Update Tag Profile

Update $PayByName Profile

```javascript
client.updateTagProfile(options, callback)
```
- ``options`` - ***required***. Any enabled currency.
- ``options.tagid`` - ***required***. Unique tag ID
- ``options.name`` - ***optional***. Name for the profile. If field is not supplied the current name will be unchanged.
- ``options.email`` - ***optional***. Email for the profile. If field is not supplied the current email will be unchanged.
- ``options.url`` - ***optional***. Website URL for the profile. If field is not supplied the current URL will be unchanged.
- ``options.image`` - ***NOT SUPPORTED***. HTTP POST with a JPG or PNG image 250KB or smaller. This is an actual "multipart/form-data" file POST and not a URL to a file. If field is not supplied the current image will be unchanged.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.updateTagProfile({
  tagid: 'string',
  name: 'some_name'
}, function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
[]
```

[back to top](#table)

<a name="getdeposit" />

## Get Deposit Address

Get a deposit address. This action does not include a fee and will not trigger IPN
```javascript
client.getDepositAddress(currency, callback)
```
- ``currency`` - ***required***. Any enabled currency.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.getDepositAddress("BTC", function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
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
client.getCallbackAddress(currency, callback)
```
- ``currency`` - ***required***. Any enabled currency.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.getCallbackAddress("BTC", function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
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
client.rates(options,callback)
```
- ``options`` - ***optional***
- ``options.short`` - ***optional*** If set to ``1``, the response won't include the full coin names and number of confirms needed to save bandwidth. (default ``0``)
- ``options.accepted`` - ***optional*** If set to ``1``, the response will include only those coins which are enabled for acceptance on your Coin Acceptance Page. (default ``0``)
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.rates(function(err,result){
  console.log(result);
});
```
Example Response from server:
```javascript
{ BTC: 
   { is_fiat: 0,
     rate_btc: '1.000000000000000000000000',
     last_update: '1375473661',
     tx_fee: '0.00020000',
     status: 'online',
     name: 'Bitcoin',
     confirms: '2',
     can_convert: 1,
     capabilities: [ 'payments', 'wallet', 'transfers', 'convert' ] },
  LTC: 
   { is_fiat: 0,
     rate_btc: '0.015797960000000000000000',
     last_update: '1498429562',
     tx_fee: '0.00100000',
     status: 'online',
     name: 'Litecoin',
     confirms: '3',
     can_convert: 1,
     capabilities: [ 'payments', 'wallet', 'transfers', 'convert' ] },
  USD: 
   { is_fiat: 1,
     rate_btc: '0.000401024662686050000000',
     last_update: '1498429562',
     tx_fee: '0.00000000',
     status: 'online',
     name: 'United States Dollar',
     confirms: '1',
     can_convert: 0,
     capabilities: [] },
  CAD: 
   { is_fiat: 1,
     rate_btc: '0.000289915841669960000000',
     last_update: '1498429562',
     tx_fee: '0.00000000',
     status: 'online',
     name: 'Canadian Dollar',
     confirms: '1',
     can_convert: 0,
     capabilities: [] },
  EUR: 
   { is_fiat: 1,
     rate_btc: '0.000444962329796210000000',
     last_update: '1498429562',
     tx_fee: '0.00000000',
     status: 'online',
     name: 'Euro',
     confirms: '1',
     can_convert: 0,
     capabilities: [] },
  XRP: 
   { is_fiat: 0,
     rate_btc: '0.000101350000000000000000',
     last_update: '1498429562',
     tx_fee: '0.00001000',
     status: 'online',
     name: 'Ripple',
     confirms: '30',
     can_convert: 1,
     capabilities: [ 'payments', 'wallet', 'transfers', 'dest_tag', 'convert' ] },
  ...
  ...
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
- ``can_convert`` - Is currency convertable on [Shapeshift.io](https://shapeshift.io).
- ``capabilities`` - Offered services for the given cryptocurrency. Can be: ```"payments"```, ```"wallet"```, ```"transfers"```, ```"dest_tag"```, ```"convert"```

[back to top](#table)

<a name="balances" />

## Balances
---
Coin Balances
```javascript
client.balances(options,callback)
```
- ``options`` - ***optional***
- ``options.all`` - ***optional*** If set to ``1``, the response will include all coins, even those with 0 balance. (default ``0``)
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.balances(function(err,result){
  console.log(result);
});
```
Example Response from server:
```javascript
{
  BTC: { 
    balance: 10000000,
    balancef: '0.10000000',
    status: 'available',
    coin_status: 'online' 
  },
  POT: {
    balance: 499594333,
    balancef: '4.99594333',
    status: 'available',
    coin_status: 'online' 
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
client.createTransaction(options,callback)
```
- ``options`` - ***required***
- ``options.currency1`` - ***required*** The original currency (displayed currency) in which the price is presented 
- ``options.currency2`` - ***required*** The currency the buyer will be sending.
- ``options.amount`` - ***required*** Expected amount to pay, where the price is expressed in ``options.currency1`` 

If ``options.currency1`` is not equal to ``options.currency2`` the expected payment amount in the response of the request will auto convert to the expected amount in ``options.currency2``

- ``options.address`` - ***optional*** Address to send the funds to ( if not set, it will use the wallet address of your coinpayments cloud wallet ) **Must be payment address from** ``options.currency2`` **network** 
- ``options.buyer_name`` - ***optional*** Set buyer name for your reference
- ``options.buyer_email`` - ***optional*** Set buyer email for your reference
- ``options.item_name`` - ***optional*** Set item name for your reference, included in IPN
- ``options.item_number`` - ***optional*** Set item number for your reference, included in IPN
- ``options.invoice`` - ***optional*** Custom field, included in IPN
- ``options.custom`` - ***optional*** Custom field, included in IPN
- ``options.ipn_url`` - ***optional*** explicit URL for the IPN to send POST requests to (see [IPN HTTP POST](#httpIPN))
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request

```javascript
client.createTransaction({'currency1' : 'DOGE', 'currency2' : 'POT', 'amount' : 10},function(err,result){
  console.log(result);
});
```

Example Response from server:
```javascript
{ 
  amount: '1.21825881',
  txn_id: 'd17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c',
  address: 'PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx',
  confirms_needed: '5',
  timeout: 5400,
  status_url: 'https://www.coinpayments.net/index.php?cmd=status&id=d17a8ee84b1de669bdd0f15b38f,
  qrcode_url: 'https://www.coinpayments.net/qrgen.php?id=CPBF4COHLYGEZZYIGFDKFY9NDP&key=90e5561c1e8cd4452069f7726d3e0370'
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
Query the server for ``txn_id`` and returns the status of the payment. 
```javascript
client.getTx(txn_id,callback)
```
- ``txn_id`` - ***required*** - transaction hash value 
- ``callback`` - callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.getTx('txn_id', function(err,result){
  console.log(result);
});
```
Example Response from server:
```javascript
{ 
  time_created: 1424436678,
  time_expires: 1424442078,
  status: 0,
  status_text: 'Waiting for buyer funds...',
  type: 'coins',
  coin: 'POT',
  amount: 121700023,
  amountf: '1.21700023',
  received: 0,
  receivedf: '0.00000000',
  recv_confirms: 0,
  payment_address: 'PWP4gKLRLVQv9dsvcN4sZn5pZaKQGothXm' 
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
client.getTxMulti(txn_id_array, callback)
```
- ``txn_id_array`` - ***required***. Any enabled currency.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
let txn_id_array = [ 
  'CPBF23CBUSHKKOMV1OPMRBNEFV',
  'CPBF4COHLYGEZZYIGFDKFY9NDP',
  'CPBF6BFPJTSLC3Z49CT82NVYJ8'
];
client.getTxMulti(txn_id_array, function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
'CPBF23CBUSHKKOMV1OPMRBNEFV': { 
  error: 'ok',
  amount: '1.21825881',
  txn_id: 'd17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c',
  address: 'PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx',
  confirms_needed: '5',
  timeout: 5400,
  status_url: 'https://www.coinpayments.net/index.php?cmd=status&id=d17a8ee84b1de669bdd0f15b38f,
  qrcode_url: 'https://www.coinpayments.net/qrgen.php?id=CPBF4COHLYGEZZYIGFDKFY9NDP&key=90e5561c1e8cd4452069f7726d3e0370'
},
'CPBF4COHLYGEZZYIGFDKFY9NDP': {...},
...
```
- ``Object.keys(response) -> ids`` - Transaction IDs
- ``response[id]`` - Object same as getTx with transaction information.

[back to top](#table)

<a name="gettxlist" />

## Get Transaction LIST

Get a list of transaction ids.

```javascript
client.getTxList(options, callback)
```
- ``options`` - ***optional***. Any enabled currency.
- ``options.limit`` - The maximum number of transaction IDs to return from 1-100. (default: 25)
- ``options.start`` - What transaction # to start from (for iteration/pagination.) (default: 0, starts with your newest transactions.)
- ``options.newer`` - Return transactions started at the given Unix timestamp or later. (default: 0)
- ``options.all`` - By default we return an array of TX IDs where you are the seller for use with get_tx_info_multi or get_tx_info. If all is set to 1 returns an array with TX IDs and whether you are the seller or buyer for the transaction.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.getTxList(function (err, response) {
  console.log(response)
})

```

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

<a name="convertcoins" />

## Convert Coins

Convert coins. Coinpayments utilizes [Shapeshift.io](https://shapeshift.io) services.

```javascript
client.convertCoins(options, callback)
```
- ``options`` - ***required***.
- ``options.amount`` - ***required***. The amount convert in the 'from' currency below.
- ``options.from`` - ***required*** From currency.
- ``options.to`` - ***required*** To currency.
- ``options.address`` - ***optional*** The address to send the funds to. If blank or not included the coins will go to your CoinPayments Wallet.
- ``options.dest_tag`` - ***optional*** The destination tag to use for the withdrawal (for Ripple.) If 'address' is not included this has no effect.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.convertCoins({
  amount: 1,
  from: "POT",
  to: "LTC"
}, function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
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
client.createTransfer(options, callback)
```
- ``options`` - ***required***. Any enabled currency.
- ``options.amount`` - ***required*** The amount of the transfer in the currency below.
- ``options.currency`` - ***required*** The cryptocurrency to withdraw. (BTC, LTC, etc.)
- ``options.merchant`` - ***optional*** The merchant ID to send the funds to, either this OR pbntag must be specified. Remember: this is a merchant ID and not a username.
- ``options.pbntag`` - ***optional*** The $PayByName tag to send the funds to, either this OR merchant must be specified.
- ``options.auto_confirm`` - ***optional*** If set to ``0`` the withdrawal will require an email confirmation in order for withdraw funds to go forth. (default ``1``)
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.createTransfer({
  amount: 0.1,
  currency: "LTC",
  pbntag: 'orahkokos'
}, function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
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
client.createWithdrawal(options,callback)
```
- ``options`` - ***required***
- ``options.amount`` - ***required*** The amount to withdraw
- ``options.currency`` - ***required*** The currency to withdraw  
- ``options.address`` - ***required*** Wallet address to send the funds to. **Must be wallet address from the same network as **``options.currency``
- ``options.auto_confirm`` - ***optional*** If set to ``0`` the withdrawal will require an email confirmation in order for withdraw funds to go forth. (default ``1``)
- ``callback`` - callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.createWithdrawal({'currency' : 'POT', 'amount' : 10, 'address': 'INSERT_WALLET_ADDRESS'},function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{
  id: '98a5ff631da2089985594789dc9fb85648596599816ac8ce1ce00fd082798967',
  amount: '1.00000000',
  status: 0 
}
```

- ``id`` - The CoinPayments.net withdrawal ID.
- ``amount`` - Amount to be withdrawn
- ``status`` - 0 or 1. 0 = Withdrawal created, waiting for email confirmation. 1 = Withdrawal created with no email confirmation needed

[back to top](#table)

<a name="createmasswithdrawal" />

## Create Mass Withdrawal

Create a a mass withdrawal

```javascript
client.createMassWithdrawal(withdrawalArray, callback)
```
- ``withdrawalArray`` - ***required***. An array with withdrawal object.
- ``withdrawalArray[n].amount`` - ***required***. Every withdrawal object needs to have amount of currency below.
- ``withdrawalArray[n].address`` - ***required***. Every withdrawal object needs to have address to withdraw funds to.
- ``withdrawalArray[n].currency`` - ***required***. Every withdrawal object needs to have currency.
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
let withdrawalArray = [
  {
    amount: 1,
    currency: "POT",
    address: "SomePotcoinAddress"
  },
  {
    amount: 1000,
    currency: "LTC",
    address: "SomeLitecoinAddress"
  }
];
client.createMassWithdrawal(withdrawalArray, function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
{ 
  wd1: { 
    error: 'ok',
    id: 'CWBF3UECUQFCCNFIRUS73G5VON',
    status: 1,
    amount: '1.00000000' 
  },
  wd2: { error: 'That amount is larger than your balance!' }
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
client.getWithdrawalInfo(id, callback)
```
- ``id`` - ***required*** (String) - Withdrawal id.
- ``callback`` - callback function, accepts 2 values (``error``,``result``)


```javascript
client.getWithdrawalInfo('some_id',function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{ 
  time_created: 1424436465,
  status: 2,
  status_text: 'Complete',
  coin: 'POT',
  amount: 10000000000,
  amountf: '100.00000000',
  send_address: 'PVtAyX2HgVmYk8BCw9NGvtaDNdkX2phrVA',
  send_txid: 'b601e7839c4c237f0fac36e93f98d648cfec402b8f8dbce617c675dac247599e' 
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
client.getWithdrawalHistory(options, callback)
```
- ``options`` - ***optional***. Any enabled currency.
- ``options.limit`` - The maximum number of withdrawals to return from 1-100. (default: 25)
- ``options.start`` - What withdrawals # to start from (for iteration/pagination.) (default: 0, starts with your newest withdrawals.)
- ``options.newer`` - Return withdrawals submitted at the given Unix timestamp or later. (default: 0)
- ``callback`` - ***required*** callback function, accepts 2 values (``error``,``result``)

Example request
```javascript
client.getWithdrawalHistory(function (err, response) {
  console.log(response)
})

```

Example response from server
```javascript
[
  { 
    id: 'CWBF3UECUQFCCNFIRUS73G5VON',
    time_created: 1498437967,
    status: 2,
    status_text: 'Complete',
    coin: 'POT',
    amount: 100000000,
    amountf: '1.00000000',
    send_address: 'PTVFPeSvccpdnT5PTyXrfU5XR6UShcRJYt',
    send_txid: '1e5be68fdac7acafb68082099ba4d1ca2c881866ce8ee575202419ad1ff55bd8' 
  },
  { 
    id: 'CWBF0ZRSKG8R4ASD7JFXFIS5YH',
    time_created: 1498429199,
    status: 2,
    status_text: 'Complete',
    coin: 'POT',
    amount: 10000000,
    amountf: '0.10000000',
    send_address: 'PMmPaNBzQEmJSZ6XYSDeXYxAC8MVJx3nGM',
    send_txid: '8d990f0a833c8c61177ed0b0a7e5ff2e3fa03cc28a9cf5d1dfb171c45b0712c3' 
  },
  ...
]
```

[back to top](#table)

<a name="ipn" />

## IPN ( Instant Payment Notification )
----
The IPN system will notify your server when you receive a payment and when a payment status changes. This is a easy and useful way to integrate our payments into your software to automate order completion.

IPN can be utilized in two ways using this lib.


[back to top](#table)

<a name="autoIPN" />

## Automated IPN ( for local development )
---
<span style="color: red"> Do not use this in ``PRODUCTION``</span>.
This method is used if you set the inital ``options.autoIpn`` to ``true``. This is unitizing ``getTxMulti`` to automatically query the server for payment statuses.

```javascript
var Coinpayments = require('coinpayments');

var client = new Coinpayments({
  key: process.env.COINPAYMENTS_API_KEY,
  secret: process.env.COINPAYMENTS_API_SECRET,
  autoIpn: true
});
                          
// client.createTransaction(...) Make transaction(s)

client.on('autoipn', function(data){
    // Handle data
    // data = getTxMulti
});
```
**General IPN rules**
- Reports only if partial or complete payment is made (partial payment is reported once and will report again if the partial amount received has increased or payment is complete)

- ``autoipn`` - Event fires every (default ``30`` seconds) after a transaction is made. ``data`` is equivalent to getTxMulti
- After all transactions are complete, autoipn stops until new transactions are in queue

[back to top](#table)

<a name="httpIPN" />

## IPN HTTP(S) POST
---
This is a coinpayments.net service to send HTTP(S) POST requests to the predefined or selected location. In order to enable this option go to **My Account -> Account Settings**, add **IPN secret** ( strong password, preferably hash ) and set **IPN URL** to where you will handle IPNs. 

On your server, you can use express middleware to handle incoming IPN POST requests, which is bundled up in this package. Here is an example server.
```javascript
let 
  CoinPayments = require('../lib'),
  express      = require('express'),
  bodyParser   = require('body-parser');
    
let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

let events = CoinPayments.events;

let middleware = [
  CoinPayments.ipn({
    'merchantId': process.env.COINPAYMENTS_MERCHANT_ID,
    'merchantSecret': process.env.COINPAYMENTS_MERCHANT_SECRET
  }), 
  function (req, res, next) {
    // Handle via middleware
    console.log(req.body);
  }]

app.use('/', middleware);



// Handle via instance
CoinPayments.on('ipn_fail', function(data){
    // Handle failed transaction
    console.log("IPN FAIL");
    console.log(data);
});
CoinPayments.on('ipn_pending', function(data){
    // Handle pending payment
    console.log("IPN PENDING");
    console.log(data);
});
CoinPayments.on('ipn_complete', function(data){
    // Handle completed payment
    console.log("IPN COMPLETE");
    console.log(data);
});


// Handle via static field ( can be used in other files, aka no need to init )
events.on('ipn_fail', function(data){
    // Handle failed transaction
    console.log("IPN FAIL");
    console.log(data);
});
events.on('ipn_pending', function(data){
    // Handle pending payment
    console.log("IPN PENDING");
    console.log(data);
});
events.on('ipn_complete', function(data){
    // Handle completed payment
    console.log("IPN COMPLETE");
    console.log(data);
});

app.listen(process.env.PORT || 1337, () => {
  console.log("APP listening on port", process.env.PORT || 1337)
});
```
**General IPN rules**
- Reports transactions that were just made (status=0) after that it reports any changes to the payment amount/ received confirmations and lastly completed transactions
- Errors are passed via ``next(err)`` in express. ``err === 'COINPAYMENTS_INVALID_REQUEST'``
- IPN Retries: If there is an error sending your server an IPN, we will retry up to 5 times. Because of this you are not guaranteed to receive every IPN (if all 5 tries fail) or that your server will receive them in order.

- ``ipn_fail`` - Payment failed/canceled
- ``ipn_pending`` - Partial payment report only
- ``ipn_complete`` - Payment complete

Example responses

- Pending:

```
{ 
  ipn_version: '1.0',
  ipn_id: '0aa2fe7965a5318e3f52bb4419c35fa3',
  ipn_mode: 'hmac',
  merchant: '831b8d495071e5b0e1015486f5001150',
  ipn_type: 'api',
  txn_id: '1c592e4ef12297759770c9656f2d509b9135ed4f5f124bd4f2bf1970ac849e83',
  status: '0',
  status_text: 'Waiting for buyer funds...',
  currency1: 'DOGE',
  currency2: 'POT',
  amount1: '100',
  amount2: '11.92422732',
  fee: '0.059621',
  buyer_name: 'CoinPayments API',
  received_amount: '0',
  received_confirms: '0' 
}

```
```
{ 
  ipn_version: '1.0',
  ipn_id: '40c7b011f7cfc7d39e03a35a72dd6d5f',
  ipn_mode: 'hmac',
  merchant: '831b8d495071e5b0e1015486f5001150',
  ipn_type: 'api',
  txn_id: '1c592e4ef12297759770c9656f2d509b9135ed4f5f124bd4f2bf1970ac849e83',
  status: '0',
  status_text: 'Waiting for buyer funds... (11.92422732/11.92422732 received, waiting for confirms...)',
  currency1: 'DOGE',
  currency2: 'POT',
  amount1: '100',
  amount2: '11.92422732',
  fee: '0.059621',
  buyer_name: 'CoinPayments API',
  received_amount: '11.92422732',
  received_confirms: '0' 
}

```
```
{ 
  ipn_version: '1.0',
  ipn_id: '507d558865aa0a160c3fb638d4b63df8',
  ipn_mode: 'hmac',
  merchant: '831b8d495071e5b0e1015486f5001150',
  ipn_type: 'api',
  txn_id: '1c592e4ef12297759770c9656f2d509b9135ed4f5f124bd4f2bf1970ac849e83',
  status: '1',
  status_text: 'Funds received and confirmed, sending to you shortly...',
  currency1: 'DOGE',
  currency2: 'POT',
  amount1: '100',
  amount2: '11.92422732',
  fee: '0.059621',
  buyer_name: 'CoinPayments API',
  received_amount: '11.92422732',
  received_confirms: '5' 
}

```

- Complete:

```
{ 
  ipn_version: '1.0',
  ipn_id: 'dd6fd76efab79f95e9bafc0dec85e158',
  ipn_mode: 'hmac',
  merchant: '831b8d495071e5b0e1015486f5001150',
  ipn_type: 'api',
  txn_id: '1c592e4ef12297759770c9656f2d509b9135ed4f5f124bd4f2bf1970ac849e83',
  status: '100',
  status_text: 'Complete',
  currency1: 'DOGE',
  currency2: 'POT',
  amount1: '100',
  amount2: '11.92422732',
  fee: '0.059621',
  net: '11.86460632',
  buyer_name: 'CoinPayments API',
  received_amount: '11.92422732',
  received_confirms: '5' 
}

```

- ``ipn_version`` - 1.0
- ``ipn_type`` - 'api'
- ``ipn_mode`` - 'hmac'
- ``ipn_id`` - The unique identifier of this IPN
- ``merchant`` - Your merchant ID (you can find this on the My Account page).
- ``status`` - Payment status
- ``status_text`` - Status expressed in human readable text.
- ``txn_id`` - The CoinPayments.net transaction ID.
- ``currency1`` - The original currency/coin submitted.
- ``currency2`` - The coin the buyer paid with.
- ``amount1`` - The amount of the payment in your original currency/coin.
- ``amount2`` - The amount of the payment in the buyer's coin.
- ``fee`` - The fee on the payment in the buyer's selected coin.
- ``net`` - ``amount2`` - ``fee``
- ``buyer_name`` - Buyer name
- ``received_amount`` - The amount of currency2 received at the time the IPN was generated.
- ``received_confirms`` - The number of confirms of 'received_amount' at the time the IPN was generated.

[back to top](#table)

<a name="dev" />

## Development

Babel ES6 -> ES5

- Clone repo
- ``npm install``
- ``npm run build`` - One time build.
- ``npm run watch`` - One time build + watcher
- Every new feature needs a test

[back to top](#table)

<a name="testing" />

## Testing

<span style="color: darkyellow">Warning: Please execute tests with Litecoin Testnet. Or be careful with your crypto. </span>

- Set the following environemntal variables:
  - ``COINPAYMENTS_API_KEY_1`` - client API key.
  - ``COINPAYMENTS_API_SECRET_1`` - client API secret.
  - ``COINPAYMENTS_API_KEY_2`` - merchant API key.
  - ``COINPAYMENTS_API_SECRET_2`` - merchant API secret.
  - ``COINPAYMENTS_CURRENCY`` - Currency that will be used during testing.
  - ``COINPAYMENTS_FIXED_AMOUNT`` - Amount of ``COINPAYMENTS_CURRENCY`` to use in tests (transactions, coversions...)
  - ``COINPAYMENTS_CURRENCY_CONVERT`` - Currency to convert to
  - ``COINPAYMENTS_MERCHANT_PBNTAG`` - Merchant pbntag, for testing transfers
  - ``COINPAYMENTS_MERCHANT_ID`` - Merchant ID, for testing transfers
- ``npm test``

[back to top](#table)

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

Support the development of opensource projects.

Coinpayments pbntag ``$orahkokos``

Coinpayments merchant id ``831b8d495071e5b0e1015486f5001150``