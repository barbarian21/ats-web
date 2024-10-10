// 匿名函数自调
(()=>{
	// 为侧边栏设置id 模板不应该改变或者跟随模板改变
	let cebian = $($('body>div>div>div')[0]);
	$(cebian).attr('id', 'cebian').css({
		'padding': 0
	});
	// 为内容设置id
	let neiRong = $($('body>div>div>div')[1]);
	$(neiRong).attr('id', 'neiRong').css({
		'padding': 0,
		'overflow': 'unset',
	});

	let $footer = $('footer');
	$($footer.parent()[0]).css({
		'margin': 0
	});
	$footer.removeClass('footer-bottom').css({
		'position': 'fixed',
		'bottom': 0
	});

	let $daoHang = $($('body>div')[0]);
	$daoHang.css({
		'margin': 0
	});
	$($daoHang.children()[0]).css({
		'padding': 0
	});

	let $zuo = $($('body>div>div')[1]);
	$zuo.css({
		'padding': 0,
		'margin': 0,
	})
	

	// 获取左侧菜单
	let $leftMenus = $('[data-tag=left-menu]')
	// 默认为左侧菜单的第一个元素添加trigger样式
	$leftMenus.first().addClass('trigger');
	// 为左侧菜单绑定点击事件 请求对应的表格数据
	$leftMenus.click(function(e){
		// 获取当前的专案
		let project = getProject();
		// 获取目标元素 并 实例化为jQuery对象
		let $triggerElement = $(e.target);

		// 判断当前元素有没有trigger样式
		if(!$triggerElement.hasClass('trigger')){
		// 如果没有
			// 则为其添加此样式
			$triggerElement.addClass('trigger');
			// 清除兄弟元素中此样式
			$triggerElement.siblings('.trigger').removeClass('trigger');
		}
		
		// 执行ajax请求器
		ajaxGetDataFromDB(project, $triggerElement.text());
	});
})();

// 获取专案
function getProject(){
	return $('#select-project').text();
}

// 返回是否禁用单元格所用的到的变量信息
function getForbiddenTdVarInfo(index){
	// 设置单元格是否为可编辑状态 默认不可编辑
	let is_editable = false;
	// 设置光标显示方式 默认禁用
	let cursor = 'no-drop';
	// 如果不在禁用名单里
	if(getForbiddenTdIndex(getForbiddenEditableTdNums).indexOf(index)==-1){
		is_editable = true;
		cursor = 'auto';
	}

	// 返回是否禁用单元格所用的到的变量信息
	return [is_editable, cursor];
}

