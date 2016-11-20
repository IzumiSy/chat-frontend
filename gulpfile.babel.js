import gulp from "gulp";
import s3 from "gulp-awspublish";
import del from "del";
import dotenv from "dotenv";

const dest = "dist";

gulp.task("clean", () => {
  return del([
    `${dest}/**/*`,
    `!${dest}/index.html`
  ]).then(function() {
    return process.exit(0);
  });
});

gulp.task("deploy-s3", () => {
  dotenv.config();

  var publisher = s3.create({
    region: process.env.AWS_REGION,
    params: {
      Bucket: process.env.AWS_BUCKET
    },
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
  });

  return gulp.src(`${dest}/**/*`)
    .pipe(publisher.publish({}, { noAcl: true }))
    .pipe(publisher.cache())
    .pipe(publisher.sync())
    .pipe(s3.reporter());
});
