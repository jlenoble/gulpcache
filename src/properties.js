import GulpStream, {makeOptions} from 'gulpstream';
import {rebaseGlob} from 'polypath';
import {setFnProperties, makeFn, makeTriggerFn, makeExecFn, makeWatchFn}
  from './function-factories';

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

const makeStreamer = args => {
  const {glob, pipe, dest} = makeOptions(args);
  return new GulpStream(
    ['default', glob, pipe, dest],
  );
};

const setMainProperties = (ctx, args) => {
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
      value: makeStreamer(args).at(0),
    },
  });
};

const mixInStreamerProperties = ctx => {
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

const setFunctionProperties = (ctx, args) => {
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
  setFnProperties(ctx.execFn, ctx, 'exec');
};

export {getName, setMainProperties, mixInStreamerProperties,
  setFunctionProperties};
