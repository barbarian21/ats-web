// 获取表名
function getBiaoMing(){
	return ['Special Note', 'Open Action', 'QTx Issue List', 'ERS/DOC', 'TC Radar', 'Done Action', 'Fixed Issue'];
}


// 获取当前表名
function getCurrentTable(){
	return $('.trigger').text();
}


// 获取当前专案
function getCurrentProject(){
	// return 'N104';
	return $('#select-project').text();
}


// 获取表头元素
function getBiaoTouElement(){
	return $('#fields');
}


// 获取表的主体元素
function getBiaoZhuTi(){
	return $('table tbody');
}


// 获取站位菜单
function getStationMenuElement(){
	return $('#station-menu');
}


// 根据表名获取提交字段名
function huoQuSubmitFields(table){
	let field0 = [
		`content`, `status`, `author`
	];
	let field1 = [
		`radar`, `title`, `DRI`, `status`, `remark`,
		`functions`, `author` 
	];
	let field2 = [
		`category`, `failure_count`, `description`, `root_cause`, 
		`ETA`, `radar`, `DRI`, `functions`, `author`
	];
	let field3 = [
		`component`, `radar`, `title`, `cocoDRI`, `remark`, `author` 
	];
	let field4 = [
		`station`, `radar`, `title`, `version`, `author` 
	];
	let field5 = field1;
	let field6 = field2;
	let fields = [field0, field1, field2, field3, field4, field5, field6];
	// 关联表名和提交字段名
	let tables = getBiaoMing();
	let d = {};
	for(let i=0; i<tables.length; i++){
		d[tables[i]] = fields[i];
	}
	// 返回提交字段名
	return d[table];
}


// 验证页码
function valiPage(current){
	let isRight = false;
	if(Number(current)){
		current = Math.ceil(Math.abs(current));
		let total = parseInt($('#page [data-page=total]').data('total'));
		current = current>total ? total : current;
		isRight = true;
	}
	else
		current = $('#page [data-page=current]').text();
	return [isRight, current];
}


// 分页
function page(){
	let $page = $('#page');
	$page.on('click', '[data-attr=page]', function(e){
		if(!hasModify())
			loadData(this.dataset.tarpage);
		else{
			let msg = '当前有改动未保存，是否需要保存？';
			confirm(msg, e);
		}
	});
	$page.on('click', '[data-attr=jump]', function(){
		let [isRight, current] = valiPage($('#page input').val());
		if(isRight)
			loadData(current);
		else
			info('输入页码错误');
	});
}


// 绘制页码
function drawPage(data){
	let page = data.page;
	let prev = page.prev;
	let current = page.current;
	let next = page.next;
	let last = page.last;
	let total = page.total;
	$('#page [data-page=prev]')[0].dataset.tarpage = prev;
	$('#page [data-page=current]').html(current);
	$('#page [data-page=next]')[0].dataset.tarpage = next;
	$('#page [data-page=last]')[0].dataset.tarpage = last;
	$('#page [data-page=total]').html(`共${total}页`)[0].dataset.total = total;
}


// 获取当前科目
function getCurrentKeMu(){
	return $('#kemu span[data-selected=true]').text();
}


// 加载数据
function loadData(current){
	$.ajax({
		url: '/ajaxGetDataFromDB/',
		type: 'POST',
		data: {
			project: getCurrentProject(),
			station_category: getCurrentKeMu(),
			table: getCurrentTable(),
			current: current,
			sortBy: getSortMethod(),
		},
		dataType: 'json',
		success: function(data){
			// console.log(data);
			drawTable(data);
			drawPage(data);
		},
		error: function(XMLHttpRequest, textStatus){
			console.log(textStatus);
		}
	});
}


// 追加额外的表头
function appendExtraBiaoTou(){
	return ['Operate'];
}


// 追加额外的内容
function appendExtraContent(){
	return `<td><button type="button" class="btn btn-primary" data-delete="delete">Delete</button></td>`;
}


