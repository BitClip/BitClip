var Q = require('q');
var http = require('http');
var Pusher = require('pusher-client');
var db = require('./dbSchema.js');

var BitstampData = require('./models/bitstampModel.js');

// List of all API sockets we want to connect to
var apiSockets = {
  bitstamp: ['de504dc5763aeef9ff52', 'live_trades']
};

// List of all API URLs we will send GET requests to
var apiGetRequests = {
};

// Format: [APIModelName, APITableName]
var apiDbSetup = {
  bitstamp: [BitstampData, 'bitstampMarketData']

};

// The obj is the JSON object we receive from the API.
// Map it to the keys provided
var apiModelInfo = {
  bitstamp: function(obj) {
    return {
      bitstampTradeKey: obj.id,
      amount: obj.amount,
      price: obj.price
    };
  }
};

// The row is the row of data from the API market data table
// that will be added to our aggregated market data table
var apiTableInfo = {
  bitstamp: function(row) {
    return {
      sourceKey: row.sourceKey,
      amount: row.amount,
      price: row.price,
      created_at: row.created_at
    };
  }
};

var dbRequests = {};

/************************************************************
Market data requests
************************************************************/

// Finds all APIs configured to use a socket in our
// apiSockets table and initializes their sockets
dbRequests.initializeSockets = function() {
  for (var api in apiSockets) {
    var pusher = new Pusher(apiSockets[api][0]);
    var tradeDataChannel = pusher.subscribe(apiSockets[api][1]);

    tradeDataChannel.bind('trade', function(tradeData) {
      dbRequests.createModels(api, tradeData);
    });
  }
};

dbRequests.initializeGetRequests = function() {
};

dbRequests.createModels = function(api, obj) {
  var trade = new apiDbSetup[api][0](apiModelInfo[api](obj));

  trade.save().then(function(tradeModel) {
    tradeModel.destroy();
  });
};

// First, this function checks our sources table to
// see if the API has already been added; if not,
// it will be added. Then, insertDataIntoAggregateTable
// will be executed
dbRequests.aggregateTables = function() {
  Object.keys(apiDbSetup).forEach(function(api) {
    db.knex('sources').where({source: api})
      .select()
      .then(function(rows) {
        if (!rows.length) {
          db.knex('sources').insert({source: api})
            .then(function() {
              dbRequests.insertDataIntoAggregateTable(api);
            });
        } else {
          dbRequests.insertDataIntoAggregateTable(api);
        }
      });
  });
};

// Truncates the API market data table and inserts its
// data into the aggregate market data table
dbRequests.insertDataIntoAggregateTable = function(api) {
  db.knex.raw('SELECT b.sourceKey, a.* FROM ' + apiDbSetup[api][1] + ' a INNER JOIN sources b ON "' + api + '" = b.source')
    .then(function(rows) {
      db.knex.raw('DELETE FROM ' + apiDbSetup[api][1] + '; VACUUM;')
        .then(function() {
          rows.forEach(function(row) {
            console.log(row);
            db.knex('aggregatedMarketData').insert(apiTableInfo[api](row))
              .then(function() {});
          });
        });
    });
};

dbRequests.deliverMarketData = function(req) {
  var deferred = $q.defer();
  console.log(req);
  // var amountOfTime = req.timePeriod; //amount of time requested to view
  // var currentTime = req.time; //current time at time of request.
  // var timeSegment = currentTime - amountOfTime; //start time of data gathering

  db.knex.raw('SELECT * FROM aggregatedMarketData WHERE created_at BETWEEN "' + 0 + '" AND "' + 150000000000 + '";')
    .then(function(rows) { 
      deferred.resolve(rows);
    });
  return deferred.promise;
};

module.exports = dbRequests;
