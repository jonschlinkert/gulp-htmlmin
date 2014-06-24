# gulp-html-minifier

> Minifies HTML using the html-minifier module. See [html-minifer](https://github.com/kangax/html-minifier) 

## Getting Started
Install the module with: 

````
npm install gulp-html-minifier
`````

## Usage

Along with the default options for html-minifier gulp-html-minifier exposes two additional handy methods. You can ignore
paths within the filepath preventing the need to pipe in a rename. This is similar to what gulp-inject does. 

Also you can pass in the environment to simply output your html to the destination ignoring the above paths if any but
minification is not applied. This is helpful and probably what you want in the development process.

```js
var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');

gulp.task('minify', function() {
  gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'))
});
````

##Ignore Path

```js
var gulp = require('gulp');
var htmlmin = require('gulp-html-minifier');

gulp.task('minify', function() {
  gulp.src('./src/assets/*.html')
    .pipe(htmlmin({collapseWhitespace: true, ignorePath: '/assets' }))
    .pipe(gulp.dest('./dist'))
});
````

##Development Mode

If you pass into your options minification is skipped however ignore path will still be applied. This makes viewing
source and element inspection easier as you probably don't want minified html when you're developing your application.

````js
options.env = 'development'
````

##Complete Options

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