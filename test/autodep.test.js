import testGulpProcess, {touchFile, isFound, compareTranspiled, snapshot,
  isNewer, isUntouched} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task depending implicitly on another`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-autodep.js',
    debug: true,

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      [`Finished 'exec:copy' after`,
        isFound('tmp/src/gulptask.js')],
      `Starting 'transpile'...`,
      [`Finished 'transpile' after`,
        compareTranspiled('src/**/*.js', 'build/tmp')],
      `Finished 'exec:transpile' after`,
      `Finished 'default' after`,
    ],
  }));

  it(`Testing a tdd task depending implicitly on another`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-autodep.js',
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
        snapshot('build/tmp/src/**/*.js'),
        snapshot('tmp/src/**/*.js'),
        touchFile('tmp/src/gulptask.js')],
      `Starting 'trigger:transpile'...`,
      [`Finished 'trigger:transpile' after`,
        isNewer('tmp/src/gulptask.js'),
        isNewer('build/tmp/src/gulptask.js'),
        isUntouched('src/**/*.js'),
        isUntouched(['tmp/src/**/*.js', '!tmp/src/gulptask.js']),
        isUntouched(['build/tmp/src/**/*.js', '!build/tmp/src/gulptask.js']),
        snapshot('build/tmp/src/**/*.js'),
        snapshot('tmp/src/**/*.js'),
        touchFile('src/gulptask.js')],
      `Starting 'trigger:copy'...`,
      `Finished 'trigger:copy' after`,
      `Starting 'trigger:transpile'...`,
      [`Finished 'trigger:transpile' after`,
        isNewer('src/gulptask.js'),
        isNewer('tmp/src/gulptask.js'),
        isNewer('build/tmp/src/gulptask.js'),
        isUntouched(['src/**/*.js', '!src/gulptask.js']),
        isUntouched(['tmp/src/**/*.js', '!tmp/src/gulptask.js']),
        isUntouched(['build/tmp/src/**/*.js', '!build/tmp/src/gulptask.js'])],
    ],
  }));
});
