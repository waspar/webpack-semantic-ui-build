import $ from 'jquery';
window.$ = $;
window.jQuery = $;

// Hi!
console.log($.trim('Hello! I am first!'));

// Other module with import $ from 'jquery';
require('second');

// Semantic
require('semantic-ui');
$('#dropdown').dropdown();

