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
      controller: 'controllers/homeCtrl'
    })
    .state('list', {
      url: '/list',
      templateUrl: './partials/list.html',
      controller: 'controllers/stockCtrl'
    })
    .state('mystocks', {
      url: '/mystocks',
      templateUrl: './partials/mystocks.html',
      controller: 'controllers/stocksearchCtrl'
    })
  $urlRouterProvider.otherwise('/');

});


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
