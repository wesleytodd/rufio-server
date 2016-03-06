export function addItemToLocalsFactory (item) {
	return function addItemToLocals (req, res, next) {
		res.locals.item = item;
		next();
	};
}
