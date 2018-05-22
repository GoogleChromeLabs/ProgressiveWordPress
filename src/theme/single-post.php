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
etag_start();
if ( ! is_fragment() ) {
	get_template_part( 'header' );
}
if ( is_user_logged_in() ) {
	$user                 = wp_get_current_user();
	$comment_author       = $user->display_name;
	$comment_author_email = $user->user_email;
} else {
	$comment_author       = '';
	$comment_author_email = '';
}
?>
<?php if ( have_posts() ) : ?>
	<?php
	while ( have_posts() ) :
		the_post();
	?>
		<article class="full">
			<header>
				<div class="ribbon ribbon--ttb ribbon--blue"><?php echo get_the_date( 'M d' ); ?><br><?php echo get_the_date( 'Y' ); ?></div>
				<a href="<?php the_permalink(); ?>" class="headline"><?php the_title(); ?></a>
			</header>
			<main><?php the_content(); ?></main>
		</article>
		<aside class="commentsection">
			<h2>Comments</h2>
			<button class="btn commentformexpand">Leave a comment</button>
			<?php
				comment_form(array(
					'comment_notes_before' => '',
					'comment_notes_after'  => '',
					'fields'               => array(
						'author' => '<input name="author" placeholder="Name" type="text" value="' . esc_attr( $comment_author ) . '" required>',
						'email'  => '<input name="email" placeholder="Email" type="text" value="' . esc_attr( $comment_author_email ) . '" required>',
					),
					'comment_field'        => '<textarea name="comment" placeholder="Comment" cols="45" rows="8" required></textarea>',
					'label_submit'         => 'Post comment',
					'class_submit'         => 'btn btn--submit btn--pink',
				));
			?>
			<div id="pendingcomments"></div>
			<?php comments_template(); ?>
		</aside>
	<?php endwhile; ?>
<?php else : ?>
	Nothing here :(
<?php endif; ?>
<?php
	if ( ! is_fragment() ) {
		get_template_part( 'footer' );
	}
	etag_end();
?>
