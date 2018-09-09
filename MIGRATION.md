# Migration from 1.x.x -> 2.x.x

## Depreciation list
### - Deprecated **autoIpn**
This was never supposed to be a part of the module.
### - Deprecated **IPN**
Now handled by [coinpayments-ipn](https://github.com/OrahKokos/coinpayments-ipn) module. Verifing IPN requests, requires **merchantId** and **ipnSecret**, rather then API keys. Beside this point, seems like a good condidate for serverless environment. Taking these two points into considoration, the logical step would be to separate.
### - Deprecated EventEmitter inheritance
Was used to "centralize" autoIpn and IPN notifications, since both of these things are deprecated, there is no reason to keep this addition.

## Errors
Custom error class is implemented. These errors can now properlly be handled in error handlers. Refer to tests [here]() for more understanding.
```javascript
const CoinpaymentsError = require('coinpayments/lib/error');
```
## Method changes

- Most method changes are made to accept multiple options. Some endpoints started accepting more then one parameter, which resulted in breaking changes in the interface. By moving all methods to consume option objects, we ensure easy expension in case of any change in the endpoints.
- All methods now support **Promise** and **Callback**
- All methods have bound context. eg. `const { getTx } = client;`

### getProfile
From: 
```javascript 
  getProfile(String pbn_tag)
```
To:   
```javascript
  getProfile(Object options)
```

`options.pbn_tag` - Required

### getDepositAddress
From: 
```javascript 
  getDepositAddress(String currency)
```
To:   
```javascript
  getDepositAddress(Object options)
```
`options.currency` - Required


### getWithdrawalInfo
From: 
```javascript 
  getWithdrawalInfo(String id)
```
To:   
```javascript
  getWithdrawalInfo(Object options)
```
`options.id` - Required

### getCallbackAddress
From: 
```javascript 
  getCallbackAddress(String currency)
```
To:   
```javascript
  getCallbackAddress(Object options)
```
`options.currency` - Required
`options.ipn_url` - Optional

### getTx
From: 
```javascript 
  getTx(String txid)
```
To:   
```javascript
  getTx(Object options)
```
`options.txid` - Required
`options.full` - Optional

### rates
 `can_convert` in response looks to be depreceted. Covered in `capabilities` in the same response.

### createTransaction
`options.buyer_email` is now required

### convertLimits
- Added

### New documentation
[Version 2.0.0](https://github.com/OrahKokos/coinpayments/tree/version/2.0.0)