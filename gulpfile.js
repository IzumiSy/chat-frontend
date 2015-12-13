var gulp     = require("gulp");

var sass     = require("gulp-sass");
var jade     = require("gulp-jade");
var prefix   = require("gulp-autoprefixer");
var header   = require("gulp-header");
var server   = require("gulp-webserver");
var plumber  = require("gulp-plumber");
var jshint   = require("gulp-jshint")
var concat   = require("gulp-concat");
var rename   = require("gulp-rename");

var del        = require("del");
var sequence   = require("run-sequence");
var stringify  = require("stringify");
var browserify = require("browserify");
var source     = require("vinyl-source-stream");

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
      "./node_modules/flat-ui/css/flat-ui.css",
      "./node_modules/nanoscroller/bin/css/nanoscroller/css"
    ],

    js: [
      "./node_modules/jquery/dist/jquery.js",
      "./node_modules/bootstrap/dist/js/bootstrap.js",
      "./node_modules/vue/dist/vue.js",
      "./node_modules/vue-resource/dist/vue-resource.js",
      "./node_modules/vue-router/dist/vue-router.js",
      "./node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js"
    ],

    icons: [
      "./node_modules/flat-ui/images/icons/png/*.png"
    ]
  },

  assets: "./assets/*.png"
};

var distDir = "./dist/";
var assetsDir = "./dist/assets/";
var appJS = "app.js";
var vendersJS = "venders.js"
var vendersCSS = "venders.css"

gulp.watch(targets.sass, ["sass"]);
gulp.watch(targets.jade, ["html"]);
gulp.watch(targets.js, ["js"]);
gulp.watch(targets.venders.js, ["venders-concat-js"]);
gulp.watch(targets.venders.css, ["venders-concat-css"]);
gulp.watch(targets.assets, ["copy-assets"]);

gulp.task("default", function() {
  gulp.src(distDir)
    .pipe(plumber())
    .pipe(server({
      root: distDir,
      livereload: true,
      open: true
     }));
  sequence("sass", "jade", "js", "venders-concat-js",
           "venders-concat-css", "copy-vendor-icons",
           "copy-assets");
});

gulp.task("sass", function() {
  console.log("[TASK] sass processing...");
  return gulp.src(targets.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(header('@charset "utf-8";\n'))
    .pipe(gulp.dest(distDir))
});

gulp.task("html", function() {
  sequence("jade", "js");
});

gulp.task("jade", function() {
  console.log("[TASK] jade processing...");
  return gulp.src(targets.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(distDir));
});

gulp.task("js", function() {
  sequence("copy-js", "browserify", "jshint");
});

gulp.task("copy-js", function() {
  console.log("[TASK] concat-js processing...");
  return gulp.src(targets.js)
    .pipe(plumber())
    .pipe(gulp.dest(distDir));
});

gulp.task("browserify", function() {
  console.log("[TASK] browserify processing...");
  return browserify({
      entries: [distDir + appJS]
    })
    .transform(stringify(['.html']))
    .bundle()
    .on('error', function(err) {
      console.log(err.toString());
      this.emit("end");
    })
    .pipe(source(appJS))
    .pipe(gulp.dest(distDir));
});

gulp.task("jshint", function() {
  console.log("[TASK] jshint processing...");
  return gulp.src(targets.js)
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("venders-concat-js", function() {
  console.log("[TASK] venders-concat-js processing...");
  return gulp.src(targets.venders.js)
    .pipe(plumber())
    .pipe(concat(vendersJS))
    .pipe(gulp.dest(distDir));
});

gulp.task("venders-concat-css", function() {
  console.log("[TASK] venders-concat-css processing...");
  return gulp.src(targets.venders.css)
    .pipe(plumber())
    .pipe(concat(vendersCSS))
    .pipe(gulp.dest(distDir));
});

gulp.task("copy-vendor-icons", function() {
  console.log("[TASK] copy-icons processing...");
  return gulp.src(targets.venders.icons)
    .pipe(plumber())
    .pipe(gulp.dest(assetsDir));
});

gulp.task("copy-assets", function() {
  console.log("[TASK] copy-assets processing...");
  return gulp.src(targets.assets)
    .pipe(plumber())
    .pipe(rename({ prefix: "face-" }))
    .pipe(gulp.dest(assetsDir));
});

gulp.task("clean", function() {
  del([distDir + "*.*", distDir + "/**/*"]);
});

