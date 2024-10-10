function initGlobalVar() {
	globalTable = null;
	globalTableInfo = null; // correct Table detail info.
	globalChangeInfo = {} // store a Table changeinfo 
	globalSelectGroup = null; // select list
	globalSelectGroupRemove = true;
	globalSelectTdList = []; //click td List
	globalClickTd = null;
	globalAddRowId = -1;
	globalUrlParams = '';
	globalProject = null;
}

function convertRemainderTime(timeDel) {
	var runTime = timeDel / 1000;
	var second = runTime % 60;
	runTime = (runTime - second) / 60;
	var minute = runTime % 60;
	runTime = (runTime - minute) / 60;
	return runTime + ':' + minute + ':' + second;
}

function creatChartByXrange(dataSeries, yAxis, title) {
	var chart = {
		type: 'xrange'
	};
	var title = {
		text: title,
		style: {
			fontWeight: 'bold',
			fontSize: "15px"
		},
	};
	var xAxis = {
		type: 'datetime',
		dateTimeLabelFormats: {
			week: '%Y/%m/%d',
			day:'%Y/%m/%d',
			hour: '%d %H',
			minute: '%d/%H:%M',
			second: '%H:%M:%S',
		}
	};
	var yAxis = {
		title: {
			text: ''
		},
		categories: yAxis,
		reversed: true
	};
	var tooltip = {
		dateTimeLabelFormats: {
			day: '%Y/%m/%d',
			hour: '%d %H',
			minute: '%d/%H:%M',
			second: '%Y/%m/%d %H:%M:%S',
		},
		// shared: true,
		// useHTML: true,
		pointFormat: '<b>{point.yCategory}</b>',
		// footerFormat: '<b>{point.y}</b>',
		valueDecimals: 2
	};
	var plotOptions = {
		xrange: {
			dataLabels: {
				enabled: true,
				// color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
				color: 'white',
				formatter: function () {
					console.log(this);
					return convertRemainderTime(this.x2 - this.x);
				},
				// style: {
				//     textShadow: '0 0 3px black'
				// }
			}
		}
	};
	var credits = {
		enabled: false
	};
	var series = dataSeries;

	var json = {};
	json.chart = chart;
	json.title = title;
	json.xAxis = xAxis;
	json.yAxis = yAxis;
	// json.legend = legend;
	json.tooltip = tooltip;
	json.plotOptions = plotOptions;
	json.credits = credits;
	// json.colors = colors;
	json.series = series;
	json.exporting = { 'fallbackToExportServer': false };
	Highcharts.setOptions({ global: { useUTC: false } });
	$('#container').highcharts(json);
}

function dealTitle(aList) {
	var res = [];
	for (var i = 1, l = aList.length; i < l; i++) {
		res.push([aList[i]['title'], aList[i]['field']])
	}
	console.log(JSON.stringify(res))
	return res
}

function getUrlParamsVariable(urlParamsStr, paramStr) {
	var vars = urlParamsStr.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == paramStr) {
			return pair[1];
		}
	}
	return (false);
}

function creatATable(TableInfo, tablePositionId, paras, url) {
	initGlobalVar();
	getAllDataFromUrl('/ST/getCommmonModelInfo/?target=mail', function (jsonData) {
		globalProject = jsonData[jsonData.length - 1];
	});
	globalUrlParams = paras || '';
	globalTableInfo = TableInfo;
	globalTable = $('#' + tablePositionId);
	initTable(url, globalTableInfo);
	globalTable.bootstrapTable('hideColumn', globalTableInfo['hiddenList']);
	$('.add').click(function () {
		globalSelectTdListVerify();
		updatePreTdvalue();
		globalTable.bootstrapTable('prepend', creatANewRow(initArowData()));
	});
	globalTable[0].style.border = 0;
}

function alignTdAndTh() {
	headerList = document.getElementsByTagName('th');
	for (var i = 0, l = headerList.length / 2; i < l; i++) {
		headerList[i + l].width = headerList[i].offsetWidth;
	}
}