// ajax请求器
function ajaxGetDataFromDB(project=getProject(), table='Open Action'){
	// 拼接post参数
	let data = `project=${project}&table=${table}`;
	// 从后台获取数据
	ajax('/ajaxGetDataFromDB/', 'json', 'post', data).then(data=>{
		// console.log(data);

		// 获取当前表名
		let table = $('.trigger').text();
		// 获取表头字段
		let FIELDS = data.FIELDS;
		// 获取id为fields的元素
		let $fields = $('#fields');
		// 定义存放表头字段的html代码片段的临时变量
		html = '';
		// 遍历表头字段
		for(let i=0; i<FIELDS.length; i++){
			html += `<th>${FIELDS[i]}</th>`;
		}
		// 将拼接好的html代码片段添加其表头元素中
		$fields.html(html);

		// 获取tbody元素
		let $tbody = $('tbody');
		// 定义存放tbody的html代码片段的临时变量
		html = '';
		// 获取总的行数据
		let ROWS = data.ROWS;
		// 遍历总行
		// 判断当前表格是否为QTx Issue List或者Fixed Issue
		
		for(let i=0; i<ROWS.length; i++){
			// 获取一行
			let ROW = ROWS[i];
			// 获取一行id
			let ID = ROW.ID;
			// 获取一行内容
			let CONTENTS = ROW.CONTENTS;
			
			// 遍历一行内容
			html += `<tr data-id=${ID} data-change="false">`;
			// 判断是否应该先过滤掉common_station.id 所以长度减subColCount
			for(let j=0; j<CONTENTS.length; j++){
				// 获取是否禁用单元格所用的到的变量信息
				let [is_editable, cursor] = getForbiddenTdVarInfo(j);
				// 开始拼接单元格
				// 判断一下单元格有没有带有 <td
				if(String(CONTENTS[j]).indexOf('<td')==-1){
				// 如果没有 拼接的时候加上td
					html += `<td contenteditable=${is_editable} style="cursor: ${cursor}">${CONTENTS[j]}</td>`;
				}else{
				// 如果有 直接拼接
					html += CONTENTS[j];
				}
			}
			html += `</tr>`;
		}
		// 将拼接好的tbody代码片段添加其tbody元素中
		$tbody.html(html);

		// 添加搜索框
		function addSearchKuang(){
			let html = '';
			let $ths = $('#fields th');
			let $search = $('#search');
			for(let i=0; i<$ths.length+1; i++){
				html += `<th><input class="form-control"></th>`;
			}
			$search.html(html);

			// 绑定搜索功能
			$('#search th input').keyup(function(e){
				console.log('开始搜索');
			});
		}
		addSearchKuang();

		function formatIssueStation(issueRows){
			let $stations = $('tbody tr').find('td:nth-child(2)');
			for(let i=0; i<issueRows.length; i++){
				let issueStation = issueRows[i].CONTENTS[1];
				issueStation = issueStation.split(',');
				// 拆分站位名和站位id
				let stationName = '',
					stationId = '';
				for(let j=1; j<issueStation.length; j+=2){
					stationName += `<span contenteditable="false" class="station" data-stationid="${issueStation[j-1]}">${issueStation[j]}</span>`;
				}
				// 获取对应的行的station列
				$stations[i].innerHTML = stationName;
			}
		}
		// 处理issue数据
		if(table=='Open Action' || table=='Done Action'){
			let $trs = $('tbody tr');
			$trs.find('td:nth-child(2)').attr('contenteditable', false);
		}
		
		// 判断当前表格是否为QTx Issue List或者Fixed Issue
		if(table=='QTx Issue List' || table=='Fixed Issue'){
			// 如果是 
			// 格式化issue站位
			formatIssueStation(data.ROWS);
			// 获取tbody所有的tr 给每一行的第二个td都加上一个data-stationid属性
			let $trs = $('tbody tr');
			$trs.find('td:nth-child(3)').attr('contenteditable', false);
			// 遍历所有的行
			for(let i=0; i<$trs.length; i++){
				// 拿到当前行
				let currentLine = $trs[i];
				// 为ETA列添加date class属性
				$($(currentLine).children()[8]).addClass('date'+i).attr('data-riqi', 'riqi');
				// 绑定日期插件
				let sign = '.date'+i;
				// console.log(sign);
				jeDate(sign, {
			        minDate: '1990-01-01',
			        isinitVal: false,
			        format: 'YYYY-MM-DD',
			        onClose: false
				});
			}
			
			
			// 为ETA列绑定blur事件
			$('tbody tr').find('td:nth-child(9)').off('blur').blur(function(e){
				// 标记改动
				let $targetElement = getUsefulTriggerElement($(e.target));
				$targetElement.parent()[0].dataset.change = true;
			});
		}

		// 增加删除按钮
		function addDeleteBtn(){
			// 获取fields
			let $fs = $('#fields');
			$fs.html($fs.html()+`<th>operate</th>`);
			// 获取tr
			let $hangs = $('tbody tr');
			for(let i=0; i<$hangs.length; i++){
				$($hangs[i]).html($hangs[i].innerHTML+`<td><button type="button" class="btn btn-primary mr-3 mb-2" data-del="del">Delete</button></td>`);
			}
		}
		addDeleteBtn();

		// 可编辑单元格的keyup事件 必须放在ajax请求器请求数据之后
		keyUpEventOfEditableTd();

		// 点击实现增加新的一行数据 必须放在ajax请求器请求数据之后
		clickToAddNewRow();

		// 鼠标右键打开菜单 必须放在ajax请求器请求数据之后
		contextMenu($('tbody td'));

		// 加载站位信息 必须放在ajax请求器请求数据之后
		loadStationInfoOnStationTdFocus();

		// 注册删除一行事件
		delAHangData();

		// 绑定日期
		bindRiqi();
		function bindRiqi(){
			let $tds = $('tbody tr td[data-riqi=riqi]');
			for(let i=0; i<$tds.length; i++){
				// console.log($tds[i]);
				let sign = '.'+$tds[i].className;
				jeDate(sign, {
			        minDate: '1990-01-01',
			        isinitVal: false,
			        format: 'YYYY-MM-DD',
			        onClose: false
				});
			}

			// 为ETA列绑定blur事件
			$tds.off('blur').blur(function(e){
				// 标记改动
				let $targetElement = getUsefulTriggerElement($(e.target));
				$targetElement.parent()[0].dataset.change = true;
			});
		}
	});
}

