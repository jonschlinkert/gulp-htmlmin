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
  path: path.join(__dirname, 'fixtures/index.html'),
  contents: fs.readFileSync(path.join(__dirname, 'fixtures/index.html'))
});

var fakeFileStream = fakeFile.clone();
fakeFileStream.contents = bufferToStream(fs.readFileSync(path.join(__dirname, 'fixtures/index.html')));

var contents = '<<div>error in this file</div>';
var errorFile = new File({
  path: path.join(__dirname, 'fixtures/error.html'),
  contents: new Buffer(contents)
});


describe('gulp-htmlmin in buffer mode', function () {
  it('should ignore empty file', function (done) {
    minify()
    .on('error', done)
    .on('data', function(newFile){
      expect(newFile.isNull()).to.be.true;
      done();
    })
    .end(new File({}));
  });

  it('should minify my HTML files', function (done) {
    minify()
    .on('error', done)
    .on('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(newFile.isBuffer()).to.be.true;
      expect(String(newFile.contents)).to.equal(expectedNormal);
      done();
    })
    .end(fakeFile);
  });

  it('should collapse whitespace', function (done) {
    minify({collapseWhitespace: true})
    .on('error', done)
    .on('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(String(newFile.contents)).to.equal(expectedCollapse);
      done();
    })
    .end(fakeFile);
  });

  it('should emit a gulp error', function(done) {
    minify()
    .on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      done();
    })
    .on('end', function () {
      done(new Error('No error.'));
    })
    .end(errorFile);
  });

  it('should emit a gulp error with a stack trace', function(done) {
    minify({showStack: true})
    .on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      expect(err.showStack).to.be.true;
      done();
    })
    .on('end', function () {
      done(new Error('No error.'));
    })
    .end(errorFile);
  });
});

describe('gulp-htmlmin in stream mode', function () {

  it('should minify my HTML files', function (done) {
    minify()
    .on('error', done)
    .on('data', function(newFile){
      expect(newFile).to.not.be.null;
      expect(newFile.isStream()).to.be.true;
      newFile.contents.on('data', function(data) {
        expect(String(data)).to.equal('<div></div>');
      });
      done();
    })
    .end(new File({contents: bufferToStream('<div   ></div>')}));
  });

  it('should emit a gulp error', function(done) {
    minify()
    .on('error', function (err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      done();
    })
    .on('end', function () {
      done(new Error('No error.'));
    })
    .end(new File({contents: bufferToStream(contents)}));
  });
});
