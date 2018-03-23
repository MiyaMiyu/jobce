/*
Name: TEBBUTT
version: 1.0.1
Description: Async load handling issues
Author: tinnkrit
TODOs:
- change handlebars 73.7KB > mustache 16KB
- jquery 93.9KB > zepto.js 9.6KB
- auto postfix {template_name}/index.html
- auto postfix {template_name}/index.js
- use import/export to handle scripts and templates
- remove Mongo and let user manually use native underscore
Dependencies:
- jquery@1.11.2 93.9KB
- handlebars.js@4.0.11 73.7KB
- underscore.js@1.8.3 16.3KB
- page.js 20.3KB
*/
/* Plug-in extended */
/* Declaration */
let _$tsbegin = Date.now();
$.getScripts = function(arr, path) {
	var _arr = $.map(arr, function(scr) {
	return $.getScript( (path||"") + scr );
	});

	_arr.push($.Deferred(function( deferred ){
	$( deferred.resolve );
	}));

	return $.when.apply($, _arr);
}
// Template
let Template = {
	_i18n: null,
	_helpers: {},
	_templates: [],
	_partials: [],
	_buildTemplate() {
		this._templates.forEach( name => {
			this[name]._hbs = Handlebars.create();
			this[name]._hbs.registerHelper(this._helpers);
			this[name]._hbs.registerHelper(this[name]._helpers);
			this._partials.forEach( partial => {
				this[name]._hbs.registerPartial(partial,this[partial]._html);
			});
			this[name]._tmpl = this[name]._hbs.compile(this[name]._html);
		});
		console.debug(`App started in ${Date.now() - _$tsbegin} ms.`);
		if(typeof App._startup === 'function') App._startup();
		page.base(App._base);
		page.start(App._routeOpt);
	},
	registerHelper(name,cb) { this._helpers[name] = cb; }
};
let Instance = function(name) {
	let self = this;
	this._name = name;
	this._parent = '';
	this._helpers = {};
	this._events = {};
	this._attachEvent = false;
	this.data = {};
	this._onRendered = () => {};
	this._onDestroyed = () => {};
	this.$ = $;
}
Instance.prototype.onRendered = function(cb) { if(typeof cb === 'function') this._onRendered = cb; }
Instance.prototype.onDestroyed = function(cb) { if(typeof cb === 'function') this._onDestroyed = cb; }
Instance.prototype.helpers = function(o){ this._helpers = o; }
Instance.prototype.render = function(selector,context) {
	this._parent = selector;
	this.data = context;
	let $dom = $(selector);
	$dom.html(this._tmpl(context));
	if(!this._attachEvent){
		this._attachEvent = true;
		if(this._events)
		for( event in this._events ) {
			let fn = this._events[event];
			if(typeof fn !== 'function') continue;
			let spaces = event.split(' ');
			let on = spaces.shift();
			// TODO: bind something useful
			let self = this;
			$dom.on(on.replace(',',' '),spaces.join(' '),
				function(e){ fn.bind(this,e,self).call(); }
			);
		}
	}
	this._onRendered.bind(this).call();
}
Instance.prototype.destroy = function(){ this._onDestroyed.bind(this).call(); };
Instance.prototype.events = function(o){ this._events = o; }
// Mongo
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
	let self = this;
	return {
		fetch() {
			if(o && ! $.isEmptyObject(o) ) {
				for ( key in o ) {
					if(key.match(/^\$/)) {
						// find with fields
						console.debug("find with $");
						// TODO: "$"" operators
						return self._data;
					}
					else {
						if(typeof o[key] === 'object') {
							// $ operators
							let { $in } = o[key];
							if(typeof $in !== "undefined") return _.filter(self._data, doc => {
								return _.contains( $in, doc[key] );
							});
						}else return _.where(self._data,o);
					}
				}
			}
			else return self._data;
		}
	}
}
Mongo.Collection.prototype.remove = function(o) {
	let self = this;
	if(o) {
		this._data = _.reject(this._data, el => {
			for( key in o) {
				if(o[key] !== el[key]) return false;
			}
			return true;
		});
		return true;
	}else return false;
}
let App = {
	_base: '/#!',
	_routes: {},
	_routeOpt: {},
	_router: page,
	_init(){
		console.debug(`Tepmlates build in ${Date.now() - _$tsbegin} ms.`);
		Template._buildTemplate.bind(Template).call();
		// this._ee.addListener('ready',);
	},
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
	baseRoute(_base) { this._base = _base; },
	routeOptions(opt) { this._routeOpt = opt; },
	route(route,{ name, before, action, after }) {
		if(!action) return;
		if(name) this._routes[name] = route;
		if(typeof before === 'function') page(route,before.bind(this),action.bind(this));
		else page(route,action.bind(this));
		if(typeof after === 'function') page.exit(route,after.bind(this));
	},
	redirect(name,context){
		let route = "";
		if(typeof this._routes[name] !== 'undefined') {
			route = this._routes[name];
			for(key in context) {
				let val = "" + context[key];
				if(typeof val === "string") route = route.replace(`:${key}`,val);
			}
		}
		// console.log("rdr",route);
		page.redirect(route);
		// page.redirect(( this._routeOpt.hashbang ? this._base+"#!" : "")+route);
	},
	i18n(name) {
		if(Template._i18n) {
			let deeps = name.split(".");
			let o = Template._i18n;
			let i = 0;
			for(i=0; i< deeps.length; i++) {
				if(o[deeps[i]]) o = o[deeps[i]];
				else break;
			}
			if(typeof o === 'string' && i === deeps.length) return o;
			else return name;
		}else {
			console.warn("missing module i18n");
			return "";
		}
	}
}
/* Initial */
// Library loaded
console.debug(`Library Loaded in ${Date.now() - _$tsbegin} ms.`);
// load templates and controllers
let _$templates = [];
let _$partials = [];
let _$scripts = [];
let _$lib = [];
let _$url = "";
let _$scriptReady = false;
let _$domReady = false;
$('[type="text/hbs"]:not([paritial])').each( (i,dom) => { _$templates.push( $.get(_$url+dom.getAttribute('src')) )});
$('[type="text/hbs"][partial]').each( (i,dom) => { _$partials.push( $.get(_$url+dom.getAttribute('src')) )});
$('[type="text/ctrlr"]').each( (i,dom) => { _$scripts.push( _$url+dom.getAttribute('src') ); });
$.when.apply($,_$templates).then( (...templates) => {
	if(typeof templates[0] === "string") templates = [templates];
	templates.forEach( ([_template]) => {
		let $template = $(_template);
		let name = $template.attr('name');
		Template[name] = new Instance(name);
		Template[name]._html = _template.replace(/^<template[^>]+>/g,"").replace(/<\/template>/g,"");
		Template._templates.push(name);
	});
	console.debug(`Templates Loaded in ${Date.now() - _$tsbegin} ms.`);
	$.when.apply($,_$partials).then( (...partials) => {
		console.debug(`Partials Loaded in ${Date.now() - _$tsbegin} ms.`);
		//TODO: scoping partial with tempaltes
		// console.log(partials)
		partials.forEach( ([_partial,...rest]) => {
			// console.log('partial : ',_partial);
			let $partial = $(_partial);
			let name = $partial.attr('name');
			// console.log("pt",name);
			Template[name] = {};
			Template[name]._html = _partial.replace(/^<template\s[^>]+>/g,"").replace(/<\/template>/g,"");
			Template._partials.push(name);
		});
		$.getScripts(_$scripts).then(() => {
			console.debug(`ControllerScripts Loaded in ${Date.now() - _$tsbegin} ms.`);
			// begin engine
			if(_$domReady && typeof App._startup === 'function') App._init();
			else _$scriptReady = true;
		},(xhr,err) => { console.error(`[Load scripts error reason]:${err}`); });
	},(xhr,err) => { console.error(`[Load partials error reason]:${err}`); });
},(xhr,err) => { console.error(`[Load templates error reason]:${err}`); });
// Default helpers
Template.registerHelper("_", App.i18n );
Template.registerHelper("pathFor", (name,context) => {
	let route = "";
	let bang = "";
	if(App._routeOpt.hashbang) bang = "#!";
	if(typeof App._routes[name] !== 'undefined') {
		route = App._routes[name];
		for(key in context) {
			let val = "" + context[key];
			if(typeof val === "string") route = route.replace(`:${key}`,val);
			// console.log(key,val,route,route.replace(`:${key}`,val));
		}
	}
	return `${bang}${route}`;
});
// DOM loaded
$(() => {
	console.debug(`DOM Loaded in ${Date.now() - _$tsbegin} ms.`);
	if(_$scriptReady && typeof App._startup === 'function') App._init();
	else _$domReady = true;
});