<?
/*
  Plugin Name: PWP Lazy Image
  Plugin URI: https://github.com/GoogleChrome/progressivewordpress
  Description: Converts included images to lazy-loading versions
  Version: 1.0
  Author: Surma <surma@google.com>
  Author URI: http://twitter.com/dassurma
  License: Apache-2.0
  Text Domain: pwp-lazy-image-plugin
*/
?>
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

  function isPNG($path) {
    return preg_match('/\.png$/i', $path);
  }
  function isJPG($path) {
    return preg_match('/\.jpe?g$/i', $path);
  }

  function generate_thumb($srcimagepath) {
    $dstimagewidth = 9;
    $dstimageheight = 9;

    $srcimagesize = getimagesize($srcimagepath);
    $srcimagewidth = $srcimagesize[0];
    $srcimageheight = $srcimagesize[1];
    if(isPNG($srcimagepath))
      $srcimage = imagecreatefrompng($srcimagepath);
    if(isJPG($srcimagepath))
      $srcimage = imagecreatefromjpeg($srcimagepath);
    $dstimage = imagecreatetruecolor($dstimagewidth, $dstimageheight);
    imagecopyresized($dstimage, $srcimage, 0, 0, 0, 0, $dstimagewidth, $dstimageheight, $srcimagewidth, $srcimageheight);

    ob_start();
    imagepng($dstimage);
    $rawimg = ob_get_contents();
    ob_end_clean();
    $base64img = base64_encode($rawimg);
    return array(
      'base64' => $base64img,
      'width' => $srcimagewidth,
      'height' => $srcimageheight,
      'ratio' => $srcimageheight/$srcimagewidth*100,
    );
  }

  function lazify_images($content) {
    return preg_replace_callback('/<img[^>]*src=\\\"([^\"]+)\\\"[^>]*>/i', function ($matches) {
      $upload_url = wp_upload_dir()['baseurl'];
      $upload_dir = wp_upload_dir()['basedir'];
      $img_path = $matches[1];
      if(substr($img_path, 0, strlen($upload_url)) !== $upload_url)
        return $matches[0];
      $relpath = substr($img_path, strlen($upload_url));
      $abspath = realpath($upload_dir . '/' . $relpath);
      $thumb = generate_thumb($abspath);

      return '<pwp-lazy-image src="' . $img_path . '" width="'. $thumb['width'] . '" height="' . $thumb['height'] .'" style="padding-top: '.$thumb['ratio'].'%; background-image: url(data:image/png;base64,' . $thumb['base64'] . ');"></pwp-lazy-image>';
    }, $content);
  }
  add_filter('the_content' , 'lazify_images', 0, 1);
?>
