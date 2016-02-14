var Rufio = require('rufio'),
	RufioServer = require('./server');

// Create rufio instance
var rufio = new Rufio();
rufio.init(function(err) {
	if (err) {
		rufio.logger.error(err);
		process.exit(1);
	}

	// Start the server
	(new RufioServer(rufio)).start();
});
