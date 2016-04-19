var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssmin = require('gulp-cssmin'),
    del = require('del'),
    html2js = require('gulp-html-js-template'),
    minify = require('gulp-minify');
    print = require('gulp-print');
    gutil = require('gulp-util');
    

var config = {
    //Include all js files but exclude any min.js files
    js_src: ['app/**/*.js', '!app/**/*.min.js'],
    scss_src :['app/scss/**/*.scss']
}


// Clean the distributable css directory
gulp.task('minify:clean:css', function () {
    return del('app/dist/css/');
});

var errorHandler = function (error) {
    console.log(error);
    this.emit('end');
}

var resolveMinifiedPath = function (path) {
    var params = path.split("/");
    var file = params.splice(params.length - 1, 1)[0];
    var newPath = params.join("/") + "/";

    return {
        file: file,
        path: newPath
    };
}


// Compile out sass files and minify it
gulp.task('minify:css', ['minify:clean:css'], function () {
    var min = resolveMinifiedPath("app/dist/css/ruleengine.min.css");
    gutil.log(min);
    return gulp.src(config.scss_src)
        .pipe(plumber(errorHandler))
        .pipe(sass())
        .pipe(gulp.dest('app/dist/css/'))
        .pipe(print())
        .pipe(cssmin())
        .pipe(concat(min.file))
        .pipe(gulp.dest(min.path));
});


//delete the output file(s)
gulp.task('minify:clean:js', function () {
    //del is an async function and not a gulp plugin (just standard nodejs)
    //It returns a promise, so make sure you return that from this task function
    //  so gulp knows when the delete is complete
    return del(['app/dist/js/']);
});

// Combine and minify all files from the app folder 
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('minify:js', ['minify:clean:js'], function () {

    return gulp.src(config.js_src)
      .pipe(uglify())
      .pipe(concat('ruleengine.min.js'))
      .pipe(gulp.dest('app/dist/js'));
});

//Set a default tasks
gulp.task('default', ['default:clean', 'minify:js', 'minify:css'], function () { });

//Set a default clean everything
gulp.task('default:clean', ['minify:clean:js', 'minify:clean:css'], function () { });

gulp.task('watch', function () {
    gulp.watch([config.js_src, config.scss_src], ['default:clean', 'default']);
});