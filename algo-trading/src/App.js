import React from 'react';
import './App.css';

function App() {
  const typeOfReq = "/coins/dogecoin/tickers"
  const stupidRequestURL = "https://api.coindesk.com/v1/bpi/currentprice.json"
  // https://web-api.coinmarketcap.com/v1.1/cryptocurrency/quotes/historical?convert=USD,BTC&format=chart_crypto_details&id=74&interval=1d&time_end=1612501200&time_start=1387065600"
  // https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd"
  
  let [responseData, setResponseData] = React.useState("");

  const fetchData = React.useCallback(() => {
    fetch(stupidRequestURL)
      .then((response) => response.json())
      .then((data) => setResponseData(data))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  fetchData();
  // React.useEffect(() => {
    
  //   fetchData()
  // }, [fetchData]);

  // setInterval(fetchData, 5000)
  var btcPrice = 69420;
  if(responseData)
  btcPrice = responseData.bpi.USD.rate_float;
  
  // {
  //   "id": "dogecoin",
  //   "symbol": "doge",
  //   "name": "Dogecoin"
  // },

  return (
    <div>
      <h1>The current price of dogecoin is ${btcPrice}</h1>
    </div>
  );
}

export default App;
