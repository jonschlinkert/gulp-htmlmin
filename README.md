# gulp-htmlmin [![NPM version](https://badge.fury.io/js/gulp-htmlmin.png)](http://badge.fury.io/js/gulp-htmlmin)

> Minify HTML.

## Getting Started
Install the module with: `npm install gulp-htmlmin`

## Usage

```js
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');

gulp.task('minify', function() {
  gulp.src('./src/foo.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.folder('./dist/foo.html'))
});
```

See the [html-minifer docs](https://github.com/kangax/html-minifier) for options.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).

## Author

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License
Copyright (c) 2013 Jon Schlinkert
Licensed under the MIT license.