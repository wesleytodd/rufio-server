var RufioServer = require('./lib/server').RufioServer;

module.exports = function (config) {
	// Create server
	var server = new RufioServer(config);

	// Handle requests
	return function (req, res, next) {
		server.handle(req, res, next);
	};
};
