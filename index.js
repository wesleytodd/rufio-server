var RufioServer = require('./lib/server').RufioServer;

module.exports = function (site, theme, opts) {
	// Create server
	var server = new RufioServer(site, theme, opts);

	// Handle requests
	return function (req, res, next) {
		server.handle(req, res, next);
	};
};

module.exports.RufioServer = RufioServer;