// 绘制表格
function drawTable(data){
	// 绘制表头
	let titles = data.FIELDS;
	titles.push(appendExtraBiaoTou()[0]);
	let $Tou = getBiaoTouElement();
	let html = '';
	for(let i=0; i<titles.length; i++){
		html += `<th>${titles[i]}</th>`;
	}
	$Tou.html(html);
	// 绘制表的内容
	let rows = data.ROWS;
	let $tbody = getBiaoZhuTi();
	html = '';
	for(let i=0; i<rows.length; i++){
		let row = rows[i];
		let id = row.ID;
		let contents = row.CONTENTS;
		html += `<tr data-id="${id}" data-change="false" data-age="old">`;
		for(let j=0; j<contents.length; j++){
			let item = contents[j];
			item = item==null ? '' : item;
			if(item.indexOf('<td ')==0 && item.indexOf('</td>')==item.length-'</td>'.length){
				html += item;
			}else{
				html += `<td>${item}</td>`
			}
		}
		// 拼接附加内容
		html += appendExtraContent();
		html += `</tr>`;
	}
	$tbody.html(html);
	// 返回顶部
	$('#dianti').click();
	// 处理issue表
	isIssueTable(getCurrentTable()) && chuLiIssueTable();
	// 先启用全部单元格的编辑功能，再部分禁用
	getTbodyAllTd().attr('contenteditable', true);
	setNoBianjiCol(getCurrentTable(), 'old');
	// 点击删除按钮
	deleteARow('old');
	// 右击事件
	YouJiEvent('old');
	// 键盘事件
	qiaoKeyEvent('old');
	// 加载站位
	stationLoad('old');
	// 加载显示列
	displayCol(titles);
	// 加载TC站位
	TCStation('old');
	// 日期控件
	dateKongJian('old');
	// 表格拖拽
	tuoZhuaiTable('old');
	// 清除复制格式
	clearPasteFormat('old');
	// 监听单元格改动
	listenTD('old');
	// 固定表头
	fixedBiaoTou();
}


// 加载显示列
function displayCol(titles){
	let $display = $('#display-col');
	let html = '<a class="dropdown-item" href="javascript:void(0);" data-func="display-all">Display All</a><a class="dropdown-item" href="javascript:void(0);" data-func="hide-all">Hide All</a><div role="separator" class="dropdown-divider"></div>';
	for(let title of titles){
		html += `<a class="dropdown-item" href="javascript:void(0);" data-func="display"><i class="fa fa-check"></i>${title}</a>`;
	}
	$display.html(html);
	// 为a标签绑定单击事件
	let $displayCol = $('[data-func=display]');
	$displayCol.click(function(e){
		let target = e.target;
		if(target.nodeName == 'A')
			target = target.firstElementChild;
		let $target = $(target);
		let i = titles.indexOf($target.parent().text());
		let $field = getMouYiTitle(i);
		let $col = getYiCol(i);
		$target.toggleClass('d-none');
		$field.toggleClass('d-none');
		$col.toggleClass('d-none');
	});
	// 为display-all绑定单击事件
	let $displayAll = $('[data-func=display-all]');
	$displayAll.click(function(){
		displayQuanBu();
	});
	// 为hide-all绑定单击事件
	let $hideAll = $('[data-func=hide-all]');
	$hideAll.click(function(){
		let $is = $('[data-func=display] i');
		let $ths = getTheadAllTh();
		let $tds = getTbodyAllTd();
		$is.addClass('d-none');
		$ths.addClass('d-none');
		$tds.addClass('d-none');
	});
}


// 显示全部
function displayQuanBu(){
	let $is = $('[data-func=display] i');
	let $ths = getTheadAllTh();
	let $tds = getTbodyAllTd();
	$is.removeClass('d-none');
	$ths.removeClass('d-none');
	$tds.removeClass('d-none');
}


// 获取thead中所有的th
function getTheadAllTh(){
	return $('thead th');
}


// 获取tbody中所有的td
function getTbodyAllTd(){
	return $('tbody td');
}


// 获取某一列
function getMouYiCol(sign, i){
	return $(`tbody tr[data-age=${sign}]`).find(`td:nth-child(${i+1})`);
}


// 获取改动的某一列
function getChangeMouYiCol(i){
	return $(`tbody tr[data-change=true]`).find(`td:nth-child(${i+1})`);
}


// 获取一列
function getYiCol(i){
	return $(`tbody tr`).find(`td:nth-child(${i+1})`);
}


// 获取某一个表头
function getMouYiTitle(i){
	return $(`thead tr#fields`).find(`th:nth-child(${i+1})`);
}


// 获取旧数据或者新数据的全部td
function getAllTdTongGuoAge(sign){
	return $(`tbody tr[data-age=${sign}] td`);
}


// 获取表头字段
function getTitleZiDuan(){
	let titles = getBiaoTouElement().children();
	let arr = [];
	for(let i=0; i<titles.length; i++){
		arr.push(titles[i].innerText);
	}
	return arr;
}


// 获取title对应的下标
function sign(title){
	return getTitleZiDuan().indexOf(title);
}


