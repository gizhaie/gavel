var https = require('https');
var http = require('http');
var querystring = require('querystring');
var config = require('config');

var apikey = config.get('battleNetApiKey');

var HTTPS_DEFAULT_PORT = 443;

var region = 'us';
var locale = 'en_US';

var apis = {
	auctionData: 'auction/data/'
};

function getProtocol(options) {
	if (typeof options === 'string' && options.startsWith('https')) {
		return https;
	}
	if (options !== null && typeof options === 'object' && options.port === HTTPS_DEFAULT_PORT) {
		return https;
	}
	return http;
}

function get(options, callback) {
	var protocol = getProtocol(options);
	var request = protocol.request(options, function (response) {
		var responseContent = '';
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			responseContent += chunk;
		});

		response.on('end', function () {
			var statusCode = response.statusCode;
			if (statusCode < 200 || statusCode >= 299) {
				return callback(response);
			}
			return callback(null, responseContent);
		});
	});
	request.end();

	request.on('error', function (error) {
		callback(error);
	});
};

function sendRequest(path, callback) {
	var options = {
		host: region + '.api.battle.net',
		port: HTTPS_DEFAULT_PORT,
		path: path,
		method: 'GET'
	};

	get(options, function (error, response) {
		if (error) {
			return callback(error);
		}
		var responseJSON;
		try {
			responseJSON = JSON.parse(response);
		} catch (error) {
			return callback(error, response);
		}
		return callback(null, responseJSON);
	});
}

exports.getAuctionData = function (realm, callback) {
	var getData = querystring.stringify({
		locale: locale,
		apikey: apikey
	});
	var path = '/wow/' + apis.auctionData + realm + '?' + getData;
	sendRequest(path, callback);
}

exports.getFile = get;