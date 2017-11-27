'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFunctionProperties = exports.mixInStreamerProperties = exports.setMainProperties = exports.getName = undefined;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _gulpstream = require('gulpstream');

var _gulpstream2 = _interopRequireDefault(_gulpstream);

var _destglob = require('destglob');

var _destglob2 = _interopRequireDefault(_destglob);

var _functionFactories = require('./function-factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getName = function getName(args) {
  var name = void 0;

  args.some(function (arg) {
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

var getDescription = function getDescription(args) {
  var description = void 0;

  args.some(function (arg) {
    if (arg.description) {
      description = arg.description;
      return true;
    }

    return false;
  });

  return description;
};

var getDependsOn = function getDependsOn(args) {
  var dependsOn = void 0;

  args.some(function (arg) {
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

var setMainProperties = function setMainProperties(ctx, args) {
  (0, _defineProperties2.default)(ctx, {
    name: {
      value: getName(args)
    },

    description: {
      value: getDescription(args)
    },

    dependsOn: {
      value: getDependsOn(args)
    },

    streamer: {
      value: new _gulpstream2.default(args).at(0)
    }
  });
};

var mixInStreamerProperties = function mixInStreamerProperties(ctx) {
  (0, _defineProperties2.default)(ctx, {
    glob: {
      value: ctx.streamer.glob
    },

    destglob: {
      value: ctx.streamer.destination ? (0, _destglob2.default)(ctx.streamer.glob, ctx.streamer.destination) : null
    },

    plugin: {
      value: ctx.streamer.plugin
    },

    dest: {
      value: ctx.streamer.destination
    }
  });
};

var setFunctionProperties = function setFunctionProperties(ctx, args) {
  // Factories rely on ctx's main properties to already be defined
  (0, _defineProperties2.default)(ctx, {
    fn: {
      value: (0, _functionFactories.makeFn)(args, ctx)
    },

    _triggerFn: { // overridden on first call and set to non configurable
      value: (0, _functionFactories.makeTriggerFn)(ctx),
      configurable: true
    },

    triggerFn: {
      value: function value() {
        return ctx._triggerFn.apply(ctx, arguments);
      }
    },

    _execFn: { // overridden on first call and set to non configurable
      value: (0, _functionFactories.makeExecFn)(ctx),
      configurable: true
    },

    execFn: {
      value: function value() {
        return ctx._execFn.apply(ctx, arguments);
      }
    },

    watchFn: {
      value: (0, _functionFactories.makeWatchFn)(ctx)
    }
  });

  (0, _functionFactories.setFnProperties)(ctx.triggerFn, ctx, 'trigger');
  (0, _functionFactories.setFnProperties)(ctx.execFn, ctx, 'exec');
};

exports.getName = getName;
exports.setMainProperties = setMainProperties;
exports.mixInStreamerProperties = mixInStreamerProperties;
exports.setFunctionProperties = setFunctionProperties;