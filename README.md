[![build status](https://secure.travis-ci.org/pahen/node-extip.png)](http://travis-ci.org/pahen/node-extip)
# node-extip

A command line interface and npm package for fetching your external IP-address.

## Install

    npm -g install extip

## Usage

The command line interface looks like this.

	extip [options]

You can also require it as a module.

	var extip = require('extip');

	extip.fetch(
		function (ip) {
			console.log(ip);
		},
		function (errors) {
			errors.forEach(function (err) {
				console.log('ERR: ' + err);
			});
		}
	);

And using a proxy ..

	extip.proxy('http://10.0.0.1:8080').fetch();