// 将触发元素改其为父元素 也就是td元素
function getUsefulTriggerElement($triggerElement){
	// 如果触发元素不是TD 则将其改为其父元素 直到为TD元素为止
	while($triggerElement.get(0).tagName != 'TD'){
		$triggerElement = $triggerElement.parent();
	}
	// 返回触发元素
	return $triggerElement;
}


// 根据单元格获取对应的表头字段
function getFieldAccordingToTd($triggerElement){
	// 获取表头字段 获取单元格对应的下标 并返回相应的字段名
	return $('#fields').children().eq(getUsefulTriggerElement($triggerElement).index()).text();
}

// 前端映射到后台的字段和传递的内容
function getDBFieldAndContentAccordingToUIField($triggerElement){
	// 获取前端字段名
	let UIField = getFieldAccordingToTd($triggerElement);
	// 获取当前表名
	let table = $('.trigger').text();
	// 开始做映射
	if((table=='QTx Issue List' || table=='Fixed Issue') && UIField=='station'){
		// 返回站位字段名 和 单元格内的站位文本
		return ['stationID', $triggerElement.text()];
	}else{
		// 返回当前获取到的前端字段 和 整个单元格
		return [UIField, $triggerElement.prop('outerHTML')];
	}
} 

// ajax发送器
function ajaxSendDataToDB($triggerElement){
	// 单独获取需要向后台传递的数据
	let [field, content] = getDBFieldAndContentAccordingToUIField($triggerElement);
	let project    = getProject();
	let table      = $('.trigger').text();
	let id         = $triggerElement.parent().data('id');
	// 处理获取到到内容 处理单引号 和 双引号 防止数据库保存出错
	content = content.replace(/'/g, "\\'").replace(/"/g, '\\"');

	// 拼接向数据库发送的数据
	let data = `PROJECT=${project}&TABLE=${table}&ID=${id}&FIELD=${field}&CONTENT=${content}`;
	console.log(data);
	// ajax向后台发送数据
	ajax('/ajaxSendDataToDB/', 'txt', 'post', data).then(data=>{
		console.log(data);
		// 如果返回id 将id写入到data-id中
		if(Number(data)){
			$('[data-id=null]').data('id', data);
		}
	});
}

//为每个可编辑单元格绑定keyup事件 实时保存编辑的数据
function keyUpEventOfEditableTd(){
	// 获取具有contenteditable=true的元素
	let $contenteditableIsTrue = $('[contenteditable=true]');
	// 为此绑定keyup事件
	$contenteditableIsTrue.off('keyup').keyup(function(e){
		setChangeSign(e);
	});
}

// 标记改动
function setChangeSign(e){
	// 获取触发元素到td
	let trigger = e.target;
	while(trigger.nodeName != 'TD'){
		trigger = trigger.previousElementSibling;
	}
	// 获取到tr元素
	let tr = trigger.parentNode;
	// 将所在的行的data-change属性修改为true
	tr.dataset.change = true;
}

// 点击实现增加新的一行数据
function clickToAddNewRow(){
	// 获取id为add的元素
	let $add = $('#add');
	// 为其绑定点击事件
	$add.off('click').click(function(){
		// 获取表头字段的个数
		let count = $('#fields th').length;
		// 定义一个存放html代码片段的临时变量
		let html = `<tr data-id="">`;
		// 循环增加对应的单元格
		for(let i=0; i<count; i++){
			// 获取是否禁用单元格所用的到的变量信息
			let [is_editable, cursor] = getForbiddenTdVarInfo(i);
			// 开始拼接单元格
			if(i==count-1){
				// 增加删除按钮
				html += `<td><button type="button" class="btn btn-primary mr-3 mb-2" data-del="del">Delete</button></td>`;
			}else{
				html += `<td contenteditable=${is_editable} style="cursor: ${cursor}"></td>`;
			}
		}
		html += `</tr>`;
		// 追加到tbody的第一个元素位置上
		$('tbody').prepend(html);
		
		// 获取表名
		let table = $('.trigger').text();
		if(table=='Open Action' || table=='Done Action'){
			$('tbody tr').first().children().eq(1).attr('contenteditable', false);
		}
		if(table=='QTx Issue List' || table=='Fixed Issue'){
			// ETA列 绑定日期插件
			// 获取当前毫秒数
			let currentMilliSecond = Date.now();
			let DATEID = 'date-'+currentMilliSecond;
			// 获取新添加的一行元素中的ETA列设置当前的毫秒数作为id属性
			$('tbody tr').first().children().eq(8).attr('id', DATEID);
			$('tbody tr').first().children().eq(2).attr('contenteditable', false);
			// 获取新添加的一行元素中的ETA列绑定日期控件
			jeDate('#'+DATEID, {
		        minDate: '1990-01-01',
		        isinitVal: false,
		        format: 'YYYY-MM-DD',
		        onClose: false
		    });
		    // 为ETA列绑定blur事件
			$('tbody tr').find('td:nth-child(9)').off('blur').blur(function(e){
				// 标记改动
				let $targetElement = getUsefulTriggerElement($(e.target));
				$targetElement.parent()[0].dataset.change = true;
			});
		}

		// 为新增的一行添加 鼠标右键打开菜单 必须放在添加新的一行之后
		contextMenu($('[data-id=""] td'));

		// 可编辑单元格的keyup事件 必须放在添加新的一行之后
		keyUpEventOfEditableTd();

		// 加载站位信息 必须放在添加新的一行之后
		loadStationInfoOnStationTdFocus();

		// 注册删除一行事件
		delAHangData();
	});
}

