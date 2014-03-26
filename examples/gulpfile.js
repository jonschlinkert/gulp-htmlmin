var gulp = require('gulp');
var htmlmin = require('../');


gulp.task('normal', function(){
  gulp.src('./index.html')
  .pipe(htmlmin())
  .pipe(gulp.dest('./build'));
});

gulp.task('collapse', function(){
  gulp.src('./index.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('./build'));
});