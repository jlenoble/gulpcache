import GulpTask from './src/gulptask';
import gulp from 'gulp';

new GulpTask({
  name: 'hello',
  glob: 'src/**/*.js',
  fn: done => {
    console.log('Hello');
    done();
  },
});

gulp.task('default', gulp.series('tdd:hello'));
