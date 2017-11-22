import testGulpProcess, {compareTranspiled} from './test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a transpile task`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-transpile-all.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`, compareTranspiled('src/**/*.js',
        'build')],
      `Finished 'default' after`,
    ],
  }));
});
