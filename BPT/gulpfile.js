// Gulp.js configuration
var
    // modules
    gulp = require('gulp'),

    // development mode?
    devBuild = (process.env.NODE_ENV !== 'production'),

    // folders
    folder = {
        src: 'src/',
        build: 'build/'
    }
    ;

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

//script paths
var jsFiles = 'scripts/**/*.js', js2 = 'content/**/*.js', js3 = 'app/**/*.js',
    jsDest = 'dist/scripts';

gulp.task('scripts', function () {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
});
gulp.task('scripts', function () {
    return gulp.src(js2)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
});
gulp.task('scripts', function () {
    return gulp.src(js3)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest));
});


gulp.task('scripts', function () {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});
gulp.task('scripts', function () {
    return gulp.src(js2)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});
gulp.task('scripts', function () {
    return gulp.src(js3)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});