// 删除数据
function delAHangData(){
	$('button[data-del=del]').off('click').click(function(e){
		if(confirm('Are you sure to delete this row ?')){
			let fuJieDian = e.target.parentNode.parentNode;
			if(fuJieDian.dataset.id){
				// 如果有id
				// 获取table名
				let table = $('.trigger').text();

				// 获取要删除的id
				let id = Number(fuJieDian.dataset.id);
				// 拼接删除的data
				let data = 	`id=${id}&table=${table}`;
				// 调用删除接口
				ajax('/ajaxDeleteDataFromDB/', 'txt', 'post', data).then(data=>{
				// console.log(data);
				});
				// console.log('删除成功');
			}
			$(fuJieDian).remove();
		}
	});
}

// 设置禁用可编辑单元格的编号
function getForbiddenEditableTdNums(){
	// 规定编号 并 返回
	return {
		FORBIDDEN_TABLE0: [6, 7],
		FORBIDDEN_TABLE2: [10, 11],
		FORBIDDEN_TABLE4: [5, 6],
		FORBIDDEN_TABLE5: [2, 3],
	}
}

// 设置禁用右键菜单的编号
function getForbiddenContextMenuNums(){
	// 规定编号 并 返回
	return {
		FORBIDDEN_TABLE0: [6, 7, 8],
		FORBIDDEN_TABLE2: [1, 8, 10, 11, 12],
		FORBIDDEN_TABLE4: [5, 6, 7],
		FORBIDDEN_TABLE5: [2, 3, 4],
	};
}

// 返回禁用编辑功能的单元格序号
function getForbiddenTdIndex(getForbiddenNums){
	// 获取被禁用编号
	let NUMS = getForbiddenNums();
	// 设置禁用编辑功能的单元格序号
	let FORBIDDEN_TABLE0 = NUMS.FORBIDDEN_TABLE0;
	let FORBIDDEN_TABLE1 = FORBIDDEN_TABLE0;
	let FORBIDDEN_TABLE2 = NUMS.FORBIDDEN_TABLE2;
	let FORBIDDEN_TABLE3 = FORBIDDEN_TABLE2;
	let FORBIDDEN_TABLE4 = NUMS.FORBIDDEN_TABLE4;
	let FORBIDDEN_TABLE5 = NUMS.FORBIDDEN_TABLE5;
	let FORBIDDEN_TABLES = [FORBIDDEN_TABLE0, FORBIDDEN_TABLE1, FORBIDDEN_TABLE2, FORBIDDEN_TABLE3, FORBIDDEN_TABLE4, FORBIDDEN_TABLE5];
	// 获取带有trigger属性的元素的下标
	let index = $('.trigger').index();
	// 返回对应的禁用序号所在的数组
	return FORBIDDEN_TABLES[index];
}

// 设置禁用右键菜单单元格名单
function can_openContextMenu($triggerElement){
	// 返回判断结果 如果不在禁用名单里 返回true
	return can = getForbiddenTdIndex(getForbiddenContextMenuNums).indexOf($triggerElement.index())==-1 ? true : false ;
}

// 设置相应的菜单的单击事件
function setMenusClickEvent(menuId, MENU_LISTS_FUNCTION, $triggerElement){
	// 设置相应的菜单的单击事件
	$(menuId).off('click').click(function(e){
		// 设置相应的菜单的功能
		MENU_LISTS_FUNCTION($(e.target), $triggerElement);
	}).off('mouseleave').mouseleave(function(){
		$(this).hide();
	});
}

