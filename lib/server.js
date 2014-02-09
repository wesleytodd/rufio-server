// Requirements
var http = require('http'),
	path = require('path'),
	express = require('express');

// The server application
var RufioServer = module.exports = function(rufio) { 
	// Create the rufio app
	this.rufio = rufio;

	// Create the express app
	this.app = express();

	// Create the http server
	this.server = http.createServer(this.app);

};

RufioServer.prototype.start = function() {

	// Make sure rufio is ready
	if (!this.rufio.ready) {
		this.rufil.logger.error('Cannot start Rufio Server until Rufio is ready.');
		return;
	}

	// Settings
	this.app.set('port', this.rufio.config.get('server:port') || 8080);
	this.app.use(express.logger());
	this.app.use(express.compress());

	// Serve /v routes from the build root
	this.app.use('/v', express.static(this.rufio.BUILD_ROOT));
	
	// Also serve direct routes from the active dir
	this.app.use(express.static(this.rufio.BUILD_DIR));

	// Start the http server
	this.server.listen(this.app.get('port'), function(err) {
		if (err) {
			this.rufio.logger.error('Failed to start http server', err);
			return;
		}

		this.rufio.logger.info('Server started on port ' + this.app.get('port'));

		// Signal to naught if present
		if (process.send) {
			process.send('online');
		}
		
	}.bind(this));
		
};
