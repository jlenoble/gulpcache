import GulpGlob from 'gulpglob';

export default class DependencyMap {
  constructor () {
    Object.defineProperties(this, {
      map: {
        value: new Map(),
      },
    });
  }

  register (task) {
    this.registerAsExplicitDependent(task);
    this.registerAsImplicitDependency(task);
  }

  registerAsExplicitDependent (task) {
    task.dependsOn.forEach(name => {
      const tasks = this.map.get(task);

      if (tasks) {
        tasks.add(name);
      } else {
        this.map.set(task, new Set([name]));
      }

      const names = this.map.get(name);

      if (names) {
        tasks.add(task);
      } else {
        this.map.set(name, new Set([task]));
      }
    });
  }

  registerAsImplicitDependency (task) {
    // Task is registered according to its downstream output
    // so that another task can check if it has it as its upstream input

    // Take advantage of singletonness of GulpGlobs
    let destglob = task.destglob && new GulpGlob(task.destglob);

    if (!destglob) {
      return;
    }

    const tasks = this.map.get(destglob);

    if (tasks) {
      tasks.add(task);
    } else {
      this.map.set(destglob, new Set([task]));
    }
  }

  getDependencies (task) {
    const explicitDeps = this.getExplicitDependencies(task);
    const implicitDeps = this.getImplicitDependencies(task);
    return Array.from(new Set(explicitDeps.concat(implicitDeps)));
  }

  getExplicitDependencies (task) {
    const set = this.map.get(task);
    return set ? Array.from(set).map(name => task.getTask(name)) : [];
  }

  getImplicitDependencies (task) {
    // Take advantage of singletonness of GulpGlobs
    const set = this.map.get(new GulpGlob(task.glob));
    return set ? Array.from(set) : [];
  }

  getDependents ({name}) {
    const set = this.map.get(name);
    return set ? Array.from(set) : [];
  }
}
