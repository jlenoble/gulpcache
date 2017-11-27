import testGulpProcess, {touchFile} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task depending explicitly on another`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
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

  it(`Testing a tdd task depending explicitly on another`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-depends-on.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      [`Finished 'default' after`,
        touchFile('test/fn.test.js')],
      `Starting 'trigger:transpile'...`,
      [`Finished 'trigger:transpile' after`,
        touchFile('src/gulptask.js')],
      `Starting 'trigger:copy'...`,
      `Starting 'copy'...`,
      `Finished 'copy' after`,
      `Starting 'trigger:transpile'...`,
      `Finished 'trigger:transpile' after`,
      `Finished 'trigger:copy' after`,
    ],
  }));
});
