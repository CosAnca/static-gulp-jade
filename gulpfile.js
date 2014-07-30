var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    jade = require('gulp-jade'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    process = require('child_process');

gulp.task('default', ['browser-sync', 'watch']);

// Watch task
gulp.task('watch', function() {
  gulp.watch('*.jade', ['jade']);
  gulp.watch('public/css/**/*.scss', ['sass']);
  gulp.watch('public/js/*.js', ['js']);
});

// Jade task
gulp.task('jade', function() {
  return gulp.src('*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('Build/'))
    .pipe(browserSync.reload({stream:true}));
});

// Sass task
gulp.task('sass', function() {
  return gulp.src('public/css/**/*.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(prefix(['last 2 versions'], {
    cascade: true
  }))
  .pipe(gulp.dest('Build/public/css'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest('Build/public/css'));
});

// JS task
gulp.task('js', function() {
  return gulp.src('public/js/*.js')
    .pipe(plumber())
    .pipe( uglify() )
    .pipe( concat('all.min.js'))
    .pipe( gulp.dest('Build/public/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Browser-sync task
gulp.task('browser-sync', ['jade', 'sass', 'js'], function() {
  return browserSync.init(null, {
    server: {
      baseDir: 'Build'
    }
  });
});