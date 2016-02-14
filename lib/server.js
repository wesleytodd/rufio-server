'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RufioServer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // var rufio = require('rufio');


var _router = require('router');

var _router2 = _interopRequireDefault(_router);

var _rufio = require('rufio');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RufioServer = exports.RufioServer = function () {
	function RufioServer(site) {
		var _this = this;

		_classCallCheck(this, RufioServer);

		// Create the rufio site
		this.site = site;

		// setup router
		this.router = new _router2.default();

		// Load the site and setup the routes
		this.site.load().on('data', function (d) {
			if (d instanceof _rufio.Type) {
				return _this.handleType(d);
			}
			if (d instanceof _rufio.Item) {
				return _this.handleItem(d);
			}
		});
	}

	_createClass(RufioServer, [{
		key: 'handle',
		value: function handle(req, res, next) {
			var _this2 = this;

			this.router.handle(req, res, function () {
				if (!res.locals.item) {
					return next();
				}

				_this2.site.theme.renderContentItem(res.locals.item, function (err, str) {
					res.status(200).send(str);
				});
			});
		}
	}, {
		key: 'handleType',
		value: function handleType(type) {
			var _this3 = this;

			// Handle the index routes
			type.indexes.forEach(function (index) {
				if (!index.route) {
					return;
				}

				_this3.router.get(index.route, function (req, res, next) {
					// Match by index
					var match = type.getItemsFromIndex(index.groupBy, req.params);

					// No match :(
					if (!match) {
						return next();
					}

					_this3.site.get('theme').renderContentIndex(match, function (err, str) {
						res.status(200).send(str);
					});
					next();
				});
			});
		}
	}, {
		key: 'handleItem',
		value: function handleItem(item) {
			var _this4 = this;

			this.router.get(item.pathname, function (req, res, next) {
				_this4.site.get('theme').renderContentItem(item, function (err, str) {
					if (err) {
						console.log('Error rendering theme', err.stack);
						return res.status(500).send(err);
					}
					res.status(200).send(str);
				});
			});
		}
	}]);

	return RufioServer;
}();