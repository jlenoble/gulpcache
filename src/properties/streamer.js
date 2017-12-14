import GulpStream, {makeOptions} from 'gulpstream';
import {rebaseGlob} from 'polypath';
import {wrapWithDebugPipes} from './wrap-pipes';

const makeStreamer = (ctx, args) => {
  const {glob, pipe, dest} = makeOptions(args);
  const {pipes, newerPipes} = wrapWithDebugPipes(ctx, pipe, dest);

  if (!newerPipes) {
    return new GulpStream(
      ['default', glob, pipes]
    );
  }

  return new GulpStream(
    ['default', glob, pipes, dest],
    ['newer', glob, newerPipes, dest]
  );
};

export const setStreamerProperties = (ctx, args) => {
  const streamer = makeStreamer(ctx, args);

  Object.defineProperties(ctx, {
    streamer: {
      value: streamer,
    },

    glob: {
      value: streamer.glob,
    },

    destglob: {
      value: streamer.destination ? rebaseGlob(streamer.glob,
        streamer.destination) : null,
    },

    plugin: {
      value: streamer.plugin,
    },

    dest: {
      value: streamer.destination,
    },
  });
};
