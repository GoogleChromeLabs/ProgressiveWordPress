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
  $preloads = [];

  function add_preload($asset, $type = 'style') {
    global $preloads;
    array_push($preloads, array('asset' => $asset, 'type' => $type));
  }

  function send_preload() {
    global $preloads;
    $payloads = [];
    foreach($preloads as $preload) {
      array_push($payloads, '<' . get_bloginfo('template_url') . $preload['asset'] . '>;rel=preload;as=' . $preload['type']);
    }
    header('Link: ' . join(',', $payloads));
  }

  // This just a 1K script, but it’s synchronous and will be injected before
  // ours. We don’t need it, so just don’t load it at all.
  function my_deregister_scripts(){
    wp_deregister_script( 'wp-embed' );
  }
  add_action( 'wp_footer', 'my_deregister_scripts' );

  function is_fragment() {
    return $_GET['fragment'] == 'true';
  }
?>
