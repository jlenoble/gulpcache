import testGulpProcess, {nextTask, parallel} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a task with debug option set`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-debug.js',
    task: ['default', 'default'],

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      parallel(
        [`Task 'copy' (SRC): src/gulptask.js`,
          `Task 'copy' (NWR): src/gulptask.js`],
        [`Task 'copy' (SRC): 1 item`,
          `Task 'copy' (NWR): 1 item`]
      ),
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      parallel(
        [`Task 'transpile' (SRC): tmp/src/gulptask.js`,
          `Task 'transpile' (NWR): tmp/src/gulptask.js`,
          `Task 'transpile' (DST): tmp/src/gulptask.js`],
        [`Task 'transpile' (SRC): 1 item`,
          `Task 'transpile' (NWR): 1 item`,
          `Task 'transpile' (DST): 1 item`]
      ),
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      [`Finished 'default' after`, nextTask()],
      `Starting 'default'...`,
      `Starting 'exec:transpile'...`,
      `Starting 'exec:copy'...`,
      `Task 'copy' (SRC): src/gulptask.js`,
      `Task 'copy' (SRC): 1 item`,
      `Task 'copy' (NWR): 0 items`,
      `Finished 'exec:copy' after`,
      `Starting 'transpile'...`,
      `Task 'transpile' (SRC): tmp/src/gulptask.js`,
      `Task 'transpile' (SRC): 1 item`,
      `Task 'transpile' (NWR): 0 items`,
      `Task 'transpile' (DST): 0 items`,
      `Finished 'transpile' after`,
      `Finished 'exec:transpile' after`,
      `Finished 'default' after`,
    ],
  }));
});
