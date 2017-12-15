import testGulpProcess, {hasSourcemap} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task with sourcemaps option set`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-sourcemaps.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      [`Finished 'exec:transpile' after`, hasSourcemap('src/gulptask.js',
        'build')],
      `Finished 'default' after`,
    ],
  }));
});
