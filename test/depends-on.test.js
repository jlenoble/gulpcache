import testGulpProcess from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task depending on another`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-depends-on.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      `Finished 'default' after`,
    ],
  }));
});
