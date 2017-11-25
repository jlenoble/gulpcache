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

const makeFn = (args, _streamer) => {
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

const makeExecFn = (dependsOn, fn) => {
  return dependsOn ? gulp.series(gulp.parallel(
    ...dependsOn.map(task => `exec:${task}`)), fn) : fn;
};

const makeWatchFn = (dependsOn, ctx) => {
  return done => {
    const watcher = gulp.watch(ctx.glob, ctx.fn);
    watcher.on('unlink', file => {
      if (ctx.dest) {
        return del(destglob(file, ctx.dest));
      }
    });
    done();
  };
};

export default class GulpTask {
  constructor (...args) {
    const name = getName(args);
    const description = getDescription(args);
    const dependsOn = null;

    const _streamer = (new GulpStream(args)).at(0);
    const fn = makeFn(args, _streamer);

    const execFn = makeExecFn(dependsOn, fn);

    Object.defineProperties(execFn, {
      name: {
        value: `exec:${name}`,
      },

      description: {
        value: description,
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

      destglob: {
        value: _streamer.destination ? destglob(_streamer.glob,
          _streamer.destination) : null,
      },

      plugin: {
        value: _streamer.plugin,
      },

      dest: {
        value: _streamer.destination,
      },

      fn: {
        value: fn,
      },
    });

    const watchFn = makeWatchFn(dependsOn, this);

    Object.defineProperties(watchFn, {
      name: {
        value: `watch:${name}`,
      },

      description: {
        value: `Watching task ${execFn.name}`,
      },
    });

    gulp.task(execFn);
    gulp.task(watchFn);
    gulp.task(`tdd:${name}`, gulp.series(execFn, watchFn));
  }
}
