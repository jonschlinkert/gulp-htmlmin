/*
 * gulp-htmlmin
 * https://github.com/jonschlinkert/gulp-htmlmin
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 */

/* globals describe, it */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var expect = require('chai').expect;
var htmlmin = require('html-minifier');
var minify = require('../index.js');
var es = require('event-stream');

describe('gulp-htmlmin minification', function () {
  describe('gulp-htmlmin', function () {

    it('should minify my HTML files', function (done) {
      var filename = path.join(__dirname, './fixtures/index.html');
      gulp.src(filename)
        .pipe(minify())
        .pipe(es.map(function (file) {
          var expected = htmlmin.minify(fs.readFileSync(filename, 'utf-8'));
          expect(String(file.contents)).to.equal(expected);
          done();
        }));
    });

    it('should collapse whitespace', function (done) {
      var filename = path.join(__dirname, './fixtures/index.html');
      gulp.src(filename)
        .pipe(minify({collapseWhitespace: true}))
        .pipe(es.map(function (file) {
          var expected = htmlmin.minify(fs.readFileSync(filename, 'utf-8'), {collapseWhitespace: true});
          expect(String(file.contents)).to.equal(expected);
          done();
        }));
    });

    it('should return file.contents as a buffer', function (done) {
      var filename = path.join(__dirname, './fixtures/index.html');
      gulp.src(filename)
        .pipe(minify())
        .pipe(es.map(function (file) {
          expect(file.contents).to.be.an.instanceof(Buffer);
          done();
        }));
    });
  });
});