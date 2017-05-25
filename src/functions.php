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
  include("third_party/mustache.php/Mustache/Autoloader.php");
  Mustache_Autoloader::register();
  $mustacheEngine = new Mustache_Engine(array(
    "loader" => new Mustache_Loader_FilesystemLoader(dirname(__FILE__)),
  ));

  function render_json($data) {
    echo json_encode($data);
  }

  function render_template($path, $data) {
    global $mustacheEngine;
    get_template_part("header");
    echo $mustacheEngine->render($path, $data);
    get_template_part("footer");
  }
?>
