var issueCategory = [['#ff0000', 'New Issue'], ['#ffff00', 'Retest Issue'], ['#ffa500', 'Known Issue'],['#008000', 'Keep Monitor'],['#008000', 'Close Issue'],['#008000', 'Fixed Issue']]
var statusCategory = [['#ff0000', 'New'], ['#ffff00', 'Ongoing'], ['#008000', 'Keep Monitor'],['#008000', 'Close'],['#008000', 'Done']]
function initArowData()
{
	return {'station_category' : {'Content' : getUrlParamsVariable(globalUrlParams, 'station_category')}};
}

function sidebarHref(e,target)
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

	document.getElementById('download').href = '/issue/download/?' + globalUrlParams;

	if(e.getAttribute('searchPara'))
	{
		globalUrlParams += e.getAttribute('searchPara');
	}

	if('Handover' == target)
	{
		globalTableInfo = getHandovertitles();

	}else if('Action' == target)
	{
		globalTableInfo = getActiontitles();
	}else if('Issue' == target)
	{
		globalTableInfo = getIssuetitles();
	}else if('ErsDoc' == target)
	{
		globalTableInfo = getErsDoctitles();
	}else{
		globalTableInfo = getTCRadartitles()
	}

	var activeButton = $('.list-group-item.list-group-item-action.active')[0];
	if(activeButton)
	{
		activeButton.classList.remove('active')
	}
	e.classList.add('active');
	var collapseBody = e.parentNode.parentElement;
	if(!$(collapseBody).hasClass('show'))
	{
		collapseBody.previousElementSibling.firstElementChild.click();
	}
	creatATable(globalTableInfo,'IssueCategory', globalUrlParams, '/getIssueDataFromDb/');
}

function searchRadar(e, searchFlag)
{
	var searchNum = document.getElementById('searchRadar').value;
	// if(8 != searchNum.length)
	// {
	// 	alert('please input correct radar number, thanks')
	// 	document.getElementById('searchRadar').value = '';
	// 	return;
	// }
	var collapseList =  document.getElementsByClassName('collapse');
	var firstSearchResult = null;
	for(var i = 1, l = collapseList.length; i < l; i++)
	{
		var buttonList = collapseList[i].getElementsByTagName('button');
		for(var buttonIndex = 0, buttonNum = buttonList.length; buttonIndex < buttonNum; buttonIndex++)
		{
			var curButton = buttonList[buttonIndex]
			if('search' == searchFlag){
				e.value = 'done';
				e.style.backgroundColor = '#ff0000'
				if(0 == buttonIndex)
				{
					curButton.hidden = true;
					continue;
				}
				$.ajax({  
					url: '/searchIssue/?' + curButton.value + '&radar=' + searchNum,  
					type: 'GET',
					async: false,
					success: function (resData){
						if(0 == resData)
						{
							curButton.hidden = true;
						}else{
							curButton.setAttribute('searchPara', '&radar=' + searchNum);
							firstSearchResult = firstSearchResult || curButton;
						}
					}
				});
			}else{
				e.value = 'search';
				e.style.backgroundColor = null;
				curButton.hidden = false;
				firstSearchResult = firstSearchResult || curButton;
				if(e.getAttribute('searchPara'))
				{
					e.removeAttribute('searchPara');
				}
			}
		}
	}
	if(firstSearchResult)
	{
		firstSearchResult.click();
	}
}

function defineForeign(tdInfo,tdUrl, firstIndex)
{
	var firstIndex = firstIndex || 'ForeignKey';

	tdInfo['element'].firstElementChild.contentEditable = false;
	getAllDataFromUrl(tdUrl,function (jsonData){
		defineSelectGroup(tdInfo, jsonData, firstIndex);
	});
}

function defineManyField(tdInfo,tdUrl, firstIndex)
{
	var contentDiv =  tdInfo['element'].firstElementChild;
	contentDiv.contentEditable = false;
	getAllDataFromUrl(tdUrl,function (jsonData){
		globalSelectGroup =  creatAPopList(jsonData,firstIndex);
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
			}
			contentDiv.innerHTML = creatSapnGroup(spanDic);
			tdInfo['value']['Content'] = spanDic;
			updateCellValue(tdInfo, tdInfo['value'], false, false);
		});
		var tbodyEle = $('.fixed-table-body')[0]
		globalSelectGroup.style.top = tdInfo['element'].offsetTop - tbodyEle.scrollTop + tdInfo['element'].offsetHeight / 2 + 'px';
		globalSelectGroup.style.left = tdInfo['element'].offsetLeft - tbodyEle.scrollLeft + tdInfo['element'].offsetWidth / 2 +'px';
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


