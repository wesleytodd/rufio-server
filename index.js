var RufioServer = require('./lib/server');

module.exports = function(rufio) {

	rufio.config.validate('server', function(val, done) {

		if (typeof val === 'undefined') {
			done('The server plugin requires configuration.');
		}
		
		if (typeof val.port !== 'undefined' && typeof val.port !== 'number') {
			done('Server port must be a number');
		}
		
		// No errors
		done();
	});

};

module.exports.RufioServer = RufioServer;
