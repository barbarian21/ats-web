function sidebarHref(e)
{
	if(globalTable)
	{
		globalSelectTdListVerify();
		updatePreTdvalue();
		if(!$.isEmptyObject(globalChangeInfo))
		{
			if(!confirm('Are you sure to discard currrn change, click Yes will discard!'))
			{
				return;
			}
		}
	}
	globalUrlParams = e.value || '';
	var activeButton = $('.list-group-item.list-group-item-action.active')[0];
	if(activeButton)
	{
		activeButton.classList.remove('active')
	}
	e.classList.add('active');
	creatATable(getSTtitles(),'StationTarckTable', globalUrlParams, '/ST/getSTDataFromDb/')
}

function initArowData()
{
	return {};
}

function defineForeign(tdInfo,tdUrl)
{
	tdInfo['element'].firstElementChild.contentEditable = false;
	getAllDataFromUrl(tdUrl,function (jsonData){
		defineSelectGroup(tdInfo, jsonData, 'ForeignKey');
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


function foreignKeyStage(tdInfo)
{
	defineForeignKeyFunc(tdInfo,'/ST/getCommmonModelInfo/?target=stage')
}


function getSTtitles()
{
	columns = [
		{
			field:'operate',
			title:'<a class="add" href="javascript:void(0)" title="Add"><i class="fa fa-plus"></i></a>',
			formatter:operateFormatter,
			events:operateEvents
		},
		{
			field:'id',
			title:'id',
			formatter:columnFormatter
		},
		{
			field:'project',
			title:'project',
			formatter:columnFormatter
		},
		{
			field:'stage',
			title:'stage',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'station_name',
			title:'station_name',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'station_quantity',
			title:'station_quantity',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'Overlay_Version',
			title:'Overlay_Version',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'GRR',
			title:'GRR',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'cofList',
			title:'cofList',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'Setup_Issue_Remark',
			title:'Setup_Issue_Remark',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'Daily_Issue_describe',
			title:'Daily_Issue_describe',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'update_time',
			title:'update_time',
			formatter:columnFormatter
		},
		{
			field:'add_time',
			title:'add_time',
			formatter:columnFormatter
		}];

	hiddenList = ['id','project', 'add_time'];
	SpecialFuncField = {'stage': function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=stage')
							}, 
						'station_name' : function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=station')
						}};
	prohibitEdit = {'id' : 0,'project' : 0,'update_time' : 0,'add_time' : 0};
	return {'columns' : columns,
		'hiddenList' : hiddenList,
		'SpecialFuncField' : SpecialFuncField,
		'prohibitEdit' : prohibitEdit,
		'idField' :'id'
	}
}

$(document).ready(function($){
	// sidebarHref(location.search.substring(1));
	creatATable(getSTtitles(),'StationTarckTable', location.search.substring(1), '/ST/getSTDataFromDb/')
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
























