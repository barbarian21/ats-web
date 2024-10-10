var statusCategory = [['#ff0000', 'Open'], ['#ffff00', 'Ongoing'], ['#90EE90', 'Keep Monitor'], ['#008000', 'Close']];
var issueCategory = [['#ffffff', 'Command Issue'], ['#ffffff', 'Limit Issue'], ['#ffffff', 'Item Loss'], ['#ffffff', 'Logic Issue']
	, ['#ffffff', 'RegEx Issue'], ['#ffffff', 'Unit Issue'], ['#ffffff', 'Value Issue']];


function sidebarHref(e) {
	if (globalTable) {
		globalSelectTdListVerify();
		updatePreTdvalue();
		if (!$.isEmptyObject(globalChangeInfo)) {
			if (!confirm('Are you sure to discard currrn change, click Yes will discard!')) {
				return;
			}
		}
	}
	location.href = e.value || '';

}

function creatReplyInfo(aReply, edit) {
	var replyNode = $('#replyAudit')[0].cloneNode(true);
	var replyUser = replyNode.getElementsByClassName('replyUser')[0];
	var replyDate = replyNode.getElementsByClassName('replyDate')[0];
	var replyInfo = replyNode.getElementsByClassName('replyInfo')[0];
	replyUser.style.borderBottom = "dotted 1px"
	replyDate.style.borderBottom = "dotted 1px"
	replyInfo.style.borderBottom = "solid 1px"

	replyNode.setAttribute('pk', aReply['id']['Content']);
	replyNode.contentEditable = false;
	if ('replyUser' in aReply) {
		for (var aUser in aReply['replyUser']['Content']) {
			replyUser.setAttribute('pk', aUser);
			replyUser.innerText = aReply['replyUser']['Content'][aUser];
		}
	}
	if ('addTime' in aReply) replyDate.innerText = aReply['addTime']['Content'];
	replyInfo.innerHTML = newline2Br(aReply['replyMessage']['Content']);
	replyInfo.contentEditable = edit || false;

	return replyNode;
}

// function columnAuditReplyUserFormatter(value, row, index) {
// 	var cellCommnet = document.createElement('div');
// 	var replyInfoList = value['Content'];
// 	var l = replyInfoList.length
// 	for (var i = 0; i < l; i++) 
// 	{
// 		cellCommnet.appendChild(creatReplyInfo(replyInfoList[i]));
// 	}
// 	if(l) cellCommnet.lastChild.style.color = "#007bff";
// 	cellCommnet.contentEditable = false;
// 	return cellCommnet.outerHTML;
// }
function deleteStrEndChar(rawStr, tempChar) {
	for (i = rawStr.length - 1; i >= 0; i--) {
		if (rawStr[i] != tempChar) {
			rawStr = rawStr.substring(0, i + 1);
			break;
		}
	}
	return rawStr;
}

function creatReplyInfoAtARow(aReply) {
	var reStr = '[';
	if ('replyUser' in aReply) {
		for (var aUser in aReply['replyUser']['Content']) {
			reStr += aReply['replyUser']['Content'][aUser];
		}
	}
	if ('addTime' in aReply) reStr += ' ' + aReply['addTime']['Content'].substr(5, 5);
	reStr += '] ' + deleteStrEndChar(aReply['replyMessage']['Content'], '\n');
	return reStr;

}

function columnAuditReplyUserFormatter(value, row, index) {
	var cellCommnet = document.createElement('div');
	var replyInfoList = value['Content'];
	var l = replyInfoList.length
	for (var i = l; i > 0; i--) {
		var tempSpan = document.createElement('span');
		tempSpan.innerHTML = i + '. ' + newline2Br(creatReplyInfoAtARow(replyInfoList[i - 1])) + '<br/>';
		if (l - i > 2) {
			tempSpan.hidden = true;
		}
		cellCommnet.appendChild(tempSpan);
	}
	if (l) {
		cellCommnet.firstChild.style.color = "#007bff";
	}
	cellCommnet.contentEditable = false;
	return cellCommnet.outerHTML;
}