function getIssuetitles()
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
		// {
		// 	field:'project',
		// 	title:'project',
		// 	formatter:columnFormatter
		// },
		// {
		// 	field:'stage',
		// 	title:'stage',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
        // },
        {
			field:'category',
			title:'Category',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		// {
		// 	field:'is_highlight',
		// 	title:'is_highlight',
		// 	formatter:columnBoolFormatter,
		// 	cellStyle :cellStyle
        // },
		{
			field:'station',
			title:'Station',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'failure_count',
			title:'Failure Qty',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'description',
			title:'Failure Items/Message',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'root_cause',
			title:'Root Cause/Next Steps',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'action',
			title:'action',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'ETA',
			title:'ETA',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'radar',
			title:'Radar',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'DRI',
			title:'DRI',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'functions',
			title:'Module',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'update_time',
			title:'Update Time',
			formatter:columnFormatter
		},
		{
			field:'add_time',
			title:'Add Time',
			formatter:columnFormatter
        },
        {
			field:'author',
			title:'Author',
			formatter:columnFormatter,
			cellStyle :cellStyle
		}];

	hiddenList = ['id', 'action','add_time'];
	SpecialFuncField = {'stage': function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=stage');
							}, 
                        'category' : function (tdInfo){
                            defineSelectGroup(tdInfo, issueCategory, 'bgColor');
							},
						'station' : function (tdInfo){
							defineManyField(tdInfo,'/ST/getCommmonModelInfo/?target=station', 'ManyKey');
							},

						// 'is_highlight' : function (tdInfo){
						// 	defineSelectGroup(tdInfo,[[false, 'No'], [true, 'Yes']], 'BoolField');
						// 	},
						};
	prohibitEdit = {'id' : 0,'project' : 0,'update_time' : 0,'add_time' : 0,'author' : 0};
	return {'columns' : columns,
		'hiddenList' : hiddenList,
		'SpecialFuncField' : SpecialFuncField,
		'prohibitEdit' : prohibitEdit,
		'idField' :'id',
	}
}

function getActiontitles()
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
		// {
		// 	field:'project',
		// 	title:'project',
		// 	formatter:columnFormatter
		// },
		// {
		// 	field:'stage',
		// 	title:'stage',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
        // },
		// {
        //     field:'is_highlight',
		// 	title:'is_highlight',
		// 	formatter:columnBoolFormatter,
		// 	cellStyle :cellStyle
        // },
		// {
		// 	field:'station',
		// 	title:'Station',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
		// },
        {
			field:'radar',
			title:'Radar',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
		{
            field:'title',
			title:'Title',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
        {
			field:'DRI',
			title:'DRI',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'status',
			title:'Status',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'remark',
			title:'Remark',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'functions',
			title:'Module',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'update_time',
			title:'Update Time',
			formatter:columnFormatter
		},
		{
			field:'add_time',
			title:'Add Time',
			formatter:columnFormatter
        },
        {
			field:'author',
			title:'Author',
			formatter:columnFormatter,
			cellStyle :cellStyle
		}];

	hiddenList = ['id','add_time'];
	SpecialFuncField = {'stage': function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=stage');
							}, 
						'station' : function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=station');
                            },
                        'category' : function (tdInfo){
                            defineSelectGroup(tdInfo, issueCategory, 'bgColor');
							},
						'status' : function (tdInfo){
							defineSelectGroup(tdInfo, statusCategory, 'bgColor');
							},
						// 'is_highlight' : function (tdInfo){
						// 	defineSelectGroup(tdInfo,[[false, 'No'], [true, 'Yes']], 'BoolField');
						// 	},

                        };
	prohibitEdit = {'id' : 0,'update_time' : 0,'add_time' : 0,'author' : 0};
	return {'columns' : columns,
		'hiddenList' : hiddenList,
		'SpecialFuncField' : SpecialFuncField,
		'prohibitEdit' : prohibitEdit,
		'idField' :'id'
	}
}

