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

if ( ! defined( 'ABSPATH' ) ) {
  exit;
} ?>
<article class="preview">
  <header>
    <div class="ribbon ribbon--ttb ribbon--blue"><?php echo get_the_date( 'M d' ); ?><br><?php echo get_the_date( 'Y' ); ?></div>
    <a href="<?php the_permalink(); ?>" class="headline"><?php the_title(); ?></a>
  </header>
  <main class="excerpt"><?php the_excerpt(); ?></main>
  <?php include dirname( __FILE__ ) . '/fragment-post-footer.php'; ?>
</article>
