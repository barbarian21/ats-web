$(function () {
	//adjust height
	$(".movie-content").height(ds-$(".navbar").height());
	$(".sidebar").height(ds-$(".navbar").height());
	$("#info_table").height($(".movie-content").height()-20);
	$("#application_div").height($(".movie-content").height()-20);
	
	//搜索框
	$(document).on("keyup",".search_group",function(e){
		var tr = $('#info_table tr');
		$("#info_table tr").hide();       //隐藏所有行
		$(tr[0]).show();					//显示第一二行
		$(tr[1]).show();
		var n = 0;
		for (var i = 0; i < tr[0].children.length; i++) {
			if(tr[0].children[i].children[0]==this){
				n = i;
			}else{
				$(tr[0].children[i].children[0]).val("");
			}
		}
		for (var i = 2; i < tr.length; i++) {
			 if(tr[i].children[n].innerText.toUpperCase().includes(this.value.toUpperCase())){
					$(tr[i]).show();          //当某行的值包含输入框的值，显示该行
			}
		}
	});

	//当滚动这个div的时候，将表头th都放到顶部
	$('#info_table').on('scroll',function(){
		var top=$(this)[0].scrollTop;
		var thead=$('th.th_top_tech');
		if(top>50){
			thead.css('top',top-50);
		}else{
			thead.css('top',0);
		}
	}); 

	//当滚动这个div的时候，将表头th都放到顶部
	$('#application_div').on('scroll',function(){
		var top=$(this)[0].scrollTop;
		var thead=$('th.th_top_applications');
		if(top>0){
			thead.css('top',top-10);
		}else{
			thead.css('top',0);
		}
	}); 
	
	//当点击表格某一行时，调用
	$(document).on("click","#info_table tr",function(e){
		var tr=document.getElementsByTagName('tr');
		for(i=2;i<tr.length;i++){
			if(this==tr[i]){                   
				$("#info_table tr").eq(i).addClass("select")                            
			}else{
				$("#info_table tr").eq(i).removeClass("select")
			}
		}
		document.getElementById('DuserApps').innerText = ($(this.children[0]).text())

		//点击搜索行和标题行时，返回false
		if($(this.children[0]).hasClass("th_top_tech")){                   
			return false
		}else if($(this.children[0]).hasClass("th_top")){
			return false
		}else{
			$.ajax({
				url: "appsDetail/",
				type: "post",
				dataType:"JSON",
				async:true,
				data: {
					'number':($(this.children[0]).text())
				},
				dataType: 'JSON',
				success: function (data) {
					//给application表添加标题行
					$('#application_table').html("<tr style='height:30px;line-height: 30px;'>\
							<th class='th_top_applications'colspan='2' style='text-align:center'>Applications</th>\
						</tr>")
					//循环加入数据
					if(data.Apps.length>0){
						for (var i=0;i<data.Apps.length;i=i+2){
							if(i+1<data.Apps.length){
								$('#application_table').append("<tr><td>"+data.Apps[i]+"</td><td>"+data.Apps[i+1]+"</td></tr>") 
							}else{
								$('#application_table').append("<tr><td>"+data.Apps[i]+"</td><td></td></tr>")                                
							}
						}
					}else{
						alert("无数据");
					}                 
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					$('#application_table').html("<tr style='height:30px;line-height: 30px;'>\
							<th class='th_top_applications'colspan='2' style='text-align:center'>Applications</th>\
						</tr>")
					alert("数据加载错误！");
				}
			});    
		}
		
	});

	//点击button，下载表格时调用
	$(document).on("click",".downloadtable",function(e){
		let downloadTable=$(this).data("dtable");
		
		if(downloadTable == 'personApp'){
			if(! $(this)[0].innerText.startsWith('S')){
				alert("请选择要下载的用户！")
				return
			}
		}
		let isconfirm = confirm('请确认是否下载'+$(this)[0].innerText+'?');
		if(isconfirm){
			
			if(downloadTable == 'personApp'){
				$("#downloadTableType").val($(this)[0].innerText);
			}
			else{
				$("#downloadTableType").val(downloadTable);
			}
            $("#downloadTableForm input[type=submit]").click();    
		}
	});

})