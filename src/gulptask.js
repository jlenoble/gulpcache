import {SingletonFactory} from 'singletons';
import GulpStream from 'gulpstream';
import gulp from 'gulp';
import destglob from 'destglob';
import DependencyMap from './dependency-map';
import {makeFn, makeExecFn, makeWatchFn} from './function-factories';

const dependencies = new DependencyMap();

const getName = args => {
  let name;

  args.some(arg => {
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

const getDescription = args => {
  let description;

  args.some(arg => {
    if (arg.description) {
      description = arg.description;
      return true;
    }

    return false;
  });

  return description;
};

const getDependsOn = args => {
  let dependsOn;

  args.some(arg => {
    if (arg.dependsOn) {
      dependsOn = arg.dependsOn;
      return true;
    }

    return false;
  });

  if (!dependsOn) {
    return [];
  }

  return Array.isArray(dependsOn) ? dependsOn : [dependsOn];
};

export class SimpleGulpTask {
  constructor (...args) {
    const name = getName(args);
    const description = getDescription(args);
    const dependsOn = getDependsOn(args);

    const _streamer = (new GulpStream(args)).at(0);

    Object.defineProperties(this, {
      name: {
        value: name,
      },

      description: {
        value: description,
      },
      // 
      // dependsOn: {
      //   value: dependsOn,
      // },
      //
      // glob: {
      //   value: _streamer.glob,
      // },
      //
      // destglob: {
      //   value: _streamer.destination ? destglob(_streamer.glob,
      //     _streamer.destination) : null,
      // },
      //
      // plugin: {
      //   value: _streamer.plugin,
      // },
      //
      // dest: {
      //   value: _streamer.destination,
      // },
      //
      // streamer: {
      //   value: _streamer,
      // },
    });

    // Factories rely on nampe and descripton properties to be defined
    const fn = makeFn(args, this);
    const execFn = makeExecFn(this);
    const watchFn = makeWatchFn(this);

    Object.defineProperties(this, {
      fn: {
        value: fn,
      },

      execFn: {
        value: execFn,
      },

      watchFn: {
        value: watchFn,
      },
    });

    dependencies.register(this);

    gulp.task(execFn);
    gulp.task(watchFn);
    gulp.task(`tdd:${name}`, gulp.series(execFn, watchFn));
  }

  getDependencies () {
    return dependencies.getDependencies(this);
  }

  getDependents () {
    return dependencies.getDependents(this);
  }

  getTask (name) {
    return GulpTask.get(name);
  }
}

const GulpTask = SingletonFactory(SimpleGulpTask, // eslint-disable-line new-cap
  ['literal', {type: 'ignore', rest: true}], {
    preprocess (args) {
      return [getName(args), ...args];
    },
  });

export default GulpTask;
