var gulp = require('gulp');

var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify');

gulp.task('scripts', function(){

	gulp.src(['./js/src/util.js','./js/src/editor.js','./js/src/validate.js','./js/src/dom.js' ])
		.pipe(babel({
			presets:['es2015']
		}))
		.pipe(concat('foo.js'))
		.pipe(gulp.dest('./temp'))


    gulp.src([

    	'./js/lib/src-min-noconflict/ace.js',
    	'./js/lib/src-min-noconflict/worker-javascript.js',
    	'./js/lib/src-min-noconflict/mode-javascript.js',
    	'./js/lib/src-min-noconflict/theme-dreamweaver.js',
    	'./js/lib/esprima.min.js',
    	 './temp/*.js'

    	])
        .pipe(concat('script.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'))

});

