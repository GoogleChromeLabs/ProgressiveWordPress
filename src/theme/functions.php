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

define( 'PWA_THEME_MANIFEST_ARG', 'jetpack_app_manifest' );

register_nav_menus( array(
	'footer-nav' => 'Footer menu',
) );

$preloads = array();

function add_preload( $asset, $type = 'style' ) {
	global $preloads;

	$preloads[] = array(
		'asset' => $asset,
		'type'  => $type,
	);
}

function send_preload() {
	global $preloads;

	if ( empty( $preloads ) ) {
		return;
	}

	$template_url = get_template_directory_uri();
	$payloads = array();

	foreach ( $preloads as $preload ) {
		$asset_url  = $template_url . $preload['asset'];
		$payloads[] = sprintf( '<%s>;rel=preload;as=%s', $asset_url, $preload['type'] );
	}

	header( 'Link: ' . implode( ',', $payloads ) );
}

// This just a 1K script, but it’s synchronous and will be injected before
// ours. We don’t need it, so just don’t load it at all.
function my_deregister_scripts() {
	wp_deregister_script( 'wp-embed' );
}
add_action( 'wp_footer', 'my_deregister_scripts' );

function is_fragment() {
	return isset( $_GET['fragment'] ) && 'true' === $_GET['fragment'];
}

$etag_depth = 0;

function is_being_etagged() {
	global $etag_depth;

	return $etag_depth > 0;
}

function etag_start() {
	global $etag_depth;

	if ( 0 === $etag_depth ) {
		ob_start();
	}

	$etag_depth++;
}

function etag_end() {
	global $etag_depth;

	$etag_depth--;

	if ( $etag_depth > 0 ) {
		return;
	}

	$content = ob_get_clean();
	$etag    = hash( 'sha256', $content );
	$request = isset( $_SERVER['HTTP_IF_NONE_MATCH'] ) && $_SERVER['HTTP_IF_NONE_MATCH'];

	if ( $etag === $request ) {
		http_response_code( 304 );
		return;
	}

	header( 'Etag: ' . $etag );
	echo $content;
}

function wpb_move_comment_field_to_bottom( $fields ) {
	$comment_field = $fields['comment'];
	unset( $fields['comment'] );
	$fields['comment'] = $comment_field;
	return $fields;
}
add_filter( 'comment_form_fields', 'wpb_move_comment_field_to_bottom' );

function pwa_theme_get_manifest_path() {
	return add_query_arg( PWA_THEME_MANIFEST_ARG, '1', site_url() );
}

function pwa_theme_register_query_vars( $vars ) {
	$vars[] = PWA_THEME_MANIFEST_ARG;
	return $vars;
}
add_filter( 'query_vars', 'pwa_theme_register_query_vars' );

function pwa_theme_render_custom_assets() {
	global $wp_query;

	if ( $wp_query->get( PWA_THEME_MANIFEST_ARG ) ) {

		$theme_color = pwa_theme_get_theme_color();

		$manifest = array(
			'start_url'        => home_url(),
			'short_name'       => get_bloginfo( 'name' ),
			'name'             => get_bloginfo( 'name' ),
			'display'          => 'standalone',
			'background_color' => $theme_color,
			'theme_color'      => $theme_color,
		);

		$icon_48 = pwa_site_icon_url( 48 );

		if ( $icon_48 ) {
			$manifest['icons'] = array(
				array(
					'src'   => $icon_48,
					'sizes' => '48x48',
				),
				array(
					'src'   => pwa_site_icon_url( 192 ),
					'sizes' => '192x192',
				),
				array(
					'src'   => pwa_site_icon_url( 512 ),
					'sizes' => '512x512',
				),
			);
		}

		wp_send_json( $manifest );
	}
}
add_action( 'template_redirect', 'pwa_theme_render_custom_assets', 2 );

function pwa_theme_get_theme_color() {
	// if we have AMP enabled, use those colors?
	if ( current_theme_supports( 'custom-background' ) ) {
		$theme_color = get_theme_support( 'custom-background' )->{'default-color'};
	} else {
		$theme_color = '#FFF';
	}

	return apply_filters( 'pwa_theme_background_color', $theme_color );
}

function pwa_site_icon_url( $size ) {
	$url =  get_site_icon_url( $size );
	
	if ( ! $url ) {
		$url = sprintf( '%s/images/icon.png', esc_url( get_template_directory_uri() ) );
	}

	return $url;
}