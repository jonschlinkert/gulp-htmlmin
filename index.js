'use strict';

var BufferStreams = require('bufferstreams');
var htmlmin = require('html-minifier');
var extend = require('extend-shallow');
var gutil = require('gulp-util');
var through = require('through2');

module.exports = function (options) {
  var opts = extend({showStack: false}, options);

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    function minifyHtml(buf, done) {
      try {
        done(null, new Buffer(htmlmin.minify(String(buf), opts)));
      } catch (err) {
        done(new gutil.PluginError('gulp-htmlmin', err, opts));
        return;
      }
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
