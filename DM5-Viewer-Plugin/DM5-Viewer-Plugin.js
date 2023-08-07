// ==UserScript==
// @name         DM5-Viewer-Plugin
// @namespace    http://sero.idv.tw/
// @version      0.3
// @description  add some in DM5 View Mode
// @author       sero
// @homepage     http://git.sero.idv.tw
// @include      /^http(s)*:\/\/([^\/]*\.)?(dm5|dm9){1}\.(cn|com|net){1}\/(manhua-([^\/])+|m(\d)+(-p\d+)*){1}(\/)*$/
// @icon         https://www.google.com/s2/favicons?domain=dm5.com
// @grant        none
// @downloadURL  https://github.com/serotw/tampermonkey-script/raw/main/DM5-Viewer-Plugin/DM5-Viewer-Plugin.js
// ==/UserScript==

;(function(win) {
	'use strict';
	let $ = null;
	let pp = console.log;
	const source = 'https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js';
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
		return isObject(arguments[0]) && arguments[0] instanceof Array;
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
		let separator = arguments[0] || null;
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
		let separator = arguments[0] || null;
		const ary = arguments[1] || null;
		if(!isArrays(ary)) {
			return;
		}
		if(!isStrings(separator)) {
			separator = ' ';
		}
		return ary.join(separator);
	}
	function incJQuery() {
		if(isFunction(win.jQuery)) {
			return;
		}
		$('<script>').attr({src: source}).appendTo('body');
	}
	function incPhotos() {
		if(!isFunction(win.jQuery)) {
			return;
		}
		$('<script>').attr({src: 'https://cdn.jsdelivr.net/gh/dimsemenov/PhotoSwipe@5.3.8/dist/umd/photoswipe-lightbox.umd.min.js'}).appendTo('body');
		$('<script>').attr({src: 'https://cdn.jsdelivr.net/gh/dimsemenov/PhotoSwipe@5.3.8/dist/umd/photoswipe.umd.min.js'}).appendTo('body');
	}
	function incViewer() {
		if(!isFunction(win.jQuery)) {
			return;
		}
		$('<script>').attr({src: 'https://cdn.jsdelivr.net/gh/serotw/js@main/jQuery.plugins/jQuery.obViewer.min.js'}).appendTo('body');
	}
	const plugin = function() {
		return new plugin.fn.init();
	};
	plugin.fn = plugin.prototype = {
		constructor: plugin,
		type: 'watch',
		init: function() {
			const self = plugin.fn.getSelf(this);
			if(/(manhua-){1}/.test(location.href)) {
				self.type = 'detail';
				return self.chkCookie();
			}
			return self.chkCookie().wait();
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
#nowViewer {
	z-index: 1001;
	display: block!important;
	position: fixed;
	right: 20px;
	top: 20px;
	padding: .25rem .5rem;
	background-color: rgba(0,0,0,.325);
	border-radius: 4px;
}
#nowViewer>strong:not(:empty)+span:before,
#nowViewer>strong,
#nowViewer>span {
	display: inline-block;
	vertical-align: bottom;
	line-height: 1;
}
#nowViewer>strong {
	font-weight: bold;
	font-size: 1.5em;
	color: #f00;
}
#nowViewer>strong:empty+span {
	display: none!import;
}
#nowViewer>strong:not(:empty)+span:before,
#nowViewer>strong:not(:empty)+span {
	font-size: .75em;
	color: #888;
}
#nowViewer>strong:not(:empty)+span:before {
	content: '/';
}
.white #nowViewer {
	background-color: rgba(0,0,0,.075);
}
.new-tip, .view-ad, .view-comment, .footer, #imgloading, .view-paging, .view-header-2 a.back, .view-header-2 .right-bar {
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
#showimage {
	margin-top: 0!important;
}
#showimage>img {
	display: block;
	vertical-align: middle;
	margin: 0 auto;
}
#showimage>img+img {
	margin-top: 1em;
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
			let callEnd = function() {
				style = $('<style>').attr({type:'text/css', id:'DM5_Viewer_Plugins'}).html(value);
				style.appendTo('body');
			};
			$.ajax({url: 'https://cdn.jsdelivr.net/gh/dimsemenov/PhotoSwipe@5.3.8/dist/photoswipe.css'}).done(function(respone, textStatus, request) {
				if(isNull(respone) || textStatus!=='success') {
					return;
				}
				let style1 = $('<style>').attr({type:'text/css', id:'DM5_Viewer_Photo'}).html(respone);
				style1.appendTo('body');
				callEnd();
			});
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
		loadAllImages: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'loadAllImages';
			const callback = arguments[0] || null;
			return $.when((async()=> {
				const mainElement = $('#showimage');
				if(!isJQuery(mainElement)) {
					return;
				}
				mainElement.empty();
				let page = 1;
				let wait = win.DM5_IMAGE_COUNT;
				const callEnd = function() {
					let selectorElement = mainElement.find('>*').eq(win.DM5_PAGE - 1)[0];
					$('html, body').animate({scrollTop: selectorElement.offsetTop}, 150);
					callback && callback();
				};
				await $.each(new Array(win.DM5_IMAGE_COUNT), ()=> {
					const imgElement = $('<img>').attr('data-page', page).addClass('photoswipe-image loading').appendTo(mainElement);
					imgElement.on('load', function() {
						$(this).attr({
							'data-photoswipe-width': this.naturalWidth,
							'data-photoswipe-height': this.naturalHeight
						}).removeClass('loading');
					//
						wait--;
						if(wait==0) {
							setTimeout(callEnd && callEnd(), 100);
						}
					});
					const options = {
						url: `chapterfun.ashx?cid=${win.DM5_CID}&page=${page}&language=1&gtk=6&_cid=${win.DM5_CID}&_mid=${win.DM5_MID}&_dt=${win.DM5_VIEWSIGN_DT}&_sign=${win.DM5_VIEWSIGN}`
					};
					$.ajax(options).done(function(respone, textStatus, request) {
						if(isNull(respone) || textStatus!=='success') {
							return;
						}
						eval(respone).forEach(e=> { imgElement.attr('src', e); });
					});
					page++;
				});
			})()).then(()=> {
				return self;
			});
		},
		addViewer: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'addViewer';
			const callback = arguments[0] || null;
			const callEnd = function() {
				callback && callback();
				return self;
			};
			if(!$ || !$.obViewer) {
				return callEnd();
			}
			const mainElement = $('#showimage');
			if(!isJQuery(mainElement)) {
				return callEnd();
			}
			const textElement = $('<div>').attr('id', 'nowViewer').appendTo('body');
			$('<strong>').appendTo(textElement);
			$('<span>').appendTo(textElement).text(win.DM5_IMAGE_COUNT || '');
			self.obViewer = $.obViewer(mainElement[0], { selector: '>img[data-page]', element: textElement.find('>strong')[0] }, function() {
				if(!this.targets || !this.targets.length) {
					return;
				}
				textElement.find('>span').text(win.DM5_IMAGE_COUNT || this.targets.length);
				$.each(this.targets, (i, v)=> {
					const k = 'data-viewer-title';
					if(!$(v).attr(k)) { $(v).attr(k, i + 1); }
				})
			});
			return callEnd();
		},
		chkCookie: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'chkCookie';
			const k = 'isAdult';
			if(win.jQuery && win.jQuery.cookie && !win.jQuery.cookie(k)) {
				win.jQuery.cookie(k, 1, {expires: 30, path: '/'});
				return location.reload();
			}
			return self;
		},
		start: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'start';
			if(!win.jQuery || !isFunction(win.jQuery)) {
				self.wait();
				return self;
			}
			const callEnd = function() {
				self.addViewer(self.end);
			};
			return self.addCSS().addBtn().loadAllImages(callEnd);
		},
		end: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'end';
			const mainElement = $('#showimage');
			if(isJQuery(mainElement)) {
				const options = {
					gallery: '#showimage',
					children: 'img.photoswipe-image',
					pswpModule: PhotoSwipe,
					bgOpacity: .85,
					showHideOpacity: true,
					wheelToZoom: true
				};
				const lightbox = new PhotoSwipeLightbox(options);
				lightbox.addFilter('domItemData', (itemData, element, linkEl) => {
					if($(element).is('img')) {
						$.extend(itemData, {
							src: $(element).data('src') || $(element).attr('src'),
							w: $(element).attr('data-photoswipe-width'),
							h: $(element).attr('data-photoswipe-height')
						});
					}
					return itemData;
				});
				lightbox.init();
			}
			console.clear();
			return self;
		},
		listen: function() {
			const self = plugin.fn.getSelf(this);
			const name = 'listen';
			if(!win.jQuery || !isFunction(win.jQuery)) {
				incJQuery();
				self.time.plus(name);
				pp(implode(' ', ['run', name, self.time.show(name)]));
				setTimeout(self.wait, 100);
				return self;
			}
			if(!$ || !isFunction($)) {
				$ = win.jQuery;
			}
			if(!('PhotoSwipe' in win)) {
				incPhotos();
				self.time.plus(name);
				pp(implode(' ', ['run', name, self.time.show(name)]));
				setTimeout(self.wait, 100);
				return self;
			}
			if(!('obViewer' in $)) {
				incViewer();
				self.time.plus(name);
				pp(implode(' ', ['run', name, self.time.show(name)]));
				setTimeout(self.wait, 100);
				return self;
			}
			const toolBar = $('body>.rightToolBar');
			if(!isJQuery(toolBar)) {
				self.time.plus(name);
				pp(implode(' ', ['run', name, self.time.show(name)]));
				setTimeout(self.wait, 100);
				return self;
			}
			return self.start();
		},
		wait: function() {
			const self = plugin.fn.getSelf(this);
			if(self.type!=='watch') {
				return self;
			}
			return self.listen();
		}
	};

	win.ViewPlugins = plugin();
})(window);