// 规定单元格的可编辑性
function guiDingCellKeBianJiXing(table){
	let biaoMing = getBiaoMing();
	let common = [
		sign('Update Time'), sign('Add Time'), sign('Author'), sign('Operate')
	]
	let table0 = [].concat(common);
	let table1 = [sign('Status')].concat(common);
	let table2 = [sign('Category')].concat(common);
	let table3 = [].concat(common);
	let table4 = [].concat(common);
	let table5 = table1;
	let table6 = table2;
	let tables = [table0, table1, table2, table3, table4, table5, table6];
	let d = {};
	for(let i=0; i<tables.length; i++){
		d[biaoMing[i]] = tables[i];
	}
	return d[table];
}


// 设置不能编辑的列
function setNoBianjiCol(table, sign){
	let cols = guiDingCellKeBianJiXing(table);
	for(let i=0; i<cols.length; i++){
		getMouYiCol(sign, cols[i]).attr('contenteditable', false);
	}
}


// 处理QTx Issue List和Fixed Issue的站位名
function chuLiStation(item){
	let arr = item.split(',');
	let html = '';
	for(let i=1; i<arr.length; i+=2){
		html += `<span contenteditable="false" data-stationid="${arr[i-1]}">${arr[i]}/</span>`;
	}
	return html;
}


// 判断当前表是不是QTx Issue List和Fixed Issue
function isIssueTable(table){
	return table=='QTx Issue List' ? true :
		   table=='Fixed Issue'    ? true : false;
}


// 判断当前表是不是Open Action和Done Action
function isActionTable(table){
	return table=='Open Action' ? true :
		   table=='Done Action' ? true : false;
}


// 验证Action表数据格式
function valiAction($trs){
	let isRight = true;
	for(let $tr of $trs){
		let $status = $($tr).children().eq(sign('Status'));
		if($status.text()==''){
			isRight = false;
			$status.css({
				'background': 'blue',
			});
		}
	}
	return isRight;
}


// 验证Issue表数据格式
function valiIssue($trs){

	function valiStation($station){
		let isRight = true;
		if($station.children().length==0)return false;
		let $children = $station.children();
		for(let child of $children){
			if(child.nodeName!='SAPN' && child.dataset.stationid==undefined){
				isRight = false;
				return isRight;
			}
		}
		return isRight;
	}

	let isRight = true;
	for(let $tr of $trs){
		let $category = $($tr).children().eq(sign('Category'));
		if($category.text()==''){
			isRight = false;
			$category.css({
				'background': 'blue',
			});
		}
		let $station = $($tr).children().eq(sign('Station'));
		if($station.text()=='' || !valiStation($station)){
			isRight = false;
			$station.css({
				'background': 'blue',
			});
		}
	}
	return isRight;
}


// 处理issue表
function chuLiIssueTable(){
	let $station = getMouYiCol('old', sign('Station'));
	for(let i=0; i<$station.length; i++){
		$station[i].innerHTML = chuLiStation($station[i].innerText);
		let $last = $($station[i]).children().last();
		$last.html($last.text().slice(0, -1));
	}
}


// 点击Add按钮
function add(){
	$('#add').click(function(){
		toTableTop($('#table'));
		displayQuanBu();
		let extra = 2;
		let count = getBiaoTouElement().children().length;
		let html = `<tr data-id="" data-change="false" data-age="new">`;
		for(let i=0; i<count-extra; i++){
			html += `<td contenteditable="true"></td>`;
		}
		html += `<td>${getAuthor()}</td>`;
		html += appendExtraContent();
		html += `</tr>`;
		$('tbody').prepend(html);
		// 禁用部分列的编辑功能
		setNoBianjiCol(getCurrentTable(), 'new');
		// 点击删除按钮
		deleteARow('new');
		// 右击事件
		YouJiEvent('new');
		// 键盘事件
		qiaoKeyEvent('new');
		// 加载站位
		stationLoad('new');
		// 加载TC站位
		TCStation('new');
		// 日期控件
		dateKongJian('new');
		// 表格拖拽
		tuoZhuaiTable('new');
		// 清除复制格式
		clearPasteFormat('new');
		// 监听单元格改动
		listenTD('new');
	});
}


// rgb转16进制
function RGB2Hex(color){
    // 如果是16进制颜色，直接返回
    if(color.indexOf('#')==0)
        return color;

    // 如果是rgb颜色
    if(color.indexOf('rgb')==0){
        let arr = color.split(',');
        let r = parseInt(arr[0].split('(')[1]);
        let g = parseInt(arr[1]);
        let b = parseInt(arr[2].split(')')[0]);
        let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }
}


// 点击全屏按钮
function quanPing(){
	$('#quan-ping').click(function(e){
		let $target = $(e.target);
		let $col2 = $('#col-2');
		let $col10 = $('#col-10');
		$target.toggleClass('fa-angle-double-right');
		if($target.hasClass('fa-angle-double-right')){
			$col2.hide();
			$col10.addClass('col-12');
		}else{
			$col2.show();
			$col10.removeClass('col-12');
		}
	});
}


