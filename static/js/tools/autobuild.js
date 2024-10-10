//初始化Autobuild需要的数据，stage,station...etc
function init_selections(){
	//adjust height
	$(".movie-content").height(ds-$(".navbar").height());
	$(".sidebar").height(ds-$(".navbar").height());

	//project和左上角选择的保持一致
	$("#input_project").val($('#select-project').text())
	var project=$('#select-project').text()

	//Stage  dropdown
	$(document).on("click","#dropdown_stage a",function(){
		$("#input_stage").val(this.innerText)
	});

	//Tag dropdown
	$(document).on('click','#dropdown_tag a',function(){
		$("#input_Tag").val($(this).attr('data-commit'))
	});

	$.ajax({
		url: "requestBaseDate/",
		type: "post",
		dataType:"JSON",
		async:true,
		data: {
			'project': project,
		},
		dataType: 'JSON',
		success: function (data) {
			stage_str=''
			station_str=''
			tag_str=''

			for (var i=0;i<data.stages.length;i++){
				stage_str+="<a class='dropdown-item' href='#'>"+data.stages[i]+"</a>"
			}

			for (var s=0;s<data.stations.length;s++){
				station_str+="<option value='"+data.stations[s]+"'>"+data.stations[s]+"</option>"
			}

			for (var g=0;g<data.gitlog.length;g++){
				tag_str+="<a class='dropdown-item' href='#' data-commit="+data.gitlog[g].commitId+">"+data.gitlog[g].commitId+" （"+data.gitlog[g].author+"，"+data.gitlog[g].updatetime+"）</a>"
			}

		   $("#dropdown_stage").html(stage_str)              
		   $("#input_station").html(station_str)
		   $('#dropdown_tag').html(tag_str)
		   $("#input_ccMail").val(data.ccmail)
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("数据加载错误！");
		}
	});    
}

//发送Email
function sendBuildMail(){
	// 做一层判断 是否确定要提交
	let isconfirm = confirm('请确认是否提交？');
	if(isconfirm){
		
		$.ajax({
			url: "sendBuildMail/",
			type: "post",
			dataType:"JSON",
			async:true,
			data: {
				'project': $('#input_project').val(),
				'stage': $('#input_stage').val(),
				'station': $('#input_station').val(),
				'atlas_version': $('#input_Atlasversion').val(),
				'branch': $('#input_branch').val(),
				'Tag': $('#input_Tag').val(),
				'CCMail': $('#input_ccMail').val(),
			},
			dataType: 'JSON',
			success: function (data) {
				if(data.result == "ok"){
					alert("Mail发送成功！")
				}else{
					alert("Mail发送失败！")
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("数据加载错误！");
			}
		});    
	}            
}


$(function () {

	init_selections();	


})