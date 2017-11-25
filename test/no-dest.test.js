import testGulpProcess from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a no destination task`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-no-dest.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:no-dest'...`,
      `Finished 'exec:no-dest' after`,
      `Finished 'default' after`,
    ],
  }));
});
