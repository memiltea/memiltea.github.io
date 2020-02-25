/********************************************************************************

	SYNCER 〜 知識、感動をみんなと同期(Sync)するブログ

	* 配布場所
	https://syncer.jp/how-to-use-photoswipe

	* 最終更新日時
	2015/08/17 00:05

	* 作者
	あらゆ

	** 連絡先
	Twitter: https://twitter.com/arayutw
	Facebook: https://www.facebook.com/arayutw
	Google+: https://plus.google.com/114918692417332410369/
	E-mail: info@syncer.jp

	※ バグ、不具合の報告、提案、ご要望など、お待ちしております。
	※ 申し訳ありませんが、ご利用者様、個々の環境における問題はサポートしていません。

********************************************************************************/


/**************************************************

	PhotoSwipe (要jQuery)
	* 指定したクラス名で画像ギャラリーを構成する

**************************************************/
var initPhotoSwipeFromDOM = function() {

	//クラス名の設定
	var setClassSyncer = 'images';

	//オプションの設定
	var setOptionsSyncer = {
		history: 1,
	};

	//[.images]が付いたエレメントを全て取得する
	var galleryElements = document.getElementsByClassName(setClassSyncer);
	var items = [];

	//コンテナを動的に生成する [めんどいので要jQuery…]
	$("body").append('<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true"><div class="pswp__bg"></div><div class="pswp__scroll-wrap"><div class="pswp__container"><div class="pswp__item"></div><div class="pswp__item"></div><div class="pswp__item"></div></div><div class="pswp__ui pswp__ui--hidden"><div class="pswp__top-bar"><div class="pswp__counter"></div><button class="pswp__button pswp__button--close" title="Close (Esc)"></button><button class="pswp__button pswp__button--share" title="Share"></button><button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button><button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button><div class="pswp__preloader"><div class="pswp__preloader__icn"><div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class="pswp__share-tooltip"></div></div><button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button><button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button><div class="pswp__caption"><div class="pswp__caption__center"></div></div></div></div></div>');

	//画像ギャラリーの作成
	var parseThumbnailElements = function() {
		var figureEl,linkEl,size,item;

		for(var i=0,l=galleryElements.length; i < l; i++) {
			figureEl = galleryElements[i];
			linkEl = figureEl.children[0];

			size = linkEl.getAttribute("data-size").split("x");

			items.push({
				src: linkEl.getAttribute("href"),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10),
				msrc: linkEl.children[0].getAttribute("src"),
				el: figureEl,
				title: linkEl.children[0].getAttribute("alt")
			});

		}

		return items;
	};

	//クリックイベントの設定
	var onThumbnailsClick = function(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		var eTarget = e.target || e.srcElement;

		//クリックしたのがIMG要素ならOK
		if(eTarget.tagName.toUpperCase() !== "IMG"){
			return;
		}

		//イベントの伝播を停止
		e.stopPropagation();

		//クリックされたのが何番目の要素かを取得
		//めんどいのでjQuery…
		var no = $(galleryElements).index(this);

		if(no >= 0) {
			openPhotoSwipe( no, galleryElements[no] , "" );
		}

		return false;
	};

	//PhotoSwipeの起動
	var openPhotoSwipe = function(index, galleryElement, disableAnimation) {
		var pswpElement = document.querySelectorAll(".pswp")[0],gallery,options;

		//オプション
		options = setOptionsSyncer;
		options.index = index;
		options.getThumbBoundsFn = function(index) {
			var thumbnail = items[index].el.getElementsByTagName("img")[0],
				pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
				rect = thumbnail.getBoundingClientRect(); 
			return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		}

		//アニメーションを停止する場合
		if(disableAnimation){
			options.showAnimationDuration = 0;
		}

		gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();

	};

	//タッチイベントの設定
	items = parseThumbnailElements();
	for(var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute('data-pswp-uid', i+1);
		galleryElements[i].onclick = onThumbnailsClick;
	}

	//画像の固有リンクへのアクセス (URLアドレスの解析)
	var photoswipeParseHash = function() {
		var hash = window.location.hash.substring(1),
		params = {};

		if(hash.length < 5) {
			return params;
		}

		var vars = hash.split('&');
		for (var i = 0; i < vars.length; i++) {
			if(!vars[i]) {
				continue;
			}
			var pair = vars[i].split('=');  
			if(pair.length < 2) {
				continue;
			}           
			params[pair[0]] = pair[1];
		}

		if(params.gid) {
			params.gid = parseInt(params.gid, 10);
		}

		if(!params.hasOwnProperty('pid')) {
			return params;
		}
		params.pid = parseInt(params.pid, 10);
		return params;
	};

	//画像の固有リンクへのアクセス (PhotoSwipeの起動)
	var hashData = photoswipeParseHash();
	if(hashData.pid > 0 && hashData.gid > 0) {
		openPhotoSwipe( hashData.pid - 1 ,  galleryElements[ hashData.gid - 1 ], true );
	}

} ;

// PhotoSwipeを起動する
initPhotoSwipeFromDOM() ;