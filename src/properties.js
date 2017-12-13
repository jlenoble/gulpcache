import GulpStream, {makeOptions} from 'gulpstream';
import PolyPipe from 'polypipe';
import {rebaseGlob} from 'polypath';
import newer from 'gulp-newer';
import debug from 'gulp-debug';
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

const returnsBool = fn => args => !!fn(args);

const getDebug = returnsBool(getter('debug'));
const getDebugDest = returnsBool(getter('debugDest'));
const getDebugMinimal = getter('debugMinimal');
const getDebugNewer = returnsBool(getter('debugNewer'));
const getDebugSrc = returnsBool(getter('debugSrc'));
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

const wrapWithDebugPipes = (ctx, pipe, dest) => {
  const flags = ctx.debugSrc + 2 * ctx.debugNewer + 4 * ctx.debugDest;

  const debugSrcPipe = new PolyPipe([debug, {
    title: `Task '${ctx.name}' (SRC):`,
    minimal: ctx.debugMinimal,
  }]);
  const debugNewerPipe = new PolyPipe([debug, {
    title: `Task '${ctx.name}' (NWR):`,
    minimal: ctx.debugMinimal,
  }]);
  const debugDestPipe = new PolyPipe([debug, {
    title: `Task '${ctx.name}' (DST):`,
    minimal: ctx.debugMinimal,
  }]);

  let pipes;

  switch (flags) {
  case 1: case 3:
    pipes = pipe ? pipe.prepipe(debugSrcPipe) : debugSrcPipe;
    break;

  case 4: case 6:
    pipes = pipe ? pipe.pipe(debugDestPipe) : debugDestPipe;
    break;

  case 5: case 7:
    pipes = pipe ? pipe.prepipe(debugSrcPipe).pipe(debugDestPipe) :
      debugSrcPipe;
    break;

  default:
    pipes = pipe;
  }

  if (!dest) {
    return {pipes};
  }

  let newerPipes = new PolyPipe([newer, dest.destination]);

  if (ctx.debugSrc) {
    newerPipes = newerPipes.prepipe(debugSrcPipe);
  }

  if (ctx.debugNewer) {
    newerPipes = newerPipes.pipe(debugNewerPipe);
  }

  if (pipe) {
    newerPipes = newerPipes.pipe(pipe);
  }

  switch (flags) {
  case 6: case 7:
    if (!pipe) {
      break;
    }
  // FALL THROUGH
  case 4: case 5:
    newerPipes = newerPipes.pipe(debugDestPipe);
  }

  return {pipes, newerPipes};
};

const makeStreamer = (ctx, args) => {
  const {glob, pipe, dest} = makeOptions(args);
  const {pipes, newerPipes} = wrapWithDebugPipes(ctx, pipe, dest);

  if (!newerPipes) {
    return new GulpStream(
      ['default', glob, pipes]
    );
  }

  return new GulpStream(
    ['default', glob, pipes, dest],
    ['newer', glob, newerPipes, dest]
  );
};

export const setConfig = (ctx, args) => {
  const debug = getDebug(args);
  const minimal = getDebugMinimal(args);

  Object.defineProperties(ctx, {
    debug: {
      value: debug,
    },
    debugDest: {
      value: debug || getDebugDest(args),
    },
    debugMinimal: {
      value: minimal !== undefined ? minimal : true,
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
  });

  Object.defineProperty(ctx, 'streamer', {value: makeStreamer(ctx, args)});
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
