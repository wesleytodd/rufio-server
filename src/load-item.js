import eos from 'end-of-stream';

export function loadItemFactory (item) {
	return function loadItem (req, res, next) {
		eos(item.load(), (err) => {
			if (err) {
				return next(err);
			}
			res.locals.item = item;
			next();
		});
	};
}
