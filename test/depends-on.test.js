import testGulpProcess, {touchFile} from 'test-gulp-process';

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

  it(`Testing a tdd task depending on another`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-depends-on.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      [`Finished 'default' after`, touchFile('tmp/src/gulptask.js')],
      `Starting 'transpile'...`,
      [`Finished 'transpile' after`, touchFile('src/gulptask.js')],
      `Starting 'copy'...`,
      `Finished 'copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
    ],
  }));
});