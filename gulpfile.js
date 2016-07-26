var gulp = require('gulp');

var shell = require('gulp-shell')
var minifyHTML = require('gulp-minify-html');
var fileincluder = require('gulp-file-includer')
var jsEscape = require('gulp-js-escape');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var debug = require('gulp-debug');

gulp.task('buildRequireJS', function () {
  return gulp.src('*.js', {read: false})
    .pipe(shell([
      'r.js -o build/build.js'
    ]))
});

gulp.task('fileincluder-html-2', function() {
  return gulp.src(['sf.html'])
            .pipe(debug({title: 'Got storyformat.html'}))
            .pipe(fileincluder({
              prefix: '@@',
              basepath: '@root'
            }))
            .pipe(debug({title: 'Included js'}))
            .pipe(gulp.dest('./dist/'))
            .pipe(debug({title: 'Put in dist/'}))
});

gulp.task('fileincluder-html', function() {
  return gulp.src(['storyFormat.html'])
            .pipe(debug({title: 'Got storyformat.html'}))
            .pipe(fileincluder({
              prefix: '@@',
              basepath: '@file'
            }))
            .pipe(debug({title: 'Included js'}))
            .pipe(gulp.dest('./dist/'))
            .pipe(debug({title: 'Put in dist/'}))
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: false,
    spare:false
  };

  return gulp.src('./dist/storyFormat.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('escape-js', function() {
  var opts = {
    omitDelimiters: true
  };

  return gulp.src( 'dist/storyFormat.html' )
      .pipe( jsEscape(opts) )
      .pipe( gulp.dest('dist/escaped/') )
});

gulp.task('fileincluder-format', function() {
  return gulp.src(['format.js'])
    .pipe(fileincluder())
    .pipe(gulp.dest('dist/'))
});

gulp.task('clean-dist', function() {
  //gulp.src('./dist/out.js', {read: false})
        //.pipe(clean()); 
  //gulp.src('./dist/escaped', {read: false})
       // .pipe(clean());
  return gulp.src('./build/out.js', {read: false})
        .pipe(clean());     
});

gulp.task('default', function() {
  runSequence('clean-dist', 'buildRequireJS', 'fileincluder-html','minify-html','escape-js','fileincluder-format','clean-dist');
});

