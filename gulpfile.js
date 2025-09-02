const gulp = require('gulp');
const rename = require('gulp-rename');

function buildIcons() {
  return gulp.src(['nodes/**/*.svg'])
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('dist/icons/'));
}

gulp.task('build:icons', buildIcons);
gulp.task('default', gulp.series('build:icons'));
