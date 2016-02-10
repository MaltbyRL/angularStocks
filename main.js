'use strict';
var app = angular.module('routingTest', ['ui.router']);




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

  $urlRouterProvider.otherwise('/');

});


app.controller('listCtrl', function($scope, $state) {
  console.log("listCtrl");
  $scope.something = function() {
    console.log('$state:', $state);
    $state.go('home')
  }
})
app.controller('homeCtrl', function() {
  console.log("homeCtrl");
})



app.controller("stockCtrl", function($scope, Stock) {
  google.charts.load('current', {'packages':['corechart']});

  $scope.searchStock = function(symbol){
  console.log("sybol:", symbol);
    var promise = Stock.getStock(symbol);
    promise.then(function(res) {
      $scope.stock = res.data;
    console.log("success Stock1:", res.data);

          google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = google.visualization.arrayToDataTable([
        ['Date', 'Todays change', 'YTD change'],
        ['Start',  res.data.Open,     (res.data.ChangePercentYTD * res.data.LastPrice / 100) + res.data.LastPrice],
        ['High',  res.data.High,     (res.data.ChangePercentYTD * res.data.LastPrice / 100) + res.data.LastPrice],
        ['Low',  res.data.Low,      res.data.LastPrice],
        ['Final',  res.data.LastPrice,      res.data.LastPrice]
      ]);

      var options = {
        title: 'Stock performance for ' + res.data.Name,
        curveType: 'function',
        legend: { position: 'bottom' }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

      chart.draw(data, options);
    }
  });
}
    console.log("end");
  });

app.service('Stock', function($http) {
    this.getStock = function(stockId) {
      return $http.jsonp(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${stockId}&jsoncallback=JSON_CALLBACK`);
    }
  })
