import testGulpProcess, {compareTranspiled, touchFile, deleteFile, isDeleted}
  from 'test-gulp-process';

describe('Testing GulpTask', function () {
  it(`Testing a transpile task`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/exec-transpile-all.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`,
        compareTranspiled('src/**/*.js', 'build')],
      `Finished 'default' after`,
    ],
  }));

  it(`Testing a tdd transpile task - touching`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-transpile-all.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:transpile:all'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`,
        compareTranspiled('src/**/*.js', 'build')],
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`,
        touchFile('src/gulptask.js')],
      `Starting 'transpile:all'...`,
      `Finished 'transpile:all' after`,
    ],
  }));

  it(`Testing a tdd transpile task - deleting`, testGulpProcess({
    sources: ['src/**/*.js', 'test/**/*.js', 'gulp/**/*.js'],
    gulpfile: 'test/gulpfiles/tdd-transpile-all.js',

    messages: [
      `Starting 'default'...`,
      `Starting 'tdd:transpile:all'...`,
      `Starting 'exec:transpile:all'...`,
      [`Finished 'exec:transpile:all' after`,
        compareTranspiled('src/**/*.js', 'build')],
      `Starting 'watch:transpile:all'...`,
      `Finished 'watch:transpile:all' after`,
      `Finished 'tdd:transpile:all' after`,
      [`Finished 'default' after`,
        deleteFile('src/gulptask.js')],
      `Starting 'transpile:all'...`,
      [`Finished 'transpile:all' after`,
        compareTranspiled('src/**/*.js', 'build'),
        isDeleted('build/src/gulptask.js')],
    ],
  }));
});
