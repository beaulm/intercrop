let Backbone = require('backbone');
let PlantModel = require('../models/PlantModel');

module.exports = Backbone.Collection.extend({
  model: PlantModel,
  url: '/api/v1/plant',
});
