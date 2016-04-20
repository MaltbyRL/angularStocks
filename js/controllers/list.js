app.controller('listCtrl', function($scope, $state) {

  $scope.seeStocks = function() {
    $state.go('home')
  }
})

app.controller("stockCtrl", function($scope, Stock) {
  $scope.savedStocks = Stock.savedStocks;
  $scope.saveStock = function() {
    Stock.addStock(this.stock);
  }

  $scope.searchStock = function(symbol) {
    var promise = Stock.getStock(symbol);
    promise.then(function(res) {
      $scope.stock = res.data;
      console.log("Stock data:", res.data);
      myChart(res.data)
    });
  }

  console.log("end");
});
