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
<footer>
  <div class="credit">
    <p>Authored by <a href="#"><?php the_author(); ?></a></p>
    <p><a href="#"><?php echo comments_number( 'No comments', '1 comment', '% comments' ); ?></a></p>
  </div>
  <button class="download"><pwp-spinner></pwp-spinner>Save for offline reading</button>
  <?php the_category(); ?>
</footer>
