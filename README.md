# Progressive WordPress (PWP)

A Sample WordPress-based Progressive Web App.

## Local Development

### Setup

#### Theme

The theme is a typical frontend app, using the Node ecosystem as a build pipeline.

Install all the dependencies by running

```
$ npm install
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

#### Docker Containers

Add `surmblog.dev` to your HOSTS file and point it at `127.0.0.1`. Add `docker_assets/certs/cert.pem` to your local key chain and trust it.

The setup uses a normal MySQL server using the [official MySQL Docker image](https://hub.docker.com/_/mysql/). The Docker image serving Wordpress is the [official Wordpress Docker image](https://hub.docker.com/_/wordpress/), so a classic LAMP stack for Progressive WordPress (LAMPWP?). The containers mounts the `dist` folder so you can see your changes to the code straight away (provided you have `npm run watch` running).

I am also using nginx because [Apache and PHP still don’t do ETags right](https://t.co/Ea8Xz43GBf). I am using the [official nginx Docker image](https://hub.docker.com/_/nginx/) and enabled HTTP/2.

To set up the local development containers, run these commands:

```
$ docker build -t surma/pwp-apache . # Builds LAMPWP container image
$ docker build -t surma/pwp-nginx nginx # Builds nginx container image
$ docker run --name pwp-mysql -e MYSQL_ROOT_PASSWORD=lolz -d mysql:8.0 # Start MySQL server with root password `lolz`
$ docker run --name pwp-apache --link pwp-mysql:mysql -v $(PWD)/dist:/var/www/html/wp-content/themes/surmblog -d surma/pwp-apache
$ docker run --name pwp-nginx --link pwp-apache -p 8080:443 -d surma/pwp-nginx
```

The blog should now be available at `https://surmblog.dev:8080`.

#### CMS Configuration

1. Activate the “SurmBlog” theme in the admin panel under “Appearance” → “Themes”
2. Set the permalinks to “post name” in the admin panel under “Settings” → “Permalinks”

---
Apache 2.0
