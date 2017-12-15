import PolyPipe from 'polypipe';
import newer from 'gulp-newer';
import debug from 'gulp-debug';
import sourcemaps from 'gulp-sourcemaps';

export const wrapWithDebugPipes = (ctx, pipe, dest) => {
  const flags = ctx.debugSrc + 2 * ctx.debugNewer + 4 * ctx.debugDest;

  const debugSrcPipe = new PolyPipe([debug, {
    title: `Task '${ctx.name}' (SRC):`,
    minimal: ctx.debugMinimal,
  }]);
  const debugNewerPipe = new PolyPipe([debug, {
    title: `Task '${ctx.name}' (NWR):`,
    minimal: ctx.debugMinimal,
  }]);
  const debugDestPipe = new PolyPipe([debug, {
    title: `Task '${ctx.name}' (DST):`,
    minimal: ctx.debugMinimal,
  }]);

  let pipes;

  switch (flags) {
  case 1: case 3:
    pipes = pipe ? pipe.prepipe(debugSrcPipe) : debugSrcPipe;
    break;

  case 4: case 6:
    pipes = pipe ? pipe.pipe(debugDestPipe) : debugDestPipe;
    break;

  case 5: case 7:
    pipes = pipe ? pipe.prepipe(debugSrcPipe).pipe(debugDestPipe) :
      debugSrcPipe;
    break;

  default:
    pipes = pipe;
  }

  if (!dest) {
    return {pipes};
  }

  let newerPipes = new PolyPipe([newer, dest.destination]);

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
  case 6: case 7:
    if (!pipe) {
      break;
    }
  // FALL THROUGH
  case 4: case 5:
    newerPipes = newerPipes.pipe(debugDestPipe);
  }

  return {pipes, newerPipes};
};

export const wrapWithSourcemapsPipes = (ctx, pipe) => {
  return ctx.sourcemaps && pipe ? new PolyPipe(
    sourcemaps.init,
    pipe,
    sourcemaps.write
  ) : pipe;
};
