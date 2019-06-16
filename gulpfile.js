var gulp = require("gulp");
//convertion ts en fichier js pour browser
var browserify = require("browserify");
//ressourse / helper pour organiser les fichiers, aide browserify
var source = require('vinyl-source-stream');
//plugin utilisé par browserify
var tsify = require("tsify");
// compile le sass
var sass = require('gulp-sass');
// créé une variable path pour le copy html
var paths = {
    pages: ['src/*.html']
};

// récupère toutes les pages et copie le tout dans dist
gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

// Sass configuration

gulp.task('sass', function(cb) {
    gulp.src('./src/assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest("dist/assets/css"));
    cb();
});

//tache principale
gulp.task("default", gulp.series(gulp.parallel('copy-html'), gulp.parallel('sass'), function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
}));