// 点击字体颜色按钮
function fontColor(){
	$('#font-color button').click(function(e){
		let color = $(e.target).css('backgroundColor');
		document.execCommand('foreColor', false, RGB2Hex(color));
	});
}


// 点击删除按钮
function deleteARow(sign){
	$(`tr[data-age=${sign}] button[data-delete=delete]`).off('click').click(function(e){
		let msg = '确定要删除吗？'
		confirm(msg, e);
	});
}


// 删除一条记录
function delRecord(e){
	let deleteElement = e.target.parentNode.parentNode;
	$(deleteElement).remove();
	// 向后台发送id
	let id = deleteElement.dataset.id;
	if(id){
		$.ajax({
			url: '/ajaxDeleteDataFromDB/',
			type: 'POST',
			data: {
				table: getCurrentTable(),
				id: parseInt(id),
			},
			dataType: 'text',
			success: function(data){
				// console.log(data);
				info('删除成功');
			},
			error: function(XMLHttpRequest, textStatus){
				console.log(textStatus);
			}
		});
	}
}


// 点击保存按钮
function save(){
	$('#save').click(function(){
		// 获取有改动的tr
		let $trs = $('tbody tr[data-change=true]');
		if($trs.length){
			// 验证数据是否正确
			let table = getCurrentTable();
			let isRight = true;
			if(isActionTable(table))
				isRight = valiAction($trs);
			if(isIssueTable(table))
				isRight = valiIssue($trs);

			if(!isRight){
				info('保存失败<br>请检查被标蓝的单元格');
				return;
			}

			// 标记作者
			let $authors = getChangeMouYiCol(sign('Author'));
			let currentAuthor = getAuthor();
			$authors.text(currentAuthor);

			$.ajax({
				url: '/ajaxSendDataToDB/',
				type: 'POST',
				data: {
					data: JSON.stringify(formatSubmitData($trs))
				},
				dataType: 'text',
				success: function(data){
					// console.log(data);
					info('保存成功');
					loadData(getCurrentPage());
				},
				error: function(XMLHttpRequest, textStatus){
					// console.log(textStatus);
					info(`保存失败<br>失败原因：${textStatus}`);
				}
			});
		}else{
			info('当前没有改动');
		}
	});
}


// 获取当前页
function getCurrentPage(){
	return parseInt($('#page [data-page=current]').text());
}


// 保存成功提示信息
function info(txt){
	
	function hide(){
		$info.fadeOut('normal', 'linear');
	}

	let $info = $('#info');
	$info.html(txt).fadeIn('normal', 'linear', function(){
		setTimeout(hide, 1000);
	});
}


// 格式化提交数据
function formatSubmitData($trs){
	let t = getCurrentTable();
	let d = {
		project: getCurrentProject(),
		station_category: getCurrentKeMu(),
		table: t,
		titles: huoQuSubmitFields(t),
		rows: []
	};
	// 获取有改动的tr
	for(let i=0; i<$trs.length; i++){
		let tr = $trs[i];
		let id = tr.dataset.id;
		let $tds = $(tr).children();
		let items = [];
		for(let j=0; j<$tds.length; j++){
			// 1.方案
			// let nenRong = $tds[j].outerHTML;
			// 1.方案
			// items.push(nenRong);

			// 2.方案
			items.push(restructureTD($tds[j]));
		}
		let row = {
			id: id,
			items: items
		}
		d['rows'].push(row);
	}
	// 过滤掉不应该被提交的字段
	myFilter(t, d.rows, $trs);

	return d;
}


// 过滤掉不应该被提交的字段
function myFilter(t, rows, $trs){

	function tiaoJian(item){
		return item != null;
	}

	// 处理issue表
	function chuLiIssueStation(t, rows, $trs){
		if(isIssueTable(t)){
			let stationPos = sign('Station');
			let ETAPos1 = biaoZhi(t, 'ETA');
			let ETAPos2 = sign('ETA');
			for(let i=0; i<$trs.length; i++){
				let $tr = $($trs[i]);
				let stationIds = pinJieStationId($tr.children().eq(stationPos)[0]);
				let arr = rows[i]['items'];
				arr[ETAPos1]=$tr.children().eq(ETAPos2).text();
				arr.push(stationIds);
			}
		}
	}

	let arr = noSubmitFields(t);
	for(let i=0; i<$trs.length; i++){
		for(let j=0; j<arr.length; j++){
			rows[i]['items'][arr[j]] = null;
		}
		let nArr = [];
		nArr.push(rows[i].items.filter(tiaoJian));
		rows[i]['items'] = nArr[0];
	}
	// 处理issue表
	chuLiIssueStation(t, rows, $trs);
}


