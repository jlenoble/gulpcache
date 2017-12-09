import {SingletonFactory} from 'singletons';
import gulp from 'gulp';
import DependencyMap from './dependency-map';
import {getName, setConfig, setMainProperties, mixInStreamerProperties,
  setFunctionProperties} from './properties';

const dependencies = new DependencyMap();

export class SimpleGulpTask {
  constructor (...args) {
    setConfig(this, args);
    setMainProperties(this, args);
    mixInStreamerProperties(this);
    setFunctionProperties(this, args);

    dependencies.register(this);

    gulp.task(this.execFn);
    gulp.task(this.watchFn);
    gulp.task(`tdd:${this.name}`, gulp.series(this.execFn, this.watchFn));
  }

  passAllFiles () {
    this.streamer.setMode('default');
  }

  passNewerFilesOnly () {
    this.streamer.setMode('newer');
  }

  getOptions () {
    return {
      read: true,
      mode: this.streamer.mode,
    };
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
