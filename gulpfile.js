var gulp = require('gulp');
var browserify = require('gulp-browserify');

var libs = ['react'];

gulp.task('js', function () {
  return gulp.src('./src/js/app.js', { read: false })
             .pipe(browserify({ transform: ['reactify'] }))
             .on('prebundle', function (bundler) {
               libs.forEach(function (lib) { bundler.external(lib); });
             })
             .pipe(gulp.dest('./public/js'));
});

gulp.task('lib', function () {
  return gulp.src('./src/js/lib.js', { read: false })
             .pipe(browserify())
             .on('prebundle', function (bundler) {
               libs.forEach(function (lib) { bundler.require(lib); });
             })
             .pipe(gulp.dest('./public/js'));
});

gulp.task('html', function () {
  return gulp.src('./src/index.html')
             .pipe(gulp.dest('./public'));
});

gulp.task('watch', function () {
  gulp.watch('./src/js/**/*', function () {
    gulp.run('js');
  });
  gulp.watch('./src/*.html', function () {
    gulp.run('html');
  });
});

gulp.task('default', function () {
  gulp.run('html', 'js', 'lib');
});