// 设置不能提交的字段
function noSubmitFields(t){
	let common = [
		sign('Update Time'), sign('Add Time'), sign('Operate')
	];
	let t0 = [].concat(common);
	let t1 = [].concat(common);
	let t2 = [sign('Station')].concat(common);
	let t3 = [].concat(common);
	let t4 = [].concat(common);
	let t5 = t1;
	let t6 = t2;
	let ts = [t0, t1, t2, t3, t4, t5, t6];
	// 关联表格和不能提交的字段
	let biaos = getBiaoMing();
	let d = {};
	for(let i=0; i<biaos.length; i++){
		d[biaos[i]] = ts[i];
	}
	return d[t];
}


// 获取提交字段某字段的位置
function biaoZhi(table, field){
	return huoQuSubmitFields(table).indexOf(field);
}


// 拼接issue站位的id
function pinJieStationId(td){
	let spans = $(td).children();
	let arr = [];
	for(let i=0; i<spans.length; i++){
		arr.push(parseInt(spans[i].dataset.stationid));
	}
	return arr;
}


// 点击下载按钮
function download(){
	$('#download').click(function(e){
		let total = $('#page [data-page=total]').data('total');
		let $target = $(e.target);
		let href = `/ajaxDownload/?project=${getCurrentProject()}&table=${getCurrentTable().replace(/\//g, '_')}&total=${total}&station_category=${getCurrentKeMu()}&sortBy=${getSortMethod()}`;
		$target.attr('href', href);
	});
}


// 设置不能打开右键菜单的列
function noOpenYouJianMenuCol(table){
	let common = [sign('Update Time'), sign('Add Time'), sign('Operate')];
	let t0 = [].concat(common);
	let t1 = [].concat(common);
	let t2 = [sign('Station'), sign('ETA')].concat(common);
	let t3 = [].concat(common);
	let t4 = [sign('Station')].concat(common);
	let t5 = t1;
	let t6 = t2;
	let ts = [t0, t1, t2, t3, t4, t5, t6];
	let tables = getBiaoMing();
	let d = {};
	for(let i=0; i<tables.length; i++){
		d[tables[i]] = ts[i];
	}
	return d[table];
}


// 注册右键事件
function YouJiEvent(sign){
	let $tds = getAllTdTongGuoAge(sign);
	$tds.off('contextmenu').contextmenu(function(e){
		let $td = getTd($(e.target));
		let index = $td.index();
		setYouJianMenu($td, index, e);
	});
	// 注销不能打开右键菜单的列
	let arr = noOpenYouJianMenuCol(getCurrentTable());
	for(let i=0; i<arr.length; i++){
		getMouYiCol(sign, arr[i]).off('contextmenu');
	}
}


// 设置右键菜单
function setYouJianMenu($td, index, e){
	let data_func = '';
	if(index == sign('Status'))
		data_func = 'status';
	else if(index == sign('Category'))
		data_func = 'category';
	else
		data_func = 'background';

	openMenu($td, data_func, e);
}


// 获取父级元素直到td
function getTd($target){
	while($target[0].nodeName != 'TD'){
		$target = $target.parent();
	}
	return $target;
}


// 设置当前行的change状态
function setCurrentTrChangeTrue($target){
	getTd($target).parent().get(0).dataset.change = true;
}


// 打开菜单
function openMenu($td, data_func, e){
	showMenu(data_func, e);
	menu($td, data_func);
}


// 显示菜单
function showMenu(data_func, e){
	$(`[data-menu=${data_func}]`).removeClass('d-none').css({
		'top': e.pageY-20,
		'left': e.pageX-20,
		'display': 'block'
	});
}


// 菜单
function menu($td, data_func){
	let $menu = $(`[data-func=${data_func}]`);
	$menu.off('click').click(function(e){
		let bg = e.target.dataset.bg;
		data_func == 'background' && $td.css('background', bg);
		data_func != 'background' && $td.html(e.target.dataset.val).css('background', bg);
		setCurrentTrChangeTrue($td);
	});

	$(`[data-menu=${data_func}]`).off('mouseleave').mouseleave(function(){
		$(this).hide();
	});
}


// 敲击键盘事件
function qiaoKeyEvent(sign){
	let $edit = getKeBianJiCell(sign);
	$edit.off('keyup').keyup(function(e){
		// setCurrentTrChangeTrue($(e.target));
	});
}


// 获取可编辑单元格
function getKeBianJiCell(sign){
	return $(`tbody tr[data-age=${sign}] td[contenteditable=true]`);
}


