import gulp from 'gulp';
import del from 'del';
import destglob from 'destglob';

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

  const f = (...args) => {
    const fns = ctx.getDependents().map(task => task.fn);

    if (fns.length) {
      return gulp.series(fn, gulp.parallel(...fns))(...args);
    }

    return fn(...args);
  };

  Object.defineProperties(f, {
    name: {
      value: ctx.name,
    },

    description: {
      value: ctx.description,
    },
  });

  return f;
};

const makeExecFn = ctx => {
  // Base action for task preceded by all required actions
  // For this, implicit and explicit deps are the same
  const f = (...args) => {
    const execFns = ctx.getDependencies().map(task => task.execFn);

    if (execFns.length) {
      return gulp.series(gulp.parallel(...execFns), ctx.fn)(...args);
    }

    return ctx.fn(...args);
  };

  Object.defineProperties(f, {
    name: {
      value: `exec:${ctx.name}`,
    },

    description: {
      value: `Executing task ${ctx.name}`,
    },
  });

  return f;
};

const makeWatchFn = ctx => {
  // Watching to trigger base action.
  // Also setting watch on deps, implicit and explicit alike.
  // Note: Implicit will trigger back the task (say source files have changed)
  // thanks to the watch chain.
  // But explicit must force action again (say config files have changed), so
  // explicit execution chain is handled at the level of fn prop itself
  const f = done => {
    const watcher = gulp.watch(ctx.glob, ctx.fn);
    watcher.on('unlink', file => {
      if (ctx.dest) {
        return del(destglob(file, ctx.dest));
      }
    });

    ctx.getDependencies().map(task => task.watchFn).forEach(wfn => wfn());

    if (done) {
      done();
    }
  };

  Object.defineProperties(f, {
    name: {
      value: `watch:${ctx.name}`,
    },

    description: {
      value: `Watching task ${ctx.name}`,
    },
  });

  return f;
};

export {makeFn, makeExecFn, makeWatchFn};
