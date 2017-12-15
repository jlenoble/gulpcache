'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfigProperties = undefined;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getDebug = (0, _helpers.returnsBool)((0, _helpers.getter)('debug'));
var getDebugDest = (0, _helpers.returnsBool)((0, _helpers.getter)('debugDest'));
var getDebugMinimal = (0, _helpers.getter)('debugMinimal');
var getDebugNewer = (0, _helpers.returnsBool)((0, _helpers.getter)('debugNewer'));
var getDebugSrc = (0, _helpers.returnsBool)((0, _helpers.getter)('debugSrc'));
var getSourcemaps = (0, _helpers.returnsBool)((0, _helpers.getter)('sourcemaps'));

var setConfigProperties = exports.setConfigProperties = function setConfigProperties(ctx, args) {
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
      value: minimal !== undefined ? !!minimal : true
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