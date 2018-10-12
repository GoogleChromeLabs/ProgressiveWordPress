# Progressive WordPress (PWP)

A Sample WordPress-based Progressive Web App.

## Local Development

### Setup

#### Theme

Install all the dependencies (use Node 8 or newer)

```
$ npm install
```

and build the theme

```
$ npm run build
```

For continuous builds, run

```
$ npm run watch
```

Now just select the theme `PWAWP-theme` in the WordPress _wp-admin_ page.

#### Docker

The Docker setup is a network consisting of Caddy, Apache2/PHP7 and a MySQL container. The image for the Apache2/PHP7 container is based on the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/). It is also published to the [Docker Hub](https://hub.docker.com/r/surma/progressivewordpress/) if you don’t want to build locally. WordPress also needs a MySQL server for which the [official MySQL Docker image](https://hub.docker.com/_/mysql/) is used. [Caddy](https://hub.docker.com/r/abiosoft/caddy/) is added to the mix for easy local HTTP/2 development.

```
$ docker pull surma/progressivewordpress # if you don’t want to build locally
$ docker-compose up -d
```

The WordPress install wizard is now available at `http://localhost:8080`. If you want to use HTTP/2 during development, you have to:

* point `surmblog.dev` to `127.0.0.1` using `/etc/hosts`
* trust the certficiate in [caddy/certs](https://github.com/GoogleChromeLabs/ProgressiveWordPress/tree/master/caddy/certs)
* navigate to `https://surmblog.dev:8443` instead

Once installed, make sure to [enable the theme “surmblog”](http://localhost:8080/wp-admin/themes.php) and [set the permalink style](http://localhost:8080/wp-admin/options-permalink.php) to “Post name”.

---
Apache 2.0