// 鼠标右键打开菜单
function contextMenu($td){
	// 为单元格绑定右键事件
	$td.off('contextmenu').contextmenu(function(e){
		// 获取被选中文本在该单元格的html的偏移位置 和 被选中的文本内容 全部变量
		[GLOBAL_offset, GLOBAL_selectedText] = getOffsetOfSelectedTextInAllHtml();
		// 获取触发事件的元素
		let $triggerElement = $(e.target);
		// 设置菜单列表
		let MENU_LISTS = ['#action-status-menu', '#issue-category-menu', '#background-font-menu'];
		// 设置菜单列表对应的函数功能
		let MENU_LISTS_FUNCTIONS = [actionStatusAndIssueCategoryFunction, executeIssueCategoryMenuFunction, executeBackgroundFontMenuFunction];
		// 判断是否满足打开右键菜单的条件
		if(can_openContextMenu($triggerElement)){
		// 如果满足
			// 判断该单元格对应的表头字段
			let FIELD = getFieldAccordingToTd($triggerElement);
			// 设置索引值 默认打开background菜单、字体菜单和清除样式菜单
			let index = 2;
			// 根据表头字段 选择打开不同的右键菜单 因为Special Note也有个status字段
			if(FIELD=='status' && $('.trigger').text()!='Special Note'){
				// 打开action status菜单
				index = 0;
			}else if(FIELD=='category'){
				// 打开issue category菜单
				index = 1;
			}
			// 打开相应的右键菜单之前 先关闭已经打开的菜单
			$('[data-tag=menu]:not(.d-none)').addClass('d-none');
			// 打开右键菜单 移除隐藏样式
			$(MENU_LISTS[index]).removeClass('d-none').css({
				// 设置其显示位置
				'top' : e.pageY-10,
				'left': e.pageX-10,
				// 将其显示
				'display': 'block',
			});

			// 设置相应的菜单的单击事件
			setMenusClickEvent(MENU_LISTS[index], MENU_LISTS_FUNCTIONS[index], $triggerElement);
		}
	});
}

// 根据菜单中触发元素的索引值返回对应的背景色样式
function getBGStyleAccordingToTriggerElementIndex(index){
	// 返回背景色样式
	return ['bg-danger', 'bg-warning', 'bg-success'][index];
}

// action status菜单功能 和 issue category菜单功能 目前来说一样
function actionStatusAndIssueCategoryFunction($triggerElement, $targetElement){
	// 标记改动
	// console.log(getUsefulTriggerElement($targetElement));
	getUsefulTriggerElement($targetElement).parent()[0].dataset.change = true;
	// 获取触发元素的索引值
	let index = $triggerElement.index();
	// 定义背景色样式 默认为.bg-info
	let BGSTYLE = getBGStyleAccordingToTriggerElementIndex(2);
	// 判断触发元素的索引值 为目标元素设置对应的背景颜色样式
	if(index==0){
		BGSTYLE = getBGStyleAccordingToTriggerElementIndex(0);
	}else if(index==1){
		BGSTYLE = getBGStyleAccordingToTriggerElementIndex(1);
	}
	// 开始设置样式
	$targetElement.html($triggerElement.text()).removeClass().addClass(BGSTYLE);
	// console.log($targetElement);
}

// action status菜单功能
function executeActionStatusMenuFunction($triggerElement, $targetElement){
	actionStatusAndIssueCategoryFunction($triggerElement, $targetElement);
}

// issue category菜单功能
function executeIssueCategoryMenuFunction($triggerElement, $targetElement){
	actionStatusAndIssueCategoryFunction($triggerElement, $targetElement);
}

// background菜单、字体菜单和清除样式菜单功能
function executeBackgroundFontMenuFunction($triggerElement, $targetElement){
	// 标记改动
	getUsefulTriggerElement($targetElement).parent()[0].dataset.change = true;
	// 获取触发元素的索引值
	let index = $triggerElement.index();
	// 判断索引值
	if(index<3){
		// 设置背景色
		getUsefulTriggerElement($targetElement).removeClass().addClass(getBGStyleAccordingToTriggerElementIndex(index));
	}else if(index==3){
		// 清除所有样式功能
		// 清空背景色
		getUsefulTriggerElement($targetElement).removeClass();
		// 清空字体颜色样式
		clearFontStyle($targetElement);
	}else{
		// 清除字体颜色
		let $TD = getUsefulTriggerElement($targetElement);
		let $NODES = $TD.contents();
		// 遍历所有节点
		let text = '';
		for(let i=0; i<$NODES.length; i++){
			// console.log($NODES[i].nodeName);
			if($NODES[i].nodeName == '#text'){
				text += $($NODES[i]).text();
			}else if($NODES[i].nodeName == 'FONT'){
				text += $NODES[i].innerText;
			}else if($NODES[i].nodeName == 'BR'){
				text += '<br>';
			}
		}
		// 设置新的内容
		$TD.html(text);
	}
}

