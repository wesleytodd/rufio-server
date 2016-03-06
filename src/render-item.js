import concat from 'concat-stream';
import pump from 'pump';

export function renderItemFactory (theme, opts = {}) {
	opts.mime = opts.mime || function () {
		return 'text/html';
	};
	return function renderItem (req, res, next) {
		if (!res.locals.site) {
			return next(new TypeError('res.locals.site is required'));
		}
		if (!res.locals.item) {
			return next(new TypeError('res.locals.item is required'));
		}

		// Create the theme stream
		var t = theme(res.locals.site);

		// Buffer the entire response before sending
		var content;
		pump(t, concat(function (c) {
			content = c;
		}), function (err) {
			if (err) {
				return next(err);
			}
			
			// Successfully rendered
			res.type(opts.mime(res.locals.item));
			res.status(200);
			res.send(content);
		});
		t.write(res.locals.item);
		t.end();
	};
}
