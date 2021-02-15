const _ = require('lodash');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const SMA = require('technicalindicators').SMA;
const Backtest = require('@kendelchopp/alpaca-js-backtesting')



const ticker = 'AAPL'
const alpaca = new Alpaca({
  keyId: process.env.API_KEY,
  secretKey: process.env.SECRET_API_KEY,
  paper: true,
  usePolygon: false
});

const backtest = new Backtest({
    alpaca, 
    startDate: new Date("2021-01-01"),
    endDate: new Date("2021-01-05")
})

let sma20, sma50;
let lastOrder = 'SELL';

async function initializeAverages() {
  const initialData = await alpaca.getBars(
    '1Min',
    ticker,
    {
      limit: 50,
      until: new Date()
    }
  );

  const closeValues = _.map(initialData.ticker, (bar) => bar.closePrice);

  sma20 = new SMA({ period: 20, values: closeValues });
  sma50 = new SMA({ period: 50, values: closeValues });

  console.log(`sma20: ${sma20.getResult()}`);
  console.log(`sma50: ${sma50.getResult()}`);
}

// initializeAverages();
    sma20 = new SMA({ period: 20, values: [] });
    sma50 = new SMA({ period: 50, values: [] });

// const client = alpaca.data_ws;
const client = backtest.data_ws;

client.onConnect(() => {
  client.subscribe([`alpacadatav1/AM.${ticker}`]);
//   setTimeout(() => client.disconnect(), 6000*1000);
});

client.onStockAggMin((subject, data) => {
  const nextValue = data.closePrice;

  const next20 = sma20.nextValue(nextValue);
  const next50 = sma50.nextValue(nextValue);

//   console.log(`next20: ${next20}`);
//   console.log(`next50: ${next50}`);
   
    let algorithm = next20 < next50;

  if (algorithm && lastOrder !== 'BUY') {
    backtest.createOrder({
      symbol: ticker,
      qty: 200,
      side: 'buy',
      type: 'market',
      time_in_force: 'day'
    });

    lastOrder = 'BUY';
    console.log('\nBUY\n');
  } else if ( !algorithm && lastOrder !== 'SELL') {
    backtest.createOrder({
      symbol: ticker,
      qty: 200,
      side: 'sell',
      type: 'market',
      time_in_force: 'day'
    });

    lastOrder = 'SELL';
    console.log('\nSELL\n');
  }
});

client.onDisconnect(() => {
    console.log(backtest.getStats());
})

client.connect();