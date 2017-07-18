<?
  /**
   * Copyright 2017 Google Inc. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *     http://www.apache.org/licenses/LICENSE-2.0
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
?>
<?
  require('../../../wp-load.php');
  etag_start();
  header('Content-Type: application/json');
?>
{
  "name": "Aimless Stack Pointer",
  "short_name": "PWP",
  "lang": "en-US",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#BF3F71",
  "background_color": "#FFF8F7",
  "icons": [
    {
      "src": "<?=get_bloginfo('template_url');?>/images/icon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
<?
  etag_end();
?>
