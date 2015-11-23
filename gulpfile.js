var gulp     = require("gulp");

var sass     = require("gulp-sass");
var jade     = require("gulp-jade");
var prefix   = require("gulp-autoprefixer");
var header   = require("gulp-header");
var server   = require("gulp-webserver");
var plumber  = require("gulp-plumber");
var jshint   = require("gulp-jshint")
var concat   = require("gulp-concat");

var del      = require("del");
var sequence = require("run-sequence");

var targets = {
  sass: [
    "./styles/*.scss",
    "./styles/**/*.scss",
    "./styles/**/_*.scss"
  ],

  jade: [
    "./jade/*.jade",
    "./jade/**/*.jade",
    "./jade/**/_*.jade"
  ],

  js: [
    "./js/*.js",
    "./js/**/*.js"
  ],

  venders: {
    css: [
      "./vender/css/normalize.css",
      "./node_modules/flat-ui/bootstrap/css/bootstrap.css",
      "./node_modules/flat-ui/css/flat-ui.css"
    ],

    js: [
      "./node_modules/vue/dist/vue.js"
    ]
  }
};

var defaultTasks = [
  "sass",
  "jade",
  "concat-js",
  "jshint",
  "venders-concat-js",
  "venders-concat-css"
];
var destDir = "./dest/";
var concatJS = "application.js"
var vendersJS = "venders.js"
var vendersCSS = "venders.css"

gulp.task("default", defaultTasks, function() {
  gulp.src(destDir)
    .pipe(plumber())
    .pipe(server({
      root: destDir,
      livereload: true,
      open: true
     }));
  gulp.watch(targets.sass, ["sass"]);
  gulp.watch(targets.jade, ["jade"]);
  gulp.watch(targets.js, ["concat-js", "jshint"]);
  gulp.watch(targets.venders.js, ["venders-concat-js"]);
  gulp.watch(targets.venders.css, ["venders-concat-css"]);
});

gulp.task("sass", function() {
  console.log("[TASK] sass processing...");
  return gulp.src(targets.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(header('@charset "utf-8";\n'))
    .pipe(gulp.dest(destDir))
});

gulp.task("jade", function() {
  console.log("[TASK] jade processing...");
  return gulp.src(targets.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(destDir))
});

gulp.task("concat-js", function() {
  console.log("[TASK] concat-js processing...");
  return gulp.src(targets.js)
    .pipe(plumber())
    .pipe(concat(concatJS))
    .pipe(gulp.dest(destDir))
});

gulp.task("venders-concat-js", function() {
  console.log("[TASK] venders-concat-js processing...");
  return gulp.src(targets.venders.js)
    .pipe(plumber())
    .pipe(concat(vendersJS))
    .pipe(gulp.dest(destDir))
});

gulp.task("jshint", function() {
  console.log("[TASK] jshint processing...");
  return gulp.src(targets.js)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
});

gulp.task("venders-concat-css", function() {
  console.log("[TASK] venders-concat-css processing...");
  return gulp.src(targets.venders.css)
    .pipe(plumber())
    .pipe(concat(vendersCSS))
    .pipe(gulp.dest(destDir))
});

gulp.task("clean", function() {
  del([destDir + "*.*"]);
});

