var gulp = require('gulp');

var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var fileincluder = require('gulp-file-includer')
var jsEscape = require('gulp-js-escape');
var runSequence = require('run-sequence');

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

gulp.task('default', function() {
  runSequence('uglify', 'fileincluder-html','minify-html','escape-js','fileincluder-format','watch');
});
