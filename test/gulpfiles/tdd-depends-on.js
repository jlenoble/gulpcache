import GulpTask from './src/gulptask';
import gulp from 'gulp';
import babel from 'gulp-babel';

new GulpTask({
  name: 'copy',
  glob: 'src/**/*.js',
  dest: 'tmp',
});

new GulpTask({
  name: 'transpile',
  glob: 'test/**/*.js',
  dest: 'build',
  pipe: babel,
  dependsOn: 'copy',
});

gulp.task('default', gulp.series('tdd:transpile'));
