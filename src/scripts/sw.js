const VERSION = '{%VERSION%}';

self.oninstall = event => {
  event.waitUntil(self.skipWaiting());
};

self.onactivate = event => {
  event.waitUntil(self.clients.claim());
}

self.onfetch = event => {
  console.log('onfetch', event.request.url);
};
