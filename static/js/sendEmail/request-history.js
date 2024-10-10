'use strict'


$(function(){
    
    function setMailContentHeight(){
        let winHeight = $(window).outerHeight(true);
        let navHeight = $('nav').outerHeight(true);
        let optionbarHeight = $('.option_bar').outerHeight(true);
        let footerHeight = $('#footer').outerHeight(true);
        $(".mail_content").height(winHeight-navHeight-1.5*optionbarHeight-footerHeight)
    }
    const email = (function(){
        function win(){
            $('table tbody').on('click', 'tr td:nth-child(2) a', function(){
                event.preventDefault();
                var eid = this.dataset.eid;
                open('/showContent/?eid='+eid, 'email', 'width=700,height=500');
            });
        }

        function search(url){
            var searchKind = document.getElementById('search-kind'),
                searchInput = document.getElementById('search-input'),
                searchBtn = document.getElementById('search-btn');

            searchBtn.onclick = function(){
                var kind = searchKind.value,
                    val = searchInput.value.trim().toLowerCase();
                open(
                    url+'?kind='+kind+'&val='+val, 
                    '_self', 
                );
            }

            $("#select_all").on("click",function(){
                let ischecked=$(this).prop("checked")
                let $checked = $('input[type="checkbox"]');
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

            $("#delete").on("click",function(){
                let eids=""
                let $checked = $('input:checked');
                if ($checked.length==0){
                    alert("请选择邮件！ ");
                }else{
                    for(let checked of $checked){
                        if (checked.id!="select_all"){
                            eids=eids+","+checked.id
                        }
                    }
                    let isconfirm = confirm('请确认是否删除?');
                    if(isconfirm){
                        deleteEmail(eids)
                    }
                }                               
            });

            function deleteEmail(email_ids){
                $.ajax({
                    url: '/delete-email/',
                    type: 'POST',
                    data: {
                        eids:email_ids
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

        }

        var fns = {
            win: win,
            search: search,
        };

        return fns;
    })();

    email.win();
    email.search('/search/');
    setMailContentHeight();
});
