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

The Docker setup is a typical LAMP setup for ProgressiveWordpress (LAMPWP?!). The Docker image is based on the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/) but adds a self-signed certificate and HTTP/2 configuration files.  It is also published to the [Docker Hub](https://hub.docker.com/r/surma/progressivewordpress/) if you don’t want to build locally. WordPress also needs a  MySQL server (root password is set to `lolz`), for which the [offical MySQL Docker image](https://hub.docker.com/_/mysql/) is used.

```
$ docker run --name pwp-mysql -e MYSQL_ROOT_PASSWORD=lolz -d mysql:8.0
$ docker build -t surma/progressivewordpress .
$ docker run --name pwp --link pwp-mysql:mysql \
  -v $(pwd)/dist:/var/www/html/wp-content/themes/surmblog \
  -v $(pwd)/uploads:/var/www/html/wp-content/uploads \
  -p 8080:80 -d surma/progressivewordpress
```

Add `surmblog.dev` to your HOSTS file and point it at `127.0.0.1`. Add `docker_assets/certs/cert.pem` to your local key chain and trust it.

Blog is now available at `https://surmblog.dev:8080`.

---
Apache 2.0
