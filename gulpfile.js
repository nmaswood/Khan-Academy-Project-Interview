var gulp = require('gulp');

var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify');
var order = require('gulp-order');

gulp.task('scripts', function(){

	gulp.src('./js/src/validate.js')
		.pipe(babel({
			presets:['es2015']
		}))
		.pipe(concat('foo.js'))
		.pipe(gulp.dest('./temp'))


    gulp.src(['./js/src/esprima.min.js', './temp/*.js'])
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'))
});