(()=>{
	// 页面初始化
	function init(){
		Array.prototype.del = function(val){
			let index = this.indexOf(val);
			index == -1 || this.splice(index, 1);
		}


		// nav
		let $nav = $('body>div:first');
		$nav.css({
			'marginLeft': 0,
			'marginRight': 0,
		}).attr({
			'id': 'nav',
		});
		$nav.children().eq(0).css({
			'paddingLeft': 0,
			'paddingRight': 0,
		});


		// footer
		let $footer = $('footer');
		$footer.parent().css({
			'marginLeft': 0,
			'marginRight': 0,
		}).attr({
			'id': 'footer',
		});
		$footer.css({
			'position': 'fixed',
			'bottom': 0,
		});
		$footer.children().eq(0).css({
			'marginBottom': 0,
		});


		// content
		let contentHeight = $(window).outerHeight()-$('#nav').outerHeight()-$('footer').outerHeight()-$('#table-top').outerHeight();
		let $content = $('body>div:nth(1)');
		$content.children().eq(0).css({
			'marginLeft': 0,
			'marginRight': 0,
			'height': 'auto',
		});
		$content.children().eq(0).children().eq(0).css({
			'paddingLeft': 0,
			'paddingRight': 0,
		}).attr({
			'id': 'col-2',
		});
		$content.children().eq(0).children().eq(1).css({
			'paddingTop': 0,
			'paddingRight': 0,
		}).attr({
			'id': 'col-10',
		}).removeClass('content_scroll');
		$('#table').css({
			'height': contentHeight,
		});
		let $col2 = $('#col-2');
		$col2.children().eq(0).removeClass();
		$col2.children().eq(0).children().eq(0).remove();
		$('#home br').remove();
		let $home = $('#home');
		$home.css({
			'paddingLeft': 0,
			'paddingRight': 0,
		}).children().eq(0).removeClass('bar_left').css({
			'padding': 20,
			'marginBottom': 0,
		});
		$('#home ul a').css({
			'padding': 10,
			'whiteSpace': 'nowrap',
			'overflow': 'hidden',
		});
	}


	// 为导航条绑定单击事件
	function nav(){
		let $nav = $('[data-nav=nav]');
		$nav.first().addClass('trigger');
		loadData(1);
		$nav.click(function(e){
			let $target = $(e.target);
			if(!$target.hasClass('trigger')){
				$target.addClass('trigger').siblings('.trigger').removeClass('trigger');
			}
			loadData(1);
		});
	}


	init();
	nav();
})();


$(document).ready(function(){
	// 点击Add按钮
	add();
	// 全屏
	quanPing();
	// 电梯
	dianTi();
	// 点击字体颜色按钮
	fontColor();
	// 点击保存按钮
	save();
	// 点击下载按钮
	download();
	// 分页
	page();
	// 切换科目
	toggleKeMu();
	// 搜索
	search();
	// 排序
	sort();
});
