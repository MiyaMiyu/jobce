/*
Name: Templating.js
Description: Templating.js is Blaze-like (package for meteor meteor) library. This library just integrate from Handlebars.js.
version: 1.0.0
Author: tinnkrit
TODOs:
- onCreated / onDestroyed event
- partial scripts support
- data passing support
Dependencies:
- jquery@1.11.2
- handlebars.js@4.0.11
- underscore.js@1.8.3
*/
/* Plug-in extended */
$.getScripts = function(arr, path) {
	var _arr = $.map(arr, function(scr) {
	return $.getScript( (path||"") + scr );
	});

	_arr.push($.Deferred(function( deferred ){
	$( deferred.resolve );
	}));

	return $.when.apply($, _arr);
}
/* Template */
let Template = {
	_i18n: null,
	_helpers: {},
	registerHelper(name,cb) { this._helpers[name] = cb; }
};
/* Default helpers */
Template.registerHelper("_", name => {
	if(Template._i18n) {
		let deeps = name.split(".");
		let o = Template._i18n;
		let i = 0;
		for(i=0; i< deeps.length; i++) {
			if(o[deeps[i]]) o = o[deeps[i]];
			else break;
		}
		if(typeof o === 'string' && i === deeps.length) return o;
	}
});
/* Mongo */
const Mongo = {
	Collection: function(name){
		this.name = name;
		this._data = [];
		return this;
	}
}
Mongo.Collection.prototype.insert = function(o){
	o = o.length ? o : [o];
	for(let i=0;i< o.length;i++) this._data.push(o[i]);
}
Mongo.Collection.prototype.findOne = function(o){
	if(o) return _.findWhere(this._data,o);
	else return _.last(this._data);
}
Mongo.Collection.prototype.find = function(o) {
	if(o) {
		for ( key in o ) {
			// TODO: "$"" operators
			if(key.match(/^$/)) {}
			else {
				console.log("find in fields");
				if(typeof o[key] === 'object') {
					// $ operators
					let { $in } = o[key];
					if(typeof $in !== "undefined") return _.filter(this._data, doc => {
						return _.contains( $in, doc[key] );
					});
				}else {
					// primetive type
				}
			}
		}
		return this._data;
	}
	else return this._data;
}
//
let App = {
	setLanguage(lang) {
		let raw = $.ajax({
			dataType: "json",
			url: `/i18n/${lang}.i18n.json`,
			async: false
		}).responseText;
		Template._i18n = JSON.parse(raw) || null;
	},
	// TODO: modify for avoid waiting rendering
	startup(cb){ if(typeof cb === 'function') this._startup = cb; },
	// TODO: client routes
	// $root: $('body'),
	// _startup: null,
	// render(t){ if(Template[t]) Template[t]._render(Template.$root); },
	// setRoot(selector) { this.$root = $(selector) },
}
let Instance = function(name) {
	this._name = name;
	this._helpers = {};
	this._events = {};
	this._attachEvent = false;
	this.data = {};
	this._onCreated = () => {};
	this._onRendered = () => {};
	this._onDestroyed = () => {};
}
// Instance.prototype._render = function($root){
// 	console.log(this.data);
// 	$root.append(this._tmpl(this.data));
// 	this._onRendered();
// }
Instance.prototype._create = function(){
	console.log(`create template ${this._name}`);
	this._hbs.registerHelper(Template._helpers);
	this._hbs.registerHelper(this._helpers);
	// console.log(this._hbs.helpers);
	this._onCreated();
}
Instance.prototype.onCreated = function(cb) { if(typeof cb === 'function') this._onCreated = cb; }
Instance.prototype.onRendered = function(cb) { if(typeof cb === 'function') this._onRendered = cb; }
Instance.prototype.onDestroyed = function(cb) { if(typeof cb === 'function') this._onDestroyed = cb; }
Instance.prototype.helpers = function(o){ this._helpers = o; }
Instance.prototype.render = function($selector) {
	if(typeof this._onRendered === 'function') this._onRendered();
	$selector.empty().append( this._tmpl(this.data) );
	if(!Template[name]._attachEvent){
		if(this._events)
		for( event in this._events ) {
			let fn = this._events[event];
			if(typeof fn !== 'function') continue;
			let self = this;
			let spaces = event.split(' ');
			// TODO: support "this" object
			$selector.on(spaces.shift(),spaces.join(' '),function(e){ fn.bind({},e,self).call(); });
		}
		Template[name]._attachEvent = true;
	}

}
Instance.prototype.events = function(o){ this._events = o; }
/* initial */
// load controller scripts
let scripts = [];
let _rendered = false;
let _scriptloaded = false;
$('script[data-src]').each( (i,script) => {
	let { src } = $(script).data();
	if(typeof src !== 'undefined') scripts.push(src);
});
$templates = $('[rel="import"]:not([partial])');
$templates.each( (ind,tmpl) => {
	let $tmpl = $(tmpl.import).find('template');
	let name = $tmpl.attr('name');
	Template[name] = new Instance(name);
	Template[name]._html = $tmpl.html().replace(/{{&gt;/g,'{{>');
});
console.log(`Templates Loaded in ${Date.now() - _$tsbegin} ms.`);
$.getScripts(scripts).then( _ => {
	console.log(`Scripts Loaded in ${Date.now() - _$tsbegin} ms.`);
	// console.log(Template);
	for( name in Template ) {
		// Skip native functions
		if ([
			'_i18n',
			'_helpers',
			'registerHelper'
		].some( x => x === name) ) continue;
		// Templates
		Template[name]._hbs = Handlebars.create();
		Template[name]._create();
		// load partial
		let $partials = $(`[rel="import"][partial="${name}"]`);
		$partials.each( (pind,prtl) => {
			let $prtl = $(prtl.import).find('template');
			Template[name]._hbs.registerPartial($prtl.attr('name'),$prtl.html());
		});
		Template[name]._tmpl = Template[name]._hbs.compile(Template[name]._html);
	}
	if(_rendered && typeof App._startup === 'function') {
		if(typeof App._startup === 'function') App._startup();
	}else _scriptloaded = true;
}, (xhr,err) => { console.log(`[loadscrpits error reason]:${err}`); });
//
$( () => {
	console.log(`DOM Loaded in ${Date.now() - _$tsbegin} ms.`);
	if(_scriptloaded) {
		if(typeof App._startup === 'function') App._startup();
	}else _rendered = true;
});