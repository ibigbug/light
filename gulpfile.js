var gulp = require('gulp');

var stylus = require('gulp-stylus');
var nib = require('nib');
var jade = require('gulp-jade');
var base64 = require('gulp-css-base64');
var concat = require('gulp-concat');

var livereload = require('gulp-livereload');

var paths = {
  stylus: {
    src: './assets/stylus/**/*.styl',
    dest: './assets/stylus/'
  },
  css: {
    src: './assets/**/*.css',
    dest: './light/static'
  },
  jade: {
    input: './assets/jade/**/*.jade',
    src: [
      './assets/jade/layout.jade',
      './assets/jade/post.jade',
      './assets/jade/index.jade',
      './assets/jade/single.jade'
    ],
    dest: './light/'
  }
};


gulp.task('stylus', function () {
  gulp.src(paths.stylus.src)
    .pipe(stylus({ use: [nib()]}))
    .pipe(gulp.dest(paths.stylus.dest))
})

gulp.task('css', ['stylus'], function () {
  gulp.src(paths.css.src)
    .pipe(base64({
      baseDir: 'assets',
      maxWeightResource: 1000000,
      verbose: true
    }))
    .pipe(concat('site.css'))
    .pipe(gulp.dest(paths.css.dest))
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
  var build = './light';

  server.use(serveStatic(build)).listen(3000, next);
})

gulp.task('watch', ['server'], function () {
  var server = livereload();
  gulp.watch(paths.jade.input, ['jade'])
  gulp.watch(paths.stylus.src, ['css'])
  gulp.watch(paths.jade.dest + '/**')
    .on('change', function (file) {
      server.changed(file.path);
    })
  gulp.watch(paths.stylus.dest + '/**')
    .on('change', function (file) {
      server.changed(file.path);
    })
})

gulp.task('default', ['css', 'jade', 'watch']);
