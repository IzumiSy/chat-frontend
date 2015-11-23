var gulp     = require("gulp")
var sass     = require("gulp-sass")
var jade     = require("gulp-jade")
var concat   = require("gulp-concat")
var prefix   = require("gulp-autoprefixer")
var header   = require("gulp-header")
var server   = require("gulp-webserver")
var plumber  = require("gulp-plumber")
var del      = require("del")
var sequence = require("run-sequence")

var sassTargets = [
  "./styles/*.scss",
  "./styles/**/*.scss",
  "./styles/**/_*.scss"
];
var jadeTargets = [
  "./jade/*.jade",
  "./jade/**/*.jade",
  "./jade/**/_*.jade"
];
var jsTargets = [
  "./js/*.js",
  "./js/**/*.js"
];

gulp.task("default", ["sass", "jade", "concat-js"], function() {
  gulp.src("app")
    .pipe(plumber())
    .pipe(server({
      livereload: true,
      open: true
     }));
  gulp.watch(sassTargets, ["sass"]);
  gulp.watch(jadeTargets, ["jade"]);
  gulp.watch(jsTargets, ["concat-js"]);
});

gulp.task("sass", function() {
  console.log("[TASK] sass processing...");
  gulp.src(sassTargets)
    .pipe(plumber())
    .pipe(sass())
    .pipe(header('@charset "utf-8;\n'))
    .pipe(gulp.dest("./app/"))
});

gulp.task("jade", function() {
  console.log("[TASK] jade processing...");
  gulp.src(jadeTargets)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest("./app/"))
});

gulp.task("concat-js", function() {
  var output = "app/application.js"
  console.log("[TASK] concat-js processing...");
  gulp.src(jsTargets)
    .pipe(plumber())
    .pipe(concat(output))
    .pipe(gulp.dest("./app/"))
});

gulp.task("clean", function() {
  del(["./app/*.*"]);
});

