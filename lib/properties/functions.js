'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFunctionProperties = undefined;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setFunctionProperties = exports.setFunctionProperties = function setFunctionProperties(ctx, args) {
  // Factories rely on ctx's main properties to already be defined
  (0, _defineProperties2.default)(ctx, {
    fn: {
      value: (0, _helpers.makeFn)(args, ctx)
    },

    _triggerFn: { // overridden on first call and set to non configurable
      value: (0, _helpers.makeTriggerFn)(ctx),
      configurable: true
    },

    triggerFn: {
      value: function value() {
        return ctx._triggerFn.apply(ctx, arguments);
      }
    },

    _triggeredFn: { // overridden on first call and set to non configurable
      value: (0, _helpers.makeTriggeredFn)(ctx),
      configurable: true
    },

    triggeredFn: {
      value: function value() {
        return ctx._triggeredFn.apply(ctx, arguments);
      }
    },

    _execFn: { // overridden on first call and set to non configurable
      value: (0, _helpers.makeExecFn)(ctx),
      configurable: true
    },

    execFn: {
      value: function value() {
        return ctx._execFn.apply(ctx, arguments);
      }
    },

    watchFn: {
      value: (0, _helpers.makeWatchFn)(ctx)
    }
  });

  (0, _helpers.setFnProperties)(ctx.triggerFn, ctx, 'trigger');
  (0, _helpers.setFnProperties)(ctx.triggeredFn, ctx, 'triggered');
  (0, _helpers.setFnProperties)(ctx.execFn, ctx, 'exec');
};