# Progressive WordPress (PWP)

A Sample WordPress-based Progressive Web App.

## Local Development

### Setup

#### Theme

Install all the dependencies

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

#### Docker

The Docker setup is a typical LAMP setup for ProgressiveWordpress (LAMPWP?!). The Docker image is based on the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/) but adds a self-signed certificate and HTTP/2 configuration files. It is also published to the [Docker Hub](https://hub.docker.com/r/surma/progressivewordpress/) if you don’t want to build locally. WordPress also needs a MySQL server for which the [official MySQL Docker image](https://hub.docker.com/_/mysql/) is used.

```
$ docker pull surma/wordpress # if you don’t want to build locally
$ docker-compose up -d
```

WordPress install wizard is now available at `https://localhost:8080`. Once installed, make sure to [enable the theme](https://localhost:8080/wp-admin/themes.php) and [set the permalink style](https://localhost:8080/wp-admin/options-permalink.php) to “Post name”.

---
Apache 2.0
