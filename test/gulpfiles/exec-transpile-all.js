import GulpTask from './src/gulptask';
import gulp from 'gulp';
import babel from 'gulp-babel';

new GulpTask({
  name: 'transpile:all',
  description: 'Transpiling all Js source files',
  glob: 'src/**/*.js',
  pipe: [babel],
  dest: 'build',
});

gulp.task('default', gulp.series('exec:transpile:all'));
