# gulp-htmlmin [![NPM version](https://badge.fury.io/js/gulp-htmlmin.svg)](http://badge.fury.io/js/gulp-htmlmin) [![Build Status](https://travis-ci.org/jonschlinkert/gulp-htmlmin.svg?branch=master)](https://travis-ci.org/jonschlinkert/gulp-htmlmin)

> Minify HTML.

## Getting Started
Install the module with: `npm install gulp-htmlmin --save-dev`

## Usage

```js
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');

gulp.task('minify', function() {
  gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});
```

See the [html-minifer docs](https://github.com/kangax/html-minifier) for options.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Author

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2014 Jon Schlinkert
Licensed under the MIT license.
