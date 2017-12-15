# gulptask

Encapsulating Gulp tasks

  * [Usage](#usage)
    * [Transpiling example](#transpiling-example)
  * [License](#license)


## Usage

A `GulpTask` instance is initialized from 6 options:

* `name` (mandatory): A stem from which all task names are formed. 3 tasks are generated automatically: `exec:stem`, `watch:stem` and `tdd:stem`, the latter running first `exec:stem` before starting watching.
* `description` (optional): A description for the `exec:stem` task.
* `glob` (mandatory): Glob for files to be sourced; `base` is always `process.cwd()`.
* `pipe` (optional): Array of initializer plugins with arguments used by underlying [PolyPipe](https://www.npmjs.com/package/polypipe).
* `dest` (optional): Where to write the transformed files.
* `fn` (optional): Overrides `pipe` and `dest`, providing a custom function for the current task.
* `dependsOn` (optional): GulpTask name or array of GulpTask names; Ensures that tasks depended upon are executed first. Note that if dependency tasks have `dest` defined, then the dependency is implicitly set anyway.
* `debug` (optional): If true, debugging messages are logged onto the screen for every file going through your pipes.
* `sourcemaps` (optional): If true, sourcemaps will be generated.

Two options are mandatory: `name` and `glob`. But at least one of `pipe`, `dest` or `fn` should be provided for the task to do anything.

### Transpiling example

```js
import GulpTask from 'gulptask';
import gulp from 'gulp';
import babel from 'gulp-babel';

new GulpTask({
  name: 'transpile:all',
  description: 'Transpiling all Js source files',
  glob: 'src/**/*.js',
  pipe: [babel],
  dest: 'build',
});

gulp.task('default', gulp.series('exec:transpile:all'));
```

## License

gulptask is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
