'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var EnergyConsumption = require('./models/energy-consumption');

// Use environment defined port or 3000
var port = process.env.PORT || 3010;
var mongoConnection = process.env.MONGO || 'mongodb://mongo:27017/energy-usage';

console.log(mongoConnection);

mongoose.connect(mongoConnection);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create our Express router
var router = express.Router();

router.get('/private/ping', function(req, res) {
  res.json({ message: 'pong' });
});


var createRoute = router.route('/consumption');

createRoute.post(function(req, res) {
  var data = new EnergyConsumption();

  data.customerId = req.body.customerId;
  data.dateCreated = new Date();
  data.lastAmended = new Date();
  data.postcode = req.body.postcode;
  data.gasUsage = req.body.gasUsage;
  data.electricityUsage = req.body.electricityUsage;

  data.save(function(err) {
    if (err) {
      res.send(err);
      return;
    };
    res.json({ message: 'Energy consumption saved', data: data });
  });
});
// Create a new route with the /beers/:beer_id prefix
var route = router.route('/consumption/:customerId');

route.get(function(req, res) {
  var criteria = {customerId: req.params.customerId};
  EnergyConsumption.findOne(criteria, function(err, data) {
    if (err) {
      res.send(err);
      return;
    };

    res.json(data);
  });
});

route.put(function(req, res) {
  var criteria = {customerId: req.params.customerId};
  EnergyConsumption.findOne(criteria, function(err, data) {
    if (err)
      res.send(err);

      data.lastAmended = new Date();
      data.postcode = req.body.postcode;
      data.gasUsage = req.body.gasUsage;
      data.electricityUsage = req.body.electricityUsage;


    data.save(function(err) {
      if (err)
        res.send(err);

      res.json(data);
    });
  });
});

// Create endpoint /api/beers/:beer_id for DELETE
route.delete(function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  var criteria = {customerId: req.params.customerId};
  EnergyConsumption.find(criteria).remove(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Consumption data removed for customer ' + req.params.customerId });
  });
});

// Register all our routes with /api
app.use('/api', router);

app.listen(port);

console.log('Running on http://localhost:' + port);
