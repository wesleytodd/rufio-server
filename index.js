var RufioServer = require('./lib/server').RufioServer;

module.exports = function (site, theme) {
	// Create server
	var server = new RufioServer(site, theme);

	// Handle requests
	return function (req, res, next) {
		server.handle(req, res, next);
	};
};

module.exports.RufioServer = RufioServer;