// 请求站位
function getStation(e){
	$.ajax({
		url: '/ajaxGetStationInfoFromDB/',
		type: 'POST',
		data: {
			project: getCurrentProject(),
		},
		dataType: 'json',
		success: function(data){
			// console.log(data);
			isIssueTable(getCurrentTable()) && drawStation(data, e);
			isTCRadarTable(getCurrentTable()) && drawTCStation(data, e);
		},
		error: function(XMLHttpRequest, textStatus){
			console.log(textStatus);
		}
	});
}


// station站位
function stationLoad(age){
	if(isIssueTable(getCurrentTable())){
		let $tds = getMouYiCol(age, sign('Station'));
		$tds.off('contextmenu').contextmenu(function(e){
			getStation(e);
		});
	}
}


// 拼接站位html代码片段
function pinJieStationHtml(data){
	let stationInfos = data;
	let html = '';
	for(let i=0; i<stationInfos.length; i++){
		let stationInfo = stationInfos[i];
		html += `<li class="list-group-item list-group-item-secondary list-group-item-action" data-stationid="${stationInfo[0]}" data-func="station">${stationInfo[1]}</li>`;
	}
	return html;
}


// 绘制站位
function drawStation(data, e){
	let $stationMenu = getStationMenuElement();
	$stationMenu.html(pinJieStationHtml(data));
	// 站位菜单打开
	openStationMenu($stationMenu, e);
}


// 隐藏站位菜单
function hideStationMenu($stationMenu){
	$stationMenu.off('mouseleave').mouseleave(function(){
		$(this).hide();
	});
}


// 站位菜单打开
function openStationMenu($stationMenu, e){
	let $td = getTd($(e.target));
	showMenu('stations', e);
	let $stations = $('li[data-func=station]');
	$stations.off('click').click(function(e){
		let $station = $(e.target);
		let stationId = $station.data('stationid');
		let stationName = $station.text();

		let allStations = $td.html();
		if(!allStations.includes(stationName)){
			setCurrentTrChangeTrue($td);
			let aStation = `<span contenteditable="false" data-stationid="${stationId}"> ${stationName} </span>`;
			$td.html(allStations+aStation);
		}
	});
	hideStationMenu($stationMenu);
}


// 获取单元格背景
function background(parent){
	let background = RGB2Hex($(parent).css('background'));
	return background=='#000000' ? 'transparent' : background;
}


// 格式化单元格内容
function content(parent){

	// 获取某个节点下所有的子节点
	function getAllChildNodes(parent){
		
		function getNode(parent){
			for(let node of parent.childNodes)
				if(node.hasChildNodes())
					getNode(node);
				else
					nodes.push(node);
		}

		let nodes = [];
		getNode(parent);

		return nodes;
	}


	// 格式化子节点
	function formatChildNodes(nodes){
		let format = [];

		for(let node of nodes)
			if((node.nodeName!='BR')&&(node.parentNode.nodeName=='FONT'))
				format.push({font_color: RGB2Hex(getComputedStyle(node.parentNode).color)}, node.textContent);
			else if(node.nodeName=='BR')
				format.push({font_color: RGB2Hex(getComputedStyle(node.parentNode).color)}, '\n');
			else
				format.push({font_color: RGB2Hex(getComputedStyle(parent).color)}, node.textContent);

		return format;
	}


	return formatChildNodes(getAllChildNodes(parent));	
}


// 格式化td
function formatTD(td){
	return {
		background: background(td),
		content: content(td),
	};
}


// 过滤存入数据库的td
function filterTD(td){
	let background = td.background;
	let content = td.content;
	let html = `<td style="background: ${background}">`;
	for(let i=0; i<content.length; i+=2){
		let color = content[i].font_color;
		let text = content[i+1];
		if(text=='\n')
			html += `<br>`;
		else if(isRightColor(color))
			html +=	`<font color="${color}">${text}</font>`;
		else
			html += text;
	}
	html += `</td>`;
	// html = againFilter(html);
	return html;
}


// 判断字体颜色是不是在规定的字体颜色内
function isRightColor(color){
	let colors = ['#000000', '#ff0000', '#0000ff'];
	return colors.indexOf(color)==-1 ? false : true;
}


// 重构td的html
function restructureTD(td){
	return filterTD(formatTD(td));
}


// 过滤复制后的格式
function againFilter(html){
	let n1 = 'p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 10.0px Arial; color: #000000; -webkit-text-stroke: #000000}';
	let n2 = 'span.s1 {font-kerning: none}';

	let pos1 = html.indexOf(n1);
	if(pos1 != -1)
		html = html.slice(0, pos1) + 
			   html.slice(pos1+n1.length);
	let pos2 = html.indexOf(n2);
	if(pos2 != -1)
		html = html.slice(0, pos2) + 
		       html.slice(pos2+n2.length);
	
	return html;
}


