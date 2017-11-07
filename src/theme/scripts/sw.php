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
require( '../../../../wp-load.php' );
etag_start();
header( 'Service-Worker-Allowed: /' );
header( 'Content-Type: application/javascript' ); ?>
_wordpressConfig={templateUrl:`<?php echo esc_url( get_template_directory_uri() ); ?>`};
<?php
readfile( 'sw.js' );
etag_end();
