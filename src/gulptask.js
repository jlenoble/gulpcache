import {SingletonFactory} from 'singletons';
import gulp from 'gulp';
import DependencyMap from './dependency-map';
import {getName, setMainProperties,
  setFunctionProperties} from './properties.js';
import {setConfigProperties, setStreamerProperties} from './properties/index';

const dependencies = new DependencyMap();

export class SimpleGulpTask {
  constructor (...args) {
    setConfigProperties(this, args);
    setMainProperties(this, args);
    setStreamerProperties(this, args);
    setFunctionProperties(this, args);

    Object.defineProperty(this, 'options', {
      value: {
        read: true,
        mode: 'default',
      },
    });

    dependencies.register(this);

    gulp.task(this.execFn);
    gulp.task(this.watchFn);
    gulp.task(`tdd:${this.name}`, gulp.series(this.execFn, this.watchFn));
  }

  passAllFiles () {
    this.options.mode = 'default';
    this.options.since = undefined;
  }

  passNewerFilesOnly () {
    this.options.since = gulp.lastRun(this.fn);
    this.options.mode = this.options.since ? 'default': 'newer';
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
