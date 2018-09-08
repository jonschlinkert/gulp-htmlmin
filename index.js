'use strict';

const PluginError = require('plugin-error');
const htmlmin = require('html-minifier');
const through = require('through2');

module.exports = options => {
  return through.obj(function(file, enc, next) {
    if (file.isNull()) {
      next(null, file);
      return;
    }

    const isStream = file.isStream();
    const minify = (buf, cb) => {
      try {
        const contents = Buffer.from(htmlmin.minify(buf.toString(), options));
        if (!isStream) {
          file.contents = contents;
          cb(null, file);
        } else {
          cb(null, contents);
        }
      } catch (err) {
        const opts = Object.assign({}, options, { fileName: file.path });
        const error = new PluginError('gulp-htmlmin', err, opts);
        if (isStream) this.emit('error', error);
        cb(error);
      }
    };

    if (isStream) {
      file.contents = file.contents.pipe(through((buf, enc, cb) => minify(buf, cb)));
      next(null, file);
    } else {
      minify(file.contents, next);
    }
  });
};
