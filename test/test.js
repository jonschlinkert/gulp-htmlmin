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
var gutil = require('gulp-util');
var expect = require('chai').expect;
var minify = require('../index.js');


var expectedNormal = fs.readFileSync(path.join(__dirname, 'expected/normal.html'));
var expectedCollapse = fs.readFileSync(path.join(__dirname, 'expected/collapse.html'));

var fakeFile = new gutil.File({
  base: path.join(__dirname, 'fixtures'),
  cwd: __dirname,
  path: path.join(__dirname, 'fixtures/index.html'),
  contents: fs.readFileSync(path.join(__dirname, 'fixtures/index.html'))
});


var contents = '<<div>error in this file</div>';
var errorFile = new gutil.File({
  base: path.join(__dirname, 'fixtures'),
  cwd: __dirname,
  path: path.join(__dirname, 'fixtures/error.html'),
  contents: new Buffer(contents)
});


describe('gulp-htmlmin minification', function () {

  it('should minify my HTML files', function (done) {

    var stream = minify();
    stream.once('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(String(newFile.contents)).to.equal(String(expectedNormal));
      done();
    });
    stream.write(fakeFile);
  });

  it('should collapse whitespace', function (done) {
    var stream = minify({collapseWhitespace: true});

    stream.once('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(String(newFile.contents)).to.equal(String(expectedCollapse));
      done();
    });
    stream.write(fakeFile);
  });



  it('should return file.contents as a buffer', function (done) {
    var stream = minify();

    stream.once('data', function(newFile){
      expect(newFile.contents).to.be.an.instanceOf(Buffer);
      done();
    });
    stream.write(fakeFile);
  });

  it('should throw a gulp error', function(done) {


    var stream = minify();

    stream.on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      done();
    });

    stream.on('end', function () {
      done();
    });

    stream.write(errorFile);
    stream.end();
  });

  it('should throw a gulp error with a stack trace', function(done) {

    var stream = minify({showStack: true});

    stream.on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      expect(err.showStack).to.be.true;
      done();
    });

    stream.on('end', function () {
      done();
    });

    stream.write(errorFile);
    stream.end();
  });
});