'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapWithSourcemapsPipes = exports.wrapWithDebugPipes = undefined;

var _polypipe = require('polypipe');

var _polypipe2 = _interopRequireDefault(_polypipe);

var _gulpNewer = require('gulp-newer');

var _gulpNewer2 = _interopRequireDefault(_gulpNewer);

var _gulpDebug = require('gulp-debug');

var _gulpDebug2 = _interopRequireDefault(_gulpDebug);

var _gulpSourcemaps = require('gulp-sourcemaps');

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var wrapWithDebugPipes = exports.wrapWithDebugPipes = function wrapWithDebugPipes(ctx, pipe, dest) {
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
      break;

    default:
      pipes = pipe;
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

var wrapWithSourcemapsPipes = exports.wrapWithSourcemapsPipes = function wrapWithSourcemapsPipes(ctx, pipe) {
  return ctx.sourcemaps && pipe ? new _polypipe2.default(_gulpSourcemaps2.default.init, pipe, _gulpSourcemaps2.default.write) : pipe;
};