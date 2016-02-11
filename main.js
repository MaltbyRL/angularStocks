'use strict';
var app = angular.module('routingTest', ['ui.router']);
var checker = this.savedStocks;

$('table').on('click', 'input[type="button"]', function() {
  console.log('deleted');
  $(this).closest('tr').remove()
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: './partials/home.html',
      controller: 'homeCtrl'
    })
    .state('list', {
      url: '/list',
      templateUrl: './partials/list.html',
      controller: 'stockCtrl'
    })
    .state('mystocks', {
      url: '/mystocks',
      templateUrl: './partials/mystocks.html',
      controller: 'stocksearchCtrl'
    })
  $urlRouterProvider.otherwise('/');

});


///////////////////////////////
/////////controller
///////////////////////////////
app.controller('listCtrl', function($scope, $state) {

  $scope.seeStocks = function() {
    $state.go('home')
  }
})
app.controller('homeCtrl', function() {
  console.log("homeCtrl");
})
app.controller('stocksearchCtrl', function() {
    console.log("stocksearchCtrl");
  })
  ///////////////////////////////
  /////////choose a stock page
  ///////////////////////////////
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




//////////////////////////////
/////////stock chart
////////////////////////////
google.charts.load('current', {
  'packages': ['corechart']
});

function myChart(stock) {
  google.charts.setOnLoadCallback(drawChart);

  function drawChart(data) {
    var annualMed = (stock.ChangePercentYTD * stock.LastPrice / 100) + stock.LastPrice
    var data = google.visualization.arrayToDataTable([
      [Date, 'Todays change', 'YTD change'],
      ['Start', stock.Open, annualMed],
      ['First', stock.Low, (annualMed + stock.LastPrice) / 2],
      ['Second', stock.High, (annualMed + stock.LastPrice) / 2],
      ['Final', stock.LastPrice, stock.LastPrice]
    ]);
    var options = {
      title: 'Stock performance for ' + stock.Name,
      curveType: 'function',
      legend: {
        position: 'bottom'
      }
    };
    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
  }
}
