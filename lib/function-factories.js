'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeWatchFn = exports.makeExecFn = exports.makeTriggerFn = exports.makeFn = exports.setFnProperties = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _destglob = require('destglob');

var _destglob2 = _interopRequireDefault(_destglob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var setFnProperties = function setFnProperties(fn, ctx, stem) {
  var name = stem ? stem + ':' + ctx.name : ctx.name;
  var description = void 0;

  switch (stem) {
    case 'trigger':
      description = 'Triggering task ' + name + ' and dependents';
      break;

    case 'exec':
      description = 'Executing task ' + name + ' and dependencies';
      break;

    case 'watch':
      description = 'Watching task ' + name + ' and dependencies';
      break;

    default:
      description = ctx.description;
      break;
  }

  (0, _defineProperties2.default)(fn, {
    name: {
      value: name
    },

    description: {
      value: description
    }
  });
};

var overrideOnFirstCall = function overrideOnFirstCall(fn, ctx, stem) {
  // Prevents from looking for deps and recreating fn on each call
  // triggerFn wraps _triggerFn and execFn wraps _execFn
  var f = function f() {
    return fn.apply(undefined, arguments);
  };

  Object.defineProperty(ctx, '_' + stem + 'Fn', {
    value: f,
    configurable: false
  });
};

var makeFn = function makeFn(args, ctx) {
  // Base action for task
  var fn = void 0;

  args.some(function (arg) {
    if (arg.fn) {
      fn = function fn() {
        return arg.fn.apply(arg, arguments);
      };
      return true;
    }

    return false;
  });

  if (!fn) {
    if (ctx.dest) {
      fn = function fn() {
        return ctx.streamer.dest().isReady();
      };
    } else {
      fn = function fn() {
        return ctx.streamer.stream();
      };
    }
  }

  setFnProperties(fn, ctx);

  return fn;
};

var makeTriggerFn = function makeTriggerFn(ctx) {
  // Base action for task triggering all *explicit* dependents
  // Only used in watch mode; exec mod has its own dependency scheme.
  // Filtering on isWatched allows to interrupt the trigger chain and not
  // do operations not required for the prompted gulp target.
  var f = function f() {
    var fns = ctx.getDependents().filter(function (task) {
      return task.isWatched;
    }).map(function (task) {
      return task.triggerFn;
    });

    var fn = fns.length ? _gulp2.default.series(ctx.fn, _gulp2.default.parallel.apply(_gulp2.default, (0, _toConsumableArray3.default)(fns))) : ctx.fn;

    overrideOnFirstCall(fn, ctx, 'trigger');

    return fn.apply(undefined, arguments);
  };

  return f;
};

var makeExecFn = function makeExecFn(ctx) {
  // Base action for task preceded by all required actions
  // For this, implicit and explicit deps are the same
  var f = function f() {
    var execFns = ctx.getDependencies().map(function (task) {
      return task.execFn;
    });

    var fn = execFns.length ? _gulp2.default.series(_gulp2.default.parallel.apply(_gulp2.default, (0, _toConsumableArray3.default)(execFns)), ctx.fn) : ctx.fn;

    overrideOnFirstCall(fn, ctx, 'exec');

    return fn.apply(undefined, arguments);
  };

  return f;
};

var makeWatchFn = function makeWatchFn(ctx) {
  // Watching to trigger base action.
  // Also setting watch on deps, implicit and explicit alike.
  // Note: Implicit will trigger back the task (say source files have changed)
  // thanks to the watch chain.
  // But explicit must force action again (say config files have changed), so
  // explicit execution chain is handled at the level of triggerFn prop
  var f = function f() {
    var watcher = _gulp2.default.watch(ctx.glob, ctx.triggerFn);
    watcher.on('unlink', function (file) {
      if (ctx.dest) {
        return (0, _del2.default)((0, _destglob2.default)(file, ctx.dest));
      }
    });

    Object.defineProperty(ctx, 'isWatched', { value: true });

    return _promise2.default.all(ctx.getDependencies().filter(function (task) {
      return !task.isWatched;
    }).map(function (task) {
      return task.watchFn();
    }));
  };

  setFnProperties(f, ctx, 'watch');

  return f;
};

exports.setFnProperties = setFnProperties;
exports.makeFn = makeFn;
exports.makeTriggerFn = makeTriggerFn;
exports.makeExecFn = makeExecFn;
exports.makeWatchFn = makeWatchFn;