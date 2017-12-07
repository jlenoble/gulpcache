import testGulpProcess, {touchFile, isFound, compareTranspiled, snapshot,
  isNewer, isUntouched} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task depending explicitly on another`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-depends-on.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      [`Finished 'exec:copy' after`,
        isFound('tmp/src/gulptask.js')],
      `Starting 'transpile'...`,
      [`Finished 'transpile' after`,
        compareTranspiled('test/**/*.js', 'build')],
      `Finished 'exec:transpile' after`,
      `Finished 'default' after`,
    ],
  }));

  it(`Testing a tdd task depending explicitly on another`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-depends-on.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      [`Finished 'default' after`,
        snapshot('tmp/src/**/*.js'),
        snapshot('build/test/**/*.js'),
        touchFile('test/fn.test.js')],
      `Starting 'trigger:transpile'...`,
      [`Finished 'trigger:transpile' after`,
        isNewer('build/test/**/*.js'),
        isUntouched('tmp/src/**/*.js'),
        snapshot('build/test/**/*.js'),
        snapshot('tmp/src/**/*.js'),
        touchFile('src/gulptask.js')],
      `Starting 'trigger:copy'...`,
      `Starting 'copy'...`,
      `Finished 'copy' after`,
      `Starting 'trigger:transpile'...`,
      `Finished 'trigger:transpile' after`,
      [`Finished 'trigger:copy' after`,
        isNewer('tmp/src/**/*.js'),
        isNewer('build/test/**/*.js')],
    ],
  }));
});
