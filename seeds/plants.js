
exports.seed = function(knex, Promise) {
	return Promise.join(
		// Deletes ALL existing entries
		knex('plants').del(), 
		knex('plants').insert({
			id: 1,
			name: 'Cucumbers',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/16090-42.png',
			affinities: {
				2: 1,
				3: 1,
				4: 1,
				5: -1,
			},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 2,
			name: 'Kohlrabi',
			url: null,
			affinities: {
				1: 1,
				6: 1,
			},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 3,
			name: 'Radishes',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/50402-42.png',
			affinities: {
				7: 1,
				8: -1,
			},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 4,
			name: 'Peas',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/177692-42.png',
			affinities: {
				9: 1
			},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 5,
			name: 'Potatos',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/105370-42.png',
			affinities: {},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 6,
			name: 'Beets',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/17741-42.png',
			affinities: {},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 7,
			name: 'Lettuce',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/62621-42.png',
			affinities: {
				2: 1,
				3: 1,
				6: 1,
			},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 8,
			name: 'Grapes',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/113844-42.png',
			affinities: {},
			createdAt: '2015-10-10T22:15:04'
		}),
		knex('plants').insert({
			id: 9,
			name: 'Garlic',
			url: 'https://d30y9cdsu7xlg0.cloudfront.net/png/180321-42.png',
			affinities: {
				1: 1,
			},
			createdAt: '2015-10-10T22:15:04'
		})
	);
};
