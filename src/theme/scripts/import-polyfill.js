_registry = {};
(function() {
  function myLoader(path) {
    path = path.replace('/scripts/', '/scripts/systemjs/');
    return SystemJS.import(path);
  }

  window.importPolyfill = ('SystemJS' in window) ? myLoader : (path => {
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
  });
})();
