var gulp = require('gulp');

var stylus = require('gulp-stylus');
var nib = require('nib');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var base64 = require('gulp-css-base64');
var rimraf = require('gulp-rimraf');
var cssmin = require('gulp-cssmin');

var livereload = require('gulp-livereload');

var paths = {
  css: {
    input: './assets/stylus/**',
    dest: './light/css/'
  },
  _includes: {
    input: [
      './assets/jade/head.jade',
      './assets/jade/header.jade',
      './assets/jade/footer.jade',
      './assets/jade/comments.jade',
      './assets/jade/ga.jade'
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
  _pages: {
    input: [
      './assets/jade/index.jade',
      './assets/jade/archives.jade'
    ],
    dest: './light/'
  }
};


gulp.task('css', function () {
  gulp.src(paths.css.input)
    .pipe(stylus({use: [nib()]}))
    .pipe(base64({
      verbose: true,
      baseDir: './assets',
      maxWeightResource: 100000000,
    }))
    .pipe(concat('site.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(paths.css.dest))
})

gulp.task('template', function () {
  var targets = ['_includes', '_layouts', '_pages'];
  targets.forEach(function(t){
    gulp.src(paths[t].input)
      .pipe(jade({pretty: false}))
      .pipe(gulp.dest(paths[t].dest))
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
  gulp.watch(paths._stylus.input, ['css'])
  gulp.watch('./light/**/*.html')
    .on('change', function (file) {
      server.changed(file.path);
    })
  gulp.watch(paths._stylus.dest + '/**')
    .on('change', function (file) {
      server.changed(file.path);
    })
})

gulp.task('clean', function () {
  for (var target in paths) {
    gulp.src(paths[target].dest, {read: false})
      .pipe(rimraf());
  }
})

gulp.task('default', ['css', 'template']);
gulp.task('dev', ['css', 'template', 'watch']);
