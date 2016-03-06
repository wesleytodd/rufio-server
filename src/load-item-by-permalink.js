import eos from 'end-of-stream';

export function loadItemByPermalinkFactory (type) {
	return function loadItemByPermalink (req, res, next) {
		var match = type.getItemsFromIndex('permalink', {
			permalink: req.url
		});
		
		// No match found in this collection
		if (!match || !match.length) {
			return next();
		}

		// Load the item before adding it to res.locals
		eos(match.items[0].load(), (err) => {
			if (err) {
				return next(err);
			}
			res.locals.item = match.items[0];
			next();
		});
	};
}