function initArowData() {
	return {};
}

function defineForeign(tdInfo, tdUrl) {
	tdInfo['element'].firstElementChild.contentEditable = false;
	getAllDataFromUrl(tdUrl, function (jsonData) {
		defineSelectGroup(tdInfo, jsonData, 'ForeignKey');
	});
}

function auditStationVersion(stationTdInfo, tdUrl, firstIndex) {
	var stationVerTdInfo = Object.assign({}, stationTdInfo);
	stationVerTdInfo['element'] = stationTdInfo['element'].nextElementSibling;
	stationVerTdInfo['field'] = 'version';
	stationVerTdInfo['value'] = stationTdInfo['row'][stationVerTdInfo['field']];
	var topTemp = globalSelectGroup.style.top;
	var leftTemp = globalSelectGroup.style.left;
	getAllDataFromUrl(tdUrl, function (jsonData) {
		if(jsonData.length == 0) alert('No version find, please check!');
		globalSelectGroup = creatAPopList(jsonData, firstIndex);
		document.getElementById('PopList').appendChild(globalSelectGroup);
		$(globalSelectGroup).click(function (event) {
			var tempCell = event.target;
			var spanDic = (stationVerTdInfo['value']['Content'] || {});
			if ("object" != typeof(spanDic)) {
				spanDic = {};
			}
			var selPk = tempCell.getAttribute(firstIndex);
			// if (selPk in spanDic) {
			// 	delete spanDic[selPk]
			// } else {
			// 	spanDic[selPk] = tempCell.innerText;
			// }
			spanDic[selPk] = tempCell.innerText;
			globalSelectGroup.remove();
			stationVerTdInfo['value']['Content'] = spanDic;
			stationVerTdInfo['element'].innerHTML = creatSapnGroup(spanDic,'<br/>');
			updateCellValue(stationVerTdInfo, stationVerTdInfo['value'], false, false);
			stationTdInfo.element.click();
			// updatePreTdvalue();
		});
		globalSelectGroup.style.top = topTemp;
		globalSelectGroup.style.left = leftTemp;
		// var tbodyEle = $('.fixed-table-body')[0]
		// globalSelectGroup.style.top = stationVerTdInfo['element'].offsetTop - tbodyEle.scrollTop + stationVerTdInfo['element'].offsetHeight / 2 + 'px';
		// globalSelectGroup.style.left = stationVerTdInfo['element'].offsetLeft - tbodyEle.scrollLeft + stationVerTdInfo['element'].offsetWidth / 2 + 'px';
	});

}

function defineStationField(tdInfo, tdUrl, firstIndex) {
	var contentDiv = tdInfo['element'].firstElementChild;
	contentDiv.contentEditable = false;
	getAllDataFromUrl(tdUrl, function (jsonData) {
		globalSelectGroup = creatAPopList(jsonData, firstIndex);
		document.getElementById('PopList').appendChild(globalSelectGroup);
		$(globalSelectGroup).click(function (event) {
			var tempCell = event.target;
			var spanDic = (tdInfo['value']['Content'] || {});
			if ("object" != typeof(spanDic)) {
				spanDic = {};
			}
			var selPk = tempCell.getAttribute(firstIndex);
			if (selPk in spanDic) {
				delete spanDic[selPk];
			} else {
				spanDic[selPk] = tempCell.innerText;
				auditStationVersion(tdInfo , '/Audit/getStationVerson/?reqVer=' + selPk, 'ForeignKey');
			}
			contentDiv.innerHTML = creatSapnGroup(spanDic,'<br/>');
			tdInfo['value']['Content'] = spanDic;
			globalSelectGroup.remove();
			updateCellValue(tdInfo, tdInfo['value'], false, false);
		});
		var tbodyEle = $('.fixed-table-body')[0];
		globalSelectGroup.style.top = tdInfo['element'].offsetTop - tbodyEle.scrollTop + tdInfo['element'].offsetHeight / 2 + 'px';
		globalSelectGroup.style.left = tdInfo['element'].offsetLeft - tbodyEle.scrollLeft + tdInfo['element'].offsetWidth / 2 + 'px';
	});
}

