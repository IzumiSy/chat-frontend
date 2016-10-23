var gulp   = require("gulp");
var s3     = require("gulp-awspublish")
var del    = require("del");
var dotenv = require("dotenv");

const dest = "./dist";

gulp.task("clean", function() {
  return del([
    dest + "*.*",
    dest + "/**/*",
    "!" + dest + "/index.html"
  ]).then(function() {
    return process.exit(0);
  });
});

gulp.task("deploy-s3", function() {
  dotenv.config();

  var publisher = s3.create({
    region: process.env.AWS_REGION,
    params: {
      Bucket: process.env.AWS_BUCKET
    },
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
  });

  return gulp.src(dest + "**/*")
    .pipe(publisher.publish({}, { noAcl: true }))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(s3.reporter());
});
