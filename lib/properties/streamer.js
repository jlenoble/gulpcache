'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setStreamerProperties = undefined;

var _defineProperties = require('babel-runtime/core-js/object/define-properties');

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _gulpstream = require('gulpstream');

var _gulpstream2 = _interopRequireDefault(_gulpstream);

var _polypath = require('polypath');

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeStreamer = function makeStreamer(ctx, args) {
  var _makeOptions = (0, _gulpstream.makeOptions)(args),
      glob = _makeOptions.glob,
      pipe = _makeOptions.pipe,
      dest = _makeOptions.dest;

  var _wrapWithDebugPipes = (0, _helpers.wrapWithDebugPipes)(ctx, (0, _helpers.wrapWithSourcemapsPipes)(ctx, pipe), dest),
      pipes = _wrapWithDebugPipes.pipes,
      newerPipes = _wrapWithDebugPipes.newerPipes;

  if (!newerPipes) {
    return new _gulpstream2.default(['default', glob, pipes]);
  }

  return new _gulpstream2.default(['default', glob, pipes, dest], ['newer', glob, newerPipes, dest]);
};

var setStreamerProperties = exports.setStreamerProperties = function setStreamerProperties(ctx, args) {
  var streamer = makeStreamer(ctx, args);

  (0, _defineProperties2.default)(ctx, {
    streamer: {
      value: streamer
    },

    glob: {
      value: streamer.glob
    },

    destglob: {
      value: streamer.destination ? (0, _polypath.rebaseGlob)(streamer.glob, streamer.destination) : null
    },

    plugin: {
      value: streamer.plugin
    },

    dest: {
      value: streamer.destination
    }
  });
};