var express = require('express');
var path = require('path');
var cors = require('cors');
var http = require('http');

var dbRequest = require('./db/dbRequestHandler.js');

var app = express();
app.use(cors());

// This initializes the connections to our APIs' web sockets
dbRequest.initializeSockets();

// This initializes the GET requests we will be using
// to fetch data from APIs without web sockets
dbRequest.initializeGetRequests();

// This specifies the interval for which we will aggregate
// our API market data tables into our aggregated market
// data table
setInterval(function() {
  dbRequest.aggregateTables();
}, 1000);

// Sending a GET request to /api/marketdata will return
// an answer from our aggregated market data table,
// based on user-specified parameters
// http.get('http://127.0.0.1:8080/api/marketdata', function() {
//  console.log("I called stuff");
//  //Will prolly have to change this to post to send the object.
// });
app.get('/api/marketdata', function(req, res) {
  dbRequest.deliverMarketData(req
    // {
    // "timePeriod": 28800000, // this is 8 hours in milliseconds
    // "time": 1411700196372 // equivalent to Wed Sep 24 2014 16:28:32 GMT-0700 (PDT)
    // }
    ).then(function(data) {
    res.status(200).send(data);
  });
});

var port = process.env.PORT || 8080;

app.listen(port);
