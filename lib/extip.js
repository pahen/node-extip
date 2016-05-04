var request = require('request'),
	proxy = false,
	urls = [
		'http://icanhazip.com/',
		'http://ifconfig.me/ip',
		'http://whatismyip.org/',
		'http://ip.appspot.com/',
		'http://curlmyip.com/',
		'http://ident.me/',
		'http://whatismyip.akamai.com/',
		'http://tnx.nl/ip',
		'http://myip.dnsomatic.com/',
		'http://ipecho.net/plain',
	];

/**
 * Specify a proxy that should be used for the requests.
 * @param  {String} value (host:port)
 * @return {Object} Return module (for chaining)
 */
exports.proxy = function (value) {
	if (value) {
		proxy = value;
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

	var errors = [];

	function error(msg) {
		errors.push(msg);
		if (fail && urls.length === errors.length) {
			fail(errors);
		}
	}

	var requests = urls.map(function (url) {
		return request({url: url, proxy: proxy, timeout: 3000}, function (err, resp, body) {
			if (err) {
				error('Request to ' + url + ' failed: ' + err.message);
			} else if (resp.statusCode !== 200) {
				error('Wrong status code from ' + url);
			} else {
				var ip = body.replace(/\s/, '');
				if (ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)) {
					requests.forEach(function (r) {
						r.req.abort();
					});
					success && success(ip);
				} else {
					error('Invalid response from ' + url);
				}
			}
		});
	});

	return this;
};