import GulpStream, {makeOptions} from 'gulpstream';
import PolyPipe from 'polypipe';
import {rebaseGlob} from 'polypath';
import newer from 'gulp-newer';
import {setFnProperties, makeFn, makeTriggerFn, makeTriggeredFn, makeExecFn,
  makeWatchFn} from './function-factories';

export const getName = args => {
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

const getter = name => args => {
  let value;

  args.some(arg => {
    if (arg[name]) {
      value = arg[name];
      return true;
    }

    return false;
  });

  return value;
};

const getDebug = getter('debug');
const getDebugDest = getter('debugDest');
const getDebugNewer = getter('debugNewer');
const getDebugSrc = getter('debugSrc');
const _getDependsOn = getter('dependsOn');
const getDescription = getter('description');
const getSourcemaps = getter('sourcemaps');

const getDependsOn = args => {
  const dependsOn = _getDependsOn(args);
  if (!dependsOn) {
    return [];
  }
  return Array.isArray(dependsOn) ? dependsOn : [dependsOn];
};

const makeStreamer = args => {
  const {glob, pipe, dest} = makeOptions(args);

  if (!dest) {
    return new GulpStream(
      ['default', glob, pipe]
    );
  }

  const newerPipe = pipe ? pipe.prepipe([newer, dest.destination]) :
    new PolyPipe([newer, dest.destination]);

  return new GulpStream(
    ['default', glob, pipe, dest],
    ['newer', glob, newerPipe, dest]
  );
};

export const setConfig = (ctx, args) => {
  const debug = getDebug(args);

  Object.defineProperties(ctx, {
    debug: {
      value: debug,
    },
    debugDest: {
      value: debug || getDebugDest(args),
    },
    debugNewer: {
      value: debug || getDebugNewer(args),
    },
    debugSrc: {
      value: debug || getDebugSrc(args),
    },

    sourcemaps: {
      value: getSourcemaps(args),
    },
  });
};

export const setMainProperties = (ctx, args) => {
  Object.defineProperties(ctx, {
    name: {
      value: getName(args),
    },

    description: {
      value: getDescription(args),
    },

    dependsOn: {
      value: getDependsOn(args),
    },

    streamer: {
      value: makeStreamer(args),
    },
  });
};

export const mixInStreamerProperties = ctx => {
  Object.defineProperties(ctx, {
    glob: {
      value: ctx.streamer.glob,
    },

    destglob: {
      value: ctx.streamer.destination ? rebaseGlob(ctx.streamer.glob,
        ctx.streamer.destination) : null,
    },

    plugin: {
      value: ctx.streamer.plugin,
    },

    dest: {
      value: ctx.streamer.destination,
    },
  });
};

export const setFunctionProperties = (ctx, args) => {
  // Factories rely on ctx's main properties to already be defined
  Object.defineProperties(ctx, {
    fn: {
      value: makeFn(args, ctx),
    },

    _triggerFn: { // overridden on first call and set to non configurable
      value: makeTriggerFn(ctx),
      configurable: true,
    },

    triggerFn: {
      value: (...args) => ctx._triggerFn(...args),
    },

    _triggeredFn: { // overridden on first call and set to non configurable
      value: makeTriggeredFn(ctx),
      configurable: true,
    },

    triggeredFn: {
      value: (...args) => ctx._triggeredFn(...args),
    },

    _execFn: { // overridden on first call and set to non configurable
      value: makeExecFn(ctx),
      configurable: true,
    },

    execFn: {
      value: (...args) => ctx._execFn(...args),
    },

    watchFn: {
      value: makeWatchFn(ctx),
    },
  });

  setFnProperties(ctx.triggerFn, ctx, 'trigger');
  setFnProperties(ctx.triggeredFn, ctx, 'triggered');
  setFnProperties(ctx.execFn, ctx, 'exec');
};
