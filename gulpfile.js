const gulp = require('gulp');
const fs = require('fs');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const nunjucksRender = require('gulp-nunjucks-render');
const include = require("gulp-include");
const data = require('gulp-data');
const babel = require('gulp-babel');
const browserify = require('gulp-browserify');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const responsive = require('gulp-responsive');
const jeditor = require("gulp-json-editor");

const browsers = ['since 2013'];


// Static Server + watching scss/html files
gulp.task('serve', ['styles', 'html', 'scripts', 'images', 'previews', 'icons', 'manifest'], function() {

  browserSync.init({
    server: "./public"
  });

  //css
  gulp.watch("src/scss/**/*.scss", ['styles']);
  //js
  gulp.watch("src/js/**/*.js", ['scripts']);
  //html
  gulp.watch("src/**/*.+(html|nunjucks)", ['html']);
  gulp.watch("src/data.json", ['html']);
  gulp.watch("public/*.html").on('change', browserSync.reload);
  //img
  gulp.watch("src/img/*", ['images']);
  gulp.watch("public/img/*").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function () {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['node_modules/']
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: browsers
    }))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

// nunjucks render
gulp.task('html', function () {
  return gulp.src('src/pages/**/*.+(html|nunjucks)')
    .pipe(data(function() {
      // return require('./src/data.json')
      return JSON.parse(fs.readFileSync('./src/data.json'));
    }))
    .pipe(nunjucksRender({
      path: ['src/templates/']
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('public'));
});

//scripts
gulp.task("scripts", function() {
  gulp.src("src/js/main.js")
    .pipe(include())
      .on('error', console.log)
    .pipe(babel({
      "presets": [
        ["env", {
          "targets": {
            "browsers": browsers
          }
        }]
      ],
      "minified": true,
      "comments": false
    }))
    .pipe(browserify())
    .pipe(gulp.dest("public/js"))
    .pipe(browserSync.stream());
});


gulp.task('images', () =>
  gulp.src(['src/img/*.{png,jpg}', '!src/img/works/**', '!./src/img/icon.png'])
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest('public/img'))
);

gulp.task('icons', () => {
  let icons = {'*':[]};
  JSON.parse(fs.readFileSync('./src/data.json')).icons.forEach((res)=>{
    icons['*'].push({
      width: res,
      height: res,
      withMetadata: false,
      rename: {
        suffix: ('-'+res+'x'+res),
        extname: '.png'
      }
    });
    
  });
  gulp.src('./src/img/icon.png')
    .pipe(responsive(icons))
    .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest("public/img/icons"))
});

gulp.task('manifest', () => {
  gulp.src("./src/manifest.json")
    .pipe(jeditor(function(json){
      let data = JSON.parse(fs.readFileSync('./src/data.json'));
      json.name = data.name;
      json.short_name = data.name;
      json.icons = [];
      data.icons.forEach((res)=>{
        json.icons.push({
          "src": "img/icons/icon-"+res+"x"+res+".png",
          "sizes": res+"x"+res,
          "type": "image/png"
        });
      });
      return json;
    }))
    .pipe(gulp.dest("./public"));
}
);



gulp.task('previews', function () {
  return gulp.src('src/img/works/*.{png,jpg}')
    .pipe(responsive({
      '*': [
        {
          width: 575,
          height: Math.floor(Math.random()*5)*50 + 450,
          withMetadata: false,
          rename: {
            suffix: '_preview',
            extname: '.jpg',
          },
          crop: "north"
        },
        {
          rename: {
            withMetadata: false,
            suffix: '_full',
            extname: '.jpg',
          }
        }
      ]
    }))
    // .pipe(imagemin({progressive: true}))
    .pipe(gulp.dest('public/img/works'));
});


gulp.task('default', ['serve']);