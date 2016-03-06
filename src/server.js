import Router from 'router';
import through2 from 'through2';
import eos from 'end-of-stream';
import concat from 'concat-stream';
import pump from 'pump';
import mime from 'mime';
import {Site, Type, Item, renderer} from 'rufio';
import {loadItemFactory} from './load-item';
import {renderItemFactory} from './render-item';
import {loadItemByPermalinkFactory} from './load-item-by-permalink';
import {addItemToLocalsFactory} from './add-item-to-locals';

export class RufioServer {
	constructor (site, theme, opts = {}) {
		// References to the site and theme
		this.site = site;
		if (theme && typeof theme !== 'function') {
			opts = theme;
			theme = null;
		}
		this.theme = theme || renderer;

		// Setup the mime type detection
		this.mime = (function () {
			if (typeof opts.mime === 'string') {
				return function () {
					return opts.mime;
				};
			}

			if (typeof opts.mime === 'function') {
				return opts.mime;
			}

			return function (item) {
				if (item.mime) {
					return item.mime;
				}

				return mime.lookup(item.path) || 'text/html';
			};
		})();

		// Setup router
		this.router = new Router();

		// Add site to res.locals
		this.router.use((req, res, next) => {
			res.locals.site = site;
			next();
		});

		// Load the site and setup the routes
		this.site.types.forEach((type) => {
			type.forEach((item) => {
				if (item.type && item.permalink !== item.type.getItemPath(item)) {
					this.handleItem(item);
				}
			});
			this.handleType(type);
		});
	}

	handle (req, res, next) {
		this.router.handle(req, res, next);
	}

	handleType (type) {
		// Handle the index route
		if (type.route) {
			this.router.get(type.route, addItemToLocalsFactory(type), renderItemFactory(this.theme, {
				mime: this.mime
			}));
		}

		// Handle the sub index routes
		Object.keys(type.indices).forEach((c) => {
			if (type.indices[c].route) {
				this.router.get(type.indices[c].route, addItemToLocalsFactory(type.indices[c]), renderItemFactory(this.theme, {
					mime: this.mime
				}));
			}
		});

		// Handle the item routes
		if (type.itemRoute) {
			this.router.get(type.itemRoute, loadItemByPermalinkFactory(type), renderItemFactory(this.theme, {
				mime: this.mime
			}));
		}
	}

	handleItem (item) {
		this.router.get(item.permalink, loadItemFactory(item), renderItemFactory(this.theme, {
			mime: this.mime
		}));
	}
}
