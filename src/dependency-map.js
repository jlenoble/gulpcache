import GulpGlob from 'gulpglob';

export default class DependencyMap {
  constructor () {
    Object.defineProperties(this, {
      map: {
        value: new Map(),
      },
    });
  }

  registerAsDependent (task) {
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

  getDependenciesFor (task) {
    const set = this.map.get(new GulpGlob(task.glob));
    return set ? Array.from(set) : [];
  }
}
