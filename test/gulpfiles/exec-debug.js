import GulpTask from './src/gulptask';
import gulp from 'gulp';
import babel from 'gulp-babel';

new GulpTask({
  name: 'copy',
  glob: 'src/gulptask.js',
  dest: 'tmp',
  debug: true,
});

new GulpTask({
  name: 'transpile',
  glob: 'tmp/src/gulptask.js',
  dest: 'build',
  pipe: babel,
  debug: true,
});

gulp.task('default', gulp.series('exec:transpile'));
