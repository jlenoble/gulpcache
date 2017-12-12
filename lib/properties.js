'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setFunctionProperties = exports.mixInStreamerProperties = exports.setMainProperties = exports.setConfig = exports.getName = undefined;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _gulpstream = require('gulpstream');

var _gulpstream2 = _interopRequireDefault(_gulpstream);

var _polypipe = require('polypipe');

var _polypipe2 = _interopRequireDefault(_polypipe);

var _polypath = require('polypath');

var _gulpNewer = require('gulp-newer');

var _gulpNewer2 = _interopRequireDefault(_gulpNewer);

var _gulpDebug = require('gulp-debug');

var _gulpDebug2 = _interopRequireDefault(_gulpDebug);

var _functionFactories = require('./function-factories');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getName = exports.getName = function getName(args) {
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

var getter = function getter(name) {
  return function (args) {
    var value = void 0;

    args.some(function (arg) {
      if (arg[name]) {
        value = arg[name];
        return true;
      }

      return false;
    });

    return value;
  };
};

var getDebug = getter('debug');
var getDebugDest = getter('debugDest');
var getDebugMinimal = getter('debugMinimal');
var getDebugNewer = getter('debugNewer');
var getDebugSrc = getter('debugSrc');
var _getDependsOn = getter('dependsOn');
var getDescription = getter('description');
var getSourcemaps = getter('sourcemaps');

var getDependsOn = function getDependsOn(args) {
  var dependsOn = _getDependsOn(args);
  if (!dependsOn) {
    return [];
  }
  return Array.isArray(dependsOn) ? dependsOn : [dependsOn];
};

var wrapWithDebugPipes = function wrapWithDebugPipes(ctx, pipe, dest) {
  var flags = ctx.debugSrc + 2 * ctx.debugNewer + 4 * ctx.debugDest;

  var debugSrcPipe = new _polypipe2.default([_gulpDebug2.default, {
    title: 'Task \'' + ctx.name + '\' (SRC):',
    minimal: ctx.debugMinimal
  }]);
  var debugNewerPipe = new _polypipe2.default([_gulpDebug2.default, {
    title: 'Task \'' + ctx.name + '\' (NWR):',
    minimal: ctx.debugMinimal
  }]);
  var debugDestPipe = new _polypipe2.default([_gulpDebug2.default, {
    title: 'Task \'' + ctx.name + '\' (DST):',
    minimal: ctx.debugMinimal
  }]);

  var pipes = void 0;

  switch (flags) {
    case 1:case 3:
      pipes = pipe ? pipe.prepipe(debugSrcPipe) : debugSrcPipe;
      break;

    case 4:case 6:
      pipes = pipe ? pipe.pipe(debugDestPipe) : debugDestPipe;
      break;

    case 5:case 7:
      pipes = pipe ? pipe.prepipe(debugSrcPipe).pipe(debugDestPipe) : debugSrcPipe;
  }

  if (!dest) {
    return { pipes: pipes };
  }

  var newerPipes = new _polypipe2.default([_gulpNewer2.default, dest.destination]);

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
    case 6:case 7:
      if (!pipe) {
        break;
      }
    // FALL THROUGH
    case 4:case 5:
      newerPipes = newerPipes.pipe(debugDestPipe);
  }

  return { pipes: pipes, newerPipes: newerPipes };
};

var makeStreamer = function makeStreamer(ctx, args) {
  var _makeOptions = (0, _gulpstream.makeOptions)(args),
      glob = _makeOptions.glob,
      pipe = _makeOptions.pipe,
      dest = _makeOptions.dest;

  var _wrapWithDebugPipes = wrapWithDebugPipes(ctx, pipe, dest),
      pipes = _wrapWithDebugPipes.pipes,
      newerPipes = _wrapWithDebugPipes.newerPipes;

  if (!newerPipes) {
    return new _gulpstream2.default(['default', glob, pipes]);
  }

  return new _gulpstream2.default(['default', glob, pipes, dest], ['newer', glob, newerPipes, dest]);
};

var setConfig = exports.setConfig = function setConfig(ctx, args) {
  var debug = getDebug(args);
  var minimal = getDebugMinimal(args);

  (0, _defineProperties2.default)(ctx, {
    debug: {
      value: debug
    },
    debugDest: {
      value: debug || getDebugDest(args)
    },
    debugMinimal: {
      value: minimal !== undefined ? minimal : true
    },
    debugNewer: {
      value: debug || getDebugNewer(args)
    },
    debugSrc: {
      value: debug || getDebugSrc(args)
    },

    sourcemaps: {
      value: getSourcemaps(args)
    }
  });
};

var setMainProperties = exports.setMainProperties = function setMainProperties(ctx, args) {
  (0, _defineProperties2.default)(ctx, {
    name: {
      value: getName(args)
    },

    description: {
      value: getDescription(args)
    },

    dependsOn: {
      value: getDependsOn(args)
    }
  });

  Object.defineProperty(ctx, 'streamer', { value: makeStreamer(ctx, args) });
};

var mixInStreamerProperties = exports.mixInStreamerProperties = function mixInStreamerProperties(ctx) {
  (0, _defineProperties2.default)(ctx, {
    glob: {
      value: ctx.streamer.glob
    },

    destglob: {
      value: ctx.streamer.destination ? (0, _polypath.rebaseGlob)(ctx.streamer.glob, ctx.streamer.destination) : null
    },

    plugin: {
      value: ctx.streamer.plugin
    },

    dest: {
      value: ctx.streamer.destination
    }
  });
};

var setFunctionProperties = exports.setFunctionProperties = function setFunctionProperties(ctx, args) {
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

    _triggeredFn: { // overridden on first call and set to non configurable
      value: (0, _functionFactories.makeTriggeredFn)(ctx),
      configurable: true
    },

    triggeredFn: {
      value: function value() {
        return ctx._triggeredFn.apply(ctx, arguments);
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
  (0, _functionFactories.setFnProperties)(ctx.triggeredFn, ctx, 'triggered');
  (0, _functionFactories.setFnProperties)(ctx.execFn, ctx, 'exec');
};