// 直达表格顶部
function toTableTop($table){
	$table.scrollTop(0);
	$table.scrollLeft(0);
}


// 电梯
function dianTi(){
	let $table = $('#table');
	let $dianTi = $('#dianti');
	$table.scroll(function(){
		let scrollTop = $(this).scrollTop();
		if(scrollTop>=200)
			$dianTi.show();
		else
			$dianTi.hide();
	});
	$dianTi.click(function(){
		toTableTop($table);
	});
}


// 固定表头
function fixedBiaoTou(){
	let $table = $('#table');
	let $ths = $('#fields th');
	$table.scroll(function(){
		let scrollTop = $(this).scrollTop();
		if(scrollTop > 0)
			$ths.css('top', scrollTop-1);
		else
			$ths.css('top', 0);
	});
}


// 判断是不是TC Radar表
function isTCRadarTable(table){
	return table=='TC Radar' ? true : false;
}


// TC Radar站位
function TCStation(age){
	if(isTCRadarTable(getCurrentTable())){
		let $stations = getMouYiCol(age, sign('Station'));
		$stations.off('contextmenu').contextmenu(function(e){
			getStation(e);
		});
	}
}


// 绘制TC站位
function drawTCStation(data, e){
	let $stationMenu = getStationMenuElement();
	let html = `<li class="list-group-item list-group-item-secondary list-group-item-action" data-stationid="0" data-func="station">All QT/SA Staions</li>`+pinJieStationHtml(data)
	$stationMenu.html(html);
	// 设置站位菜单
	setTCStationMenu($stationMenu, e);
}


// 设置站位菜单
function setTCStationMenu($stationMenu, e){
	showMenu('stations', e);
	let $td = getTd($(e.target));
	let $stations = $('li[data-func=station]');
	$stations.off('click').click(function(e){
		setCurrentTrChangeTrue($td);
		$td.html(e.target.innerText);
	});
	hideStationMenu($stationMenu);
}


// 绑定日期控件
function dateKongJian(age){
	if(isIssueTable(getCurrentTable())){
		let $ETAs = getMouYiCol(age, sign('ETA'));
		for(let ETA of $ETAs){
			let parentId = ETA.parentNode.dataset.id;
			let haoMiao = Date.now();
			let sign = 'time-'+parentId+'-'+haoMiao;
			ETA.setAttribute('id', sign);
			jeDate('#'+sign, {
		        minDate: '1990-01-01',
		        isinitVal: false,
		        format: 'YYYY-MM-DD',
		        onClose: false
			});
		}
	}
}


// 表格拖拽
function tuoZhuaiTable(age){

	// 调整宽度和高度
	// event.offsetX：鼠标在单元格内的偏移量
	// self.offsetWidth：单元格宽度
	// event.x：距离屏幕左边的距离
	function resize($elems){
		const MIN = 15;
		let self;
		$elems.off('mousedown').mousedown(function(){
			self = this;
			if(self.offsetWidth-event.offsetX < MIN){
				self.mouseDown = true;
	            self.oldX = event.x;
	            self.oldWidth = self.offsetWidth;
			}

			// if(self.offsetHeight-event.offsetY < MIN){
			// 	self.mouseDown = true;
	        //     self.oldY = event.y;
	        //     self.oldHeight = self.offsetHeight;
			// }
		}).off('mousemove').mousemove(function(e){
			e.preventDefault();
			if((this.offsetWidth-event.offsetX < MIN) && !(this.offsetHeight-event.offsetY < MIN))
	            this.style.cursor = 'col-resize';
	        // else if((this.offsetHeight-event.offsetY < MIN) && !(this.offsetWidth-event.offsetX < MIN))
	        // 	this.style.cursor = 'row-resize';
	        // else if((this.offsetWidth-event.offsetX < MIN) && (this.offsetHeight-event.offsetY < MIN))
	        // 	this.style.cursor = 'nwse-resize';
	        else
	            this.style.cursor = 'text';
			
			if(self == undefined)
				self = this;
			
			if(self.mouseDown!=null && self.mouseDown==true){
	            if((self.oldWidth+(event.x-self.oldX)>0) && (self.style.cursor=='col-resize'))
	                self.style.width = self.oldWidth+(event.x-self.oldX)+'px';
				
	            // if((self.oldHeight+(event.y-self.oldY)>0) && (self.style.cursor=='row-resize'))
	            //     self.style.height = self.oldHeight+(event.y-self.oldY)+'px';

	            // if((self.oldWidth+(event.x-self.oldX)>0) && (self.oldHeight+(event.y-self.oldY)>0) && (self.style.cursor=='nwse-resize')){
	            // 	self.style.width = self.oldWidth+(event.x-self.oldX)+'px';
	            //     self.style.height = self.oldHeight+(event.y-self.oldY)+'px';
	            // }
	        }
		}).off('mouseup').mouseup(function(){
			if(self == undefined){
				self = this;
			}
			self.mouseDown = false;
	        self.style.cursor = 'text';
		});
	}


	let $ths = $(`table thead tr th`);
	// let $tds = $(`table tbody tr[data-age=${age}] td`);
	resize($ths);
	// resize($tds);
}


