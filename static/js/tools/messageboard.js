$(function () {
	//adjust height
	var content_height=ds-$(".navbar").height();
	$(".movie-content").height(content_height);
	$(".sidebar").height(content_height);
    $(".content_scroll").height(content_height);

	$(".grrAdd_click").click(function(){
		$("#grrStation").val("")
		$("#grrRadar").val("")
		$("#grrVersion").val("")
		$("#grrOverlay").val("")
		$("#grrToolVer").val("")
		$("#input_remarkGrr").val("")
	});

	$(".overlayAdd_click").click(function(){

		$("#overlayStation").val("")
		$("#overlayRadar").val("")
		$("#overlayOverlay").val("")
		$("#overlayBasedOn").val("")
		$("#overlayRemark").val("")
		$("#input_remarkOver").val("")

	});

	$(".Gedit_click").click(function(){
		$("#grrInput").val($(this).attr("id"))
		console.log($(this).attr("id"))
		let station = $(this).data("station")
		let radar = $(this).data("radar")
		let grrVer = $(this).data("grrver")
		let overlay = $(this).data("overlay")
		let remark = $(this).data("remark")
		let toolVer = $(this).data("toolver")
		console.log(station,radar,grrVer,overlay,remark,toolVer)
		$("#grrStation").val(station)
		$("#grrRadar").val(radar)
		$("#grrVersion").val(grrVer)
		$("#grrOverlay").val(overlay)
		$("#grrToolVer").val(toolVer)
		$("#input_remarkGrr").val(remark)
	
	})
	$(".Oedit_click").click(function(){
		$("#overlayInput").val($(this).attr("id"))
		console.log($(this).attr("id"))
		var station = $(this).data("station")
		var radar = $(this).data("radar")
		var change = $(this).data("changenote")
		var overlay = $(this).data("overlay")
		var remark = $(this).data("remark")
		var baseOn = $(this).data("baseon")
		console.log(station,radar,change,overlay,remark,baseOn)
		$("#overlayStation").val(station)
		$("#overlayRadar").val(radar)
		$("#overlayOverlay").val(overlay)
		$("#overlayBasedOn").val(baseOn)
		$("#overlayRemark").val(remark)
		$("#input_remarkOver").val(change)
		
	});

	//当点击回复的时候，保存该留言的ID到回复表单中，以便提交。
	$(".reply_click").click(function(){
		$("#input_LeaveInfoId").val($(this).attr("id"))
	});

	$(".delete_overlay").click(function(){
		console.log($(this).attr("id"))
		let isconfirm = confirm('请确认是否删除？');

		if(isconfirm){
			$.ajax({
				url: "delGrrOrOverlay/",
				type: "post",
				dataType:"JSON",
				async:true,
				data: {
					'markId': $(this).attr("id"),
					'mark':'overlay',
				},
				dataType: 'JSON',
				success: function (data) {
					alert("删除成功！")
					window.location.reload()
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("删除失败！");
				}
			}); 
		}

	});
	$(".delete_grr").click(function(){
		console.log($(this).attr("id"))
		let isconfirm = confirm('请确认是否删除？');
		if(isconfirm){
			$.ajax({
				url: "delGrrOrOverlay/",
				type: "post",
				dataType:"JSON",
				async:true,
				data: {
					'markId': $(this).attr("id"),
					'mark':'grr',
				},
				dataType: 'JSON',
				success: function (data) {
					alert("删除成功！")
					window.location.reload()
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("删除失败！");
				}
			}); 
		}
	});
	//当删除留言或回复时，调用
	$(".delete_leavemessage,.delete_reply").click(function(){
		console.log($(this).attr("id"))
		let isconfirm = confirm('请确认是否删除？');
		if(isconfirm){
			$.ajax({
				url: "deleteMessage/",
				type: "post",
				dataType:"JSON",
				async:true,
				data: {
					'MessageId': $(this).attr("id"),
				},
				dataType: 'JSON',
				success: function (data) {
					alert("删除成功！")
					window.location.reload()
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					alert("删除失败！");
				}
			}); 
		}   
	});

	//当滚动条的位置处于距顶部50像素以下时，跳转链接出现，否则消失
	$(".content_scroll").scroll(function() {         
		if ($(".content_scroll").scrollTop() > 300) {
			$("#btn").fadeIn(200);
		} else {
			$("#btn").fadeOut(200);
		}
	});
	//当点击跳转链接后，回到页面顶部位置
	$("#btn").click(function() {
		$('.content_scroll').animate({
			scrollTop: 0
		},500);           
		return false;
	});
})
function submitGrrInfo(){
	if($('#grrStation').val()=="" || $('#grrRadar').val()=="" || $('#version').val()=="" || $('#overlay').val()==""|| $('#toolVer').val()==""){
		alert("请填写完整信息！")
		return false;
	}
	let isconfirm = confirm('请确认是否提交？');
	if(isconfirm){
		$.ajax({
			url: "submitGrrOrOverlay/",
			type: "post",
			dataType:"JSON",
			async:true,
			data: {
				'station':$("#grrStation").val(),
				'radar':$("#grrRadar").val(),
				'version':$("#grrVersion").val(),
				'overlay':$("#grrOverlay").val(),
				'toolVer':$("#grrToolVer").val(),
				'remark':$("#input_remarkGrr").val(),
				'mark':'grr',
			},
			dataType: 'JSON',
			success: function (data) {
				alert("提交成功！")
				window.location.reload()
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败！");
			}
		}); 
	}

}
function submitOverInfo(){
	if($('#overlayStation').val()=="" || $('#overlayRadar').val()=="" || $('#overlayOverlay').val()==""){
		alert("请填写完整信息！")
		return false;
	}
	let isconfirm = confirm('请确认是否提交？');
	if(isconfirm){
		$.ajax({
			url: "submitGrrOrOverlay/",
			type: "post",
			dataType:"JSON",
			async:true,
			data: {
				'station':$("#overlayStation").val(),
				'radar':$("#overlayRadar").val(),
				'overlay':$("#overlayOverlay").val(),
				'baseOn':$("#overlayBasedOn").val(),
				'remark':$("#overlayRemark").val(),
				'change':$("#input_remarkOver").val(),
				'mark':'overlay',
			},
			dataType: 'JSON',
			success: function (data) {
				alert("提交成功！")
				window.location.reload()
				$("#tabId a:last").tab('show')
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("提交失败！");
			}
		}); 
	}
	
}
//提交留言
function submitMessage(){
	if($('#input_message').val()=="" || $('#input_title').val()==""){
		alert("请输入留言！")
		return false;
	}
	let isconfirm = confirm('请确认是否提交？');
	if(isconfirm){
		$.ajax({
			url: "submitMessage/",
			type: "post",
			dataType:"JSON",
			async:true,
			data: {
				'message': $('#input_message').val(),
				'title': $('#input_title').val(),
			},
			dataType: 'JSON',
			success: function (data) {
				alert("发表成功！")
				window.location.reload()
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("数据加载错误！");
			}
		}); 
	}   
}

//提交回复
function submitReplyMessage(){
	if($('#input_replymessage').val()==""){
		alert("请输入回复！")
		return false;
	}
	let isconfirm = confirm('请确认是否提交？');
	if(isconfirm){
		$.ajax({
			url: "submitReplyMessage/",
			type: "post",
			dataType:"JSON",
			async:true,
			data: {
				'replyMessage': $('#input_replymessage').val(),
				'leaveInfo': $('#input_LeaveInfoId').val(),
			},
			dataType: 'JSON',
			success: function (data) {
				alert("发表成功！")
				window.location.reload()
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert("数据加载错误！");
			}
		}); 
	}   
}