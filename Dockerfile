# Copyright 2017 Google Inc. All Rights Reserved.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#     http://www.apache.org/licenses/LICENSE-2.0
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FROM wordpress:4.7-php7.0-apache

RUN ln -sf /etc/apache2/mods-available/socache_shmcb.* /etc/apache2/mods-enabled/
RUN ln -sf /etc/apache2/mods-available/ssl.* /etc/apache2/mods-enabled/
RUN ln -sf /etc/apache2/mods-available/headers.* /etc/apache2/mods-enabled/
RUN echo "deb http://http.debian.net/debian testing main" > /etc/apt/sources.list.d/testing.list
COPY docker_assets/testing /etc/apt/preferences.d/
RUN apt-get update
RUN apt-get install -o Dpkg::Options::="--force-confdef" -y -t testing apache2
RUN ln -sf /etc/apache2/mods-available/http2.* /etc/apache2/mods-enabled/
COPY docker_assets/http2.conf /etc/apache2/conf-available/
RUN ln -sf /etc/apache2/conf-available/http2.* /etc/apache2/conf-enabled/
COPY docker_assets/certs /etc/apache2/certs
COPY docker_assets/000-default.conf /etc/apache2/sites-available/
RUN mkdir -p /var/www/html/wp-content/themes/surmblog /var/www/html/wp-content/plugins/pwp-lazy-image
COPY dist/theme /var/www/html/wp-content/themes/surmblog
COPY dist/pwp-lazy-image-plugin /var/www/html/wp-content/plugins/pwp-lazy-image/
VOLUME /var/www/html/wp-content/themes/surmblog
VOLUME /var/www/html/wp-content/plugins/pwp-lazy-image-plugin
