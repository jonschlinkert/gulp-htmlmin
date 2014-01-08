/*
 * gulp-htmlmin
 * https://github.com/jonschlinkert/gulp-htmlmin
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 */


var Buffer = require('buffer').Buffer;
var es = require('event-stream');
var htmlmin = require('html-minifier');

module.exports = function (opts) {
  'use strict';

  opts = opts || {};

  return es.map(function (file, cb) {
    try {
      file.contents = new Buffer(htmlmin.minify(String(file.contents), opts));
    } catch (err) {
      console.warn('Error caught from html-minify: ' + err.message + '.');
    }
    cb(null, file);
  });
};