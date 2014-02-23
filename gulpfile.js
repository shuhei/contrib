var gulp = require('gulp');
var browserify = require('gulp-browserify');
var plumber = require('gulp-plumber');
var manifest = require('gulp-manifest');
var libBundle = require('./gulp-lib-bundle');

var libs = ['react/addons'];

gulp.task('js', function () {
  return gulp.src('./src/js/app.js', { read: false })
             .pipe(plumber())
             .pipe(browserify({ transform: ['reactify'], external: libs }))
             .pipe(gulp.dest('./public/js'));
});

gulp.task('lib', function () {
  return libBundle(libs, { path: './src/js/lib.js' })
             .pipe(browserify({ require: libs }))
             .pipe(gulp.dest('./public/js'));
});

gulp.task('css', function () {
  return gulp.src('./src/css/*.css')
             .pipe(gulp.dest('./public/css'));
});

gulp.task('img', function () {
  return gulp.src('./src/img/**/*')
             .pipe(gulp.dest('./public/img'));
});

gulp.task('html', function () {
  return gulp.src('./src/index.html')
             .pipe(gulp.dest('./public'));
});

gulp.task('manifest', ['html', 'img', 'css', 'js', 'lib'], function () {
  // node-mime serves '*.appcache' as 'text/cache-manifest'.
  var manifestFile = 'app.appcache';
  return gulp.src('./public/**/*')
             .pipe(manifest({
               hash: true,
               timestamp: false,
               exclude: manifestFile,
               filename: manifestFile
             }))
             .pipe(gulp.dest('./public'));
});

gulp.task('watch', function () {
  gulp.watch(['./src/js/**/*', './src/css/*.css', './src/*.html'], ['manifest']);
});

gulp.task('default', ['manifest']);
