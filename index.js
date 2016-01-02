'use strict';
/*
 * gulp-html-minifier
 * https://github.com/origin1tech/gulp-html-minifier
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 */
var es = require('event-stream'),
	htmlmin = require('html-minifier'),
	HTMLLint = require('html-minifier/src/htmllint').HTMLLint,
	gutil = require('gulp-util');
module.exports = function (options) {
	options = options || {
		showStack: false,
	};	

	if (options.lint) {
		options.lint = new HTMLLint();
	}
	// snipets stripPath, toArray & unixify based on gulp-inject
	// https://github.com/klei/gulp-inject/blob/master/index.js
	function ignorePath (basedir, filepath) {
		return toArray(basedir).reduce(function (path, remove) {
			var regex = remove;
			if(!(remove instanceof RegExp)){
				remove = remove.replace(/\//g, '\\/');
				regex = new RegExp(remove, 'g');
			}
			path = path.replace(regex, '');
			return path;
		}, filepath);
	}
	function toArray (arr) {
		if (!Array.isArray(arr)) {
			return arr ? [arr] : [];
		}
		return arr;
	}
	function unixify (filepath) {
		return filepath.replace(/\\/g, '/');
	}
	return es.map(function (file, cb) {
		try {
			// if in dev mode html should not be minified
			// instead only output stream after checking ignore path.
			if(options.env === 'development'){
				file.path = ignorePath(options.ignorePath, unixify(file.path));
			} else {
				file.path = ignorePath(options.ignorePath, unixify(file.path));
				file.contents = new Buffer(htmlmin.minify(String(file.contents), options));
			}
		} catch (err) {
			return cb(new gutil.PluginError('gulp-htmlmin', err, options));
		}
		cb(null, file);
	});
};
