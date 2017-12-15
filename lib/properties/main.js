'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setMainProperties = exports.getName = undefined;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _helpers = require('./helpers');

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

var _getDependsOn = (0, _helpers.getter)('dependsOn');
var getDescription = (0, _helpers.getter)('description');

var getDependsOn = function getDependsOn(args) {
  var dependsOn = _getDependsOn(args);
  if (!dependsOn) {
    return [];
  }
  return Array.isArray(dependsOn) ? dependsOn : [dependsOn];
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
};