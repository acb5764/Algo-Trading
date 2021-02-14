const _ = require('lodash');
const Alpaca = require('@alpacahq/alpaca-trade-api')
const SMA = require('technicalindicators').SMA;

const alpaca = new Alpaca({
    keyId:process.env.API_KEY,
    secretKey:process.env.SECRET_API_KEY,
    paper:true,
});

let sma20, sma50;
let lastOrder = 'SELL';


async function initializeAverages(){
    const initialData = await alpaca.getBars(
        '1Min',
        'SPY',
        {
            limit:50,
            until: new Date(),
        })
        const closeValues = _.map(initialData.SPY, (bar) => bar.c);
        sma20 = new SMA({
            period:20, 
            values: closeValues,
        });
        sma50 = new SMA({
            period:50, 
            values: closeValues,
        })

        console.log("gotem")
        console.log(`sma20 ${sma20.getResult()}`)
        console.log(`sma50 ${sma50.getResult()}`)
};



initializeAverages();

const client = alpaca.websocket;
// client.onconnect(() => {
//     console.log("Connected to client")
//     setTimeout(() => client.disconnect(), 5*1000)
// });
