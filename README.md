# Progressive WordPress (PWP)

A Sample WordPress-based Progressive Web App.

## Local Development

Add `surmblog.dev` to your HOSTS file and point it at `127.0.0.1`. Add `docker_assets/certs/cert.pem` to your local key chain and trust it. Then run the following commands to build the docker image:

```
$ docker build -t surma/progressivewordpress .
```

The Docker image is based on the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/) but adding certificates and HTTP/2 configuration files. It is also published to the [Docker Hub](https://hub.docker.com/r/surma/progressivewordpress/) so you don’t need to build locally.

To run a local instance, spawn a MySQL server (root password is set to `lolz`) and start the LAMPWP (yes that’s a thing now):

```
$ docker run --name pwp-mysql -e MYSQL_ROOT_PASSWORD=lolz -d mysql:8.0
$ docker run --name pwp --link pwp-mysql:mysql -v $(PWD)/theme:/var/www/html/wp-content/themes/surmblog -p 8080:80 -d surma/progressivewordpress
```

Blog is now be available at `https://surmblog.dev:8080`.

---
Apache 2.0
