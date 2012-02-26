var http = require('http'),
	parser = require('url'),
	proxy = false,
	urls = [
		'http://icanhazip.com/',
		'http://ifconfig.me/ip',
		'http://whatismyip.org/'
	];

/**
 * Specify a proxy that should be used for the requests.
 * @param  {String} value (host:port)
 * @return {Object} Return module (for chaining)
 */
exports.proxy = function (value) {
	if (value) {
		var s = value.split(':');
		proxy = {
			host: s[0],
			port: s[1] || 8888
		};
	} else {
		proxy = null;
	}
	return this;
};

/**
 * Request all URLs and use the results from the first one responding.
 * @param  {Function} success
 * @param  {Function} fail
 * @return {Object} Return module (for chaining)
 */
exports.fetch = function (success, fail) {

	var requests = [],
		errors = [],
		error = function (msg) {
			errors.push(msg);
			if (urls.length === errors.length && fail) {
				fail(errors);
			}
		};

	urls.forEach(function (url) {

		var o = parser.parse(url),
			options = proxy ? {host: proxy.host, port: proxy.port, path: url} : {host: o.host, port: 80, path: o.pathname},
			req = http.get(options, function (res) {

				res.setEncoding('utf8');

				if (res.statusCode === 200) {
					res.on('data', function (chunk) {
						var ip = chunk.replace(/\s/, '');
						if (ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)) {
							requests.forEach(function (r) {
								if (r !== req) {
									r.abort();
								}
							});
							if (success) {
								success(ip);
							}
						} else {
							error('Invalid response from ' + url);
						}
					});
				} else {
					error('Wrong status code from ' + url);
				}
			}).on('error', function (e) {
				error('Request to ' + url + ' failed: ' + e.message);
			});

		req.socket.on('timeout', function () {
			error('Timeout waiting for ' + url);
			req.abort();
		}).setTimeout(3000);

		requests.push(req);
		req.end();
	});

	return this;
};