'use strict';

var fs = require('fs');
var path = require('path');
var bufferToStream = require('simple-bufferstream');
var expect = require('chai').expect;
var File = require('vinyl');
var minify = require('..');

var expectedNormal = fs.readFileSync(path.join(__dirname, 'expected/normal.html'), 'utf8');
var expectedCollapse = fs.readFileSync(path.join(__dirname, 'expected/collapse.html'), 'utf8');

var fakeFile = new File({
  base: path.join(__dirname, 'fixtures'),
  cwd: __dirname,
  path: path.join(__dirname, 'fixtures/index.html'),
  contents: fs.readFileSync(path.join(__dirname, 'fixtures/index.html'))
});

var fakeFileStream = fakeFile.clone();
fakeFileStream.contents = bufferToStream(fs.readFileSync(path.join(__dirname, 'fixtures/index.html')));

var contents = '<<div>error in this file</div>';
var errorFile = new File({
  base: path.join(__dirname, 'fixtures'),
  cwd: __dirname,
  path: path.join(__dirname, 'fixtures/error.html'),
  contents: new Buffer(contents)
});


describe('gulp-htmlmin in buffer mode', function () {
  it('should ignore empty file', function (done) {
    var stream = minify();
    stream.on('data', function(newFile){
      expect(newFile.isNull()).to.be.true;
      done();
    });
    stream.end(new File({}));
  });

  it('should minify my HTML files', function (done) {
    var stream = minify();
    stream.on('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(newFile.isBuffer()).to.be.true;
      expect(String(newFile.contents)).to.equal(expectedNormal);
      done();
    });
    stream.write(fakeFile);
  });

  it('should collapse whitespace', function (done) {
    var stream = minify({collapseWhitespace: true});

    stream.on('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(String(newFile.contents)).to.equal(expectedCollapse);
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

    stream.end(errorFile);
  });

  it('should throw a gulp error with a stack trace', function(done) {
    var stream = minify({showStack: true});

    stream.on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      expect(err.showStack).to.be.true;
      done();
    });

    stream.on('end', function () {
      done(new Error('No error.'));
    });

    stream.end(errorFile);
  });
});

describe('gulp-htmlmin in stream mode', function () {

  it('should minify my HTML files', function (done) {
    var stream = minify();
    stream.on('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(newFile.isStream()).to.be.true;
      newFile.contents.on('data', function(data) {
        expect(String(data)).to.equal('<div></div>');
      });
      done();
    });
    stream.end(new File({contents: bufferToStream('<div   ></div>')}));
  });

  it('should throw a gulp error', function(done) {
    var stream = minify();

    stream.on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      done();
    });

    stream.on('end', function () {
      done(new Error('No error.'));
    });

    stream.end(new File({contents: bufferToStream(contents)}));
  });
});
