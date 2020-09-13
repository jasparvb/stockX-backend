//Function to return a string of symbols given lists with stocks

function getSymbols(lists) {
  let tickerSet = new Set();
  let symbols = '';
  for(let list of lists) {
    for(let stock of list.stocks) {
      tickerSet.add(stock.ticker);
    }
  }
  if(tickerSet.size) {
    for(let i of tickerSet) {
      if(symbols) {
        symbols = symbols + "," + i;
      } else {
        symbols = i;
      }
    }    
  }
  return symbols;
}

module.exports = { getSymbols };