// 获取author
function getAuthor(){
	return $('#navbardrop_Tools').text().trim();
}


// 粘贴时清除格式
function clearPasteFormat(sign){
	let $tds = getKeBianJiCell(sign);
	$tds.off('paste').on('paste', function(e){
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		let text = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text/plain');
		document.execCommand('insertText', false, text);
	});
}


// 判断是否有改动
function hasModify(){
	let $trs = $('tbody tr[data-change=true]');
	return $trs.length == 0 ? false : true;
}


// td元素变化回调
function TDcallback(mutationList){
	mutationList.forEach(function(item, index){
		switch(item.type){
			case 'childList':
			case 'subtree':
			case 'characterData':
				// console.log(item.target);
				setCurrentTrChangeTrue($(item.target));
				break;
		}
	});
}


// 监测td元素变化
function listenDOM(td){
	let observer = new MutationObserver(TDcallback);
	let config = {
		childList: true,
		subtree: true,
		characterData: true,
	};
	observer.observe(td, config);
}


// 获取可编辑单元格
function getEditTD(age){
	return $(`tbody tr[data-age=${age}] td[contenteditable=true]`);
}


// 监听可编辑单元格内容改动
function listenTD(age){
	$tds = getEditTD(age);
	for(let td of $tds){
		listenDOM(td);
	}
}


// 切换科目
function toggleKeMu(){
	$('#kemu').on('click', 'span', function(){
		this.dataset.selected = true;
		$(this).remove('active').addClass('active').siblings('[data-selected=true]').removeClass('active').each(function(index, item){
			item.dataset.selected = false;
		});
		loadData(1);
	});
}


// confirm
function confirm(msg, e=''){
	$confirm = $('#confirm');
	$confirm.html(msg);
	$confirm.dialog({
		resizable: false,
		height: 'auto',
		width: 400,
		modal: true,
		draggable: false,
		buttons: {
			'确定': function(){
				$(this).dialog('close');
				if(e.target.innerText == 'Delete')
					delRecord(e);
				else
					$('#save').click();
			},
			'取消': function(){
				$(this).dialog('close');
				if(e.target.innerText != 'Delete')
					loadData(e.target.dataset.tarpage);
			}
		}
	});
}


// 搜索
function search(){
	$('#search').click(function(){
		let table = getCurrentTable();
		let txt = $('#search-content').val();
		if(txt != '' && table != 'Special Note')
			$.ajax({
				url: '/ajaxSearch/',
				type: 'POST',
				data: {
					project: getCurrentProject(),
					station_category: getCurrentKeMu(),
					table: getCurrentTable(),
					radar: txt,
				},
				dataType: 'json',
				success: function(data){
					rows = data.ROWS;
					if(rows.length)
						drawTable(data);
					else
						info('没有找到对应的数据');
				},
				error: function(XMLHttpRequest, textStatus){
					console.log(textStatus);
				}
			});
	});
}


// 排序
function sort(){
	$('#sort button:not(:first) i').hide();
	$('#sort').on('click', 'button', function(e){
		let $button = $(e.target);
		$button.children('i').show();
		$button.siblings().children('i').hide();
		let sortBy = e.target.dataset.sort;
		$.ajax({
			url: '/ajaxGetDataFromDB/',
			type: 'POST',
			data: {
				project: getCurrentProject(),
				station_category: getCurrentKeMu(),
				table: getCurrentTable(),
				current: getCurrentPage(),
				sortBy: sortBy,
			},
			dataType: 'json',
			success: function(data){
				// console.log(data);
				drawTable(data);
				drawPage(data);
			},
			error: function(XMLHttpRequest, textStatus){
				console.log(textStatus);
			}
		});
	});
}


// 获取排序方法
function getSortMethod(){
	let $is = $('#sort button i');
	for(let i of $is)
		if($(i).css('display') != 'none')
			return i.parentNode.dataset.sort;
}
