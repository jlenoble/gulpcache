import GulpTask from './src/gulptask';
import gulp from 'gulp';
import babel from 'gulp-babel';

new GulpTask({
  name: 'transpile',
  glob: 'src/gulptask.js',
  dest: 'build',
  pipe: babel,
  sourcemaps: true,
});

gulp.task('default', gulp.series('exec:transpile'));
