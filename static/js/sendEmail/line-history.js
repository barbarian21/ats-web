'use strict'


$(function(){
    var line = (function(){
        function search(url){
            var searchKind = document.getElementById('search-kind'),
                searchInput = document.getElementById('search-input'),
                searchBtn = document.getElementById('search-btn');
    
            searchBtn.onclick = function(){
                var kind = searchKind.value,
                    val = searchInput.value.trim().toLowerCase();
                    $.ajax({
                        url: url,
                        type: 'POST',
                        data: {
                            kind: kind,
                            value: val,
                        },
                        dataType: 'JSON',
                        success: function(data){
                            var str_line=""
                            for (var j=0;j<data.server_lines.length;j++){
                                str_line+="<tr data-lid="+data.server_lines[j].lid+">\
                                <td><input type='checkbox' id="+data.server_lines[j].lid+"></td>\
                                <td>"+data.server_lines[j].sname+"</td>\
                                <td>"+data.server_lines[j].lname+"</td>\
                                </tr>\
                                "
                            }
                            $("#search_lresult").html(str_line)
                        },
                        error: function(XMLHttpRequest, textStatus){
                            alert("搜索不到结果！");
                        }
                    });    
                // open(
                //     url+'?kind='+kind+'&val='+val, 
                //     '_self', 
                // );
            }
        }

        function upload(){
            function sendVal(){
                var uploadSname = document.getElementById('upload-sname'),
                    //uploadSaddress = document.getElementById('upload-saddress'),
                    uploadLname = document.getElementById('upload-lname');
                $.ajax({
                    url: '/save-line/',
                    type: 'POST',
                    data: {
                        sname: uploadSname.value.trim().toUpperCase(),
                        //saddress: uploadSaddress.value.trim(),
                        lname: uploadLname.value.trim(),
                    },
                    dataType: 'text',
                    success: function(data){
                        alert(data);
                        window.location.reload()
                    },
                    error: function(XMLHttpRequest, textStatus){
                        alert("添加失败！");
                    }
                });
            }

            $('#upload').click(function(){
                $( "#upload-form" ).dialog({
                    draggable: false,
                    modal: true,
                    buttons: {
                        '提交': function() {
                            $( this ).dialog( "close" );
                            sendVal();
                            //alert('此功能暂未上线');
                        }
                    }
                });
                $('button.ui-dialog-titlebar-close').html('<i class="fa fa-times" aria-hidden="true"></i>');
            });

            $("#manyupload").on("click",function(){
                $( "#manyupload-form" ).dialog({
                    draggable: false,
                    modal: true,
                    buttons: {
                        '提交': function() {
                            $( this ).dialog( "close" );
                            //alert('此功能暂未上线');
                            manauploadline();
                        }
                    }
                });
                $('button.ui-dialog-titlebar-close').html('<i class="fa fa-times" aria-hidden="true"></i>');          
            });

            $("#delete").on("click",function(){
                let lids=""
                let lname=""

                let $checked = $('#line_history input:checked');
                if ($checked.length==0){
                    alert("请选择线体！");
                }else{
                    for(let checked of $checked){
                        if (checked.id!="select_all"){
                            lids=lids+","+checked.id
                            lname=lname+"\n"+$(checked).attr("data-lname")
                        }
                    }
                    let isconfirm = confirm('请确认是否删除以下线体:'+lname);
                    if(isconfirm){
                        deleteline(lids)
                    }
                }                               
            });

            $("#download").on("click",function(){
                let isconfirm = confirm('请确认是否下载？');
                if(isconfirm){
                    location.href = "download-line/";
                }
            });

            $("#select_all").on("click",function(){
                let ischecked=$(this).prop("checked")
                let $checked = $('#line_history input[type="checkbox"]');
                if (ischecked){
                    for(let checked of $checked){
                        $(checked).prop("checked","checked")
                    }
                }else{
                    for(let checked of $checked){
                        $(checked).prop("checked","")
                    }
                }
            });


            function deleteline(line_ids){
                $.ajax({
                    url: '/delete-line/',
                    type: 'POST',
                    data: {
                        lids:line_ids
                    },
                    dataType: 'text',
                    success: function(data){
                        alert(data);
                        window.location.reload()
                    },
                    error: function(XMLHttpRequest, textStatus){
                        alert("删除失败！");
                    }
                });
            }

            function manauploadline(){
                let formData = new FormData();
                formData.append('files',$('#manyupload-file')[0].files[0]);
                $.ajax({
                    url: '/manyupload-line/',
                    type: 'POST',
                    cache: false,
                    processData: false,
                    contentType: false,
                    data: formData,
                    dataType: 'text',
                    success: function(data){
                        alert(data);
                        window.location.reload()
                    },
                    error: function(XMLHttpRequest, textStatus){
                        alert("添加失败！");
                    }
                });
            }


            //分页
            $("label[data-attr='page']").on("click",function(){
                let pageOption=$(this).attr("data-page")
                let pageSize=$("#select_pageSize").val()
                let pageCount=$("#line_count")[0].innerText
                let currentPage=parseInt($("#current")[0].innerText)
                if (pageSize=="All")
                    pageSize=pageCount
                let topage=changePageDisplay(pageOption,currentPage,pageCount,pageSize)
                goPage(topage,pageSize,pageCount);
            });

            $('input[data-attr="jump"]').on("click",function(){
                let pageCount=$("#line_count")[0].innerText
                let pageSize=$("#select_pageSize").val()
                let page=$("#jump-input").val()
                if(pageSize=='All')
                    pageSize=pageCount

                if (page>Math.ceil(pageCount/pageSize) || isNaN(page)|| page<1){
                    alert("请检查输入的页数！");
                }else{
                    goPage(page,pageSize,pageCount);
                }
            });

            function changePageDisplay(pageOption,currentPage,pageCount,pageSize){
                let dic={
                    'first':1,
                    'next':(currentPage+1)>Math.ceil(pageCount/pageSize)?Math.ceil(pageCount/pageSize):(currentPage+1),
                    'prev':(currentPage<2)?1:currentPage-1,
                    'last':Math.ceil(pageCount/pageSize)
                }
                return dic[pageOption]
            }
            function goPage(page,pageSize,pageCount){
                $("#current").html(page)
                $("#line_start").html((page-1)*pageSize+1)
                $("#line_end").html(page*pageSize>pageCount?pageCount:page*pageSize)
                let orderby=$('#order_kind')[0].innerText
                $.ajax({
                    url: '/goPage/',
                    type: 'POST',
                    data: {
                        'page':page,
                        'pageSize':pageSize,
                        'orderby':orderby
                    },
                    dataType: 'JSON',
                    success: function(data){
                        var tab_str=""
                        let table_cols=$("#table_head")[0].children.length;
                        if(table_cols==3){
                            for (var j=0;j<data.page_lines.length;j++){
                                tab_str+="<tr data-lid="+data.page_lines[j].lid+">\
                                <td><input type='checkbox' id="+data.page_lines[j].lid+" data-lname="+data.page_lines[j].lname+"></td>\
                                <td>"+data.page_lines[j].sname+"</td>\
                                <td>"+data.page_lines[j].lname+"</td>\
                                </tr>\
                                "
                            }
                        }else if(table_cols==2){
                            for (var j=0;j<data.page_lines.length;j++){
                                tab_str+="<tr data-lid="+data.page_lines[j].lid+">\
                                <td>"+data.page_lines[j].sname+"</td>\
                                <td>"+data.page_lines[j].lname+"</td>\
                                </tr>\
                                "
                            }
                        }else{
                            
                        }
                        
                        $("#search_lresult").html(tab_str)

                    },
                    error: function(XMLHttpRequest, textStatus){
                        alert("失败！");
                    }
                });
            }

            $("#select_pageSize").on("change",function(){
                let pageSize=$(this).val();
                let page=1;
                let pageCount=$("#line_count")[0].innerText
                setPageNum();
                if (pageSize=="All"){
                    goPage(page,pageCount,pageCount);
                }else{
                    goPage(page,pageSize,pageCount);
                }
            });

            function setPageNum(){
                let pageCount=$("#line_count")[0].innerText
                let pageSize=$("#select_pageSize").val()
                if(pageSize=='All')
                    pageSize=pageCount
                let pageNum=Math.ceil(pageCount/pageSize)
                $("#pageNum").html("共"+pageNum+"页")
            }

            setPageNum();

            $("a[data-order*=sc]").on('click',function(){
                let pageCount=$("#line_count")[0].innerText
                let pageSize=$("#select_pageSize").val()
                if(pageSize=='All')
                    pageSize=pageCount
                let order_kind=$(this)[0].dataset.order
                $('#order_kind').html(order_kind)
                goPage(1,pageSize,pageCount);
            });

        }

        var fns = {
            search: search,
            upload: upload,
        };

        return fns;
    })();
    line.search('/search-line/');
    line.upload();
});