// 点击字体颜色按钮
$('#colors button').click(function(e){
	// 获取被选中的字体
	let sel = getSelection();
	if(sel.toString()){
		// 获取所在的单元格
		let $targetElement = getUsefulTriggerElement($(sel.baseNode));
		// 标记改动
		$targetElement.parent()[0].dataset.change = true;
	}

	// 改变字体颜色
	let color = $(e.target).css('backgroundColor');
	document.execCommand('foreColor', false, RGB2Hex(color));
});

// 清空字体颜色样式
function clearFontStyle($targetElement){
	// 获取要设置的单元格对象
	$targetElement = getUsefulTriggerElement($targetElement);
	// 获取当前单元格中所有的子节点
	let allChirldNodes = $targetElement.contents();
	// 定义存放html代码片段的临时变量
	let html = '';
	// 遍历所有的子节点
	for(let i=0; i<allChirldNodes.length; i++){
		// 获取当前的子节点
		let currentChildNode = allChirldNodes[i];
		// 判断当前子节点是否为SPAN
		if(currentChildNode.nodeName == 'SPAN'){
			// 如果是的话 获取其innerHTML
			html += currentChildNode.innerText;
		}else if(currentChildNode.nodeName == '#text'){
		// 否则节点为#text
			// 获取其文本内容
			html += $(currentChildNode).text();
		}else{
		// 否则节点为BR
			// 获取其outerHTML
			html += currentChildNode.outerHTML;
		}
	}
	// 最后将拼接好的字符串赋值给当前单元格的html
	$targetElement.html(html);
}

// 获取被选中文本在该单元格的html的偏移位置
function getOffsetOfSelectedTextInAllHtml(){
	// 获取选中的对象
	let selectedObj = getSelection();
	// 获取被选中的文本内容
	let selectedText = selectedObj.toString();
	// 获取当前节点
	let currentNode = selectedObj.baseNode;
	// 获取当前节点的偏移量
	let offset = selectedObj.baseOffset;
	// 判断当前节点有没有上一个兄弟节点
	while(currentNode.previousSibling){
		// 如果有上一个兄弟节点
		// 将当前节点指向上一个兄弟节点
		currentNode = currentNode.previousSibling;
		// 判断当前的节点名称 作出不同的处理
		if(currentNode.nodeName == '#text'){
			// 如果当前节点是文本节点
			// 偏移量加上当前节点的长度
			offset += currentNode.length;
		}else{
			// 如果当前节点是BR或者是SPAN
			offset += currentNode.outerHTML.length;
		}
	}
	// 返回最终计算后的偏移量 和 被选中的文本内容
	return [offset, selectedText];
}

