import GulpStream from 'gulpstream';
import gulp from 'gulp';
import destglob from 'destglob';
import del from 'del';

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

const getFn = (args, _streamer) => {
  let fn;

  args.some(arg => {
    if (arg.fn) {
      fn = (...args) => arg.fn(...args);
      return true;
    }

    return false;
  });

  if (!fn) {
    if (_streamer._destination) {
      fn = () => _streamer.dest().isReady();
    } else {
      fn = () => _streamer.stream();
    }
  }

  return fn;
};

export default class GulpTask {
  constructor (...args) {
    const name = getName(args);
    const description = getDescription(args);

    const _streamer = (new GulpStream(args)).at(0);
    const execFn = getFn(args, _streamer);
    const watchFn = done => {
      const watcher = gulp.watch(_streamer.glob, execFn);
      watcher.on('unlink', file => {
        if (this.dest) {
          return del(destglob(file, this.dest));
        }
      });
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
