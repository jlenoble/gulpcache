import testGulpProcess, {touchFile} from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a function task`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-hello.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:hello'...`,
      `Hello`,
      `Finished 'exec:hello' after`,
      `Finished 'default' after`,
    ],
  }));

  it(`Testing a tdd function task`, testGulpProcess({
    sources: ['src/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-hello.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:hello'...`,
      `Starting 'exec:hello'...`,
      `Hello`,
      `Finished 'exec:hello' after`,
      `Starting 'watch:hello'...`,
      `Finished 'watch:hello' after`,
      `Finished 'tdd:hello' after`,
      [`Finished 'default' after`,
        touchFile('src/gulptask.js')],
      `Starting 'trigger:hello'...`,
      `Hello`,
      `Finished 'trigger:hello' after`,
    ],
  }));
});
