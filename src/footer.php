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
  require_once(dirname(__FILE__).'/../../../wp-load.php');
  etag_start();
?>
</pwp-view>
<? wp_nav_menu(array('theme_location' => 'footer-nav')); ?>
<?
  wp_footer();
?>
<script>
  window._wordpressConfig = {
    templateUrl: '<?=get_bloginfo('template_url');?>',
    baseUrl: '<?=home_url();?>',
  };
</script>
<script src="<?=get_bloginfo('template_url');?>/scripts/import-polyfill.js" defer></script>
<script src="<?=get_bloginfo('template_url');?>/scripts/ric-polyfill.js" defer></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/observable.js"></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/router.js"></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/lazyload.js"></script>
<noscript class="lazyload">
<script src="<?=get_bloginfo('template_url');?>/scripts/idb.js" defer></script>
<script src="<?=get_bloginfo('template_url');?>/scripts/sw-postmessage.js" defer></script>
<script src="<?=get_bloginfo('template_url');?>/scripts/bg-sync-manager.js" defer></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/pwp-view.js"></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/pwp-notification.js"></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/pwp-lazy-image.js"></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/install-sw.js"></script>
<script type="module" src="<?=get_bloginfo('template_url');?>/scripts/pending-comments.js"></script>
</noscript>
<?
  etag_end();
?>