function defineSelectGroup(tdInfo, jsonData, firstIndex) {
	var contentDiv = tdInfo['element'].firstElementChild;
	contentDiv.contentEditable = false;
	globalSelectGroup = creatAPopList(jsonData, firstIndex);
	document.getElementById('PopList').appendChild(globalSelectGroup);
	$(globalSelectGroup).click(function (event) {
		var tempCell = event.target;
		if ('bgColor' == firstIndex) {
			tdInfo['value']['Style'] = { 'bg_color': rgb2HexString(tempCell.style.backgroundColor) };
			tdInfo['value']['Content'] = tempCell.innerText;
		} else {
			var spanDic = tdInfo['value']['Content'] || {};
			var selPk = tempCell.getAttribute(firstIndex);
			if (selPk in spanDic) {
				delete spanDic[selPk];
			}else{
				spanDic[selPk] = tempCell.innerText;	
			}	
			tdInfo['value']['Content'] = spanDic;
		}
		// globalSelectTdList.push(tdInfo);
		
		globalSelectGroup.remove();
		updateCellValue(tdInfo, tdInfo['value'], false, true);
		globalSelectTdListVerify();
		updatePreTdvalue();
	});
	var tbodyEle = $('.fixed-table-body')[0]
	globalSelectGroup.style.top = tdInfo['element'].offsetTop - tbodyEle.scrollTop + tdInfo['element'].offsetHeight / 2 + 'px';
	globalSelectGroup.style.left = tdInfo['element'].offsetLeft - tbodyEle.scrollLeft + tdInfo['element'].offsetWidth / 2 + 'px';

}

function defineReplyModal(tdInfo) {
	globalClickTd['Verify'] = 'Modal';
	var cellCommnet = $('#oldReply')[0];
	var replyInfoList = tdInfo['value']['Content'];
	for (var i = 0, l = replyInfoList.length; i < l; i++) {
		cellCommnet.appendChild(creatReplyInfo(replyInfoList[i], false));
	}
	$('#replyModal').modal('show')
}


function submitModal() {
	// check old reply change
	var oldReplyList = $('#oldReply .replyInfo');
	var replyInfoList = globalClickTd['value']['Content'] || [];
	var value = {};
	for (var i = 0, l = replyInfoList.length; i < l; i++) {
		var tempReply = replyInfoList[i];
		if (tempReply['replyMessage']['Content'] != oldReplyList[i].innerText) {
			tempReply['replyMessage']['Content'] = oldReplyList[i].innerText;
			value[tempReply['id']['Content']] = { 'replyMessage': { 'Content': oldReplyList[i].innerText } };
			uploadglobalChangeInfo(globalClickTd, { 'Content': value }, true);
		}
	}

	var newInfo = $('#newReply')[0].value;
	if (newInfo.length) {
		var lastReply = replyInfoList[replyInfoList.length - 1]
		value[-1] = { 'replyMessage': { 'Content': newInfo } }
		if (lastReply && 0 > lastReply['id']['Content']) {
			lastReply['replyMessage']['Content'] = newInfo;
		} else {
			replyInfoList.push({ 'replyMessage': { 'Content': newInfo }, 'id': { 'Content': -1 } });
		}
		uploadglobalChangeInfo(globalClickTd, { 'Content': value }, true);
	}
	globalClickTd['value']['Content'] = replyInfoList;
	updateCellValue(globalClickTd, globalClickTd['value'], true, true);
	globalSelectTdListVerify();
	updatePreTdvalue();
	globalClickTd = null;

	$('#replyModal').modal('hide');
}

