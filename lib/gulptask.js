'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleGulpTask = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _singletons = require('singletons');

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _dependencyMap = require('./dependency-map');

var _dependencyMap2 = _interopRequireDefault(_dependencyMap);

var _properties = require('./properties');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dependencies = new _dependencyMap2.default();

var SimpleGulpTask = exports.SimpleGulpTask = function () {
  function SimpleGulpTask() {
    (0, _classCallCheck3.default)(this, SimpleGulpTask);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _properties.setMainProperties)(this, args);

    (0, _properties.mixInStreamerProperties)(this);

    (0, _properties.setFunctionProperties)(this, args);

    dependencies.register(this);

    _gulp2.default.task(this.execFn);
    _gulp2.default.task(this.watchFn);
    _gulp2.default.task('tdd:' + this.name, _gulp2.default.series(this.execFn, this.watchFn));
  }

  (0, _createClass3.default)(SimpleGulpTask, [{
    key: 'getDependencies',
    value: function getDependencies() {
      return dependencies.getDependencies(this);
    }
  }, {
    key: 'getDependents',
    value: function getDependents() {
      return dependencies.getDependents(this);
    }
  }, {
    key: 'getTask',
    value: function getTask(name) {
      return GulpTask.get(name);
    }
  }]);
  return SimpleGulpTask;
}();

var GulpTask = (0, _singletons.SingletonFactory)(SimpleGulpTask, // eslint-disable-line new-cap
['literal', { type: 'ignore', rest: true }], {
  preprocess: function preprocess(args) {
    return [(0, _properties.getName)(args)].concat((0, _toConsumableArray3.default)(args));
  }
});

exports.default = GulpTask;