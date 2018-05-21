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
	require_once( dirname( __FILE__ ) . '/../../../wp-load.php' );
	etag_start();
?>
	</pwp-view>
	<footer class="footer">
		<div class="footer__signoff">
			Made with 💻 by Surma
		</div>
		<div class="footer__social">
			<a href="https://github.com/GoogleChrome/ProgressiveWordPress">
				<img src="<?php echo get_bloginfo( 'template_url' ); ?>/images/github.svg" alt="github">
			</a>
			<a href="https://twitter.com/DasSurma">
				<img src="<?php echo get_bloginfo( 'template_url' ); ?>/images/twitter.svg" alt="twitter">
			</a>
			<a href="#">
				<img src="<?php echo get_bloginfo( 'template_url' ); ?>/images/rss.svg" alt="rss">
			</a>
		</div>
		<?php
		wp_nav_menu( array(
			'theme_location' => 'footer-nav',
			'fallback_cb'    => false,
		) );
		?>
	</footer>
	<script>
		window._wordpressConfig = {
			templateUrl: new URL('<?php echo get_bloginfo( 'template_url' ); ?>').toString(),
			baseUrl: new URL('<?php echo home_url(); ?>').toString(),
		};
	</script>
	<script>
		<?php include( dirname( __FILE__ ) . '/scripts/nomodule-safari.js' ); ?>
	</script>
	<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/system.js" nomodule></script>
	<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/custom-elements.js" defer></script>
	<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/import-polyfill.js" defer></script>
	<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/ric-polyfill.js" defer></script>
	<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/pubsubhub.js" defer></script>
	<?php
		$modules = array( 'pwp-view.js', 'router.js', 'lazyload.js' );
		foreach ( $modules as $module ) :
	?>
		<script type="module" src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/<?php echo $module; ?>"></script>
	<?php
		endforeach;
	?>
	<script nomodule>
		<?php echo json_encode( $modules ); ?>.reduce(
			async (chain, module) => {
				await chain;
				return SystemJS.import(`<?php echo get_bloginfo( 'template_url' ); ?>/scripts/systemjs/${module}`);
			},
			Promise.resolve()
		)
	</script>
	<script type="module" src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/router.js"></script>
	<script type="module" src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/lazyload.js"></script>
	<template class="lazyload">
		<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/idb.js" defer></script>
		<script src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/bg-sync-manager.js" defer></script>
			<?php
				$modules = array( 'analytics.js', 'install-sw.js', 'pending-comments.js', 'resource-updates.js', 'pwp-lazy-image.js', 'offline-articles.js', 'commentform-expander.js' );
				foreach ( $modules as $module ) :
			?>
				<script type="module" src="<?php echo get_bloginfo( 'template_url' ); ?>/scripts/<?php echo $module; ?>"></script>
			<?php
				endforeach;
			?>
		<script nomodule>
			<?php echo json_encode( $modules ); ?>.reduce(
				async (chain, module) => {
					await chain;
					return SystemJS.import(`<?php echo get_bloginfo( 'template_url' ); ?>/scripts/systemjs/${module}`);
				},
				Promise.resolve()
			)
		</script>

	</template>
</body>
<?php
	etag_end();
?>
