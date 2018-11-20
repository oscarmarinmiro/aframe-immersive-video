var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var del = require('del');
var copy = require('gulp-copy');

// Define default destination folder

var dest = 'dist/';

gulp.task('clean', function() {
    return del([dest + '*.js']);
});

var jsFiles = [
    'node_modules/howler/dist/howler.min.js',
   'src/aframe-immersive-video-component.js',
   'src/aframe-uipack-constants.js',
   'src/aframe-uipack-themes.js',
   'src/aframe-uipack-component.js',
   'src/aframe-uipack-utils.js',
];

gulp.task('min', function() {

    return gulp.src(jsFiles)
        .pipe(filter('**/*.js'))
        .pipe(concat('aframe-immersive-video-component.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest));



});

gulp.task('js', function() {


    return gulp.src(jsFiles)
        .pipe(filter('**/*.js'))
        .pipe(concat('aframe-immersive-video-component.js'))
        .pipe(gulp.dest(dest));



});




gulp.task('default', ['clean'], function() {
    gulp.start('js');
    gulp.start('min');
});




