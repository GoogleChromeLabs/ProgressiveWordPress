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
FROM wordpress:4.8-php7.0-apache

# Gotta fix HTTPS >.>
RUN echo "<? if (\$_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') { \$_SERVER['HTTPS'] = 'on'; } ?>" >> /tmp/file && \
    cat /usr/src/wordpress/wp-config-sample.php >> /tmp/file && \
    cp /tmp/file /usr/src/wordpress/wp-config-sample.php
# Gotta fix GZIP, too >.>
RUN sed -i 's|</VirtualHost>||' /etc/apache2/sites-enabled/000-default.conf && \
echo "    # Set no-cache as default caching strategy to avoid heuristics stupidity" >> /etc/apache2/sites-enabled/000-default.conf && \
echo "    Header setIfEmpty Cache-Control \"public, no-cache\"" >> /etc/apache2/sites-enabled/000-default.conf && \
echo "    # Fix etags w/ mod_deflate >.>" >> /etc/apache2/sites-enabled/000-default.conf && \
echo "    Header edit \"ETag\" \"^(.*)-gzip(\\\"?)$\" \"\$1\$2\"" >> /etc/apache2/sites-enabled/000-default.conf && \
echo "    RequestHeader unset If-Modified-Since" >> /etc/apache2/sites-enabled/000-default.conf && \
echo "</VirtualHost>" >> /etc/apache2/sites-enabled/000-default.conf && \
echo "" >> /etc/apache2/sites-enabled/000-default.conf && \
ln -sf /etc/apache2/mods-available/headers.* /etc/apache2/mods-enabled/

COPY dist/theme /var/www/html/wp-content/themes/surmblog
RUN mkdir /var/www/html/wp-content/themes/surmblog_dev
COPY dist/pwp-lazy-image-plugin /var/www/html/wp-content/plugins/pwp-lazy-image
VOLUME /var/www/html/wp-content/themes/surmblog_dev
VOLUME /var/www/html/wp-content/plugins/pwp-lazy-image-plugin
