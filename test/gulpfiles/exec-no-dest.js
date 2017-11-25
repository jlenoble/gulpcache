import GulpTask from './src/gulptask';
import gulp from 'gulp';

new GulpTask({
  name: 'no-dest',
  glob: 'src/**/*.js',
});

gulp.task('default', gulp.series('exec:no-dest'));