$('#replyModal').on('hide.bs.modal', function (e) {
	// do something...
	$('#oldReply')[0].innerText = '';
	$('#newReply')[0].value = '';
})

function foreignKeyStage(tdInfo) {
	defineForeignKeyFunc(tdInfo, '/ST/getCommmonModelInfo/?target=stage')
}


function getAuditTitles() {
	columns = [
		{
			field: 'operate',
			title: '<a class="add" href="javascript:void(0)" title="Add"><i class="fa fa-plus"></i></a>',
			formatter: operateAuditFormatter,
			events: operateEvents
		},
		{
			field: 'id',
			title: 'id',
			formatter: columnFormatter
		},
		{
			field: 'status',
			title: 'Status',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter,
			cellStyle: cellStyle
		},
		{
			field: 'issueCategory',
			title: 'IssueCategory',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter,
			cellStyle: cellStyle
		},
		{
			field: 'issueDescription',
			title: 'IssueDescription',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter,
			cellStyle: cellStyle
		},

		{
			field: 'ERS',
			title: 'ERS',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter,
			cellStyle: cellStyle
		},
		{
			field: 'station',
			title: 'Station',
			sortable: true,
			filterControl: 'input',
			formatter: columnVersionFormatter,
			cellStyle: cellStyle
		},
		{
			field: 'version',
			title: 'Version',
			sortable: true,
			filterControl: 'input',
			formatter: columnVersionFormatter,
			cellStyle: cellStyle
		},
		{
			field: 'replyInfo',
			title: 'Remark',
			sortable: true,
			filterControl: 'input',
			formatter: columnAuditReplyUserFormatter,
			// cellStyle :cellStyle
		},
		{
			field: 'updateTime',
			title: 'updateTime',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter
		},
		{
			field: 'auditDRI',
			title: 'AuditDRI',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter,
			cellStyle: cellStyle
		},

		{
			field: 'addTime',
			title: 'AuditTime',
			sortable: true,
			filterControl: 'input',
			formatter: columnFormatter
		}];

	hiddenList = ['id', 'updateTime'];
	SpecialFuncField = {
		'issueCategory': function (tdInfo) {
			defineSelectGroup(tdInfo, issueCategory, 'bgColor');
		},
		'status': function (tdInfo) {
			defineSelectGroup(tdInfo, statusCategory, 'bgColor');
		},
		'version': function (tdInfo) {
			var dataList = [];
			for(var i in tdInfo['value']['Content']){
				dataList.push([i,tdInfo['value']['Content'][i]]);
			}
			defineSelectGroup(tdInfo, dataList, 'ForeignKey');
		},
		'station': function (tdInfo) {
			// defineForeign(tdInfo, '/ST/getCommmonModelInfo/?target=station')
			defineStationField(tdInfo, '/ST/getCommmonModelInfo/?target=station', 'ManyKey');
		},
		'replyInfo': function (tdInfo) {
			defineReplyModal(tdInfo)
		},
	};
	prohibitEdit = { 'id': 0, 'updateTime': 0, 'addTime': 0, 'auditDRI': 0};
	return {
		'columns': columns,
		'hiddenList': hiddenList,
		'SpecialFuncField': SpecialFuncField,
		'prohibitEdit': prohibitEdit,
		'idField': 'id'
	}
}

$(document).ready(function ($) {
	// sidebarHref(location.search.substring(1));
	creatATable(getAuditTitles(), 'AuditTrackTable', location.search.substring(1), '/Audit/getAuditData/');
	// $.get('/ST/getDataFromDb' + location.search, function(data,status){
	// 	var responseData = JSON.parse(data);

	// 	// $('td').mouseover(function(){
	// 	// 	showInform(this);
	// 	// }).mouseout(function(){
	// 	// 	hiddenInform(this);
	// 	// });


	//   });
});



// $('.name').off('click').click(function(){}

// );
	// tagEle.setAttribute('onMouseOver','showInform(this)')
	// tagEle.setAttribute('onmouseout','hiddenInform(this)')


