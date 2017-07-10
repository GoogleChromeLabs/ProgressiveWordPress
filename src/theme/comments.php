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
<? if(have_comments()): ?>
  <ul>
    <? while(have_comments()): the_comment(); ?>
      <li class="comment">
        <?=get_avatar(get_comment_author_email(), 250); ?>
        <div class="comment__author"><?=get_comment_author();?></div>
        <div class="comment__date"><?=get_comment_date('D, M m Y, H:i');?></div>
        <div class="comment__text"><?=get_comment_text();?></div>
      </li>
    <? endwhile; ?>
  </ul>
<? else: ?>
  No comments.
<? endif; ?>
