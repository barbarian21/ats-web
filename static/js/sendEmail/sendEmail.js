$(function(){
	let self = window;
	let Contents={}


	// 获取preview-content元素
	self.getPreviewContentElem = function(){
		return $('#preview-content');
	}


	// 设置preview-content高度
	self.setPreviewContentHeight = function(){
		let winHeight = $(window).outerHeight(true);
		let navHeight = $('nav').outerHeight(true);
		let preTitleHeight = $('#preview-title').outerHeight(true);
		let footerHeight = $('#footer').outerHeight(true);
		let descFileHeight=$('div[data-desc="desc-file"]').outerHeight(true)

		let $previewContent = getPreviewContentElem();
		let height = winHeight-
			(navHeight+2*preTitleHeight+footerHeight+descFileHeight);
		$previewContent.css('minHeight', height);
		$previewContent.children().each(function(){
			$this = $(this);
			if($this.children().length == 0)
				$this.hide();
			else
				$this.children().each(function(){
					$(this).hide();
				});
		});
	}


	// 绘制页面
	self.drawPages = function(){
		// 获取页面按钮html
		function getPageBtnsHtml(){
			return `
				<div class="row mt-2 mb-4">
					<div class="col-sm-12 text-center">
						<button class="col-sm-3 btn btn-outline-secondary float-left" type="button" data-func="cls">Clear</button>
						<button class="col-sm-3 btn btn-outline-secondary" type="button" data-dir="back">Back</button>
						<button class="col-sm-3 btn btn-outline-secondary float-right" type="button" data-dir="next">Next</button>
					</div>
				</div>
			`;
		}
		// 获取描述文件html
		function getDescFileHtml(){
			return `<div class="row mt-2 mb-2" data-desc="desc-file">
						<div class="col-sm-12">
							<a class="col-sm-12 btn btn-info"  href="/static/sendEmail/New Line Application Format.xlsx">New Line Application Format</a>
						</div>
					</div>`;
		}
		
		// 获取每页的ps信息
		function getPagePsInfo(){
			function drawPs(data){
				let ps = data;
				$pages = $('div[data-page]');
				for(let page of $pages){
					let $page = $(page);
					let key = $page.data('page');
					let psInfos = ps[key];
					let html = '';
					for(let psInfo of psInfos){
						html += `<p>${psInfo}</p>`;
					}
					$(`div[data-page=${key}] div[data-desc=ps]`).append(html);
				}
			}
			$.ajax({
				url: '/ps/',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					// console.log(data);
					drawPs(data);
				},
				error: function(XMLHttpRequest, textStatus){
					console.log(textStatus);
				}
			});
		}
		// 删除page1的back按钮
		function removePage1BackBtn(){
			$('div[data-page=page1] button:nth-child(2)').remove();
		}
		// 修正page4
		function modifyPage4(){
			$('div[data-page=page4] button:nth-child(3)').html('Send')
				[0].dataset.dir = 'null';
		}
		
		//为每个页面添加三个button，描述文件，Ps;删除掉第一个页面的back，第四个页面的next改为Send
		let btns = getPageBtnsHtml();
		// let descFileHtml = getDescFileHtml();
		$pages = $('div[data-page]');
		let exceptPage=['page3-1','page3-2','page3-3',"page3-3-1","page3-3-2","page3-3-3","page3-3-4"]
		for(let page of $pages){
			let $page = $(page);
			let key = $page.data('page');
			let html = `
				<div data-desc="ps">
						<div><b>Ps:</b></div>
			`;
			html += `</div>`;
			if($.inArray(key,exceptPage) !=-1)
				$page.append(html);
			else
				$page.append(btns).append(html);
		}

		removePage1BackBtn();
		modifyPage4();
		// 隐藏除第一页外所有页面
		$('div[data-page]:gt(0)').hide();
		getPagePsInfo();
	}


	// 获取紧急联系人
	self.getEmergency = function(){
		// 渲染紧急联系人
		function drawEmergency(data){
			let t = data;
			//团队可以不用写死
			let teams = ['PGPD', 'PGKS'];
			let html = '';
			for(let team of teams){
				let emergencys = t[team];
				html += `<div>For ${team}：</div>`;
				html += '<div>';
				for(let emergency of emergencys){
					html += `<span class="emerge mr-2 ml-2">(${emergency[0]})${emergency[1]}&nbsp;${emergency[2]}(${emergency[3]})</span>`;
				}
				html += '</div>';
			}
			$('#emergency').append(html);
		}

		$.ajax({
			url: '/emergency/',
			type: 'POST',
			dataType: 'json',
			success: function(data){
				// console.log(data);
				drawEmergency(data);
			},
			error: function(XMLHttpRequest, textStatus){
				console.log(textStatus);
			}
		});
	}


	// 获取工厂和服务器信息
	self.getFactoryAndServer = function(){
		// 渲染工厂和服务器信息
		function drawFactoryAndServer(data){
			let $1th = $('#page1-1th-row');
			let html = '';
			for(let key in data){
				let factory = key.split(',');
				let fid = factory[0];
				let fname = factory[1];
				let servers = data[key];
				html += `
					<div class="row">
						<div class="col-sm-2 border border-top-0" data-fid="${fid}">${fname}</div>
						<div class="col-sm-10 border-bottom border-right">
						<form>
				`;
				for(let server of servers){
					let sid = server[0];
					let sname = server[1];
					html += `
						<label><input type="checkbox" data-fid="${fid}" data-sid="${sid}" class="${fname}">${sname}</label>
					`;
				}
				html += `
							</form>
						</div>
					</div>
				`;
			}
			$1th.after(html);
		}
		$.ajax({
			url: '/factoryAndServer/',
			type: 'POST',
			dataType: 'json',
			success: function(data){
				// console.log(data);
				drawFactoryAndServer(data);
			},
			error: function(XMLHttpRequest, textStatus){
				console.log(textStatus);
			}
		});
	}


	// 获取产品信息
	self.getProduct = function(){
		// 渲染产品信息
		function drawProduct(data){
			let $products = $('#products');
			let $page34_products=$('#page34_products');
			let products = data;
			let html = '<form>';
			for(let product of products){
				let pid = product[0];
				let pname = product[1];
				html += `<label class="mr-1"><input type="radio" name="optradio" data-pid="${pid}">${pname}</label>`;
			}
			html += '</form>';
			$products.html(html);
			$page34_products.html(html);
		}

		$.ajax({
			url: '/product/',
			type: 'POST',
			dataType: 'json',
			success: function(data){
				// console.log(data);
				drawProduct(data);
			},
			error: function(XMLHttpRequest, textStatus){
				console.log(textStatus);
			}
		});
	}


	// 设置方向
	self.setDir = function(){
		let from_tos = [
			['page1', 'page2'],
			['page2', 'page3'],
			['page3-1', 'page4'],
			['page3-2', 'page4'],
			['page3-3-1', 'page4'],
			['page3-3-2', 'page4'],
			['page3-3-3', 'page4'],
			['page3-3-4', 'page4'],
			['page3-4', 'page4'],
		];
		for(let from_to of from_tos){
			let nextBtn = $(`div[data-page=${from_to[0]}] button[data-dir=next]`)[0];
			let backBtn = $(`div[data-page=${from_to[1]}] button[data-dir=back]`)[0];
			nextBtn.dataset.to = from_to[1];
			backBtn.dataset.from = from_to[0];
		}

		//设置page3和page3-3的dataset.dir为null？？？？？
		setPage3Dir();
		setPage33Dir();

		function setPage3Dir(){
			function setPage3NextBtn(){
				$('div[data-page=page3] button[data-dir=next]')[0]
					.dataset.dir = 'null';
			}
			setPage3NextBtn();
		}


		function setPage33Dir(){
			function setPage33NextBtn(){
				$('div[data-page=page3-3] button[data-dir=next]')[0]
					.dataset.dir = 'null';
			}
			setPage33NextBtn();
		}
	}


	// 获取当前页面
	self.getCurrentPage = function($btn){
		while($btn.attr('data-page')==undefined)
			$btn = $btn.parent();
		return $btn.attr('data-page');
	}


	// 点击next按钮
	self.clickNextBtn = function(){
		function vali(page){
			function valiDiff(page, selector, selector2){
				function isNone(){
					let $inputs = $(`div[data-page=${page}] ${selector2}`);
					for(let input of $inputs){
						if(input.getAttribute('type')=='radio')
							if(input.checked)
								return [true, 'pass'];
						if(input.getAttribute('type')=='text')
							if(input.value)
								return [true, 'pass'];
					}
					return [false, 'fail:null'];
				}

				let [isPass, msg] = isNone();
				if(isPass){
					let $inputs = $(`div[data-page=${page}] ${selector}`);
					for(let i=0; i<$inputs.length; i+=2){
						let before = $inputs[i];
						let after = $inputs[i+1];
						if((before.value!='' && after.value=='')||(before.value=='' && after.value!='')||(before.value!='' && after.value!='' && before.value==after.value)){
							$(after).focus();
							return [false, 'fail:diff'];
						}
					}
					return [true, 'pass'];
				}
				return [isPass, msg];
			}
			function valiPage1(){
				let $checked=$('div[data-page=page1] input:checked')
				if ($checked.length == 0)
					return [false, 'fail:null']
				else{
					//判断选中的server有没有不同的Site
					let firstChecked=$checked[0]
					for(let che of $checked){
						if($(firstChecked).attr("class")!=$(che).attr("class"))
							return [false, 'fail:site']

					}
					return [true, 'pass']
				}
			}
			function valiPage2(){
				return $('div[data-page=page2] input:checked').length == 0 ? 
					[false, 'fail:null'] : [true, 'pass'];
			}
			function valiPage31(){
				let str_val=$('#new-line').val();
				if (str_val=='')
					return [false, 'fail:null']
				else{
					arr=str_val.split(',')
					for(let a of arr){
						a=a.trim()
						if(a){
							regex_result=/^(F|J)[A-Z0-9-//]{8,20}$/.test(a);
							if(!regex_result){
								break;
							}
						}
					}
					return regex_result? [true, 'pass']:[false, 'fail:regex'];
				}
			}
			function valiPage32(){
				let line_val=$('div[data-page=page3-2] input[data-search=line]').val()
				if (line_val=='')
					return [false, 'fail:null']
				else{
					arr=line_val.split(',')
					for(let a of arr){
						a=a.trim()
						if(a){
							regex_result=/^(F|J)[A-Z0-9-//]{8,20}$/.test(a);
							if(!regex_result)
								break;							
						}
					}
				}
				return $('div[data-page=page3-2] input[data-vali=stationType]')
					.val() == '' ? [false, 'fail:null'] : 
					regex_result? [true, 'pass']:[false, 'fail:regex'] ;
			}
			function valiPage331(){
				return valiDiff('page3-3-1', 'input:not(:last)', 'input');
			}
			function valiPage332(){
				return $('div[data-page=page3-3-2] input[data-search=line]')
					.val() == '' ? [false, 'fail:linenull'] :
					valiDiff('page3-3-2', 'input[type=text]:not(:first,:last)', 'input:not(:first)');
			}
			function valiPage333(){
				return $('div[data-page=page3-3-3] input[data-desc=station-type]')
					.val() == '' ? [false, 'fail:stationnull'] : 
					valiDiff('page3-3-3', 'input[type=text]:not(:first,:last)', 'input:not(:first)');
			}
			function valiPage334(){
				return valiDiff('page3-3-4', 'input[type=text]:not(:first,:eq(1),:last)', 'input:gt(1)');
			}
			function valiPage34(){
				let deleteline_val=$('div[data-page=page3-4] input[data-option=deleteline]').val();
				let addline_val=$('div[data-page=page3-4] input[data-option=addline]').val();
				let [isPass, msg]=valiLineName(deleteline_val);
				if(isPass){
					console.log(addline_val)
					if (addline_val){
						if($('div[data-page=page3-4] input:checked').length == 0)
							return [false,"fail:productNull"]
						else
							return valiLineName(addline_val);					
					}
					return [isPass, msg];
				}else{
					return [isPass, msg];
				}				
			}

			function valiLineName(value){
				if (value=='')
					return [false, 'fail:null']
				else{
					arr=value.split(',')
					for(let a of arr){
						a=a.trim()
						if(a){
							regex_result=/^(F|J)[A-Z0-9-//]{8,20}$/.test(a);
							if(!regex_result){
								break;
							}
						}
					}
					return regex_result? [true, 'pass']:[false, 'fail:regex'];
				}
			}

			let valiPages = {
				'page1': valiPage1,
				'page2': valiPage2,
				'page3-1': valiPage31,
				'page3-2': valiPage32,
				'page3-3-1': valiPage331,
				'page3-3-2': valiPage332,
				'page3-3-3': valiPage333,
				'page3-3-4': valiPage334,
				'page3-4': valiPage34,
			};

			return valiPages[page];
		}
		function showMsg(page){
			function showMsg1(msg){
				if(msg=='fail:site')
					info('请勿选择不同Site Server!');
				if(msg=='fail:null')
					info('请至少选择一个Server!');
			}
			function showMsg2(msg){
				info('请选择一个产品！');
			}
			function showMsg31(msg){
				if(msg=='fail:null')
					info('请填写必填项');
				if(msg=='fail:regex')
					info('请检查新线体名称');
			}
			function showMsg32(msg){
				if (msg=='fail:regex')
					info('请检查线体名称')
				if (msg=='fail:null')
					info('请填写必填项');
			}
			function showMsg331(msg){
				if(msg=='fail:null')
					info('请至少修改一项');
				if(msg=='fail:diff')
					info('检查光标所在的输入框，注意修改内容前后必须不同');
			}
			function showMsg332(msg){
				if(msg=='fail:linenull')
					info('线体不能为空');
				showMsg331(msg);
			}
			function showMsg333(msg){
				if(msg=='stationnull')
					info('请填写站位类型');
				showMsg331(msg);
			}
			function showMsg334(msg){
				showMsg331(msg);
			}
			function showMsg34(msg){
				if(msg=='fail:regex')
					info('请检查线体名称');
				if(msg=='fail:productNull')
					info('请选择一个产品');
				if(msg=='fail:null')
					info('请填写要删除的线名');
			}

			let showMsgs = {
				'page1': showMsg1,
				'page2': showMsg2,
				'page3-1': showMsg31,
				'page3-2': showMsg32,
				'page3-3-1': showMsg331,
				'page3-3-2': showMsg332,
				'page3-3-3': showMsg333,
				'page3-3-4': showMsg334,
				'page3-4': showMsg34,
			};

			return showMsgs[page];
		}

		$('#pages').on('click', 'button[data-dir=next]', function(){
			let $this = $(this);
			let currentPage = getCurrentPage($this);
			let [isPass, msg] = vali(currentPage)();
			if(isPass){
				let nextPage = $this.data('to');
				$(`div[data-page=${currentPage}]`).hide();
				$(`div[data-page=${nextPage}]`).show();
				$(`div[data-page=${nextPage}] button[data-dir=back]`)[0]
					.dataset.from = currentPage;
			}else
				showMsg(currentPage)(msg);
		});
		//page3-1和page3-2的add
		$('#pages').on('click', 'button[data-dir=add]', function(){
			let $this = $(this);
			let currentPage = getCurrentPage($this);
			let [isPass, msg] = vali(currentPage)();
			if(isPass){
				confirm('确定要添加吗', $this, 'add');
			}else
				showMsg(currentPage)(msg);
		});
		//changeSetting子页面page3-3-1,page3-3-2,page3-3-3,page3-3-4的add
		$('#pages').on('click', 'button[data-dir=addOther]', function(){
			let $this = $(this);
			let currentPage = getCurrentPage($this);
			let [isPass, msg] = vali(currentPage)();
			if(isPass){
				// confirm('确定要添加吗', $this, 'addOther');
				let currentPage = getCurrentPage($this);
				let $back=$(`div[data-page=${currentPage}] button[data-dir=back]`);
				let prevPage = $back[0].dataset.from;		
				clear(currentPage+"_clcInputAndSelect")();
				clear(prevPage+"_clcInput")();
				//得到上个页面所有的input，并重新设置data-pid
				$Inputs=$(`div[data-page=${prevPage}] input`)
				addCount=addCount+1;
				for(let input of $Inputs){
					input.dataset.pid =input.dataset.pid +addCount
				}
				//得到该页面所有的input，并重新设置data-pid
				$currentInputs=$(`div[data-page=${currentPage}] input`)
				addCount=addCount+1;
				for(let cinput of $currentInputs){
					cinput.dataset.pid =cinput.dataset.pid +addCount
				}

				$(`div[data-page=${currentPage}]`).hide();
				$(`div[data-page=${prevPage}]`).show();
	
			}else
				showMsg(currentPage)(msg);
		});
	}


	// page3跳转
	self.page3Next = function(){
		$('div[data-page=page3] button[data-dir=null]').click(function(){
			let $this = $(this);
			let isPass = valiPage3();
			if(isPass){
				let $radio = $('div[data-page=page3] input:checked');
				let currentPage = getCurrentPage($this);
				let nextPage = $radio.data('to');
				$(`div[data-page=${currentPage}]`).hide();
				$(`div[data-page=${nextPage}]`).show();
				$(`div[data-page=${nextPage}] button[data-dir=back]`)[0]
					.dataset.from = currentPage;
			}else
				info('请选择一项设置');
		});

		function valiPage3(){
			let $radios = $('div[data-page=page3] input[type=radio]');
			for(let radio of $radios)
				if(radio.checked)return true;
			return false;
		}
	}


	// page3-3跳转
	self.page33Next = function(){
		// function setVal(page){
		// 	function setSelected(pid, txt){
		// 		var pagesFunc = this;
		// 		var fns = {
		// 			discardSomeSymbol: pagesFunc.discardSomeSymbol,
		// 			addContent: pagesFunc.addContent,
		// 		}
		// 		fns.addContent(
		// 			pid,
		// 			fns.discardSomeSymbol(txt)
		// 		);
		// 	}
		// 	function setPage332(){
		// 		var val = $('div[data-page=page3-3] input:eq(0)')[0].value;
		// 		$('div[data-page=page3-3-2] input:first')[0].value = val;
		// 		setSelected.call(pagesFunc, 'page332-line', 'Line Name: '+val);
		// 	}
		// 	function setPage333(){
		// 		var val = $('div[data-page=page3-3] input:eq(1)')[0].value;
		// 		$('div[data-page=page3-3-3] input:first')[0].value = val;
		// 		setSelected.call(pagesFunc, 'page333-stationtype', 'Station Type: '+val);
		// 	}
		// 	function setPage334(){
		// 		var val1 = $('div[data-page=page3-3] input:eq(2)')			[0].value,
		// 			val2 = $('div[data-page=page3-3] input:eq(3)')		[0].value;

		// 		$('div[data-page=page3-3-4] input:eq(0)')[0].value = val1;
		// 		$('div[data-page=page3-3-4] input:eq(1)')[0].value = val2;
		// 		setSelected.call(pagesFunc, 'page334-stationunit', 'Station Unit: '+val1);
		// 		setSelected.call(pagesFunc, 'page334-ip', 'IP Address: '+val2);
		// 	}

		// 	let pages = {
		// 		'page3-3-2': setPage332,
		// 		'page3-3-3': setPage333,
		// 		'page3-3-4': setPage334,
		// 	};

		// 	if(pages.hasOwnProperty(page))
		// 		pages[page]();
		// }

		$page33NextBtn = $('div[data-page=page3-3] button[data-dir=null]');
		$page33NextBtn.click(function(){
			setPage33Next();
			let $this = $(this);
			// let nextPage = $this.data('to');
			let nextPage=$page33NextBtn[0].dataset.to;
			let currentPage = getCurrentPage($this);		
			let [isPass, msg] = valiPage33();
			if(isPass){
				setNextPagePid(nextPage);
				$(`div[data-page=${currentPage}]`).hide();
				$(`div[data-page=${nextPage}]`).show();
				$(`div[data-page=${nextPage}] button[data-dir=back]`)[0]
					.dataset.from = currentPage;
			}else
				info(msg);
			// setVal(nextPage);
		});

		//Page3-3点击add按钮
		$('#pages').on('click', 'button[data-dir=add33]', function(){
			let $this = $(this);
			let currentPage = getCurrentPage($this);
			let [isPass, msg] = valiPage33();
			if(isPass){
				confirm('确定要添加吗', $this, 'add');
			}else
				info(msg);
		});

		//验证33页面的LineName和IPAddress
		function valiPage33(){
			let line_val=$('div[data-page=page3-3] input[data-judge=line]').val()
			let station_val=$('div[data-page=page3-3] input[data-judge=station]').val()
			let unit_val=$('div[data-page=page3-3] input[data-judge=unit]').val()
			let ipaddress_val=$('div[data-page=page3-3] input[data-judge=ipaddress]').val()
			//unit和ipaddress填写后，line和station也必须填
			if (unit_val || ipaddress_val){				
				if(line_val && station_val){}		
				else
					return [false, '请填入线体和站位信息!'];				
			}
			//验证ipaddress
			if(!!ipaddress_val){
				regex_result=/^[0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$/.test(ipaddress_val);
				if(!regex_result)
					return [false, '请检查IP Address!'];
			}
			//验证line名称
			if(!!line_val){
				arr=line_val.split(',')
				for(let a of arr){
					a=a.trim()
					if(a){
						regex_result=/^(F|J)[A-Z0-9-//]{8,20}$/.test(a);
						if(!regex_result)
							break;							
					}
				}				
				return regex_result? [true, 'pass']:[false, '请检查线体名称!'];
			}
			return [true, 'pass'];
		}


		// 获取page3-3的input元素
		function getPage33InputElem(){
			return $('div[data-page=page3-3] input');
		}


		// 获取page3-3的input下标
		function getPage33InputIndex(){
			let $inputs = getPage33InputElem();
			for(let i=$inputs.length; i>0; i--){
				if($($inputs[i-1]).val())
					return i;
			}
			return 0;
		}


		// 设置page3-3的next的data-to
		function setPage33Next(){
			let d = {
				0: 'page3-3-1',
				1: 'page3-3-2',
				2: 'page3-3-3',
				3: 'page3-3-4',
				4: 'page3-3-4',
			};
			let index = getPage33InputIndex();
			$page33NextBtn[0].dataset.to = d[index];
		} 

		//设置page3-3-1,page3-3-2,page3-3-3,page3-3-4中的所有pid
		function setNextPagePid(nextpage){
			let replacePage=nextpage.replace(/-/g,'')
			let $inputs=nextpage=='page3-3-1' ? 
						$(`div[data-page=${nextpage}] div[data-pid*=${replacePage}],input[data-pid*=${replacePage}]`)
						:$(`div[data-page=${nextpage}] div[data-pid*=${replacePage}]`);
			addCount=addCount+1;
			for(let $input of $inputs){
				$input.dataset.pid =$input.dataset.pid +addCount;
			}
		}
	}


	// 点击back按钮
	self.clickBackBtn = function(){
		$('#pages').on('click', 'button[data-dir=back]', function(){
			let $this = $(this);
			confirm('确定要返回上一页吗', $this, 'back');
		});
	}


	// 搜索
	self.search = function(){

		function getEmailName(){
			$.ajax({
				url: 'http://eip.sh.pegatroncorp.com:789/StaffSearch.Web/StaffList.aspx?R1=EName&T1=Tito_Wu',
				success: function(data){
					console.log(data);
				},
				error: function(XMLHttpRequest, textStatus){
					console.log(textStatus);
				}
			});
		}

		function searchBind(selector, search){
			function split( val ) {
				return val.split( /,\s*/ );
			}
			function extractLast( term ) {
				return split( term ).pop();
			}
		
			$( selector )
			// don't navigate away from the field on tab when selecting an item
			.on( "keydown", function( event ) {
				if ( event.keyCode === $.ui.keyCode.TAB &&
					$( this ).autocomplete( "instance" ).menu.active ) {
					event.preventDefault();
				}
			})
			.autocomplete({
				source: function( request, response ) {
					$.getJSON( search, {
						term: extractLast( request.term )
					}, response );
				},
				search: function() {
					// custom minLength
					var term = extractLast( this.value );
					if ( term.length < 1 ) {
						return false;
					}
				},
				focus: function() {
					// prevent value inserted on focus
					return false;
				},
				select: function( event, ui ) {
					var terms = split( this.value );
					// remove the current input
					terms.pop();
					// add the selected item
					terms.push( ui.item.value );
					// add placeholder to get the comma-and-space at the end
					terms.push( "" );
					this.value = terms.join( ", " );
					$(this).keyup();
					return false;
				}
			});
		}

		let o = {
			'input[data-search=line]': 'line',
			'input[data-search=osx]': 'osx',
			'input[data-search=build]': 'build',
		};
		for(let key in o)
			searchBind(key, o[key]);

		// getEmailName();
	}
	

	// 功能，将邮件的主题拼接出来，把左边的具体操作结果，显示在右边
	self.pagesFunc = function(){

		pagesFunc.discardSomeSymbol = discardSomeSymbol;
		pagesFunc.addContent = addContent;
		function discardSomeSymbol(txt){
			txt = txt.trim();
			([',', '*'].indexOf(txt.slice(-1))!=-1)
			&&
			(txt=txt.slice(0,-1))
			return txt;
		}
		//写内容到右边div,原来的
		// function addContent(pid, addHtml){
		// 	if(addHtml)
		// 		$(`#${pid}`).html(addHtml).show();
		// 	else
		// 		$(`#${pid}`).html(addHtml).hide();
		// }

		//写内容到右边div
		function addContent(pid, addHtml){			
			if(addHtml){
				Contents[pid]=addHtml
				$(`#preview-content`).val(divtostr(Contents));
			}else
				$(`#preview-content`).val(divtostr(Contents));
		}

		function deleteContent(pid){
			delete Contents[pid];
			$(`#preview-content`).val(divtostr(Contents));
		}

		function divtostr(dic){
			str=""
			$.each(dic,function(key,value){
				if(value!='')
					str+=value+"\n"
			});
			return str
		}

		//拼接处内容的格式，并写内容到右边div
		function keyupWriter(input){
			let $input = $(input);
			let title = discardSomeSymbol($input.parent().prev().text());
			let content = discardSomeSymbol($input.val());
			let pid = $input[0].dataset.pid;
			let addHtml = title+': '+content;
			if(content)
				addContent(pid, addHtml);
			else
				deleteContent(pid)
		}
		//单个文本框的内容的输入
		function autoAddContentForKeyUp(page, selector){
			$(`div[data-page=${page}]`).on('keyup', selector, function(){
				keyupWriter(this);
			});
		}
		//针对有before和after两个input的情况，拼接出内容，并写入右边div
		function changeWriterForKeyUp(page, selector){
			$(`div[data-page=${page}]`).on('keyup', selector, function(){
				let $this = $(this);
				let $title = $this.parent().parent().children(':eq(0)');
				let pid = $title[0].dataset.pid;
				let title = discardSomeSymbol($title.text());
				let before = discardSomeSymbol($title.next().children(':first').val());
				let after = discardSomeSymbol($title.next().next().children(':first').val());
				let addHtml = `${title}: ${before} => ${after}`;
				if(before=='' && after=='')
					addContent(pid, '');
				else
					addContent(pid, addHtml);
			});
		}
		//针对有before和after两个radio的选择，拼接内容，并写入右边div
		function changeWriterForKeyUp2(){
			let $this = $(this);
			let $title = $this.parent().parent().parent().parent().parent().children(':eq(0)');
			let pid = $title[0].dataset.pid;
			let title = discardSomeSymbol($title.text());
			
			let before = discardSomeSymbol($title.next().find('input:checked').parent().text());
			let after = discardSomeSymbol($title.next().next().find('input:checked').parent().text());
			let addHtml = `${title}: ${before} => ${after}`;
			if(before=='' && after==''){
				addContent(pid, '');				
			}else
				addContent(pid, addHtml);
		}

		function emailSub(page, selector, desc, fn=function(val){}){
			function emailSubject(extra){
				//邮件主题 [PGKS2-1][Panda][Change Setting]For Unit  333
				let subject = discardSomeSymbol(combinaSubject() + extra);
				$('div[data-page=page4] #subject')[0].value = subject;
			}

			$(`div[data-page=${page}] ${selector}`).change(function(){
				let extra = `${desc} ${this.value}`;
				emailSubject(extra);
				fn(this.value);
			});
		}
		
		//将before radio 和after radio的选择进行联系
		function relateBtn(page){
			function calc(){
				let $radios = $(`div[data-page=${page}] input[type=radio]`);
				let pos = $radios.index(this);
				//floor(x/4)*8+3-x=y  
				let i = 4*Math.floor(pos/4) + 4-1-pos%4;
				$radios[i].checked = true;
				changeWriterForKeyUp2.bind($radios[i])();
			}
			$(`div[data-page=${page}]`).on('click', 'input[type=radio]', function(){
				let $this = $(this);
				calc.bind(this)();
			});
		}
		
		function page1Func(){
			$('div[data-page=page1]').on('click', 'input[type=checkbox]', function(){
				$checked = $('div[data-page=page1] input:checked');
				let title = 'GH Server: '; 
				let txt = '';
				for(let checked of $checked){
					txt += $(checked).parent().text() + ',';
				}
				if(txt)
					addContent('page1', title+txt.slice(0, -1));
				else
					addContent('page1', '');
			});
		}
		function page2Func(){
			let $product = $('div[data-page=page3-3-1] #product');
			$('div[data-page=page2]').on('click', 'input[type=radio]', function(){
				let txt = $('div[data-page=page2] input:checked').parent().text();
				let title = 'Product: ';
				addContent('page2', title+txt);
				$product.html(txt);
			});
		}
		function page3Func(){
			$('div[data-page=page3]').on('click', 'input[type=radio]', function(){
				let title = 'Request Category: ';
				let txt = $('div[data-page=page3] input:checked').parent().text();
				addContent('page3', title+txt);
			});
		}
		function page31Func(){
			autoAddContentForKeyUp('page3-1', 'input');
			emailSub('page3-1', '#new-line', 'For Line ');
		}
		function page32Func(){
			autoAddContentForKeyUp('page3-2', 'input');
			emailSub('page3-2', 'input:first', 'For Station ');
		}
		function page33Func(){
			autoAddContentForKeyUp('page3-3', 'input');
			emailSub('page3-3', 'input:first', 'For Line ', function(val){
				$('div[data-page=page3-3-2] input:first')[0].value = val;
			});
			emailSub('page3-3', 'input:eq(1)', 'For Station ', function(val){
				$('div[data-page=page3-3-3] input:first')[0].value = val;
			});
			emailSub('page3-3', 'input:eq(2)', 'For Unit ', function(val){
				$('div[data-page=page3-3-4] input:eq(0)')[0].value = val;
			});
			emailSub('page3-3', 'input:eq(3)', 'For Unit ', function(val){
				$('div[data-page=page3-3-4] input:eq(1)')[0].value = val;
			});
		}
		function page331Func(){
			changeWriterForKeyUp('page3-3-1', 'input:not(:last)');
			autoAddContentForKeyUp('page3-3-1', 'input:last');
		}
		function page332Func(){
			// autoAddContentForKeyUp('page3-3-2', 'input:first');
			changeWriterForKeyUp('page3-3-2', 'input[type=text]:not(:first,:last)');
			autoAddContentForKeyUp('page3-3-2', 'input:last');
			emailSub('page3-3-2', 'input:first', 'For Line ');
			relateBtn('page3-3-2');
		}
		function page333Func(){
			// autoAddContentForKeyUp('page3-3-3', 'input:first');
			changeWriterForKeyUp('page3-3-3', 'input[type=text]:not(:first,:last)');
			autoAddContentForKeyUp('page3-3-3', 'input:last');
			emailSub('page3-3-3', 'input:first', 'For Station ');
			relateBtn('page3-3-3');
		}
		function page334Func(){
			// autoAddContentForKeyUp('page3-3-4', 'input:lt(2)');
			changeWriterForKeyUp('page3-3-4', 'input[type=text]:not(:first,:eq(1),:last)');
			autoAddContentForKeyUp('page3-3-4', 'input:last');
			emailSub('page3-3-4', 'input:eq(0)', 'For Unit ');
			emailSub('page3-3-4', 'input:eq(1)', 'For Unit ');
			relateBtn('page3-3-4');
		}
		function page34Func(){
			let $page34_products = $('div[data-page=page3-4] #page34_products');
			$('div[data-page=page3-4]').on('click', 'input[type=radio]', function(){
				let txt = $('div[data-page=page3-4] input:checked').parent().text();
				let title = 'Product: ';
				addContent('page34', title+txt);
				// $page34_products.html(txt);
			});

			autoAddContentForKeyUp('page3-4', 'input');
			emailSub('page3-4', 'input:first', 'For Line ');
		}
		function page4Func(){

		}

		page1Func();
		page2Func();
		page3Func();
		page31Func();
		page32Func();
		page33Func();
		page331Func();
		page332Func();
		page333Func();
		page334Func();
		page34Func();
		page4Func();
	}


	// 清除
	self.clear = function(page){
		function clsSelect(){
			let end=page.indexOf("_");
				if(end>-1)
					page=page.substr(0, end)			
			$(`div[data-page=${page}] input:checked`).each(function(){
				this.checked = false;
			});
		}
		function clsInput(){
			let end=page.indexOf("_");
				if(end>-1)
					page=page.substr(0, end)
			$(`div[data-page=${page}] input[type=text]`).each(function(){
				if(!$(this).attr("readonly")){
					this.value = '';
				}
			});
		}
		function clsSelectAndInput(){
			clsSelect();
			clsInput();
		}
		// function clsContent(){
		// 	if($(`#${page}`).children().length)
		// 		$(`#${page}`).children().each(function(){
		// 			this.innerHTML = '';
		// 			this.style.display = 'none';
		// 		});
		// 	else
		// 		$(`#${page}`).html('').hide();
		// }
		function clsContent(){
			let page_end=page.indexOf("_");				
			if(page_end>-1)
				page=page.substr(0, page_end)
			if(page=="page3-3"){
				$.each(Contents,function(key,value){
					if(key.search(page.replace(/-/g,''))!=-1)
						deleteContent(key)
				});
			}else{
				$.each(Contents,function(key,value){
					let end=key.indexOf("-");
					let substr=key;
					if(end>-1)
						substr=key.substr(0, end)
					if(page.replace(/-/g,'')==substr){
						deleteContent(key)
					}						 
				});
			}
		}
		function deleteContent(pid){
			delete Contents[pid];
			$(`#preview-content`).val(divtostr(Contents));
		}
		function divtostr(dic){
			str=""
			$.each(dic,function(key,value){
				if(value!='')
					str+=value+"\n"
			});
			return str
		}
		function clsPage1(){
			clsSelect();
			clsContent();
		}
		function clsPage2(){
			clsSelect();
			clsContent();
		}
		function clsPage3(){
			clsSelect();
			clsContent();
		}
		function clsPage31(){
			clsInput();
			clsContent();
		}
		function clsInputPage31(){

			clsInput();
		}
		function clsPage32(){
			clsInput();
			clsContent();
		}
		function clsInputPage32(){
			clsInput();
		}
		function clsPage33(){
			clsInput();
			clsContent();
		}
		function clsInputPage33(){
			clsInput();
		}
		function clsPage331(){
			clsInput();
			clsContent();
		}
		function clsInputAndSelectPage331(){
			clsSelect();
			clsInput();
		}
		function clsPage332(){
			clsSelect();
			clsInput();
			clsContent();
		}
		function clsInputAndSelectPage332(){
			clsSelect();
			clsInput();
		}
		function clsPage333(){
			clsSelect();
			clsInput();
			clsContent();
		}
		function clsInputAndSelectPage333(){
			clsSelect();
			clsInput();
		}
		function clsPage334(){
			clsSelect();
			clsInput();
			clsContent();
		}
		function clsInputAndSelectPage334(){
			clsSelect();
			clsInput();
		}
		function clsPage34(){
			clsSelect();
			clsInput();
			clsContent();
		}
		function clsPage4(){
			$(`div[data-page=${page}] input:not(:eq(0),:eq(2),:eq(3),:eq(4))`).each(function(){
				this.value = '';
			});
		}
		
		let clsPages = {
			'page1': clsPage1,
			'page2': clsPage2,
			'page3': clsPage3,
			'page3-1': clsPage31,
			'page3-2': clsPage32,
			'page3-3': clsPage33,
			'page3-3-1': clsPage331,
			'page3-3-2': clsPage332,
			'page3-3-3': clsPage333,
			'page3-3-4': clsPage334,
			'page3-4': clsPage34,
			'page4': clsPage4,
			//清除页面特定的内容
			'page3-1_clcInput':clsInputPage31,
			'page3-2_clcInput':clsInputPage32,
			'page3-3_clcInput':clsInputPage33,
			'page3-3-1_clcInputAndSelect': clsInputAndSelectPage331,
			'page3-3-2_clcInputAndSelect': clsInputAndSelectPage332,
			'page3-3-3_clcInputAndSelect': clsInputAndSelectPage333,
			'page3-3-4_clcInputAndSelect': clsInputAndSelectPage334,

		};

		return clsPages[page];
	}
	self.readyCls = function(){
		(function(){
			$('#pages').on('click', 'button[data-func=cls]', function(){
				confirm('确定要对当前页做清空操作吗', $(this), 'clear');
			});
		})();
	}


	// 邮件
	self.sendEmail = function(){
		function getUserName(){
			return $('#usr').val().trim();
		}
		function getPassWord(){
			return $('#pwd').val().trim();
		}
		function getSubject(){
			return $('#subject').val().trim();
		}
		function getBody(){
			let text = 'Hi groundhog team,\n\nPlease help on this, thanks~\n\n';
			text+=$('#preview-content').val();
			return text;
		}
		function getF(){
			console.log($('#f').val().trim())
			return $('#f').val().trim();
		}
		function getTo(){
			return $('#to').val().trim();
		}
		function getCC(){
			let cc = $('#cc')[0].value.trim();
			if(cc){
				let arr = cc.split(';');
				let a = [];
				for(let item of arr)
					if(item)
						a.push(item);
				return a;
			}
			return [];
		}
		function valiEmail(){			
			let to = $('#to').val();
			let subject=$('#subject').val();
			if(to&&subject)
				return true;
			else
				return false;
		}
		// function valiEmail(){
		// 	let usr = $('#usr').val();
		// 	let pwd = $('#pwd').val();
		// 	let f = $('#f').val();
		// 	let to = $('#to').val();
		// 	if(usr&&pwd&&f&&to)
		// 		return true;
		// 	else
		// 		return false;
		// }

		// $('#hide-email').click(function(){
		// 	let formData = new FormData();
		// 	formData.append('usr', getUserName());
		// 	formData.append('pwd', getPassWord());
		// 	formData.append('subject', getSubject());
		// 	formData.append('body', getBody());
		// 	formData.append('f', getF());
		// 	formData.append('to', getTo());
		// 	formData.append('cc', JSON.stringify(getCC()));
		// 	formData.append('appendix', $('#myFile')[0].files[0]);
		// 	$.ajax({
		// 		url: '/email/',
		// 		type: 'POST',
		// 		cache: false,
		// 		processData: false,
		// 		contentType: false,
		// 		data: formData,
		// 		dataType: 'text',
		// 		success: function(data){
		// 			info(data);
		// 		},
		// 		error: function(XMLHttpRequest, textStatus){
		// 			info('密码错误');
		// 		}
		// 	});
		// });

		function saveEmail(){
			let formData = new FormData();
			formData.append('subject', getSubject());
			formData.append('body', getBody());
			formData.append('f', getF());
			formData.append('to', getTo());
			$.ajax({
				url: '/email/',
				type: 'POST',
				cache: false,
				processData: false,
				contentType: false,
				data: formData,
				dataType: 'text',
				success: function(data){
					info(data);
				},
				error: function(XMLHttpRequest, textStatus){
					info('保存邮件失败！');
				}
			});
		}

		$("#hide-email").click(function(){
			let to=getTo();
			let subject=encodeURIComponent(getSubject());
			let body=encodeURIComponent(getBody());
			$("#send-email-a").attr("href","mailto:"+to+"?subject="+subject+"&body="+body);
			document.getElementById("send-email-a").click();
			saveEmail();
		});


		$('div[data-page=page4] button:last').click(function(){
			if(valiEmail()){
				confirm('请确认信息无误，是否发出mail', $(this), 'email');
			}
			else
				info('请检查必填项');
		});
	}


	// 拼接邮件subject , [PGKS2-1][Panda][Change Setting]
	self.combinaSubject = function(){
		let txt = '';
		{
			let $servers = $('div[data-page=page1] input:checked');
			let arr = [];
			for(let server of $servers){
				arr.push(server.parentNode.innerText);
			}
			txt = '['+arr.join('|')+']';
		}
		{
			let $product = $('div[data-page=page2] input:checked');
			txt += `[${$product.parent().text()}]`;
		}
		{
			let $select = $('div[data-page=page3] input:checked');
			txt += `[${$select.parent().text()}]`;
		}
		return txt;
	}
});


// 主流程
$(function(){
	// 设置preview-content高度
	setPreviewContentHeight();


	// 获取工厂和服务器信息
	getFactoryAndServer();
	// 获取产品信息
	getProduct();
	// 获取紧急联系人
	getEmergency();


	// 绘制页面
	drawPages();


	// 设置方向
	setDir();
	// 点击next按钮
	clickNextBtn();
	// page3跳转
	page3Next();
	// page3-3跳转
	page33Next();
	// 点击back按钮
	clickBackBtn();

	// 搜索
	search();
	
	// 功能
	pagesFunc();
	// 清除
	readyCls();


	// 邮件
	sendEmail();
	//弹出菜单栏
	CCinputForKeyUp();
});

//标志，拼接pid需要用
let addCount=0;
// 提示信息
function info(msg){
	$( "#dialog-message" ).dialog({
		draggable: false,
		modal: true,
		buttons: {
			'确定': function() {
				$( this ).dialog( "close" );
			}
		}
	}).html(msg);
	$('button.ui-dialog-titlebar-close').html('<i class="fa fa-times" aria-hidden="true"></i>');
}
// 确认
function confirm(msg, $this, operate){
	$( "#confirm" ).dialog({
		draggable: false,
		modal: true,
		buttons: {
			'确定': function() {
				if(operate=='back'){
					let prevPage = $this[0].dataset.from;
					let currentPage = getCurrentPage($this)
					clear(currentPage)();
					$(`div[data-page=${currentPage}]`).hide();
					$(`div[data-page=${prevPage}]`).show();
				}
				if(operate=='add'){
					let currentPage = getCurrentPage($this);
					//得到该页面所有的input，并重新设置data-pid
					$Inputs=$(`div[data-page=${currentPage}] input`)
					addCount=addCount+1;
					for(let input of $Inputs){
						input.dataset.pid =input.dataset.pid +addCount;
					}
					//清空所有的input
					currentPage=currentPage+"_clcInput"
					clear(currentPage)();
				}					
				if(operate=='clear')
					clear(getCurrentPage($this))();
				if(operate=='email')
					$('#hide-email').click();					
				$( this ).dialog( "close" );
			},
			'取消': function() {
				$( this ).dialog( "close" );
			}
		}
	}).html(msg);
	$('button.ui-dialog-titlebar-close').html('<i class="fa fa-times" aria-hidden="true"></i>');
}

//CC文本框输入时弹出菜单
function CCinputForKeyUp(){

	//右击弹菜单
	$(`div[data-page="page4"] #cc`).off('contextmenu').contextmenu(function(e){
        e.preventDefault();
		$("#ccemail-menu").removeClass('d-none').css({
			// 设置其显示位置
			'top' : e.pageY+10,
			'left': e.pageX+10,
			// 将其显示
			'display': 'block',
		});
	});
	//点击隐藏
	$(`div[data-page="page4"] #cc`).on('click',function(e){
		$("#ccemail-menu").addClass('d-none')
	});
	//点击菜单，选择值
	$("#ccemail-menu li").on('click',function(){
		let $this=$(this)
		let cc=$(`div[data-page="page4"] #cc`)
		let ccval=cc.val()
		//cc.val(ccval+$this.attr("data-val")) 
		//使光标置后
    	cc.val("").focus().val(ccval+$this.attr("data-val"));  
		$("#ccemail-menu").addClass('d-none')
	});

}
