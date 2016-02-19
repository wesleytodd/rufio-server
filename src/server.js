import Router from 'router';
import through2 from 'through2';
import {Site, Type, Item} from 'rufio';

export class RufioServer {
	constructor (site, theme) {
		// References to the site and theme
		this.site = site;
		this.theme = theme;

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
		this.router.handle(req, res, next);
	}

	handleType (type) {
		// Handle the item routes
		if (type.itemRoute) {
			this.router.get(type.itemRoute, (req, res, next) => {
				var match = type.getItemsFromIndex('permalink', {
					permalink: req.url
				});
				
				if (!match || !match.length) {
					return next();
				}

				var t = this.theme(this.site);
				t.pipe(through2.obj(function (content) {
					res.status(200);
					res.type(match.items[0].mime);
					res.send(content);
					res.end();
				}));
				t.write(match.items[0]);
			});
		}

		// Handle the index route
		if (type.route) {
			this.router.get(type.route, (req, res, next) => {
				var t = this.theme(this.site);
				t.pipe(through2.obj(function (content) {
					res.status(200);
					res.type('application/json');
					res.send(content);
				}));
				t.write(type);
			});
		}

		// Handle the sub index routes
		Object.keys(type.indices).forEach((c) => {
			if (type.indices[c].route) {
				this.router.get(type.indices[c].route, (req, res, next) => {
					var t = this.theme(this.site);
					t.pipe(through2.obj(function (content) {
						res.status(200);
						res.type('application/json');
						res.send(content);
					}));
					t.write(type.indices[c]);
				});
			}
		});
	}

	handleItem (item) {
		//console.log(item.path);
		/*
		this.router.get(item.pathname, (req, res, next) => {
			var t = this.theme(this.site);
			t.pipe(through2.obj(function (content) {
				res.status(200);
				res.type(item.mime);
				res.send(content);
				res.end();
			}));
			t.write(item);
		});
		*/
	}
}
