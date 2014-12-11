var gulp = require('gulp'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),
    jade = require('gulp-jade'),
    data = require('gulp-data'),
    path = require('path'),
    fs = require('fs'),
    sass = require('gulp-ruby-sass'),
    prefix = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    runSequence = require('run-sequence'),
    process = require('child_process');

// Error handling - Send error to notification center with gulp-notify
var handleErrors = function() {
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, arguments);
  this.emit('end');
};

gulp.task('default', ['browser-sync', 'watch']);

// Watch task
gulp.task('watch', function() {
  gulp.watch('src/templates/*.jade', ['jade']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
  gulp.watch('src/img/**/*.{png,jpg,jpeg,gif}', ['images']);
});

// Jade task
gulp.task('jade', function() {
  return gulp.src('src/templates/*.jade')
    .pipe(plumber())
    .pipe(changed('dist', {extension: '.html'}))
    .pipe(data(function(file) {
      // return require('./data/' + path.basename(file.path) + '.json');
      return JSON.parse(fs.readFileSync('./src/data/' + path.basename(file.path) + '.json'));
    }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify('Templates task complete!'));
});

// Sass task
gulp.task('sass', function() {
  return gulp.src('src/sass/**/*.scss')
  .pipe(plumber())
  .pipe(sass({
    'sourcemap=none': true,
    lineNumbers: true
  }))
  .pipe(prefix({
    browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7']
  }))
  .pipe(gulp.dest('dist/css/'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(gulp.dest('dist/css/'))
  .pipe(notify('Styles task complete!'));
});

// JS task
gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js/'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify('Scripts task complete!'));
});

// Clean images folder
gulp.task('clean-images', function(cb) {
  del(['dist/img/'], cb);
});

// Move images to dest folder
gulp.task('images', ['clean-images'], function() {
  return gulp.src('src/img/**/*.{png,jpg,jpeg,gif}')
    .pipe(plumber())
    .pipe(gulp.dest('dist/img/'))
    .pipe(notify('Image optimized!'));
});

// Compress images to dist
gulp.task('dist-images', function() {
  return gulp.src('src/img/**/*.{png,jpg,jpeg,gif}')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/img/'))
    .pipe(notify('Image optimized!'));
});

// Browser-sync task
gulp.task('browser-sync', ['jade', 'sass', 'js', 'images'], function() {
  return browserSync.init(null, {
    server: {
      baseDir: 'dist'
    }
  });
});