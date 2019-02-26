const { src, dest, parallel, series } = require('gulp');
const gulp = require('gulp');
const  bs = require('browser-sync').create(); // create a browser sync instance.
const sass = require('gulp-sass');


function browserSync() {
    bs.init({
        server: {
            baseDir: "./build"
        }
    });
}

function bsReload() {
    bs.reload();
}

function css() {
  return src('scss/*.scss')
    .pipe(sass())
    .pipe(dest('build/css'))
    .pipe(bs.stream())
}

function js() {
  return src('js/*.js')
    .pipe(dest('build/js'))
    .pipe(bs.stream())
}

function html() {
    return src('*.html')
      .pipe(dest('build'))
      .pipe(bs.stream())
}
  

function data() {
    return src('data/*')
      .pipe(dest('build/data'))
      .pipe(bs.stream())
}


function res() {
    return src('res/*')
      .pipe(dest('build/res'))
}

function watchFiles() {
    gulp.watch("./scss/*", css);
    gulp.watch("./js/*", js);
    gulp.watch("./*.html", html);
    gulp.watch("./data/*", data);
    gulp.watch("./res/*", res);
}

const watch = gulp.parallel(watchFiles, browserSync);
const build = gulp.parallel(css,html,js,data,res);
  
 
exports.js = js;
exports.css = css;
exports.html = html;
exports.data = data;
exports.watchFiles = watchFiles;
exports.watch = watch;
exports.bsReload = bsReload;
exports.default = build;
