'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _gulpglob = require('gulpglob');

var _gulpglob2 = _interopRequireDefault(_gulpglob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DependencyMap = function () {
  function DependencyMap() {
    (0, _classCallCheck3.default)(this, DependencyMap);

    (0, _defineProperties2.default)(this, {
      map: {
        value: new _map2.default()
      }
    });
  }

  (0, _createClass3.default)(DependencyMap, [{
    key: 'register',
    value: function register(task) {
      this.registerAsExplicitDependent(task);
      this.registerAsImplicitDependency(task);
    }
  }, {
    key: 'registerAsExplicitDependent',
    value: function registerAsExplicitDependent(task) {
      var _this = this;

      task.dependsOn.forEach(function (name) {
        var tasks = _this.map.get(task);

        if (tasks) {
          tasks.add(name);
        } else {
          _this.map.set(task, new _set2.default([name]));
        }

        var names = _this.map.get(name);

        if (names) {
          tasks.add(task);
        } else {
          _this.map.set(name, new _set2.default([task]));
        }
      });
    }
  }, {
    key: 'registerAsImplicitDependency',
    value: function registerAsImplicitDependency(task) {
      // Task is registered according to its downstream output
      // so that another task can check if it has it as its upstream input

      // Take advantage of singletonness of GulpGlobs
      var destglob = task.destglob && new _gulpglob2.default(task.destglob);

      if (!destglob) {
        return;
      }

      var tasks = this.map.get(destglob);

      if (tasks) {
        tasks.add(task);
      } else {
        this.map.set(destglob, new _set2.default([task]));
      }
    }
  }, {
    key: 'getDependencies',
    value: function getDependencies(task) {
      var explicitDeps = this.getExplicitDependencies(task);
      var implicitDeps = this.getImplicitDependencies(task);
      return (0, _from2.default)(new _set2.default(explicitDeps.concat(implicitDeps)));
    }
  }, {
    key: 'getExplicitDependencies',
    value: function getExplicitDependencies(task) {
      var set = this.map.get(task);
      return set ? (0, _from2.default)(set).map(function (name) {
        return task.getTask(name);
      }) : [];
    }
  }, {
    key: 'getImplicitDependencies',
    value: function getImplicitDependencies(task) {
      // Take advantage of singletonness of GulpGlobs
      var set = this.map.get(new _gulpglob2.default(task.glob));
      return set ? (0, _from2.default)(set) : [];
    }
  }, {
    key: 'getDependents',
    value: function getDependents(_ref) {
      var name = _ref.name;

      var set = this.map.get(name);
      return set ? (0, _from2.default)(set) : [];
    }
  }]);
  return DependencyMap;
}();

exports.default = DependencyMap;
module.exports = exports['default'];