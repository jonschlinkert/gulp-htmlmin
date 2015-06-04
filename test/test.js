/* eslint-env mocha */
'use strict';

var fs = require('fs');
var bufferToStream = require('simple-bufferstream');
var expect = require('chai').expect;
var File = require('vinyl');
var minify = require('..');

var expectedNormal = fs.readFileSync('test/expected/normal.html', 'utf8');
var expectedCollapse = fs.readFileSync('test/expected/collapse.html', 'utf8');

var fakeFile = new File({
  path: 'test/fixtures/index.html',
  contents: fs.readFileSync('test/fixtures/index.html')
});

var fakeFileStream = fakeFile.clone();
fakeFileStream.contents = bufferToStream(fs.readFileSync('test/fixtures/index.html'));

var contents = '<<div>error in this file</div>';
var errorFile = new File({
  path: 'test/fixtures/error.html',
  contents: new Buffer(contents)
});

describe('gulp-htmlmin in buffer mode', function() {
  it('should ignore empty file', function(done) {
    minify()
    .on('error', done)
    .on('data', function(file) {
      expect(file.isNull()).to.equal(true);
      done();
    })
    .end(new File({}));
  });

  it('should minify my HTML files', function(done) {
    minify()
    .on('error', done)
    .on('data', function(file) {
      expect(file).to.not.equal(null);
      expect(file.isBuffer()).to.equal(true);
      expect(String(file.contents)).to.equal(expectedNormal);
      done();
    })
    .end(fakeFile);
  });

  it('should collapse whitespace', function(done) {
    minify({collapseWhitespace: true})
    .on('error', done)
    .on('data', function(file) {
      expect(file).to.not.equal(null);
      expect(String(file.contents)).to.equal(expectedCollapse);
      done();
    })
    .end(fakeFile);
  });

  it('should emit a gulp error', function(done) {
    minify()
    .on('error', function(err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      expect(err.fileName).to.equal(errorFile.path);
      done();
    })
    .on('end', function() {
      done(new Error('No error.'));
    })
    .end(errorFile);
  });

  it('should emit a plugin error with a stack trace', function(done) {
    var originalOption = {showStack: true};

    minify({showStack: true})
    .on('error', function(err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      expect(err.fileName).to.equal(errorFile.path);
      expect(err.showStack).to.equal(true);
      expect(originalOption).to.eql({showStack: true});
      done();
    })
    .on('end', function() {
      done(new Error('No error.'));
    })
    .end(errorFile);
  });
});

describe('gulp-htmlmin in stream mode', function() {
  it('should minify my HTML files', function(done) {
    minify()
    .on('error', done)
    .on('data', function(file) {
      expect(file).to.not.equal(null);
      expect(file.isStream()).to.equal(true);
      file.contents.on('data', function(data) {
        expect(String(data)).to.equal('<div></div>');
      });
      done();
    })
    .end(new File({contents: bufferToStream('<div   ></div>')}));
  });

  it('should emit a plugin error', function(done) {
    minify()
    .on('error', function(err) {
      expect(err.message).to.equal('Parse Error: ' + contents);
      done();
    })
    .on('end', function() {
      done(new Error('No error.'));
    })
    .end(new File({contents: bufferToStream(contents)}));
  });
});