// 点击保存按钮
$('#save').off('click').click(function(){
	// 获取当前的专案
	let project = getProject();
	// 获取table名
	let table = $('.trigger').text();
	// 获取当前要传递的表头数据
	let $titles = $('#fields th');
	let titles = [];
	// 遍历表头数据
	for(let i=0; i<$titles.length-2; i++){
		titles.push($($titles[i]).text());
	}
	// 如果是QTx Issue List和Fixed Issue表 需要将station替换为station_id
	if(table=='QTx Issue List' || table=='Fixed Issue'){
		titles = [titles[0]].concat(titles.slice(2));
		// console.log(titles);
	}
	// 获取到所有被改动的行
	let $trs = $('tr[data-change=true]');
	// 拼接向后台传递的数据
	// 定义要提交的多行和单行
	let rows = [];
	// 循环遍历被改动的多行
	for(let i=0; i<$trs.length; i++){
		// 定义一行到数据格式
		let row = {
			id: '',
			items: []
		};
		// 获取到当前行
		let $currentLine = $($trs[i]);
		// 获取一行id
		row['id'] = $currentLine.data('id');
		// 获取一行内所有的td元素
		let $tds = $currentLine.children();
		// 遍历一行内除过最后3个的td
		let items=[];
		for(let j=0; j<$tds.length-3; j++){
			// 处理获取到到内容 处理单引号 和 双引号 空格 防止数据库保存出错
			// .replace(/'/g, "\\'").replace(/"/g, '\\"')
			items.push($($tds[j]).prop('outerHTML').replace(/'/g, "\'").replace(/"/g, '\"').replace(/&nbsp;/g, ' ').replace(/;/g, '；'));
		}
		// 如果当前表名为QTx Issue List和Fixed Issue
		// 需要将station列对应的单元格的data-stationid属性值替换原先保存的td的html代码片段提交上去
		if(table=='QTx Issue List' || table=='Fixed Issue'){
			// station列
			// 获取一行中该station单元格
			let haiZis = $($tds[1]).children();
			let sts = []
			for(let i=0; i<haiZis.length; i++){
				sts.push(Number(haiZis[i].dataset.stationid));
			}
			items = [items[0]].concat(items.slice(2));
			items.push(sts);
			// ETA列
			items[7] = $tds[8].innerText;
			// console.log(items);
		}
		// 将一行中的td压入一行中
		row['items'] = items;
		// 将一行压入多行中
		rows.push(row);
	}
	// console.log(rows);
	// 定义要最终提交的数据
	let data = `table=${table}&rows=${JSON.stringify(rows)}&project=${project}&titles=${JSON.stringify(titles)}`;
	// console.log(data);
	// ajax向后台发送数据
	ajax('/ajaxSendDataToDB/', 'txt', 'post', data).then(data=>{
		// console.log(data);
		// 提交数据后 设置data-change属性为false
		// 再次请求当前表格
		// 执行ajax请求器
		ajaxGetDataFromDB(project, table);
	});
});

// 获取键码
$(window).keydown(function(event){
	// console.log(event.keyCode);
  	switch(event.keyCode) {
  		// Alt键
  		case 18: 
  			if(!valiKeyDel()){
				alert('请先选中要删除的记录');
				return;
			}
  			// 删除一行
  			deleteRow(document.activeElement);
  			break;
  	}
});

// 删除功能
function deleteRow(deleteElement){
	// 做一层判断 是否确定要删除当前行
	let isDelete = confirm('确定要删除此行记录吗');
	if(isDelete){
		// 删除当前行
		// 获取当前行
		// 获取获得焦点的元素
		if(deleteElement instanceof jQuery){
			deleteElement = deleteElement.get(0);
		}
		let focusElement = deleteElement;
		if(focusElement.nodeName == 'TD'){
			// 获取table名
			let table = $('.trigger').text();

			// 获取要删除的元素
			deleteElement = focusElement.parentNode;
			// 获取要删除的id
			let id = $(deleteElement).data('id');
			document.querySelector('tbody').removeChild(deleteElement);
			// console.log('删除成功');
			// 拼接删除的data
			let data = 	`id=${id}&table=${table}`;
			// 调用删除接口
			ajax('/ajaxDeleteDataFromDB/', 'txt', 'post', data).then(data=>{
			// console.log(data);
			});
		}
	}
}

// 注册点击删除按钮事件
$('#del').click(function(){
	// console.log(GLOBAL_LastElementTagName);
	if((GLOBAL_LastElementTagName.last.nodeName=='BUTTON' && GLOBAL_LastElementTagName.current.nodeName=='TD') || (GLOBAL_LastElementTagName.last.nodeName=='' && GLOBAL_LastElementTagName.current.nodeName=='TD')){
		// 删除一行
		// console.log(GLOBAL_LastElementTagName.current);
  		deleteRow(getUsefulTriggerElement($(GLOBAL_LastElementTagName.current)));
	}else{
		alert('请先选中要删除的记录');
		return;
	}
});

// 验证是否应该删除
function valiKeyDel(){
	// 判断是否选中了要删除的行
	return document.activeElement.nodeName=='TD';
}

// station单元格获取焦点时要执行的函数
function loadStationInfoOnStationTdFocus(){
	// 定义获取焦点事件
	$('tbody tr').find('td:nth-child(2)').off('focus').focus(function(e){
		// 获取触发元素
		let $triggerElement = getUsefulTriggerElement($(e.target));
		// 记录鼠标点击的坐标
		// console.log($triggerElement.offset().top, $triggerElement.offset().left);
		// 获取专案
		let project = getProject();
		// 获取表头
		let title = getFieldAccordingToTd($(e.target));
		// 如果表头是station字段
		if(title=='station'){
			// 加载站位信息
			// 拼接发送给后台的数据
			let data = `project=${project}`;
			// ajax请求站位信息
			ajax('/ajaxGetStationInfoFromDB/', 'json', 'post', data).then(data=>{
				// console.log(data);
				// 获取站位数组
				let stations = data;
				// 获取到站位菜单元素
				let $stationMenu = $('#station-menu');
				// 定义站位菜单的html代码片段
				let html = '';
				// 遍历该数组
				for(let i=0; i<stations.length; i++){
					// 拼接站位菜单
					html += `<li class="list-group-item list-group-item-secondary list-group-item-action" data-stationid="${stations[i][0]}">${stations[i][1]}</li>`;
				}
				// 将站位菜单html代码片段添加到站位菜单里
				// 打开菜单
				$stationMenu.html(html).removeClass('d-none').css({
					'top': $triggerElement.offset().top+50,
					'left': $triggerElement.offset().left,
					// 再一次获取焦点时显示站位菜单
					'display': 'block',
				}).off('click').click(function(e){
				// 设置点击功能
					// 将触发元素实例化为jQuery对象
					let $eTarget = $(e.target);
					let iStation = `<span contenteditable="false" class="station" data-stationid="${$eTarget.data('stationid')}">${$eTarget.text()}</span>`;
					// 将该单元格的内容设置为相应的站位
					// 获取原先的station
					let yuanStations = $triggerElement.html();
					if(!yuanStations.includes($eTarget.text())){
						$triggerElement.html(yuanStations+iStation);
					}
					
					// 并在该单元格添加data-stationId属性
					// 标记改动
					// 获取所在的单元格
					// 标记改动
					getUsefulTriggerElement($triggerElement).parent()[0].dataset.change = true;
				}).off('mouseleave').mouseleave(function(){
				// 鼠标离开便隐藏站位菜单
					// $(this).hide();
				});
			});
		}
	});
}

// 监听页面的敲击事件
function listenPageClickEvent(){
	$(document).click(function(e){
		// 获取触发事件的元素
		let $trigger = $(e.target);
		// 获取标签名
		let tagName = $trigger.get(0).tagName;
		// 记录点击元素的标签名
		GLOBAL_LastElementTagName['last'] = GLOBAL_LastElementTagName['current'];
		GLOBAL_LastElementTagName['current'] = e.target;
		// 如果标签名是TD
		if(((tagName=='TD' && $trigger.index()!=1) || tagName!='TD') && $trigger.parent().attr('id')!='station-menu'){
			$('#station-menu').hide();
		}
	});
}

// 滚动条监听
$(window).scroll(function(){
	let top = $(document).scrollTop();
	let $yanseTiao = $('#function-menu');
	let $dianti = $('#dianti i');
	function toTopJuLI(elem){
		let sum = 0;
		do{
            sum += elem.offsetTop;
            elem = elem.offsetParent;
        }while(elem);
        return sum;
	}
	if(top>=56){
		$yanseTiao.css({
			'position': '-webkit-sticky',
			'position': 'sticky',
			'zIndex': 999,
			'top': 0,
			'background': 'white',
		}).addClass('shadow');
	}else{
		$yanseTiao.removeClass('shadow');
	}

	if(top>=200){
		$dianti.removeClass('d-none');
	}else{
		$dianti.addClass('d-none');
	}
});

// 回到顶部
$('#dianti i').click(function(){
	window.scrollTo(0, 0);
});

// 左右移动菜单
$('#tubiao i').click(function(e){
	let $menu = $('#cebian');
	let $neiRong = $('#neiRong');
	if($menu.hasClass('d-none')){
		// 显示
		$menu.removeClass('d-none');
		$(this).removeClass('fa-angle-double-right');
		$neiRong.removeClass('col-12');
	}else{
		// 隐藏
		$menu.addClass('d-none');
		$(this).addClass('fa-angle-double-right');
		$neiRong.addClass('col-12');
	}
});

// 下载
$('#download').click(function(e){
	// 获取专案和表名
	let project = getProject();
	let table = $('.trigger').text();
	// 获取下载元素
	let $a = $(e.target);
	href = `/ajaxDownload/?project=${project}&table=${table}`;
	$a.attr('href', href);
});

// issue_tito.html页面加载完成时才能执行的代码
$(document).ready(function(){
	// 全部变量 记录上一次点击的元素的标签名
	GLOBAL_LastElementTagName = {
		last: '',
		current: '',
	};
	// issue_tito.html页面加载完成时 默认请求N104案子的Open Action表格
	ajaxGetDataFromDB();
	// 监听页面的敲击事件
	listenPageClickEvent();
});
