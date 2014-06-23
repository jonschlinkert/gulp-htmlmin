# gulp-html-minifier

> Minifies HTML using the html-minifier module. See [html-minifer](https://github.com/kangax/html-minifier) 

## Getting Started
Install the module with: 

````
npm install gulp-html-minifier
`````

## Usage

```js
var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');

gulp.task('minify', function() {
  gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});
````

###Ignore Path

```js
var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');

gulp.task('minify', function() {
  gulp.src('./src/assets/*.html')
    .pipe(htmlmin({collapseWhitespace: true, ignorePath: '/assets' }))
    .pipe(gulp.dest('./dist'))
});
````

See the [html-minifer docs](https://github.com/kangax/html-minifier) for complete options.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Original Author

+ [github/jonschlinkert](https://github.com/jonschlinkert)
+ [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## Fork Author

+ [github/origin1tech](https://github.com/origin1tech)

## License
Copyright (c) 2014 Jon Schlinkert
Licensed under the MIT license.