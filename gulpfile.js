var gulp   = require("gulp");
var s3     = require("gulp-awspublish")
var del    = require("del");
var dotenv = require("dotenv");

var targets = {
  assets: "./assets/*.png"
};

var dists = {
  app:   "app.js",
  dest: "./dist/",
}

/*
gulp.task("copy-assets", function() {
  return gulp.src(targets.assets)
    .pipe(plumber())
    .pipe(rename({ prefix: "face-" }))
    .pipe(gulp.dest(dists.assets));
});
*/

gulp.task("clean", function() {
  return del([
    dists.dest + "*.*",
    dists.dest + "/**/*",
    "!" + dists.dest + "/index.html"
  ]).then(function() {
    return process.exit(0);
  });
});

gulp.task("deploy-s3", function() {
  var publisher = s3.create({
    region: process.env.AWS_REGION,
    params: {
      Bucket: process.env.AWS_BUCKET
    },
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
  });

  return gulp.src(dists.dest + "**/*")
    .pipe(publisher.publish({}, { noAcl: true }))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(s3.reporter());
});
