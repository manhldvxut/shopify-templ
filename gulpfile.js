var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var connect = require('gulp-connect-php');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

const path = require('path');
const base = path.resolve(__dirname, '');

gulp.task('sass', function() {
  return gulp
    .src('assets/src/scss/*.scss')
    .pipe(
      sass().on('error', function(err) {
        sass.logError;
        this.emit('end'); // Prevent gulp from catching the error and exiting the watch process)
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true
      })
    )
    .pipe(gulp.dest('./assets'))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task('browserSync', function(done) {
  connect.server(
    {
      base: base,
      port: '3000'
    },
    function() {
      browserSync({
        proxy: '127.0.0.1:3000'
      });
    }
  );
  browserSync.reload();
  done();
});

gulp.task(
  'default',
  gulp.series(gulp.parallel('browserSync', 'sass'), function(done) {
    gulp.watch(['./assets/src/scss/*.scss'], gulp.series('sass'));

    gulp.watch(['**/*.php']).on('change', browserSync.reload);

    gulp.watch(['./assets/js/*.js']).on('change', browserSync.reload);
  })
);
