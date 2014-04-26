var gulp    = require('gulp'),
    coffee  = require('gulp-coffee'),
    gutil   = require('gulp-util');

gulp.task('default', function(){
  gulp.src('src/*.coffee')
      .pipe(coffee({sourceMap: false})).on('error', gutil.log)
      .pipe(gulp.dest('dist'));
})

gulp.watch(['src/*.coffee'], ['default'])
