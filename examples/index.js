const
  express      = require(`express`),
  env       = require(`dotenv`),
  bodyParser   = require(`body-parser`);

const CoinPayments = require(`../lib`);

const app = express();

env.config();

const client = new CoinPayments({
  key: process.env.COINPAYMENTS_KEY_1,
  secret: process.env.COINPAYMENTS_SECRET_1
});

const events = CoinPayments.events;

app.use(bodyParser.urlencoded({ extended: true }));

const middleware = [
  CoinPayments.ipn({
    'merchantId': process.env.COINPAYMENTS_MERCHANT_ID,
    'merchantSecret': process.env.COINPAYMENTS_MERCHANT_SECRET
  }),
  function (req, res, next) {
    // Handle via middleware
    console.log(req.params);
    console.log(req.body);
  }];

app.use(process.env.IPN_ENDPOINT, middleware);


// Handle via instance
client.on(`ipn_fail`, function(data){
  // Handle failed transaction
  console.log(`IPN FAIL`);
  console.log(data);
});
client.on(`ipn_pending`, function(data){
  // Handle pending payment
  console.log(`IPN PENDING`);
  console.log(data);
});
client.on(`ipn_complete`, function(data){
  // Handle completed payment
  console.log(`IPN COMPLETE`);
  console.log(data);
});


// Handle via static field ( can be used in other files, aka no need to init )
events.on(`ipn_fail`, function(data){
  // Handle failed transaction
  console.log(`IPN FAIL`);
  console.log(data);
});
events.on(`ipn_pending`, function(data){
  // Handle pending payment
  console.log(`IPN PENDING`);
  console.log(data);
});
events.on(`ipn_complete`, function(data){
  // Handle completed payment
  console.log(`IPN COMPLETE`);
  console.log(data);
});

app.listen(process.env.PORT || 1337, () => {
  console.log(`APP listening on port`, process.env.PORT || 1337);
});