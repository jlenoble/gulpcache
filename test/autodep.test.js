import testGulpProcess, {touchFile} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task depending implicitly on another`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-autodep.js',

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

  it(`Testing a tdd task depending implicitly on another`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-autodep.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      [`Finished 'default' after`,
        touchFile('tmp/src/gulptask.js')],
      `Starting 'trigger:transpile'...`,
      [`Finished 'trigger:transpile' after`,
        touchFile('src/gulptask.js')],
      `Starting 'trigger:copy'...`,
      `Finished 'trigger:copy' after`,
      `Starting 'trigger:transpile'...`,
      `Finished 'trigger:transpile' after`,
    ],
  }));
});
