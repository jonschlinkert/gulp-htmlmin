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
  stream.end();
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
      minify()
        .on('error', cb)
        .on('data', file => {
          assert(file.isNull());
          cb();
        })
        .end(new File({}));
    });

    it('should minify my HTML files', cb => {
      let expected = fs.readFileSync('test/expected/normal.html', 'utf8');

      minify()
        .on('error', cb)
        .on('data', file => {
          assert(file);
          assert(file.isBuffer());
          assert.equal(file.contents.toString(), expected);
          cb();
        })
        .end(fakeFile);
    });

    it('should collapse whitespace', cb => {
      let expected = fs.readFileSync('test/expected/collapse.html', 'utf8');

      minify({ collapseWhitespace: true })
        .on('error', cb)
        .on('data', file => {
          assert(file);
          assert.equal(file.contents.toString(), expected);
          cb();
        })
        .end(fakeFile);
    });

    it('should emit a gulp error', cb => {
      minify()
        .on('error', err => {
          assert.equal(err.message, 'Parse Error: ' + errorFileContents);
          assert.equal(err.fileName, errorFile.path);
          cb();
        })
        .on('end', () => {
          cb(new Error('No error.'));
        })
        .end(errorFile);
    });

    it('should emit a plugin error with a stack trace', cb => {
      minify({ showStack: true })
        .on('error', err => {
          assert.equal(err.message, 'Parse Error: ' + errorFileContents);
          assert.equal(err.fileName, errorFile.path);
          assert(err.showStack);
          cb();
        })
        .on('end', () => {
          cb(new Error('No error.'));
        })
        .end(errorFile);
    });
  });

  describe('file.contents - stream', () => {
    it('should minify my HTML files', cb => {
      let fixture = new File({ contents: toStream('<div   ></div>') });

      minify()
        .on('error', cb)
        .on('data', file => {
          assert(file);
          assert(file.isStream());
          file.contents.on('data', data => {
            assert.equal(data.toString(), '<div></div>');
          });
          cb();
        })
        .end(fixture);
    });

    it('should emit a plugin error', cb => {
      let fixture = new File({ contents: toStream(errorFileContents) });

      minify()
        .on('error', err => {
          assert.equal(err.message, 'Parse Error: ' + errorFileContents);
          cb();
        })
        .on('end', () => cb(new Error('Expected an error')))
        .end(fixture);
    });
  });
});

