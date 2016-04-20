
app.service('Stock', function($http) {
  this.getStock = function(stockId) {
    var stockSymbol = $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${stockId}&jsoncallback=JSON_CALLBACK`);
    return stockSymbol;
  }

  this.savedStocks = [];

  this.addStock = function(stockName) {
    var saved = {
      Name: stockName.Name,
      Symbol: stockName.Symbol,
      Volume: stockName.Volume,
      price: stockName.LastPrice
    }
    for (var i = 0; i < this.savedStocks.length; i++) {
      console.log('saved:', saved);
      if (this.savedStocks[i].Name !== saved.Name) {
        this.savedStocks.push(saved)
      }else{
        alert("Stock alreay added")
      }
    }
    if (this.savedStocks.length === 0) {
      this.savedStocks.push(saved)
    }
    console.log("stockName:", saved.Name)
    console.log("Follow working", this.savedStocks);
    // printStock()
    return
  }
})
