# gulptask

Encapsulating Gulp tasks

  * [Usage](#usage)
    * [Example](#example)
  * [License](#license)


## Usage

A `GulpTask` instance is initialized from 5 options:

* `name`: A stem from which all task names are formed. 3 tasks are genrated automatically: `exec:stem`, `watch:stem` and `tdd:stem`, the latter running first `exec:stem` before starting watching.
* `description`: A description for the `exec:stem` task.
* `glob`: Glob for files to be sourced; `base` is always `process.cwd()`.
* `pipe`: Array of initializer plugins with arguments used by underlying [PolyPipe](https://www.npmjs.com/package/polypipe).
* `dest`: Where to write the transformed files.

### Example

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
