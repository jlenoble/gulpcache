'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleGulpTask = undefined;

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _singletons = require('singletons');

var _gulpstream = require('gulpstream');

var _gulpstream2 = _interopRequireDefault(_gulpstream);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _destglob = require('destglob');

var _destglob2 = _interopRequireDefault(_destglob);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _dependencyMap = require('./dependency-map');

var _dependencyMap2 = _interopRequireDefault(_dependencyMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dependencies = new _dependencyMap2.default();

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

var makeFn = function makeFn(args, _streamer) {
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
    if (_streamer._destination) {
      fn = function fn() {
        return _streamer.dest().isReady();
      };
    } else {
      fn = function fn() {
        return _streamer.stream();
      };
    }
  }

  return fn;
};

var makeExecFn = function makeExecFn(ctx) {
  return function () {
    var execFns = ctx.getDependencies().map(function (task) {
      return task.execFn;
    });

    if (execFns.length) {
      return _gulp2.default.series(_gulp2.default.parallel.apply(_gulp2.default, (0, _toConsumableArray3.default)(execFns)), ctx.fn).apply(undefined, arguments);
    }

    return ctx.fn.apply(ctx, arguments);
  };
};

var makeWatchFn = function makeWatchFn(ctx) {
  return function (done) {
    var watcher = _gulp2.default.watch(ctx.glob, ctx.fn);
    watcher.on('unlink', function (file) {
      if (ctx.dest) {
        return (0, _del2.default)((0, _destglob2.default)(file, ctx.dest));
      }
    });

    var watchFns = ctx.getDependencies().map(function (task) {
      return task.watchFn;
    });

    if (watchFns.length) {
      watchFns.forEach(function (fn) {
        return fn();
      });
    }

    if (done) {
      done();
    }
  };
};

var SimpleGulpTask = exports.SimpleGulpTask = function () {
  function SimpleGulpTask() {
    (0, _classCallCheck3.default)(this, SimpleGulpTask);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var name = getName(args);
    var description = getDescription(args);
    var dependsOn = getDependsOn(args);

    var _streamer = new _gulpstream2.default(args).at(0);

    var fn = makeFn(args, _streamer);

    (0, _defineProperties2.default)(fn, {
      name: {
        value: name
      },

      description: {
        value: description
      }
    });

    var execFn = makeExecFn(this);

    (0, _defineProperties2.default)(execFn, {
      name: {
        value: 'exec:' + name
      },

      description: {
        value: 'Executing task ' + name
      }
    });

    var watchFn = makeWatchFn(this);

    (0, _defineProperties2.default)(watchFn, {
      name: {
        value: 'watch:' + name
      },

      description: {
        value: 'Watching task ' + execFn.name
      }
    });

    (0, _defineProperties2.default)(this, {
      name: {
        value: name
      },

      description: {
        value: description
      },

      dependsOn: {
        value: dependsOn
      },

      glob: {
        value: _streamer.glob
      },

      destglob: {
        value: _streamer.destination ? (0, _destglob2.default)(_streamer.glob, _streamer.destination) : null
      },

      plugin: {
        value: _streamer.plugin
      },

      dest: {
        value: _streamer.destination
      },

      fn: {
        value: fn
      },

      execFn: {
        value: execFn
      },

      watchFn: {
        value: watchFn
      }
    });

    dependencies.registerAsDependent(this);

    _gulp2.default.task(execFn);
    _gulp2.default.task(watchFn);
    _gulp2.default.task('tdd:' + name, _gulp2.default.series(execFn, watchFn));
  }

  (0, _createClass3.default)(SimpleGulpTask, [{
    key: 'getDependencies',
    value: function getDependencies() {
      var explicitDeps = this.dependsOn.map(function (task) {
        return new GulpTask(task);
      });
      var implicitDeps = dependencies.getDependenciesFor(this);
      return (0, _from2.default)(new _set2.default(explicitDeps.concat(implicitDeps)));
    }
  }]);
  return SimpleGulpTask;
}();

var GulpTask = (0, _singletons.SingletonFactory)(SimpleGulpTask, // eslint-disable-line new-cap
['literal', { type: 'ignore', rest: true }], {
  preprocess: function preprocess(args) {
    return [getName(args)].concat((0, _toConsumableArray3.default)(args));
  }
});

exports.default = GulpTask;