import gulp from 'gulp';
import ghPages from 'gulp-gh-pages';

gulp.task('deploy', () => gulp.src('./dist/**/*')
  .pipe(ghPages({
    branch: 'master',
    cacheDir: './node_modules/gulp-gh-pages/.publish',
  })));
