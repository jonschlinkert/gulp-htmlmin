'use strict';

var BufferStreams = require('bufferstreams');
var htmlmin = require('html-minifier');
var gutil = require('gulp-util');
var objectAssign = require('object-assign');
var through = require('through2');
var tryit = require('tryit');

module.exports = function(options) {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    function minifyHtml(buf, done) {
      var result;
      tryit(function() {
        result = new Buffer(htmlmin.minify(String(buf), options));
      }, function(err) {
        if (err) {
          options = objectAssign({}, options, {fileName: file.path});
          done(new gutil.PluginError('gulp-htmlmin', err, options));
          return;
        }
        done(null, result);
      });
    }

    var self = this;

    if (file.isStream()) {
      file.contents.pipe(new BufferStreams(function(none, buf, done) {
        minifyHtml(buf, function(err, contents) {
          if (err) {
            self.emit('error', err);
            done(err);
          } else {
            done(null, contents);
            self.push(file);
          }
          cb();
        });
      }));
      return;
    }

    minifyHtml(file.contents, function(err, contents) {
      if (err) {
        self.emit('error', err);
      } else {
        file.contents = contents;
        self.push(file);
      }
      cb();
    });
  });
};
