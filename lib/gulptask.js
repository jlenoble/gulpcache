'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _gulpstream = require('gulpstream');

var _gulpstream2 = _interopRequireDefault(_gulpstream);

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _destglob = require('destglob');

var _destglob2 = _interopRequireDefault(_destglob);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

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

var getFn = function getFn(args, _streamer) {
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

var GulpTask = function GulpTask() {
  var _this = this;

  (0, _classCallCheck3.default)(this, GulpTask);

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var name = getName(args);
  var description = getDescription(args);

  var _streamer = new _gulpstream2.default(args).at(0);
  var execFn = getFn(args, _streamer);
  var watchFn = function watchFn(done) {
    var watcher = _gulp2.default.watch(_streamer.glob, execFn);
    watcher.on('unlink', function (file) {
      if (_this.dest) {
        return (0, _del2.default)((0, _destglob2.default)(file, _this.dest));
      }
    });
    done();
  };

  (0, _defineProperties2.default)(execFn, {
    name: {
      value: 'exec:' + name
    },

    description: {
      value: description
    }
  });

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

    glob: {
      value: _streamer.glob
    },

    plugin: {
      value: _streamer.plugin
    },

    dest: {
      value: _streamer.destination
    },

    fn: {
      value: execFn
    }
  });

  _gulp2.default.task(execFn);
  _gulp2.default.task(watchFn);
  _gulp2.default.task('tdd:' + name, _gulp2.default.series(execFn, watchFn));
};

exports.default = GulpTask;
module.exports = exports['default'];