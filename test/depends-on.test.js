import testGulpProcess, {touchFile, isFound, compareTranspiled, snapshot,
  isNewer, isUntouched} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  const refFiles = [
    'src/**/*.js',
    'test/**/*.js',
    'tmp/src/**/*.js',
    'build/test/**/*.js',
  ];

  it(`Testing a task depending explicitly on another`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-depends-on.js',

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

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      [`Finished 'default' after`,
        snapshot(refFiles),
        touchFile('test/fn.test.js')],
      `Starting 'trigger:transpile'...`,
      [`Finished 'trigger:transpile' after`,
        isNewer('test/fn.test.js'),
        isNewer('build/test/fn.test.js'),
        isUntouched('src/**/*.js'),
        isUntouched('tmp/src/**/*.js'),
        isUntouched(['test/**/*.js', '!test/fn.test.js']),
        isUntouched(['build/test/**/*.js', '!build/test/fn.test.js']),
        snapshot(refFiles),
        touchFile('src/gulptask.js')],
      `Starting 'trigger:copy'...`,
      `Starting 'copy'...`,
      `Finished 'copy' after`,
      `Starting 'triggered:transpile'...`,
      `Finished 'triggered:transpile' after`,
      [`Finished 'trigger:copy' after`,
        isNewer('src/gulptask.js'),
        isNewer('tmp/src/gulptask.js'),
        isNewer('build/test/**/*.js'),
        isUntouched('test/**/*.js'),
        isUntouched(['src/**/*.js', '!src/gulptask.js']),
        isUntouched(['tmp/src/**/*.js', '!tmp/src/gulptask.js'])],
    ],
  }));
});
