const VERSION = '{%VERSION%}';

self.oninstall = event => {
  console.log('On install');
};

self.onfetch = event => {
  console.log(`On fetch ${event.request.url}`);
};
