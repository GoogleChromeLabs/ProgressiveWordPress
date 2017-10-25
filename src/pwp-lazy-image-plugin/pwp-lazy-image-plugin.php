<?php
/**
 * Plugin Name: PWP Lazy Image
 * Plugin URI: https://github.com/GoogleChrome/progressivewordpress
 * Description: Converts included images to lazy-loading versions
 * Version: 1.0
 * Author: Surma <surma@google.com>
 * Author URI: http://twitter.com/dassurma
 * License: Apache-2.0
 * Text Domain: pwp-lazy-image-plugin
 * 
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

if ( ! class_exists( 'PWP_Lazy_Image' ) ) {

  class PWP_Lazy_Image {
  
    public static function init() {
      self::hooks();
    }

    private static function hooks() {
      add_filter( 'content_save_pre', array( __CLASS__, 'lazify_images' ), 0 );
    }

    public static function lazify_images( $content ) {
      return preg_replace_callback( '/<img[^>]*src=\\\"([^\"]+)\\\"[^>]*>/i', array( __CLASS__, 'lazify_images_callback' ), $content );
    }

    public static function lazify_images_callback( $matches ) {
      $wp_upload_dir = wp_upload_dir();
      $upload_url    = $wp_upload_dir['baseurl'];
      $image_path    = $matches[1];

      if ( substr( $image_path, 0, strlen( $upload_url ) ) !== $upload_url ) {
        return $matches[0];
      }

      $real_path = substr( $image_path, strlen( $upload_url ) );
      $abs_path  = realpath( $wp_upload_dir['basedir'] . '/' . $real_path );
      $thumb     = self::generate_thumbnail( $abs_path );

      return sprintf( 
        '<pwp-lazy-image src="%s" width="%d" height="%d" style="padding-top: %d%%; background-image: url(data:image/png;base64,%s);"></pwp-lazy-image>', 
        $image_path,
        $thumb['width'],
        $thumb['height'],
        $thumb['ratio'],
        $thumb['base64']
      );
    }

    private static function generate_thumbnail( $src_image_path ) {
      $dst_image_width  = 9;
      $dst_image_height = 9;

      list( $src_image_width, $src_image_height ) = getimagesize( $src_image_path );

      $src_image_extension = strtolower( pathinfo( $src_image_path, PATHINFO_EXTENSION ) );

      if ( 'png' == $src_image_extension ) {
        $src_image = imagecreatefrompng( $src_image_path );
      } elseif ( in_array( $src_image_extension, array( 'jpg', 'jpeg' ) ) ) {
        $src_image = imagecreatefromjpeg( $src_image_path );
      }
      
      $dst_image = imagecreatetruecolor( $dst_image_width, $dst_image_height );
      imagecopyresized( $dst_image, $src_image, 0, 0, 0, 0, $dst_image_width, $dst_image_height, $src_image_width, $src_image_height);

      ob_start();
      imagepng( $dst_image );
      $raw_image = ob_get_contents();
      ob_end_clean();
      $base64_image = base64_encode( $raw_image );

      return array(
        'base64' => $base64_image,
        'width'  => $src_image_width,
        'height' => $src_image_height,
        'ratio'  => ( $src_image_height / $src_image_width ) * 100,
      );
    }

  }

  add_action( 'plugins_loaded', array( 'PWP_Lazy_Image', 'init' ) );

}
