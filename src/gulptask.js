import {SingletonFactory} from 'singletons';
import GulpStream from 'gulpstream';
import gulp from 'gulp';
import destglob from 'destglob';
import del from 'del';
import DependencyMap from './dependency-map';

const dependencies = new DependencyMap();

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

const getDependsOn = args => {
  let dependsOn;

  args.some(arg => {
    if (arg.dependsOn) {
      dependsOn = arg.dependsOn;
      return true;
    }

    return false;
  });

  if (!dependsOn) {
    return [];
  }

  return Array.isArray(dependsOn) ? dependsOn : [dependsOn];
};

const makeFn = (args, ctx) => {
  // Base action for task
  let fn;

  args.some(arg => {
    if (arg.fn) {
      fn = (...args) => arg.fn(...args);
      return true;
    }

    return false;
  });

  if (!fn) {
    if (ctx.dest) {
      fn = () => ctx.streamer.dest().isReady();
    } else {
      fn = () => ctx.streamer.stream();
    }
  }

  return fn;
};

const makeExecFn = ctx => {
  // Base action for task preceded by all required actions
  // For this, implicit and explicit deps are the same
  return (...args) => {
    const execFns = ctx.getDependencies().map(task => task.execFn);

    if (execFns.length) {
      return gulp.series(gulp.parallel(...execFns), ctx.fn)(...args);
    }

    return ctx.fn(...args);
  };
};

const makeWatchFn = ctx => {
  // Watching to trigger base action
  // Also setting watch on deps, implicit and explicit alike
  // Implicit will trigger back the task (say source files have changed)
  // But explicit must force action again (say config files have changed)
  return done => {
    const watcher = gulp.watch(ctx.glob, ctx.fn);
    watcher.on('unlink', file => {
      if (ctx.dest) {
        return del(destglob(file, ctx.dest));
      }
    });

    ctx.getDependencies().map(task => task.watchFn).forEach(fn => fn());

    if (done) {
      done();
    }
  };
};

export class SimpleGulpTask {
  constructor (...args) {
    const name = getName(args);
    const description = getDescription(args);
    const dependsOn = getDependsOn(args);

    const _streamer = (new GulpStream(args)).at(0);

    Object.defineProperties(this, {
      name: {
        value: name,
      },

      description: {
        value: description,
      },

      dependsOn: {
        value: dependsOn,
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

      streamer: {
        value: _streamer,
      },
    });

    const fn = makeFn(args, this);

    Object.defineProperties(fn, {
      name: {
        value: name,
      },

      description: {
        value: description,
      },
    });

    const execFn = makeExecFn(this);

    Object.defineProperties(execFn, {
      name: {
        value: `exec:${name}`,
      },

      description: {
        value: `Executing task ${name}`,
      },
    });

    const watchFn = makeWatchFn(this);

    Object.defineProperties(watchFn, {
      name: {
        value: `watch:${name}`,
      },

      description: {
        value: `Watching task ${execFn.name}`,
      },
    });

    Object.defineProperties(this, {
      fn: {
        value: fn,
      },

      execFn: {
        value: execFn,
      },

      watchFn: {
        value: watchFn,
      },
    });

    dependencies.register(this);

    gulp.task(execFn);
    gulp.task(watchFn);
    gulp.task(`tdd:${name}`, gulp.series(execFn, watchFn));
  }

  getDependencies () {
    return dependencies.getDependencies(this);
  }

  getTask (name) {
    return GulpTask.get(name);
  }
}

const GulpTask = SingletonFactory(SimpleGulpTask, // eslint-disable-line new-cap
  ['literal', {type: 'ignore', rest: true}], {
    preprocess (args) {
      return [getName(args), ...args];
    },
  });

export default GulpTask;
