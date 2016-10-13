var async = require('async');
var path = require('path');

var request = require('./../request.js');

var JSON_EXTENSION = '.json';
var SERVER = 'daggerspine';

function getDump(file, callback) {
	var url = file.url;
	if (path.extname(url) !== JSON_EXTENSION) {
		return callback(new Error('Auction data file expected to be a JSON file.'));
	}
	request.getFile(url, function (error, jsonFile) {
		var json;
		try {
			json = JSON.parse(jsonFile);
		} catch (error) {
			return callback(error);
		}
		return callback(null, { data: json, timestamp: file.lastModified });
	});
}

function pullAuctionData(callback) {
	request.getAuctionData(SERVER, function (error, response) {
		if (error) {
			return callback(error);
		}
		var files = response.files;
		async.map(files, getDump, function (error, dumps) {
			if (error) {
				return callback(error);
			}
			dumps.sort(function (a, b) {
				return a.timestamp - b.timestamp;
			});
			return callback(null, dumps);
		});
	});
}

function fillDatabase(dumps, callback) {
	return callback();
}

module.exports = function () {
	pullAuctionData(function (error, dumps) {
		if (error) {
			return console.error(error);
		}
		fillDatabase(dumps, function () {});
	});
};