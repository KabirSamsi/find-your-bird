const mongoose = require('mongoose');

const addRequestSchema = new mongoose.Schema({
	name: String,
	scientificName: String,
	img: {
		url: {type: String, default: ''},
		citation: {type: String, default: ''}
	},
	description: {type: String, default: ''},
	appearance: {type: String, default: ''},
	diet: {type: String, default: ''},
	habitat: [{type: String}],
	range: {type: String, default: ''},
	size: String,
	colors: [{type: String}]
});

module.exports = mongoose.model("AddRequest", addRequestSchema);
