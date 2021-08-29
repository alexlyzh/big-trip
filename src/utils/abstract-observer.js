export default class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(modelEvent, payload) {
    this._observers.forEach((observer) => observer(modelEvent, payload));
  }
}
