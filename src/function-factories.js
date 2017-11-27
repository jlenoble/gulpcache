import gulp from 'gulp';
import del from 'del';
import destglob from 'destglob';

const setFnProperties = (fn, ctx, stem) => {
  let name;
  let description;

  switch (stem) {
  case 'trigger':
    name = `trigger:${ctx.name}`;
    description = `Triggering task ${ctx.name} and dependents`;
    break;

  case 'exec':
    name = `exec:${ctx.name}`;
    description = `Executing task ${ctx.name} and dependencies`;
    break;

  case 'watch':
    name = `watch:${ctx.name}`;
    description = `Watching task ${ctx.name} and dependencies`;
    break;

  default:
    name = ctx.name;
    description = ctx.description;
    break;
  }

  Object.defineProperties(fn, {
    name: {
      value: name,
    },

    description: {
      value: description,
    },
  });
};

const overrideOnFirstCall = (stem, newFn, ctx) => {
  const f = (...args) => newFn(...args);

  return f;
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

  setFnProperties(fn, ctx);

  return fn;
};

const makeTriggerFn = ctx => {
  // Base action for task triggering all *explicit* dependents
  // Only used in watch mode; exec mod has its own dependency scheme.
  // Filtering on isWatched allows to interrupt the trigger chain and not
  // do operations not required for the prompted gulp target.
  const f = (...args) => {
    const fns = ctx.getDependents()
      .filter(task => task.isWatched)
      .map(task => task.triggerFn);

    const fn = fns.length ? gulp.series(ctx.fn, gulp.parallel(...fns)) : ctx.fn;

    overrideOnFirstCall('trigger', fn, ctx);

    return fn(...args);
  };

  setFnProperties(f, ctx, 'trigger');

  return f;
};

const makeExecFn = ctx => {
  // Base action for task preceded by all required actions
  // For this, implicit and explicit deps are the same
  const f = (...args) => {
    const execFns = ctx.getDependencies().map(task => task.execFn);

    const fn = execFns.length ? gulp.series(gulp.parallel(...execFns), ctx.fn) :
      ctx.fn;

    overrideOnFirstCall('exec', fn, ctx);

    return fn(...args);
  };

  setFnProperties(f, ctx, 'exec');

  return f;
};

const makeWatchFn = ctx => {
  // Watching to trigger base action.
  // Also setting watch on deps, implicit and explicit alike.
  // Note: Implicit will trigger back the task (say source files have changed)
  // thanks to the watch chain.
  // But explicit must force action again (say config files have changed), so
  // explicit execution chain is handled at the level of triggerFn prop
  const f = () => {
    const watcher = gulp.watch(ctx.glob, ctx.triggerFn);
    watcher.on('unlink', file => {
      if (ctx.dest) {
        return del(destglob(file, ctx.dest));
      }
    });

    Object.defineProperty(ctx, 'isWatched', {value: true});

    return Promise.all(ctx.getDependencies()
      .filter(task => !task.isWatched)
      .map(task => task.watchFn()));
  };

  setFnProperties(f, ctx, 'watch');

  return f;
};

export {makeFn, makeTriggerFn, makeExecFn, makeWatchFn};
