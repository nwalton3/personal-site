/* gulpfile.js */

// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
// var jshint = require('gulp-jshint');
// var sass = require('gulp-sass');
// var concat = require('gulp-concat');
// var uglify = require('gulp-uglify');
// var rename = require('gulp-rename');
var pug = require('gulp-pug');
// var changed = require('gulp-changed');
// var connect = require('gulp-connect');
var plumber = require('gulp-plumber');
// var data = require('gulp-data');
var ext_replace = require('gulp-ext-replace');
// var livereload = require('gulp-livereload');
// var clean = require('gulp-clean');
// var rename = require("gulp-rename");


// Compile Pug
gulp.task( 'pug', function(){
    return gulp.src(['./_pages/**/*.html.pug'])
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            env: "local",
            assets: ""}))
        .pipe(ext_replace('.html', '.html.html'))
        .pipe(gulp.dest('./pages/'));
});


// gulp.task('pug', ['page-index','page-portfolio','page-students']);

// gulp.task('page-index', function() {
//     return gulp.src('pug/portfolio/index.html.jade')
//         .pipe(plumber())
//         .pipe(data( function(file){ return require('./data/index.json'); } ))
//         .pipe(pug({ pretty: true }))
//         .pipe(rename('index.html'))
//         .pipe(gulp.dest('./dist/'))
//         .pipe(livereload());
// });

// gulp.task('page-portfolio', function() {
//     return gulp.src('pug/portfolio/portfolio.html.jade')
//         .pipe(plumber())
//         .pipe(data( function(file){ return require('./data/portfolio.json'); } ))
//         .pipe(pug({ pretty: true }))
//         .pipe(rename('portfolio.html'))
//         .pipe(gulp.dest('./dist/'))
//         .pipe(livereload());
// });

// gulp.task('page-students', function() {
//     return gulp.src('pug/portfolio/portfolio.html.jade')
//         .pipe(plumber())
//         .pipe(data( function(file){ return require('./data/students.json'); } ))
//         .pipe(pug({ pretty: true }))
//         .pipe(rename('students.html'))
//         .pipe(gulp.dest('./dist/'))
//         .pipe(livereload());
// });


// // Compile Sass
// gulp.task('sass', function() {
//     return gulp.src('sass/*.sass')
//         .pipe(plumber())
//         .pipe(sass({outputStyle: 'compressed'}))
//         .pipe(gulp.dest('./dist/css/'))
//         .pipe(livereload());;
// });

// // Lint JS
// gulp.task('lint', function() {
//     return gulp.src('script.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// // Minify JS
// gulp.task('uglify', function () {
//     return gulp.src('js/*.js')
//         .pipe(uglify())
//         .pipe(ext_replace('.min.js', '.js'))
//         .pipe(gulp.dest('./dist/js/'))
//         .pipe(livereload());
// });

// Concatenate & Minify JS
// gulp.task('scripts', ['uglify'] function() {
//     return gulp.src('js/*.js')
//         .pipe(concat('script.min.js'))
//         .pipe(gulp.dest('dist'));
// });





// // Connect server
// gulp.task('connect', function() {
//   connect.server({
//     port: 9007,
//     root: 'dist'
//   });
// });


// Watch Files For Changes
gulp.task('watch', function() {
    // livereload.listen();
    // gulp.watch(['**/*.sass'], ['sass']);
    gulp.watch(['**/*.pug'], ['pug']);
    // gulp.watch(['js/*.js'], ['lint', 'uglify']);
});

// Default Task
gulp.task('default', ['pug', 'watch']);


