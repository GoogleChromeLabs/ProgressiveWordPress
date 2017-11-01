<?php
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
<?php
  require_once(dirname(__FILE__).'/../../../wp-load.php');
  etag_start();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">

  <link rel="manifest" href="<?php echo pwa_theme_get_manifest_path(); ?>">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="application-name" content="PWP">
  <meta name="apple-mobile-web-app-title" content="PWP">
  <meta name="theme-color" content="#FFF8F7">
  <meta name="msapplication-navbutton-color" content="#FFF8F7">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="msapplication-starturl" content="/">
  <link rel="icon" type="image/jpeg" sizes="512x512" href="<?php echo bloginfo('template_url'); ?>/images/icon.png">
  <link rel="apple-touch-icon" type="image/jpeg" sizes="512x512" href="<?php echo bloginfo('template_url'); ?>/images/icon.png">

  <title>Aimless Stack Pointers</title>
  <style>
  <?php
    include(dirname(__FILE__).'/critical.css');
    include(dirname(__FILE__).'/components/header_critical.css');
    include(dirname(__FILE__).'/components/footer_critical.css');
    include(dirname(__FILE__).'/components/article_critical.css');
    include(dirname(__FILE__).'/components/ribbon_critical.css');
    include(dirname(__FILE__).'/components/comments_critical.css');
  ?>
  </style>
  <noscript class="lazyload">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/lazy.css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/components/fonts.css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/components/footer_lazy.css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/components/header_lazy.css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/components/article_lazy.css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/components/ribbon_lazy.css">
    <link rel="stylesheet" href="<?php echo get_bloginfo('template_url'); ?>/components/comments_lazy.css">
  </noscript>
</head>
<body>
  <header class="hero <?php echo is_single()?'single':''; ?>">
    <div class="wrapper">
      <a href="<?php echo home_url(); ?>" class="ribbon ribbon--btt">
        Aimless<br>
        Stack<br>
        Pointer
      </a>
    </div>
  </header>
  <pwp-view rendered>
    <?php
      etag_end();
    ?>
