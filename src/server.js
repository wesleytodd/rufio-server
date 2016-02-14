// var rufio = require('rufio');
import Router from 'router';
import {Site, Type, Item} from 'rufio';

export class RufioServer {
	constructor (site) {
		// Create the rufio site
		this.site = site

		// setup router
		this.router = new Router();

		// Load the site and setup the routes
		this.site.load().on('data', (d) => {
			if (d instanceof Type) {
				return this.handleType(d);
			}
			if (d instanceof Item) {
				return this.handleItem(d);
			}
		});
	}

	handle (req, res, next) {
		this.router.handle(req, res, () => {
			if (!res.locals.item) {
				return next();
			}

			this.site.theme.renderContentItem(res.locals.item, (err, str) => {
				res.status(200).send(str);
			});
		});
	}

	handleType (type) {
		// Handle the index routes
		type.indexes.forEach((index) => {
			if (!index.route) {
				return;
			}

			this.router.get(index.route, (req, res, next) => {
				// Match by index
				var match = type.getItemsFromIndex(index.groupBy, req.params);

				// No match :(
				if (!match) {
					return next();
				}

				this.site.get('theme').renderContentIndex(match, (err, str) => {
					res.status(200).send(str);
				});
				next();
			});
		});
	}

	handleItem (item) {
		this.router.get(item.pathname, (req, res, next) => {
			this.site.get('theme').renderContentItem(item, (err, str) => {
				if (err) {
					console.log('Error rendering theme', err.stack);
					return res.status(500).send(err);
				}
				res.status(200).send(str);
			});
		});
	}
}
