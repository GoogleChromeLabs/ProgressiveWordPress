module.exports = class AsyncArray {
  constructor(array) {
    this._array = Promise.resolve(array);
  }

  static from(array) {
    return new AsyncArray(array);
  }

  map(f) {
    return AsyncArray.from((async _ => {
      const array = await this._array;
      return Promise.all(array.map(f));
    })());
  }

  filter(f) {
    return AsyncArray.from((async _ => {
      const array = await this._array;
      const filters = await Promise.all(array.map(f));
      return array.filter((_, idx) => filters[idx]);
    })());
  }

  get array() {
    return this._array;
  }
}