function getErsDoctitles()
{
	columns = [
		{
			field:'operate',
			title:'<a class="add" href="javascript:void(0)" title="Add"><i class="fa fa-plus"></i></a>',
			formatter:operateMailFormatter,
			events:operateEvents
		},
		{
			field:'id',
			title:'id',
			formatter:columnFormatter
		},
		// {
		// 	field:'project',
		// 	title:'project',
		// 	formatter:columnFormatter
        // },
        {
			field:'component',
			title:'Component',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
        {
			field:'radar',
			title:'Radar',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
		{
            field:'title',
			title:'Title',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        // {
		// 	field:'cocoDRI',
		// 	title:'DRI',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
		// },
		{
			field:'mailTo',
			title:'To',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
		{
			field:'mailCC',
			title:'CC',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
        {
			field:'remark',
			title:'Remark',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
		{
			field:'update_time',
			title:'Update Time',
			formatter:columnFormatter
		},
		{
			field:'add_time',
			title:'Add Time',
			formatter:columnFormatter
        },
        {
			field:'author',
			title:'Author',
			formatter:columnFormatter,
			cellStyle :cellStyle
		}];

	hiddenList = ['id','add_time'];
	SpecialFuncField = {'mailCC': function (tdInfo){
							defineManyField(tdInfo,'/ST/getCommmonModelInfo/?target=mail', 'jsonObject');
							}, 
						'mailTo' : function (tdInfo){
							defineManyField(tdInfo,'/ST/getCommmonModelInfo/?target=mail', 'jsonObject');
							},
						};
	prohibitEdit = {'id' : 0,'update_time' : 0,'add_time' : 0,'author' : 0};
	return {'columns' : columns,
		'hiddenList' : hiddenList,
		'SpecialFuncField' : SpecialFuncField,
		'prohibitEdit' : prohibitEdit,
		'idField' :'id'
	}
}

function getHandovertitles()
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
		// {
		// 	field:'project',
		// 	title:'project',
		// 	formatter:columnFormatter
		// },
		// {
		// 	field:'stage',
		// 	title:'stage',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
        // },
		// {
		// 	field:'station',
		// 	title:'Station',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
		// },
		{
            field:'title',
			title:'Title',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
        {
			field:'content',
			title:'Note',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        // {
		// 	field:'status',
		// 	title:'Status',
		// 	formatter:columnFormatter,
		// 	cellStyle :cellStyle
        // },
		{
			field:'update_time',
			title:'Update Time',
			formatter:columnFormatter
		},
		{
			field:'add_time',
			title:'Add Time',
			formatter:columnFormatter
        },
        {
			field:'author',
			title:'Author',
			formatter:columnFormatter,
			cellStyle :cellStyle
		}];

	hiddenList = ['id','add_time'];
	SpecialFuncField = {'stage': function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=stage');
							}, 
						'station' : function (tdInfo){
							defineForeign(tdInfo,'/ST/getCommmonModelInfo/?target=station');
							},
						'status' : function (tdInfo){
							defineSelectGroup(tdInfo, statusCategory, 'bgColor');
							},
                        };
	prohibitEdit = {'id' : 0,'project' : 0,'update_time' : 0,'add_time' : 0,'author' : 0};
	return {'columns' : columns,
		'hiddenList' : hiddenList,
		'SpecialFuncField' : SpecialFuncField,
		'prohibitEdit' : prohibitEdit,
		'idField' :'id'
	}
}

function getTCRadartitles()
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
		// {
		// 	field:'project',
		// 	title:'project',
		// 	formatter:columnFormatter
        // },
        {
			field:'station',
			title:'station',
			formatter:columnFormatter,
			cellStyle :cellStyle
		},
        {
			field:'radar',
			title:'Radar',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
		{
            field:'title',
			title:'Title',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
        {
			field:'version',
			title:'Version',
			formatter:columnFormatter,
			cellStyle :cellStyle
        },
		{
			field:'update_time',
			title:'Update Time',
			formatter:columnFormatter
		},
		{
			field:'add_time',
			title:'Add Time',
			formatter:columnFormatter
        },
        {
			field:'author',
			title:'Author',
			formatter:columnFormatter,
			cellStyle :cellStyle
		}];

	hiddenList = ['id','add_time'];
	SpecialFuncField = {};
	prohibitEdit = {'id' : 0,'project' : 0,'update_time' : 0,'add_time' : 0,'author' : 0};
	return {'columns' : columns,
		'hiddenList' : hiddenList,
		'SpecialFuncField' : SpecialFuncField,
		'prohibitEdit' : prohibitEdit,
		'idField' :'id'
	}
}

$(document).ready(function($){
	creatATable(getHandovertitles(),'IssueCategory', 'target=Handover&station_category=FATP', '/getIssueDataFromDb/')
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
























