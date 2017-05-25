# Progressive WordPress (PWP)

A Sample WordPress-based Progressive Web App.

## Local Development

### Setup

Add `surmblog.dev` to your HOSTS file and point it at `127.0.0.1`. Add `docker_assets/certs/cert.pem` to your local key chain and trust it. Then run the following commands to build the docker image:

```
$ docker build -t surma/progressivewordpress .
```

The Docker image is based on the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/) but adding certificates and HTTP/2 configuration files. It is also published to the [Docker Hub](https://hub.docker.com/r/surma/progressivewordpress/) so you don’t need to build locally.

Don’t forget to install all dependencies by running

```
$ npm install
```

Lastly, WordPress needs a  MySQL server (root password is set to `lolz`):

```
$ docker run --name pwp-mysql -e MYSQL_ROOT_PASSWORD=lolz -d mysql:8.0
```

### Build

The theme can be built with

```
$ npm run build
```

For continuous builds, run

```
$ npm run watch
```

### Server

To run a local instance, start the LAMPWP (yes that’s a thing now):

```
$ docker run --name pwp --link pwp-mysql:mysql -v $(PWD)/dist:/var/www/html/wp-content/themes/surmblog -p 8080:80 -d surma/progressivewordpress
```

Blog is now available at `https://surmblog.dev:8080`.

---
Apache 2.0
