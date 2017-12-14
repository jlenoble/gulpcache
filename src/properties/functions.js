import {setFnProperties, makeFn, makeTriggerFn, makeTriggeredFn, makeExecFn,
  makeWatchFn} from './helpers';

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
