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
    key: 'registerAsDependent',
    value: function registerAsDependent(task) {
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
    key: 'getDependenciesFor',
    value: function getDependenciesFor(task) {
      var set = this.map.get(new _gulpglob2.default(task.glob));
      return set ? (0, _from2.default)(set) : [];
    }
  }]);
  return DependencyMap;
}();

exports.default = DependencyMap;
module.exports = exports['default'];