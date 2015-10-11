let PlantCollection = require('./collections/PlantCollection');

module.exports = new PlantCollection([
  {
    id: 1,
    name: 'Onion',
    affinities: {
      2: -1,
      3: -1,
      4: -1,
      5: -1,
      6: -1,
    }
  },
  {
    id: 2,
    name: 'Carrot',
    affinities: {
      3: 1,
    }
  },
  {
    id: 3,
    name: 'Tomato',
    affinities: {
      2: 1,
      6: 1,
    }
  },
  {
    id: 4,
    name: 'Lettuce',
    affinities: {}
  },
  {
    id: 5,
    name: 'Bean',
    affinities: {
      2: 1,
    }
  },
  {
    id: 6,
    name: 'Basil',
    affinities: {
      1: -1,
    }
  },
]);
