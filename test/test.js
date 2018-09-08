'use strict';

require('mocha');
const fs = require('fs');
const assert = require('assert');
const through = require('through2');
const File = require('vinyl');
const minify = require('..');

function toStream(contents) {
  let stream = through();
  stream.write(contents);
  return stream;
}

let fakeFile = new File({
  path: 'test/fixtures/index.html',
  contents: fs.readFileSync('test/fixtures/index.html')
});

let errorFileContents = '<<div>error in this file</div>';
let errorFile = new File({
  path: 'test/fixtures/error.html',
  contents: Buffer.from(errorFileContents)
});

describe('gulp-htmlmin', () => {
  describe('file.contents - buffer', () => {
    it('should ignore empty file', cb => {
      let stream = minify();
      stream.on('error', cb);
      stream.on('data', file => {
        assert(file.isNull());
        cb();
      });
      stream.write(new File({}));
    });

    it('should minify my HTML files', cb => {
      let expected = fs.readFileSync('test/expected/normal.html', 'utf8');
      let stream = minify();
      stream.on('error', cb);
      stream.on('data', file => {
        assert(file);
        assert(file.isBuffer());
        assert.equal(file.contents.toString(), expected);
        cb();
      });
      stream.write(fakeFile);
    });

    it('should collapse whitespace', cb => {
      let expected = fs.readFileSync('test/expected/collapse.html', 'utf8');
      let stream = minify({ collapseWhitespace: true });
      stream.on('error', cb);
      stream.on('data', file => {
        assert(file);
        assert.equal(file.contents.toString(), expected);
        cb();
      });
      stream.write(fakeFile);
    });

    it('should emit a gulp error', cb => {
      let stream = minify();
      stream.on('error', err => {
        assert.equal(err.message, 'Parse Error: ' + errorFileContents);
        assert.equal(err.fileName, errorFile.path);
        cb();
      });
      stream.on('end', () => cb(new Error('No error.')));
      stream.write(errorFile);
    });

    it('should emit a plugin error with a stack trace', cb => {
      let stream = minify({ showStack: true });
      stream.on('error', err => {
        assert.equal(err.message, 'Parse Error: ' + errorFileContents);
        assert.equal(err.fileName, errorFile.path);
        assert(err.showStack);
        cb();
      });
      stream.on('end', () => cb(new Error('No error.')));
      stream.write(errorFile);
    });
  });

  describe('file.contents - stream', () => {
    it('should minify my HTML files', cb => {
      let fixture = new File({ contents: toStream('<div   ></div>') });
      let stream = minify();
      stream.on('error', cb);
      stream.on('data', file => {
        assert(file);
        assert(file.isStream());
        file.contents.on('data', data => {
          assert.equal(data.toString(), '<div></div>');
          cb();
        });
      });
      stream.write(fixture);
    });

    it('should emit a plugin error', cb => {
      let stream = minify();
      stream.on('error', err => {
        assert.equal(err.message, 'Parse Error: ' + errorFileContents);
        cb();
      });
      stream.on('end', () => cb(new Error('Expected an error')));
      stream.write(new File({ contents: toStream(errorFileContents) }));
    });
  });
});

