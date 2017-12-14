import {getter, returnsBool} from './helpers';

const getDebug = returnsBool(getter('debug'));
const getDebugDest = returnsBool(getter('debugDest'));
const getDebugMinimal = getter('debugMinimal');
const getDebugNewer = returnsBool(getter('debugNewer'));
const getDebugSrc = returnsBool(getter('debugSrc'));
const getSourcemaps = getter('sourcemaps');

export const setConfigProperties = (ctx, args) => {
  const debug = getDebug(args);
  const minimal = getDebugMinimal(args);

  Object.defineProperties(ctx, {
    debug: {
      value: debug,
    },
    debugDest: {
      value: debug || getDebugDest(args),
    },
    debugMinimal: {
      value: minimal !== undefined ? !!minimal : true,
    },
    debugNewer: {
      value: debug || getDebugNewer(args),
    },
    debugSrc: {
      value: debug || getDebugSrc(args),
    },

    sourcemaps: {
      value: getSourcemaps(args),
    },
  });
};