function saveTable() {
	globalSelectTdListVerify();
	updatePreTdvalue();
	postAllData2Url(location.href + '?' + globalUrlParams, { 'update': JSON.stringify(globalChangeInfo) }, function () {
		globalChangeInfo = {};
		if (globalSelectGroup) {
			globalSelectGroup.remove();
		}
		globalTable.bootstrapTable('refresh');
	});

}

function getElementPosition(e, cycNum) {
	var cycNum = cycNum || 100;
	var x = 0, y = 0;
	while (cycNum > 0 && e != null) {
		x += e.offsetLeft;
		y += e.offsetTop;
		e = e.offsetParent;
		cycNum--;
	}
	return [x, y];
}

function rgb2HexString(rgbStr) {
	rgb = rgbStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	function hex(x) { return ("0" + parseInt(x).toString(16)).slice(-2); }
	return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function injectColor(color) {
	if (globalSelectGroup) {
		globalSelectGroup.remove();
	}
	globalSelectTdListVerify();
	updatePreTdvalue();
	if (globalClickTd && 'boolean' == typeof (globalClickTd['Verify'])) {
		if (window.getSelection().toString()) {
			document.execCommand('foreColor', false, color);
			globalSelectTdList.push(globalClickTd);
			globalSelectTdListVerify();
			updatePreTdvalue();
		} else {
			globalClickTd['value']['Style'] = Object.assign((globalClickTd['value']['Style'] || {}), { 'bg_color': color });
			// uploadglobalChangeInfo(globalClickTd, globalClickTd['value']);
			updateCellValue(globalClickTd, globalClickTd['value'], false, true);
		}
	} else {
		alert('Please click a cell');
	}
	globalClickTd = null;
}

function clearColor() {
	alignTdAndTh();
	if (globalSelectGroup) {
		globalSelectGroup.remove();
	}
	globalSelectTdListVerify();
	updatePreTdvalue();
	if (globalClickTd && 'boolean' == typeof (globalClickTd['Verify'])) {

		if ("Style" in globalClickTd['value']) {
			delete globalClickTd['value']['Style'];
			// uploadglobalChangeInfo(globalClickTd, globalClickTd['value']);
			updateCellValue(globalClickTd, globalClickTd['value'], false, true);
		}
	} else {
		// alert('Please click a cell');
	}
	globalClickTd = null;
}

function newline2Br(strTemp) {
	if ('string' == typeof (strTemp)) {
		// strTemp = strTemp.replace(/(\r\n)/g, '<br/>');
		strTemp = strTemp.replace(/(\n)/g, '<br/>');
		// strTemp = strTemp.replace(/(\r)/g, '<br/>');
	}
	return strTemp;
}

function getAllDataFromUrl(reqUrl, callFuc) {
	$.get(reqUrl, function (data, status) {
		if ('success' == status) {
			callFuc(JSON.parse(data));
		}
	});
}

function postAllData2Url(reqUrl, posData, callFuc) {
	$.post(reqUrl, posData, function (data, status) {
		if ('success' == status) {
			callFuc(data);
		}
	});
}

function uploadMultiValue2globalChangeInfoById(id, value, saveOldValue) {
	if (id in globalChangeInfo) {
		if (saveOldValue) {
			for (var aField in value) {
				globalChangeInfo[id][aField] = Object.assign((globalChangeInfo[id][aField] || {}), value[aField]);
			}
		} else {
			Object.assign(globalChangeInfo[id], value);
		}
	} else {
		globalChangeInfo[id] = value;
	}
}

function uploadglobalChangeInfo(tdElement, value, saveToDict) {
	var saveToDict = saveToDict || false;
	var l = {};
	l[tdElement['field']] = value
	uploadMultiValue2globalChangeInfoById(tdElement['id'], l, saveToDict);
	// if (id in globalChangeInfo) {
	// 	var temp = globalChangeInfo[id][tdElement['field']];
	// 	if (temp && saveToDict) {
	// 		globalChangeInfo[id][tdElement['field']] = Object.assign(temp, value);
	// 	} else {
	// 		globalChangeInfo[id][tdElement['field']] = value;
	// 	}
	// } else {
	// 	var l = {};
	// 	l[tdElement['field']] = value;
	// 	globalChangeInfo[id] = l;
	// }
	tdElement['Verify'] = false;
	console.log('change Info:', globalChangeInfo);

}

function updateCellContentByIndex(index, field, value, reinit) {
	globalTable.bootstrapTable('updateCell', { index: index, field: field, value: value, reinit: reinit });
}


function updateCellValue(tdElement, value, NotUpload, reinit) {
	console.log('updateCellValue', value);
	updateCellContentByIndex(tdElement['index'], tdElement['field'], value, reinit);
	if (NotUpload) return;
	uploadglobalChangeInfo(tdElement, value, false, true);

}

function updatePreTdvalue() {
	for (var i = 0, l = globalSelectTdList.length; i < l; i++) {
		var tdElement = globalSelectTdList[i];
		if (tdElement['Verify']) {
			updateCellValue(tdElement, tdElement['value']);
		}

	}
	globalSelectTdList = [];

}

function getCellValue(tdInfo) {
	var cellStyle = {};
	var resStyle = {}
	var divElement = tdInfo['element'].firstElementChild;
	var resList = parseDivNode2Style(divElement, false);
	console.log(resList);
	// if (tdInfo['element'].style.backgroundColor) {
	// 	cellStyle['bg_color'] = rgb2HexString(tdInfo['element'].style.backgroundColor);
	// }
	resStyle['Content'] = resList[0];
	if (!$.isEmptyObject(resList[1])) {
		cellStyle['fontstyle'] = resList[1];
		resStyle['Style'] = cellStyle;
	}
	// if (divElement.getAttribute('dataType')) {
	// 	resStyle['dataType'] = divElement.getAttribute('dataType');
	// }

	// if (!$.isEmptyObject(cellStyle)) {
	// 	resStyle['Style'] = cellStyle;
	// }
	return resStyle;

}

function checkClickTdIsChange() {
	if (globalClickTd) {
		var oldValue = globalClickTd['value']['Content'];
		var newValue = globalClickTd['element'].firstElementChild.innerText;
		var isChange = newValue != oldValue;
		if (isChange) {
			// console.log(newValue,newValue.length,oldValue,oldValue.length);
			var gTdListLen = globalSelectTdList.length;
			if (!gTdListLen || globalSelectTdList[gTdListLen - 1]['field'] != globalClickTd['field'] || globalSelectTdList[gTdListLen - 1]['index'] != globalClickTd['index']) {
				globalSelectTdList.push(globalClickTd);
			}
			globalTable.bootstrapTable('resetView')
		}
		return isChange;
	}
	return false;
}

//最后一个元素一定更新
function globalSelectTdListVerify() {
	var l = globalSelectTdList.length;
	for (var i = 0; i < l; i++) {
		var tdElement = globalSelectTdList[i];
		if (!tdElement['Verify'] || i == l - 1) {
			var resStyle = getCellValue(tdElement);
			tdElement['value']['Content'] = resStyle['Content'];
			if (resStyle['Style']) {
				tdElement['value']['Style'] = Object.assign((tdElement['value']['Style'] || {}), resStyle['Style']);
			}
			tdElement['Verify'] = true;
		}
	}
}

function creatAPopList(tableData, firstIndex) {
	var popTable = document.createElement('div');
	popTable.setAttribute('class', 'list-group selectTable');
	for (var i = 0, l = tableData.length; i < l; i++) {
		var tempCell = document.createElement('button');
		tempCell.type = 'button';
		tempCell.setAttribute('class', 'list-group-item list-group-item-action');
		if ('bgColor' == firstIndex) {
			tempCell.style.backgroundColor = tableData[i][0];
		} else {
			tempCell.setAttribute(firstIndex, tableData[i][0]);
		}
		tempCell.innerText = tableData[i][1];
		popTable.appendChild(tempCell);
	}
	return popTable;
}

function cellStyle(value, row, index) {
	value = value || {};
	if ('Style' in value) {
		styleInfo = value['Style'];
		if ('bg_color' in styleInfo) {
			return { css: { 'background': styleInfo['bg_color'] } };
		}
	}
	return {};
}

function applyStyle2Content(content, styleList) {
	console.log(content, styleList);
	var resStr = '';
	var staIndex = 0;
	for (var i = 0, l = styleList.length; i < l; i++) {
		var fontColor = styleList[i]['color'];
		var colorSta = styleList[i]['staIndex'];
		var colorLen = styleList[i]['lenth'];
		resStr += content.slice(staIndex, colorSta);
		var tempFont = document.createElement('font');
		tempFont.innerText = content.slice(colorSta, colorSta + colorLen);
		tempFont.color = fontColor;
		staIndex = colorSta + colorLen;
		resStr += tempFont.outerHTML;
	}
	resStr += content.slice(staIndex);
	console.log('applyStyle2Content:', resStr);
	return resStr;
}

function creatSapnGroup(spanDic, spe) {
	var spe = spe || ',';
	var resStr = '';
	for (var aSapnPK in spanDic) {
		var aSpan = document.createElement('span');
		aSpan.setAttribute('pk', aSapnPK);
		aSpan.contentEditable = false;
		aSpan.innerHTML = spanDic[aSapnPK];
		resStr += aSpan.outerHTML + spe;
	}
	if (resStr.endsWith(spe)) {
		resStr = resStr.slice(0, resStr.length - 1);
	}
	return resStr;
}

function columnFormatter(value, row, index) {
	// console.log('columnFormatter',value,index,row);
	value = value || {};
	var cellCommnet = document.createElement('div');
	var content = value['Content'];
	var editFlag = true;
	if ('dataType' in value) {
		cellCommnet.setAttribute('dataType', value['dataType']);
		content = creatSapnGroup(content);
		editFlag = false;

	} else if ('Style' in value) {
		styleInfo = value['Style'];
		if ('fontstyle' in styleInfo) {
			content = applyStyle2Content(content, styleInfo['fontstyle']);
		}

	}
	cellCommnet.contentEditable = editFlag;
	cellCommnet.innerHTML = newline2Br(content);
	return cellCommnet.outerHTML;
}

function columnVersionFormatter(value, row, index) {
	// console.log('columnFormatter',value,index,row);
	value = value || {};
	var cellCommnet = document.createElement('div');
	var content = value['Content'];
	var editFlag = false;
	content = creatSapnGroup(content, '<br/>');
	if ('Style' in value) {
		styleInfo = value['Style'];
		if ('fontstyle' in styleInfo) {
			content = applyStyle2Content(content, styleInfo['fontstyle']);
		}
	}
	cellCommnet.contentEditable = editFlag;
	cellCommnet.innerHTML = newline2Br(content);
	return cellCommnet.outerHTML;
}

function columnBoolFormatter(value, row, index) {
	var cellCommnet = document.createElement('div');
	var content = value['Content'];
	cellCommnet.setAttribute('BoolField', content);
	if (content) {
		cellCommnet.innerHTML = 'Yes';
	} else {
		cellCommnet.innerHTML = 'No';
	}
	return cellCommnet.outerHTML;
}

function operateFormatter(value, row, index) {
	return [
		'<a class="remove" href="javascript:void(0)" title="Remove"><i class="fa fa-trash"></i></a>',
	].join('')
}

function operateMailFormatter(value, row, index) {
	return ['<div>',
		'<a class="remove" href="javascript:void(0)" title="Remove"><i class="fa fa-trash"></i></a>',
		'<a id="ERSMail" class="send" href="javascript:void(0)" title="Mail"><i class="fas fa-envelope"></i></a>',
		'</div>'
	].join('')
}

function operateAuditFormatter(value, row, index) {
	return ['<div>',
		'<a class="remove" href="javascript:void(0)" title="Remove"><i class="fa fa-trash"></i></a><br/>',
		'<a class="draw" href="javascript:void(0)" title="DrawChart" ><i class="fas fa-chart-line"></i></a><br/>',
		'<a id="AuditMail" class="send" href="javascript:void(0)" title="Mail"><i class="fas fa-envelope"></i></a>',
		'</div>'
	].join('')
}

function dict2StrList(aDic, keySep, valueSep, splitFlag) {
	var keySep = keySep || ',';
	var valueSep = valueSep || ',';
	var keyStr = '';
	var valueStr = '';
	var splitFlag = splitFlag || false;
	for (var i in aDic) {
		keyStr += i + keySep;
		var tempVar = aDic[i];
		if (splitFlag)
		{
			tempVar = tempVar.split(' ')[0];
		}
		valueStr +=  tempVar + valueSep;
	}
	return [keyStr.slice(0, -1), valueStr.slice(0, -1)];
}

window.operateEvents = {
	'click .remove': function (e, value, row, index) {
		globalSelectTdListVerify();
		updatePreTdvalue();
		if (confirm('Are you sure to delete this row? The data can\'t resume')) {
			var idFiled = globalTableInfo['idField'];
			var rowId = row[idFiled];
			if (rowId['Content'] in globalChangeInfo) {
				delete globalChangeInfo[rowId['Content']];
				console.log('change Info:', globalChangeInfo);
			}
			if (rowId['Content'] > 0) {
				postAllData2Url(location.href + '?' + globalUrlParams, { 'delete': rowId['Content'] }, function () {
					console.log('Delete success!')

				});
			}
			globalTable.bootstrapTable('remove', {
				field: idFiled,
				values: [rowId]
			});

		}
	},
	'click .draw': function (e, value, row, index) {
		globalSelectTdListVerify();
		updatePreTdvalue();
		if(globalSelectGroup) globalSelectGroup.remove();
		var yAxis = [];
		var seriesData = [];
		var series = {};
		var tempData = {};
		var startTime = Date.parse(row.addTime.Content);
		var nowTime =(new Date()).getTime();
		nowTime = nowTime - nowTime % 1000;
		var replyList = row.replyInfo.Content;
		var tempReply;
		yAxis.push(Object.values(row.auditDRI.Content)[0]);
		tempData['x'] = startTime;
		tempData['x2'] = nowTime;
		tempData['y'] = 0;
		seriesData.push(tempData);
		for(var i = 0, l = replyList.length; i < l; i++)
		{
			tempReply = replyList[i];
			var replyTime = Date.parse(tempReply.addTime.Content);
			tempData['x2'] = replyTime;
			tempData = {'x' : replyTime, 'x2' : nowTime, 'y' : i + 1};
			yAxis.push(Object.values(tempReply.replyUser.Content)[0]);
			seriesData.push(tempData);
		}
		if("Close" == row.status.Content)
		{
			var closeTime = Date.parse(row.updateTime.Content);
			tempData.x2 = closeTime;
			tempData = {'x' : startTime, 'x2' : closeTime, 'y' : seriesData.length};
			seriesData.push(tempData);
			yAxis.push('Total Time');

		}

		series['data'] = seriesData;
		series.name = 'Time of Duration';
		var stationName = dict2StrList(row.station.Content, ';', ',');
		var title = "[Overlay Audit Question][" + globalProject[1] + "]ID." + row.id.Content + ' ' + (row.issueCategory.Content || '') + " for " + stationName[1] + ' ' +  (row.ERS.Content || "")

		// var targetTD = e.currentTarget;
		$('#drawChart')[0].innerHTML = '<div id="container" class = "selectTable" style="width: 500px; height: 400px; margin: 0 auto"></div>';
		creatChartByXrange([series], yAxis, title);
		globalSelectGroup =$('#drawChart')[0].firstElementChild;
		globalSelectGroup.style.top += 100 + 'px';
		globalSelectGroup.style.left += 250 + 'px'
		globalSelectGroupRemove = false;
		// $(targetTD).popover(
		// 	{
		// 		html: true,
		// 		title: '',
		// 		delay: { show: 500, hide: 1000 },
		// 		content: function () {
		// 			return '<div id="container" style="width: 1050px; height: 400px; margin: 0 auto"></div>';
		// 		}
		// 	});
		// $(targetTD).popover('show');
		// $(targetTD).on('shown.bs.popover', function () {
		// 	console.log('hiddeb');
				
		//   })

	},
	'click #ERSMail': function (e, value, row, index) {
		globalSelectTdListVerify();
		updatePreTdvalue();
		var mailDic = {};
		var mailCCUser = dict2StrList(row.mailCC.Content, ';', ',', true);
		mailDic['mailCC'] = mailCCUser[0];
		var mailToUser = dict2StrList(row.mailTo.Content, ';', ',', true);
		mailDic['mailTo'] = mailToUser[0];
		mailDic['mailSubject'] = row.title.Content;
		var radarNum = row.radar.Content;
		mailDic['mailBody'] = '\nHi ' + mailToUser[1] + ':\nSince new build is coming, could you help update the ' + mailDic['mailSubject'] + ' and upload to the radar: ' + radarNum + '? Thanks';
		sendMail(e.currentTarget, mailDic);
	},
	'click #AuditMail': function (e, value, row, index) {
		globalSelectTdListVerify();
		updatePreTdvalue();
		var mailDic = {};
		;
		var stationName = dict2StrList(row.station.Content, ';', ',');
		var auditContent = '[' + globalProject[1] + "]ID." + row.id.Content + ' ' + (row.issueCategory.Content || "") + " for " + stationName[1] + ' ' + (row.ERS.Content || "");
		var bodyContent = '的问题，还请帮忙确认，谢谢\n\n' + (row.issueDescription.Content || "");

		var replyInfo = row.replyInfo.Content;
		var l = replyInfo.length;
		if (l) {
			bodyContent = ',回复如下，谢谢\n\n'
			for (var i = l; i > 0; i--) {
				bodyContent += i + '. ' + creatReplyInfoAtARow(replyInfo[i - 1]) + '\n';
			}
		}
		mailDic['mailTo'] = globalProject[0];
		mailDic['mailSubject'] = "[Overlay Audit Question]" + auditContent;
		mailDic['mailBody'] = '\nHello Team:\n我们发现如下关于' + auditContent + bodyContent;
		sendMail(e.currentTarget, mailDic);
	}

}
function sendMail(mailElement, mailDic) {
	mailElement.href = "mailto:" + (mailDic['mailTo'] || " ") + "?cc=" + (mailDic['mailCC'] || " ") + "&subject=" + encodeURIComponent(mailDic['mailSubject']) + "&body=" + encodeURIComponent(mailDic['mailBody'] + "\n\n\nThis e-mail and its attachment may contain information that is confidential or privileged, and are solely for the use of the individual to whom this e-mail is addressed. If you are not the intended recipient or have received it accidentally, please immediately notify the sender by reply e-mail and destroy all copies of this email and its attachment. Please be advised that any unauthorized use, disclosure, distribution or copying of this email or its attachment is strictly prohibited.")
	// "\n\n本電子郵件及其附件可能含有機密或依法受特殊管制之資訊，僅供本電子郵件之受文者使用。台端如非本電子郵件之受文者或誤收本電子郵件，請立即回覆郵件通知寄件人，並銷毀本電子郵件之所有複本及附件。任何未經授權而使用、揭露、散佈或複製本電子郵件或其附件之行為，皆嚴格禁止");
	mailElement.click();
}

function creatANewRow(newData) {
	var newData = newData || {};
	var resRow = {};
	var columns = globalTableInfo['columns'];
	for (var i = 0, l = columns.length; i < l; i++) {
		var curField = columns[i]['field'];
		if ('operate' != curField) {
			resRow[curField] = newData[curField] || { 'Content': '' };
		}
		if (globalTableInfo['idField'] == curField) {
			globalChangeInfo[--globalAddRowId] = newData;
			resRow[curField]['Content'] = globalAddRowId;
		}
	}
	return [resRow];
}

//Node:domElement 不能包括font node。 
function parseFontNode2String(domElement) {
	var contentStr = '';
	if ('#text' == domElement.nodeName) {
		contentStr = domElement.nodeValue;
		contentStr = contentStr.replace(/(\n{2,})/g, '\n');
		if ('\n' == contentStr) {
			return '';
		}
		return contentStr;
	}
	if ('BR' == domElement.nodeName) {
		return '\n';
	}
	if ('DIV' == domElement.nodeName) {
		contentStr = contentStr + '\n';
	}
	if ('STYLE' == domElement.nodeName) {
		return contentStr;
	}
	var childNodes = domElement.childNodes;
	for (var i = 0, l = childNodes.length; i < l; i++) {
		contentStr = contentStr + parseFontNode2String(childNodes[i]);
	}
	contentStr = contentStr.replace(/(\n{2,})/g, '\n');
	// contentStr = contentStr.replace(/(\s{3,})/g, '  ');
	if ('\n' == contentStr) {
		contentStr = '';
	}
	return contentStr;
}

//Node:domElement 包括font node。 
function parseDivNode2Style(domElement, isNotTopElement) {
	var fontStyle = [];
	var contentStr = '';
	var childNodes = domElement.childNodes;
	if (isNotTopElement && 'DIV' == domElement.nodeName) {
		contentStr += '\n';
	}
	if (domElement.getAttribute('dataType')) {
		var allSpan = domElement.getElementsByTagName('span');
		resDic = {}
		for (var i = 0, l = allSpan.length; i < l; i++) {
			var aSpan = allSpan[i];
			resDic[aSpan.getAttribute('pk')] = aSpan.innerText;
		}
		return [resDic, fontStyle];
	}
	if (domElement.getAttribute('BoolField')) {
		contentStr = false;
		if ('Yes' == domElement.innerText) {
			contentStr = true;
		}
		return [contentStr, fontStyle];
	}
	for (var i = 0, l = childNodes.length; i < l; i++) {
		var tempNode = childNodes[i];
		if ('STYLE' == tempNode.nodeName) {
			continue;
		} else if ('FONT' == tempNode.nodeName) {
			var res = parseFontNode2String(tempNode);
			fontStyle.push({ 'color': tempNode.color, 'staIndex': contentStr.length, 'lenth': res.length })
			contentStr += res;
		} else if (1 == tempNode.nodeType && tempNode.getElementsByTagName('font').length) {
			{
				var comSty = parseDivNode2Style(tempNode, true);
				var comstrLen = contentStr.length;
				for (var j = 0, length = comSty[1].length; j < length; j++) {
					comSty[1][j]['staIndex'] += comstrLen;
				}
				contentStr += comSty[0];
				fontStyle = fontStyle.concat(comSty[1]);
			}

		} else {
			contentStr += parseFontNode2String(tempNode);
		}
	}
	return [contentStr, fontStyle];
}

function ClickCell(field, value, row, $element) {
	console.log('ClickCell:', $element);
	globalClickTd = null;
	if (globalSelectGroup && globalSelectGroupRemove) {
		globalSelectGroup.remove();
	}
	globalSelectGroupRemove = true;
	var tdInfo = {};
	tdInfo['element'] = $element[0];
	tdInfo['field'] = field;
	tdInfo['id'] = row[globalTableInfo['idField']]['Content'];
	tdInfo['index'] = $element[0].parentNode.getAttribute('data-index');
	tdInfo['value'] = value;
	tdInfo['row'] = row;
	tdInfo['Verify'] = false;
	var gTdListLen = globalSelectTdList.length;
	if (gTdListLen) {
		if (globalSelectTdList[gTdListLen - 1]['field'] == tdInfo['field'] && globalSelectTdList[gTdListLen - 1]['index'] == tdInfo['index']) {
			console.log('remove globalSelectTdList last element', globalSelectTdList.pop());
		}
	}
	if ('operate' == field) {
		return;
	}
	if (field in globalTableInfo['prohibitEdit']) {
		tdInfo['element'].firstElementChild.contentEditable = false;
		// alert(field + ' prohibit edit');
		globalSelectTdListVerify();
		updatePreTdvalue();
		return;
	}
	globalClickTd = tdInfo;
	if (field in globalTableInfo['SpecialFuncField']) {
		globalTableInfo['SpecialFuncField'][field](tdInfo);
	} else {
		tdInfo['element'].setAttribute('onmouseleave', 'checkClickTdIsChange()');
	}
}

function DblClickCell(field, value, row, $element) {
	console.log('dd', field, value);
	// var tdInfo = {};
	// tdInfo['element'] = $element[0];
	// tdInfo['field'] = field;
	// tdInfo['id'] = row[globalTableInfo['idField']]['Content'];
	// tdInfo['index'] = $element[0].parentNode.getAttribute('data-index');
	// tdInfo['Verify'] = false;
	// if('DbClickField' in globalTableInfo && field in globalTableInfo['DbClickField'])
	// {
	// 	globalTableInfo['DbClickField'][field](tdInfo);
	// }
}


function pageChange(number, size) {
	console.log(number, size);
	var l = globalSelectTdList.length;
	if (l) {
		globalSelectTdListVerify();
		updatePreTdvalue();
		alert('The Change isn\'t save, please save it!')
	}
}

function columnSwitch(field, checked) {
	$('.add').click(function () {
		globalSelectTdListVerify();
		updatePreTdvalue();
		globalTable.bootstrapTable('prepend', creatANewRow(initArowData()));
	});

}

function queryParams(params) {
	return globalUrlParams;
}

function initTable(dataurl, titles) {
	globalTable.bootstrapTable('destroy').bootstrapTable({
		toolbar: '#toolbar',
		url: dataurl,
		method: 'GET',
		idField: titles['idField'],
		queryParams: queryParams,
		height: "700",
		search: true,

		// showToggle: true,  //是否显示 切换试图（table/card）按钮
		showColumns: true,  //是否显示 内容列下拉框
		showPaginationSwitch: true,     //显示切换分页按钮
		showRefresh: true,      //显示刷新按钮
		// search: true,   //显示搜索框
		showFullscreen: true,
		showColumnsToggleAll: true,
		//详细页面
		// detailView: true,   //设置为 true，可以显示详细页面模式。
		// detailformatter: detailFormatter, //格式化详细页面模式的视图

		toolbar: '#function-menu',//工具栏
		toolbarAlign: 'left',//工具栏的位置

		// 分页
		filterControl: true,
		sidePagination: 'client', //设置在哪里进行分页，可选值为 ‘client’ 或者 ‘server’。设置 ‘server’时，必须设置服务器数据地址（url）或者重写ajax方法
		pagination: true, //设置为 true，会在表格底部显示分页条
		pageList: "[5, 10, All]", //如果设置了分页，设置可供选择的页面数据条数。设置为All 则显示所有记录。
		pageNumber: 1,  //如果设置了分页，首页页码
		pageSize: 10,             //如果设置了分页，页面数据条数
		paginationPreText: '上一页',  //指定分页条中上一页按钮的图标或文字
		paginationNextText: '下一页',  //指定分页条中下一页按钮的图标或文字

		// showExport:true,
		// // exportDataType: 'all',
		// exportTypes:['excel'],
		// fileName: 'tableExport',
		// exportOptions:{
		// 	ignoreColumn: [0,0],            //忽略某一列的索引
		// },

		columns: titles['columns'],
		onLoadError: function () {
			alert('数据加载失败！');
		},
		onDblClickCell: DblClickCell,
		onClickCell: ClickCell,
		onPageChange: pageChange,
		onColumnSwitch: columnSwitch,
		// onPostBody : alignTdAndTh,
		onScrollBody: alignTdAndTh,
		responseHandler: function (res) {
			return res;
		},
	});
}