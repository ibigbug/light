var gulp = require('gulp');

var stylus = require('gulp-stylus');
var nib = require('nib');
var jade = require('gulp-jade');

var livereload = require('gulp-livereload');

var paths = {
  stylus: {
    src:'./assets/stylus/**/*.styl',
    dest: './light/static/'
  },
  jade: {
    input: './assets/jade/**/*.jade',
    src: [
      './assets/jade/layout.jade'
    ],
    dest: './light/'
  }
};


gulp.task('stylus', function () {
  gulp.src(paths.stylus.src)
    .pipe(stylus({ use: [nib()]}))
    .pipe(gulp.dest(paths.stylus.dest))
})

gulp.task('jade', function () {
  gulp.src(paths.jade.src)
    .pipe(jade())
    .pipe(gulp.dest(paths.jade.dest))
})

gulp.task('server', function (next) {
  var connect = require('connect'),
      serveStatic = require('serve-static'),
      server = connect();

  server.use(serveStatic(paths.jade.dest)).listen(3000, next);
})

gulp.task('watch', ['server'], function () {
  var server = livereload();
  gulp.watch(paths.jade.input, ['jade'])
  gulp.watch(paths.jade.dest + '/**')
    .on('change', function (file) {
      server.changed(file.path);
    })
})

gulp.task('default', ['stylus', 'jade', 'watch']);
