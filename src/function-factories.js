import gulp from 'gulp';
import del from 'del';
import {rebaseGlob} from 'polypath';

export const setFnProperties = (fn, ctx, stem) => {
  const name = stem ? `${stem}:${ctx.name}` : ctx.name;
  let description;

  switch (stem) {
  case 'trigger':
    description = `Triggering task ${name} and dependents`;
    break;

  case 'triggered':
    description = `Triggered task ${name} and dependents`;
    break;

  case 'exec':
    description = `Executing task ${name} and dependencies`;
    break;

  case 'watch':
    description = `Watching task ${name} and dependencies`;
    break;

  default:
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

const overrideOnFirstCall = (fn, ctx, stem) => {
  // Prevents from looking for deps and recreating fn on each call
  // triggerFn wraps _triggerFn and execFn wraps _execFn
  const mode = stem === 'triggered' ? 'default' : 'newer';

  const f = (...args) => {
    ctx.streamer.setMode(mode);
    return fn(...args);
  };

  Object.defineProperty(ctx, `_${stem}Fn`, {
    value: f,
    configurable: false,
  });
};

export const makeFn = (args, ctx) => {
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
      fn = () => {
        const options = {read: true, mode: ctx.streamer.mode};
        return ctx.streamer.dest(options).isReady();
      };
    } else {
      fn = () => {
        const options = {read: true, mode: ctx.streamer.mode};
        return ctx.streamer.stream(options);
      };
    }
  }

  setFnProperties(fn, ctx);

  return fn;
};

export const makeTriggerFn = ctx => {
  // Base action for task triggering all *explicit* dependents
  // Only used in watch mode; exec mod has its own dependency scheme.
  // Filtering on isWatched allows to interrupt the trigger chain and not
  // do operations not required for the prompted gulp target.
  const f = (...args) => {
    const fns = ctx.getDependents()
      .filter(task => task.isWatched)
      .map(task => task.triggeredFn);

    const fn = fns.length ? gulp.series(ctx.fn, gulp.parallel(...fns)) : ctx.fn;

    overrideOnFirstCall(fn, ctx, 'trigger');

    ctx.streamer.setMode('newer');

    return fn(...args);
  };

  return f;
};

export const makeTriggeredFn = ctx => {
  // Triggered tasks don't filter their input and process all.
  // Filtering on isWatched allows to interrupt the trigger chain and not
  // do operations not required for the prompted gulp target.
  const f = (...args) => {
    const fns = ctx.getDependents()
      .filter(task => task.isWatched)
      .map(task => task.triggeredFn);

    const fn = fns.length ? gulp.series(ctx.fn, gulp.parallel(...fns)) : ctx.fn;

    overrideOnFirstCall(fn, ctx, 'triggered');

    ctx.streamer.setMode('default');

    return fn(...args);
  };

  return f;
};

export const makeExecFn = ctx => {
  // Base action for task preceded by all required actions
  // For this, implicit and explicit deps are the same
  const f = (...args) => {
    const execFns = ctx.getDependencies()
      .map(task => task.execFn);

    const fn = execFns.length ? gulp.series(gulp.parallel(...execFns), ctx.fn) :
      ctx.fn;

    overrideOnFirstCall(fn, ctx, 'exec');

    ctx.streamer.setMode('newer');

    return fn(...args);
  };

  return f;
};

export const makeWatchFn = ctx => {
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
        return del(rebaseGlob(file, ctx.dest));
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
