var ds=$(window).height();
// 判断操作系统
function isWindows(){
return isWin = navigator.platform=='Win32' || navigator.platform=='Windows';
}
// 美化滚动条
function beautifulScroll(){
if(isWindows())
	document.write('<link rel="stylesheet" href="/static/css/scroll.css">');
}
// 美化滚动条
beautifulScroll();

$(function () {
	$(".dropdown-project").click(function(){
	$('#select-project').text($(this).text());
	$.ajax( {
		type: 'post',
		url:'/favorProject/',
		dataType:"JSON",
		async:true,
		data:{
			'favorProject': $(this).text(),
			'current_url': "{{ request.path }}",
		},
		success: function(data){
			window.location.reload();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(textStatus);
		},
		});
	});

	$(".dropdown-other").click(function(){
	$('#select-other').text($(this).text());
	});
});