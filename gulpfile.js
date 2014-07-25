var gulp = require('gulp');

var stylus = require('gulp-stylus');
var nib = require('nib');
var jade = require('gulp-jade');
var base64 = require('gulp-css-base64');
var concat = require('gulp-concat');

var livereload = require('gulp-livereload');

var paths = {
  _stylus: {
    input: './assets/stylus/**/*.styl',
    dest: './light/css/'
  },
  css: {
    input: './light/css',
    dest: './light/css'
  },
  _includes: {
    input: [
      './assets/jade/head.jade',
      './assets/jade/header.jade',
      './assets/jade/footer.jade'
    ],
    dest: './light/_includes'
  },
  _layouts: {
    input: [
      './assets/jade/default.jade',
      './assets/jade/page.jade',
      './assets/jade/post.jade'
    ],
    dest: './light/_layouts/',
  },
};


gulp.task('_stylus', function () {
  gulp.src(paths._stylus.input)
    .pipe(stylus({ use: [nib()]}))
    .pipe(gulp.dest(paths._stylus.dest))
})

gulp.task('css', ['_stylus'], function () {
  gulp.src(paths.css.input)
    .pipe(base64({
      baseDir: 'assets',
      maxWeightResource: 1000000,
      verbose: true
    }))
    .pipe(concat('light.css'))
    .pipe(gulp.dest(paths.css.dest))
})

gulp.task('template', function () {
  var folders = ['_includes', '_layouts'];
  folders.forEach(function(folder){
    gulp.src(paths[folder].input)
      .pipe(jade())
      .pipe(gulp.dest(paths[folder].dest))
  });
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
  gulp.watch('./assets/jade/*.jade', ['template'])
  gulp.watch(paths.stylus.input, ['css'])
  gulp.watch('./light/**/*.html')
    .on('change', function (file) {
      server.changed(file.path);
    })
  gulp.watch(paths.stylus.dest + '/**')
    .on('change', function (file) {
      server.changed(file.path);
    })
})

gulp.task('default', ['css', 'template']);
gulp.task('dev', ['css', 'template', 'watch']);
