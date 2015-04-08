var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var fileincluder = require('gulp-file-includer')
var jsEscape = require('gulp-js-escape');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var jslint = require('gulp-jslint');
 
// build the main source into the min file 
gulp.task('jslint', function () {
    return gulp.src(['TwineJson.js'])
 
        // pass your directives 
        // as an object 
        .pipe(jslint({
            // these directives can 
            // be found in the official 
            // JSLint documentation. 
            node: true,
            evil: true,
            nomen: true,
 
            // you can also set global 
            // declarations for all source 
            // files like so: 
            global: [],
            predef: [],
            // both ways will achieve the 
            // same result; predef will be 
            // given priority because it is 
            // promoted by JSLint 
 
            // pass in your prefered 
            // reporter like so: 
            reporter: 'default',
            // ^ there's no need to tell gulp-jslint 
            // to use the default reporter. If there is 
            // no reporter specified, gulp-jslint will use 
            // its own. 
 
            // specifiy custom jslint edition 
            // by default, the latest edition will 
            // be used 
            edition: '2014-07-08',
 
            // specify whether or not 
            // to show 'PASS' messages 
            // for built-in reporter 
            errorsOnly: true
        }))
 
        // error handling: 
        // to handle on error, simply 
        // bind yourself to the error event 
        // of the stream, and use the only 
        // argument as the error object 
        // (error instanceof Error) 
        .on('error', function (error) {
            console.error(String(error));
        });
});

gulp.task('fileincluder-html', function() {
  return gulp.src(['storyFormat.html'])
            .pipe(fileincluder())
            .pipe(gulp.dest('dist/'))
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

gulp.task('clean-dist', function() {
  gulp.src('./dist/escaped/', {read: false})
        .pipe(clean());
  gulp.src('./dist/*.html', {read: false})
        .pipe(clean());     
  return gulp.src('./dist/TwineJson.js', {read: false})
        .pipe(clean());    
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


gulp.task('uglify', function () {
  return gulp.src('TwineJson.js')
             .pipe(uglify())
             .pipe(gulp.dest('dist/'))
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('TwineJson.js', ['default']);
});

gulp.task('lint', function() {
  runSequence( 'jslint','uglify','fileincluder-html','minify-html','escape-js','fileincluder-format','clean-dist','watch');
});

gulp.task('default', function() {
  runSequence( 'uglify','fileincluder-html','minify-html','escape-js','fileincluder-format','clean-dist','watch');
});
