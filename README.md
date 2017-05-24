# Progressive WordPress (PWP)

A Sample WordPress-based Progressive Web App.

## Local Development

Add `surmblog.dev` to your HOSTS file and point it at `127.0.0.1`. Add the `docker/certs/cert.pem` to your local key chain and trust it. Then run the following commands to build the docker image:

```
$ cd docker
$ docker build -t pwp .
```

The Docker image is based on the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/) but adding certificates and HTTP/2 configuration files.

To run the local instance, spawn a MySQL server (with root password `lolz`) and start the LAMPWP (yes that’s a thing now).

```
$ docker run --name pwp-mysql -e MYSQL_ROOT_PASSWORD=lolz -d mysql:8.0
$ docker run --name pwp --link pwp-mysql:mysql -p 8080:80 -d pwp
```

Blog is now be available at `https://surmblog.dev:8080`.

---
Apache 2.0
