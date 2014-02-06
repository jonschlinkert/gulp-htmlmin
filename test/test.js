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
var gutil = require('gulp-util');
var expect = require('chai').expect;
var htmlmin = require('html-minifier');
var minify = require('../index.js');
var es = require('event-stream');


var expectedFilename =  path.join(__dirname, './fixtures/index.html');
var actualFilename = path.join(__dirname, './actual/index.html');

var src = path.join(__dirname, './fixtures/*.html');
var dest = path.join(__dirname, './actual');
      
describe('gulp-htmlmin minification', function () {
  describe('gulp-htmlmin', function () {

    it('should minify my HTML files', function (done) {
      gulp.src(src)
        .pipe(minify())
        .pipe(gulp.dest(dest))
        .pipe(es.map(function (file) {
          var expected = htmlmin.minify(fs.readFileSync(expectedFilename, 'utf-8'));
          var actual = fs.readFileSync(actualFilename, 'utf-8');
          expect(actual).to.equal(expected);
          done();
        }));
    });

    it('should collapse whitespace', function (done) {
      gulp.src(src)
        .pipe(minify({collapseWhitespace: true}))
        .pipe(gulp.dest(dest))
        .pipe(es.map(function (file) {
          var expected = htmlmin.minify(fs.readFileSync(expectedFilename, 'utf-8'), {collapseWhitespace: true});
          var actual = fs.readFileSync(actualFilename, 'utf-8');
          expect(actual).to.equal(expected);
          done();
        }));
    });

    it('should return file.contents as a buffer', function (done) {
      gulp.src(src)
        .pipe(minify())
        .pipe(gulp.dest(dest))
        .pipe(es.map(function (file) {
          expect(file.contents).to.be.an.instanceof(Buffer);
          done();
        }));
    });

    it('should throw a gulp error', function(done) {
      var contents = '<<div>error in this file</div>';
      var file = new gutil.File({
        base: path.join(__dirname, './fixtures'),
        cwd: __dirname,
        path: path.join(__dirname, './fixtures/error.html'),
        contents: new Buffer(contents)
      });

      var stream = minify();

      stream.on('error', function (err) {
        if (err) {
          expect(err.message).to.equal('Parse Error: ' + contents);
        }
        done();
      });

      stream.on('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should throw a gulp error with a stack trace', function(done) {
      var contents = '<<div>error in this file</div>';
      var file = new gutil.File({
        base: path.join(__dirname, './fixtures'),
        cwd: __dirname,
        path: path.join(__dirname, './fixtures/error.html'),
        contents: new Buffer(contents)
      });

      var stream = minify({showStack: true});

      stream.on('error', function (err) {
        if (err) {
          expect(err.message).to.equal('Parse Error: ' + contents);
          expect(err.showStack).to.be.true;
        }
        done();
      });

      stream.on('end', function () {
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});