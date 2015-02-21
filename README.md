![alt text](https://www.coinpayments.net/images/logo.png "CoinPayments")
# CoinPayments NodeJS client
----
CoinPayments is a cloud wallet solution that offers an easy way to integrate a checkout system for numerous cryptocurrencies.
For more information visit their website [here](https://www.coinpayments.net/).

## Installation

No deps, clean nodejs.

```$ npm install coinpayments```

<a name="table" />
## Content
----
- [Setup](#setup)
- [API reference](#reference)
  - [Init](#init)
  - [Rates](#rates)
  - [Balances](#balances)
  - [Create Transaction](#createT)
  - [Create Withdrawal](#createW)
  - [Get TX Info](#getTx)
  - [Get Withdrawal Info](#getW)
  - [Get TX Multi](#getTxM)
- [IPN](#ipn)
  - [Automated IPN](#autoIPN)
  - [IPN HTTP(S) POST](#httpIPN)

<a name="setup" />
## Setup
----
- Create a profile on [coin-payments.net](https://www.coinpayments.net/)
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

[back to top](#table)

<a name="reference" />
## API Reference 
---
<a name="init" />
### Init
```javascript
var coinPay = require('coinpayments');
var client = new coinPay(options); 
```
Argument (``options``) ***required***
- ``options.key`` - ***required*** Public API key
- ``options.secret`` - ***required*** Private API key
- ``options.autoIpn`` - ***optional*** Notification system for local development. More on IPNs (Instant Payment Notifications) here. (default ``false``)
- ``options.ipnTime`` - ***optional*** (Requires ``autoIpn`` to be ``true``) Set the loop time for server querying, time is represented in seconds (default ``30`` seconds) 

[back to top](#table)
<a name="rates" />
### Rates
----
Get Exchange Rates / Coin List
```javascript
client.rates(options,callback)
```
Argument (``options``) ***optional***
- ``options.short`` - ***optional*** If set to ``1``, the response won't include the full coin names and number of confirms needed to save bandwidth. (default ``0``)
- ``options.accepted`` - ***optional*** If set to ``1``, the response will include only those coins which are enabled for acceptance on your Coin Acceptance Page. (default ``0``)

Argument (``callback``) - ***required*** callback function, accepts 2 values (``error``,``result``)

Example - no options passed
```javascript
client.rates(function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{ 
  BTC: { 
    is_fiat: 0,
    rate_btc: '1.000000000000000000000000',
    last_update: '1375473661',
    name: 'Bitcoin',
    confirms: '2' 
  },
  LTC: { 
    is_fiat: 0,
    rate_btc: '0.007564621935351900000000',
    last_update: '1424432461',
    name: 'Litecoin',
    confirms: '3' 
  },
  USD: { 
    is_fiat: 1,
    rate_btc: '0.004141389030519300000000',
    last_update: '1424432461',
    name: 'United States Dollar',
    confirms: '10' 
  },
  EUR: { 
    is_fiat: 1,
    rate_btc: '0.004674070535169200000000',
    last_update: '1424432461',
    name: 'Euro',
    confirms: '10' 
  },
  XRP: { 
    is_fiat: 0,
    rate_btc: '0.000054665565914241000000',
    last_update: '1424432461',
    name: 'Ripple',
    confirms: '30' 
  },
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
- ``last_update`` - The last time the exchange rate was updated. This is a standad Unix timestamp.


[back to top](#table)
<a name="balances" />
### Balances
---
Get current balances
```javascript
client.balances(options,callback)
```
Argument (``options``) ***optional***

Argument (``options.all``) ***optional*** If set to ``1``, the response will include all coins, even those with 0 balance. (default ``0``)

Argument (``callback``) - ***required*** callback function, accepts 2 values (``error``,``result``)

Example - no options passed
```javascript
client.balances(function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{
  BTC: { 
    balance: 10000000,
    balancef: '0.10000000'
  },
  POT: {
    balance: 499594333,
    balancef: '4.99594333'
  }
}
```

- ``balance`` - The coin balance as an integer (in Satoshis).
- ``balancef`` - The coin balance as a floating point number.

[back to top](#table)
<a name="createT" />
### Create Transaction
---
Creates a tansaction (order) and returns all neccessery information for the client to fill (generated address where to send coins, payment timeout time, amount... etc) in order for the transaction to be complete. 
```javascript
client.createTransaction(options,callback)
```
Argument (``options``) ***required***
- ``options.currency1`` - ***required*** The original currency (displayed currency) in which the price is presented 
- ``options.currency2`` - ***required*** The currency the buyer will be sending.
  - If ``options.currency1`` is not equal to ``options.currency2`` the expected payment amount in the response of the request will auto convert to the expected amount in ``options.currency2``  
- ``options.amount`` - ***required*** Expected amount to pay, where the price is expressed in ``options.currency1`` 
- ``options.address`` - ***optional*** Address to send the funds to ( if not set, it will use the wallet address of your coinpayments cloud wallet ) **Must be payment address from** ``options.currency2`` **network** 
- ``options.buyer_name`` - ***optional*** Set buyer name for your reference
- ``options.buyer_email`` - ***optional*** Set buyer email for your reference
- ``options.item_name`` - ***optional*** Set item name for your reference, included in IPN
- ``options.item_number`` - ***optional*** Set item number for your reference, included in IPN
- ``options.invoice`` - ***optional*** Custom field, included in IPN
- ``options.custom`` - ***optional*** Custom field, included in IPN
- ``options.ipn_url`` - ***optional*** explicit URL for the IPN to send POST requests to (see [IPN HTTP POST](#httpIPN))

Argument (``callback``) - callback function, accepts 2 values (``error``,``result``)

Example - no options passed
```javascript
client.createTransaction({'currency1' : 'DOGE', 'currency2' : 'POT', 'amount' : 10},function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{ 
  amount: '1.21825881',
  txn_id: 'd17a8ee84b1de669bdd0f15b38f20a7e9781d569d20c096e49983ad9ad40ce4c',
  address: 'PVS1Xo3xCU2MyXHadU2EbhFZCbnyjZHBjx',
  confirms_needed: '5',
  timeout: 5400,
  status_url: 'https://www.coinpayments.net/index.php?cmd=status&id=d17a8ee84b1de669bdd0f15b38f
}
```

- ``amount`` - The amount for the buyer to send in the destination currency (currency2).
- ``address`` - The address the buyer needs to send the coins to.
- ``txn_id`` - The CoinPayments.net transaction ID.
- ``confirms_needed`` - The number of confirms needed for the transaction to be complete.
- ``timeout`` - How long the buyer has to send the coins and have them be confirmed in seconds.
- ``status_url`` - A URL where the buyer can view the payment progress and leave feedback for you.

[back to top](#table)
<a name="createW" />
### Create Withdrawal
---
Makes a withdrawal of funds from server to a determined wallet address.
```javascript
client.createWithdrawal(options,callback)
```
Argument (``options``) ***required***
- ``options.amount`` - ***required*** The amount to withdraw
- ``options.currency`` - ***required*** The currency to withdraw  
- ``options.address`` - ***required*** Wallet address to send the funds to. **Must be wallet address from the same network as **``options.currency``
- ``options.auto_confirm`` - ***optional*** If set to ``1`` the withdrawal will not require an email confirmation in order for withdraw funds to go forth. (default ``0``)

Argument (``callback``) - callback function, accepts 2 values (``error``,``result``)

Example - no options passed
```javascript
client.createWithdrawal({'currency' : 'POT', 'amount' : 10, 'address': 'INSERT_WALLET_ADDRESS'},function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{
  id: '98a5ff631da2089985594789dc9fb85648596599816ac8ce1ce00fd082798967',
  status: 0 
}
```

- ``id`` - The CoinPayments.net withdrawal ID.
- ``status`` - 0 or 1. 0 = Withdrawal created, waiting for email confirmation. 1 = Withdrawal created with no email confirmation needed

[back to top](#table)
<a name="getTx" />
### Get TX Info
---
Query the server for ``txn_id`` and returns the status of the payment. 
```javascript
client.getTx(txn_id,callback)
```
Argument (``txn_id``) ***required*** - transaction hash value 

Argument (``callback``) - callback function, accepts 2 values (``error``,``result``)

Example - no options passed
```javascript
client.getTx('txn_id',function(err,result){
  console.log(result);
});
```
Example Response from server:
```
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
<a name="gitW" />
### Get Withdrawal Info
---
Query the server for TX ( transaction tx ) and returns the status of the payment. 
```javascript
client.getWithdrawalInfo(id,callback)
```
Argument (``id``) ***required*** (String) - Withdrawal id 

Argument (``callback``) - callback function, accepts 2 values (``error``,``result``)

Example - no options passed
```javascript
client.getWithdrawalInfo('id',function(err,result){
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
<a name="getTxM" />
### Get TX multi
---
Query the server for multiple TXs and returns the status of all requested payments. 
```javascript
client.getTxMulti(tx_array,callback)
```
Argument (``tx_array``) ***required*** (Array) - Array of ``txn_id`` hashes

Argument (``callback``) - callback function, acceptes 2 values (``error``,``result``)

Example - no options passed
```javascript
client.getTxMulti(['txn_id_1', 'txn_id_2', 'txn_id_3'],function(err,result){
  console.log(result);
});
```
Example Response from server:
```
{ 
  f4446219a94a562851e7d27a49c48be4d447f470b9a28fa96c35a35a1f810316: 
   { error: 'ok',
     time_created: 1424440959,
     time_expires: 1424446359,
     status: 0,
     status_text: 'Waiting for buyer funds...',
     type: 'coins',
     coin: 'POT',
     amount: 127795527,
     amountf: '1.27795527',
     received: 0,
     receivedf: '0.00000000',
     recv_confirms: 0,
     payment_address: 'PDGBHHMe3SQ8Kni8Jzkwt17y29uWrG6PFU' },
  '86f35647dc6c2f6faf6e8f1028cc0befbc790932a7c08f7e93da55d72ffabb1f': 
   { error: 'ok',
     time_created: 1424440959,
     time_expires: 1424446359,
     status: 0,
     status_text: 'Waiting for buyer funds...',
     type: 'coins',
     coin: 'POT',
     amount: 1000000000,
     amountf: '10.00000000',
     received: 0,
     receivedf: '0.00000000',
     recv_confirms: 0,
     payment_address: 'PMznjyT9biYvmbypQZ2VAaJFQJpJrPQAaP' },
  ae73f16ebd851307b9a3fa9e779324e1bf1214f92d1f65a7c9e05d46ff1b4ddf: 
   { error: 'ok',
     time_created: 1424440959,
     time_expires: 1424446359,
     status: 0,
     status_text: 'Waiting for buyer funds...',
     type: 'coins',
     coin: 'POT',
     amount: 32064355698,
     amountf: '320.64355698',
     received: 0,
     receivedf: '0.00000000',
     recv_confirms: 0,
     payment_address: 'PNxf8oU1gfmt2BqVoikoXtTrnLWxhkoDME' 
   } 
}
```
Object key is = ``txn_id``
Same fields as [getTx](#getTx), for each ``txn_id`` requested.

[back to top](#table)
<a name="ipn" />
## IPN ( Instant Payment Notification )
----
The IPN system will notify your server when you receive a payment and when a payment status changes. This is a easy and useful way to integrate our payments into your software to automate order completion.

IPN can be utilized in two ways using this lib.

Both IPN methods use ``EventEmitter`` to notify you if there is any IPN cached, however responses received are different in structure. 

[back to top](#table)
<a name="autoIPN" />
### Automated IPN ( for local development )
---
This method is used if you set the inital ``options.autoIpn`` to ``true``. This is unitizing ``getTxMulti`` to automatically query the server for payment statuses.

```javascript
var coinPay = require('coinpayments');

var client = new coinPay({
                  'key': 'API_KEY',
                  'secret': 'API_SECRET',
                  'autoIpn': true
                 });
                          
// client.createTransaction(...) Make transaction(s)

client.on('ipn_error', function(data){
    // Handle error 
});
client.on('ipn_fail', function(data){
    // Handle failed transaction
});
client.on('ipn_pending', function(data){
    // Handle pending payment
});
client.on('ipn_complete', function(data){
    // Handle completed payment
});
```
**General IPN rules**
- Reports only if partial or complete payment is made (partial payment is reported once and will report again if the partial amount received has increased or payment is complete)

- ``ipn_error`` - Error is emitted if request failed in autoIPN or response from server has returned an error
- ``ipn_fail`` - Payment failed/canceled
- ``ipn_pending`` - Partial payment report only
- ``ipn_complete`` - Payment complete

Response fields are the same as in [getTx](#getTx).

[back to top](#table)
<a name="httpIPN" />
### IPN HTTP(S) POST
---
This is a coinpayments.net service to send HTTP(S) POST requests to the predefined or selected location. In order to enable this option go to **My Account -> Account Settings**, add **IPN secret** ( strong password, preferably hash ) and set **IPN URL** to where you will handle IPNs. 

On your server, you can use express middleware to handle incoming IPN POST requests, which is bundled up in this package. Here is an example server.
```javascript
var coinPay = require('node-coin-payments'),
    express = require('express'),
    bodyParser = require('body-parser');
    
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var client = new coinPay({
                  'key': 'API_KEY',
                  'secret': 'API_SECRET'
                 });
                          
// client.createTransaction(...) Make a transaction
app.use('/handler_route', client.ipn({
                            'merchantId': 'MERCHANT_ID',
                            'merchantSecret': 'IPN SECRET'
                          }));

client.on('ipn_fail', function(data){
    // Handle failed transaction
});
client.on('ipn_pending', function(data){
    // Handle pending payment
});
client.on('ipn_complete', function(data){
    // Handle completed payment
});

app.listen(1337);
```
**General IPN rules**
- Reports transactions that were just made (status=0) after that it reports any changes to the payment amount/ received confirmations and lastly completed transactions
- Errors are passed via ``next(err)`` in express
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