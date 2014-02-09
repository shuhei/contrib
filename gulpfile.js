var gulp = require('gulp');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');

var libs = ['react'];

gulp.task('js', function () {
  return gulp.src('./src/js/app.js', { read: false })
             .pipe(plumber())
             .pipe(browserify({ transform: ['reactify'], external: libs }))
             .pipe(gulp.dest('./public/js'));
});

gulp.task('lib', function () {
  return gulp.src('./src/js/lib.js', { read: false })
             .pipe(browserify({ require: libs }))
             .pipe(gulp.dest('./public/js'));
});

gulp.task('img', function () {
  return gulp.src('./src/img/**/*')
             .pipe(gulp.dest('./public/img'));
});

gulp.task('html', function () {
  return gulp.src('./src/index.html')
             .pipe(gulp.dest('./public'));
});

gulp.task('watch', function () {
  gulp.watch('./src/js/**/*', 'js');
  gulp.watch('./src/*.html', 'html');
});

gulp.task('default', ['html', 'img', 'js', 'lib']);
