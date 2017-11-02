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
}

etag_start();

if ( ! is_fragment() ) {
	get_template_part( 'header' );
}

if ( have_posts() ) : ?>
	<?php while ( have_posts() ) : ?>
		<?php the_post(); ?>
		<article class="full">
			<header>
				<a href="<?php the_permalink(); ?>" class="headline"><?php the_title(); ?></a>
			</header>
			<main><?php the_content(); ?></main>
		</article>
	<?php endwhile; ?>
<?php else : ?>
	<?php esc_html_e( 'Nothing here :(', 'surmablog' ); ?>
<?php endif; ?>

<?php
if ( ! is_fragment() ) {
	get_template_part( 'footer' );
}

etag_end();
