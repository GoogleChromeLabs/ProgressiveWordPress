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
  require 'third_party/mustache.php/Mustache/Autoloader.php';
  Mustache_Autoloader::register();
  $m = new Mustache_Engine;
  var_dump($m);
?>
<!doctype html>
<link rel="stylesheet" href="<?=get_bloginfo('template_url');?>/style.css">
<?
  wp_head();
?>
