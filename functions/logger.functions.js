let logReq = (req, res, next) => {
	console.info(req.requestId + ' ' + req.method + ' ' + req.originalUrl + ' ' + JSON.stringify(req.body));
	next();
}

exports.logReq = logReq;