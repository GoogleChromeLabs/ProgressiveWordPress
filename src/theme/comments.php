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
<?php if(have_comments()): ?>
  <ul class="comments">
    <?php while(have_comments()): the_comment(); ?>
      <li class="comment">
        <?php echo get_avatar(get_comment_author_email(), 250); ?>
        <div class="comment__author"><?php echo get_comment_author();?></div>
        <div class="comment__date"><?php echo get_comment_date('D, M m Y, H:i');?></div>
        <div class="comment__text"><?php echo get_comment_text();?></div>
      </li>
    <?php endwhile; ?>
  </ul>
<?php else: ?>
  <div class="comments">No comments.</div>
<?php endif; ?>
