import $ from 'jquery';
import _ from 'underscore';
import moment from 'moment';

// Hi!
console.log($.trim('Hello! I am first!'));

// Other module with import $ from 'jquery';
require('second');

// underscore
console.log('underscore - '+_.isArray([0,1]));

// moment
console.log('moment - '+moment().format());


/**
 * Semantic
 *
 * !Important to provide JQuery!
 *
plugins: [
...
new webpack.ProvidePlugin({
	$: 'jquery',
	jQuery: 'jquery'
}),
...
]
or
import $ from 'jquery'; window.$ = $; window.jQuery = $;
or
window.$ = window.jQuery = require("jquery");
 */

// all in one
// import '../semantic/dist/semantic.min.css';
require('semantic-ui');
$('#dropdown').dropdown();

// by parts
/*
import '../semantic/dist/components/reset.min.css';
import '../semantic/dist/components/site.min.css';
import '../semantic/dist/components/transition.min.css';
import '../semantic/dist/components/dropdown.min.css';
import '../semantic/dist/components/menu.min.css';

import '../semantic/dist/components/transition';
import '../semantic/dist/components/dropdown';
$('#dropdown').dropdown();
*/


