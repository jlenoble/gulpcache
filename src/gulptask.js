import GulpStream from 'gulpstream';
import gulp from 'gulp';

const getName = args => {
  let name;

  args.some(arg => {
    if (typeof arg === 'string') {
      name = arg;
      return true;
    }

    if (arg.name) {
      name = arg.name;
      return true;
    }

    return false;
  });

  return name;
};

const getDescription = args => {
  let description;

  args.some(arg => {
    if (arg.description) {
      description = arg.description;
      return true;
    }

    return false;
  });

  return description;
};

export default class GulpTask {
  constructor (...args) {
    const name = getName(args);
    const description = getDescription(args);

    const _streamer = (new GulpStream(args)).at(0);
    const execFn = () => _streamer.dest().isReady();
    const watchFn = done => {
      gulp.watch(_streamer.glob, execFn);
      done();
    };

    Object.defineProperties(execFn, {
      name: {
        value: `exec:${name}`,
      },

      description: {
        value: description,
      },
    });

    Object.defineProperties(watchFn, {
      name: {
        value: `watch:${name}`,
      },

      description: {
        value: `Watching task ${execFn.name}`,
      },
    });

    Object.defineProperties(this, {
      name: {
        value: name,
      },

      description: {
        value: description,
      },

      glob: {
        value: _streamer.glob,
      },

      plugin: {
        value: _streamer.plugin,
      },

      dest: {
        value: _streamer.destination,
      },

      fn: {
        value: execFn,
      },
    });

    gulp.task(execFn);
    gulp.task(watchFn);
    gulp.task(`tdd:${name}`, gulp.series(execFn, watchFn));
  }
}
