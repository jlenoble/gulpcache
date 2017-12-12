import GulpTask from './src/gulptask';
import gulp from 'gulp';
import babel from 'gulp-babel';

new GulpTask({
  name: 'copy',
  glob: 'src/**/*.js',
  dest: 'tmp',
  debug: true,
});

new GulpTask({
  name: 'transpile',
  glob: 'tmp/src/**/*.js',
  dest: 'build',
  pipe: babel,
  debug: true,
});

gulp.task('default', gulp.series('tdd:transpile'));
