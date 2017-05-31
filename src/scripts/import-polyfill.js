_registry = {};
importPolyfill = path => {
  if(!(path in _registry)) {
    const entry = _registry[path] = {};
    entry.promise = new Promise(resolve => entry.resolve = resolve);
    document.head.appendChild(Object.assign(
      document.createElement('script'),
      {
        type: 'module',
        innerText: `import * as X from '${path}'; _registry['${path}'].resolve(X);`,
      }
    ));
  }
  return _registry[path].promise;
};
