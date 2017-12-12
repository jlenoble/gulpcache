import testGulpProcess, {touchFile, snapshot} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  const refFiles = [
    'src/**/*.js',
    'tmp/src/**/*.js',
    'build/tmp/src/**/*.js',
  ];

  it(`Tdd task depending implicitly on another - lastRun`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-autodep-lastrun.js',

    // Using gulp.lastRun renders useless plugin 'newer' after the first time
    // any task is run in TDD mode.

    messages: [
      `Task 'copy' (SRC): 4 items`, // Same with 'newer'
      `Task 'copy' (NWR): 4 items`, // Same
      `Task 'transpile' (SRC): 4 items`, // Same
      `Task 'transpile' (NWR): 4 items`, // Same
      `Task 'transpile' (DST): 4 items`, // Same
      [`Finished 'default' after`,
        snapshot(refFiles),
        touchFile('tmp/src/gulptask.js')],
      `Task 'transpile' (SRC): 1 item`, // Would have been (SRC): 4 items
      // `Task 'transpile' (NWR): 1 item` would have been here
      `Task 'transpile' (DST): 1 item`, // Same
      [`Finished 'trigger:transpile' after`,
        snapshot(refFiles),
        touchFile('src/gulptask.js')],
      `Task 'copy' (SRC): 1 item`, // Would have been (SRC): 4 items
      // `Task 'copy' (NWR): 1 item` would have been here
      `Task 'transpile' (SRC): 1 item`, // Would have been (SRC): 4 items
      // `Task 'transpile' (NWR): 1 item` would have been here
      `Task 'transpile' (DST): 1 item`, // Same
    ],
  }));
});
