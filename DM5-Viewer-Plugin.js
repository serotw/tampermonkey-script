// ==UserScript==
// @name         DM5-Viewer-Plugin
// @version      0.2
// @description  add some in DM5 View Mode
// @author       sero
// @homepage     https://sero.idv.tw
// @include      /^http(s)*:\/\/([^\/]*\.)?(dm5|dm9){1}\.(cn|com|net){1}\/m(\d)+(-p\d+)*(\/)*$/
// @icon         https://www.google.com/s2/favicons?domain=dm5.com
// @grant        none
// @downloadURL  https://github.com/serotw/tampermonkey-script/raw/main/DM5-Viewer-Plugin.js
// ==/UserScript==

(function(win) {
	'use strict';
	let $ = null;
	let pp = console.log;
	let source = 'https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js';
	function type() {
		return arguments[0] && typeof arguments[0];
	}
	function isJQuery() {
		if(!arguments[0] || type(arguments[0])!=='object') {
			return false;
		}
		return 'jquery' in arguments[0] && arguments[0].length;
	}
	function isString() {
		return type(arguments[0])==='string';
	}
	function isStrings() {
		return isString(arguments[0]) && arguments[0].trim()!=='';
	}
	function isArray() {
		return type(arguments[0])==='array';
	}
	function isArrays() {
		return isArray(arguments[0]) && arguments[0].length;
	}
	function isObject() {
		return type(arguments[0])==='object';
	}
	function isFunction() {
		return type(arguments[0])==='function';
	}
	function isNull() {
		return !(arguments[0]!=null && arguments[0]!=undefined);
	}
	function explode() {
		const separator = arguments[0] || null;
		const str = arguments[1] || null;
		if(!isStrings(str)) {
			return;
		}
		if(!isStrings(separator)) {
			separator = ' ';
		}
		return str.split(separator);
	}
	function implode() {
		const separator = arguments[0] || null;
		const ary = arguments[1] || null;
		if(!isArrays(ary)) {
			return;
		}
		if(!isStrings(separator)) {
			separator = ' ';
		}
		return ary.join(separator);
	}
	let plugin = function() {
		return new plugin.fn.init();
	};
	function incJQuery() {
		if(isFunction(win.jQuery)) {
			return;
		}
		let script = document.createElement('sciprt');
		script.src = source;
		document.head.appendChild(script);
	}
	plugin.fn = plugin.prototype = {
		constructor: plugin,
		init: function() {
			const self = plugin.fn.getSelf(this);
			return self.wait();
		},
		time: {
			cache: {},
			getSelf: function() {
				return arguments[0]===plugin.fn.time ? arguments[0] : plugin.fn.time;
			},
			show: function(k) {
				const self = plugin.fn.time.getSelf(this);
				if(!(k in self.cache)) {
					return self.plus(k);
				}
				return self.cache[k];
			},
			plus: function(k) {
				const self = plugin.fn.time.getSelf(this);
				if(!(k in self.cache)) {
					self.cache[k] = 0;
				}
				return self.cache[k]++;
			}
		},
		events: {
			top: function(e) {
				e.preventDefault();
				$('html, body').stop().animate({scrollTop: 0}, 100);
			}
		},
		getSelf: function() {
			return arguments[0]===plugin.fn ? arguments[0] : plugin.fn;
		},
		addCSS: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'addCSS';
			let style = $('style#DM5_Viewer_Plugins');
			if(isJQuery(style)) {
				return self;
			}
			let value = `
.new-tip, .view-ad, .view-comment, .footer, #imgloading, .view-header-2 a.back, .view-header-2 .right-bar {
	display: none!important;
}
.view-header-2 {
	height: auto;
	line-height: normal;
	padding: .25rem 0;
}
#showimage img:last-child,
#showimage {
	margin-bottom: 0!important;
}
#top {
	cursor: pointer;
	background-image: url("//css122us.cdnmanhua.net/v202303131713/dm5/images/sd/index-top.png");
	background-repeat: no-repeat;
	background-position: center;
}
.rightToolBar a:hover {
	background-color: rgba(255,255,255,.125);
	border-radius: 4px;
}
.white .rightToolBar a:hover {
	background-color: rgba(0,0,0,.125);
}
			`;
			style = $('<style>').attr({type:'text/css', id:'DM5_Viewer_Plugins'}).html(value);
			style.appendTo('body');
			return self;
		},
		addBtn: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'addBtn';
			const toolBar = $('body>.rightToolBar');
			if(!isJQuery(toolBar)) {
				return self;
			}
			let links = toolBar.find('>a#top');
			if(isJQuery(links)) {
				return self;
			}
			links = $('<a class="text">').attr({
				id: 'top', title: 'Top'
			}).appendTo(toolBar).on('click', self.events.top);
			const tip = $('<div class="tip">').text('TOP').appendTo(links);
			return self;
		},
		start: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'start';
			if(!win.jQuery || !isFunction(win.jQuery)) {
				self.wait();
				return self;
			}
			return self.addCSS().addBtn().end();
		},
		end: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'end';
			console.clear();
			return self;
		},
		listen: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'listen';
			if(!win.jQuery || !isFunction(win.jQuery)) {
				incJQuery();
				self.time.plus(name);
				pp(implode(['run', name, self.time.show(name)]));
				setTimeout(self.wait(), 100);
				return self;
			}
			if(!$ || !isFunction($)) {
				$ = win.jQuery;
			}
			const toolBar = $('body>.rightToolBar');
			if(!isJQuery(toolBar)) {
				self.time.plus(name);
				pp(implode(['run', name, self.time.show(name)]));
				setTimeout(self.wait(), 100);
				return self;
			}
			return self.start();
		},
		wait: function() {
			const self = plugin.fn.getSelf(this);
			return self.listen();
		}
	};

	win.ViewPlugins = plugin();
})(window);
