var show_data_str='<tr>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
              <th><input class="form-control mr-sm-2 search_group" type="search" aria-label="Search" style="height:70%"></th>\
          </tr >\
          <tr id="main_item">\
              <th>Item</th>\
              <th>description</th>\
              <th>Tech</th>\
              <th>StopOnFail</th>\
              <th>Disable</th>\
              <th>mp</th>\
              <th>eng</th>\
              <th>grr</th>\
              <th>rel</th>\
              <th>LowerLimit</th>\
              <th>UpperLimit</th>\
              <th>Units</th>\
          </tr>';
var tech_table_str="<tr>\
                    <th>Item</th>\
                    <th>TestActions</th>\
                    <th>TestParameters</th>\
                    <th>TestCommands</th>\
                    <th>StopOnError</th>\
                </tr>";
var tech_table_limit_str="<tr>\
    <th>Item</th>\
    <th>units</th>\
    <th>lowerLimit</th>\
    <th>upperLimit</th>\
    <th>pattern</th>\
    <th>relaxedLowerLimit</th>\
    <th>relaxedUpperLimit</th>\
    <th>materialKey</th>\
    <th>materialValue</th>\
</tr>";
var currentLine=2;
//标志页面是main还是tech
var low_table_page="first";

//设置信息（创建TC文件的时候，需要得到project，git ,branch等信息）    
//当点击选择LogCSV的时候，调用
var setValue=function(){
    var project=$('#select-project').text()
    var git=$("#select_git").find("option:selected").text()
    var branch=$("#select_branch").find("option:selected").text()

    $("#project_form").val(project)
    $("#git_form").val(git)
    $("#branch_form").val(branch)
}


$(function () {
    function initVar(){
        //adjust height
        $(".movie-content").height(ds-$(".navbar").height());
        $(".sidebar").height(ds-$(".navbar").height());
        
        //use tooltip for img.
        $('[data-toggle="tooltip"]').tooltip();

        //click list and reload screen
        $("#a_list").click(function(){
            location.reload();
        });

        //slid left bar
        $(document).on("click",".slider",function(e){
            $("body").toggleClass("big-page");  //用来判断元素是否拥有此类名,有的话就删除,无的话就添加
            return false;
        });

        //get data when refresh
        // getTCData();
    }

    //update TC by project, git ,branch
    function getTCData(){
        var project=$('#select-project').text()
        var git=$("#select_git").find("option:selected").text()
        var branch=$("#select_branch").find("option:selected").text()

        //显示灰色的div，覆盖整个屏幕，相当于加载
        $('#hiddenDivId').css('display', 'block');
        $.ajax({
                    url: "getAllGit/",
                    type: "post",
                    async:true,
                    data: {
                        'project': project,
                        'git':git,
                        'branch':branch
                    },
                    dataType: 'JSON',
                    success: function (data) {
                        var str=''
                        var branch_str=""
                        var git_str=""
                        var download_station=""   //下载TC的站位选择

                        //隐藏灰色的div，相当于加载完毕
                        $('#hiddenDivId').css('display', 'none');

                        //update left bar
                        for (var key in data.stationlist){
                            var str_station="";
                            for (var j=0;j<data.stationlist[key].length;j++){
                                str_station+="<li><a class='a_station' href='#' style='color:#666;font-size:14px'>"+data.stationlist[key][j]+"</a></li>"
                                download_station+="<option>"+data.stationlist[key][j]+"</option>"      //下载TC的站位选择
                            }
                            str+='<div class="card">\
                            <div class="card-header-cate" id="heading'+key+'">\
                                <h2 class="mb-0">\
                                    <button class="btn btn-block btn-lg" type="button" data-toggle="collapse" data-target="#collapse'+key+'" aria-expanded="true" aria-controls="collapse'+key+'" style="font-size:16px;text-align:left;color:#000;background-color:#fff;">\
                                    '+key+'\
                                    </button>\
                                </h2>\
                            </div>\
                            <div id="collapse'+key+'" class="collapse" aria-labelledby="heading'+key+'" data-parent="#accordionExample">\
                                <div>\
                                    <ul class="bar_left_tc">\
                                    '+str_station+'\
                                    </ul>\
                                </div>\
                            </div>\
                            </div>'
                        }

                        $("#accordionExample").html(str)
                        $("#station_select").html(download_station)     //下载TC的站位选择

                        //update branch selection
                        if (branch==""){
                            for (var b=0;b<data.branches.length;b++){
                                if (data.now_branch==data.branches[b]){
                                branch_str+="<option selected>"+data.branches[b]+"</option>"
                                }else{
                                branch_str+="<option>"+data.branches[b]+"</option>"
                                }
                            }
                            $('#select_branch').html(branch_str)
                        }  

                        //update git selection
                        if (git==""){
                            for (var g=0;g<data.gits.length;g++){
                                if (data.now_git==data.gits[g]){
                                git_str+="<option selected>"+data.gits[g]+"</option>"
                                }else{
                                    git_str+="<option>"+data.gits[g]+"</option>"
                                }
                            }
                            $('#select_git').html(git_str)
                        }  

                        //update refresh time
                        $("#refresh_time").html(data.refresh_time)
                        
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("数据加载错误！");
                        $('#hiddenDivId').css('display', 'none');
                        $("#accordionExample").html("")
                    }
        });
    }

    function getItemTech(item){
        var project=$('#select-project').text()
        var git=$("#select_git").find("option:selected").text()
        var branch=$("#select_branch").find("option:selected").text()
        var station_name=$("#station_name").text();

        $.get("get_ItemTech/",{project:project,git:git,branch:branch,station:station_name,item:item},function(data,status){
            $("#tech_table").html(data)
        });     
    }
    
    function getItemLimit(item){
        var project=$('#select-project').text()
        var git=$("#select_git").find("option:selected").text()
        var branch=$("#select_branch").find("option:selected").text()
        var station_name=$("#station_name").text();

        $.ajax({
            url: "get_ItemLimit/",
            type: "post",
            dataType:"JSON",
            async:true,
            data: {
                'project': project,
                'git':git,
                'branch':branch,
                'station':station_name,
                'item':item
            },
            dataType: 'JSON',
            success: function (data) {
            var item_limit_str=""
                item_limit_str="<tr><td>"+data.itemLimit.name+"</td>\
                <td>"+data.itemLimit.units+"</td>\
                <td>"+data.itemLimit.lowerLimit+"</td>\
                <td>"+data.itemLimit.upperLimit+"</td>\
                <td>"+data.itemLimit.pattern+"</td>\
                <td>"+data.itemLimit.relaxedLowerLimit+"</td>\
                <td>"+data.itemLimit.relaxedUpperLimit+"</td>\
                <td>"+data.itemLimit.materialKey+"</td>\
                <td>"+data.itemLimit.materialValue+"</td></tr>"   

            $("#tech_table").html(tech_table_limit_str+item_limit_str)           
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("测项Limit加载错误！");
            }
        });    
    }

    const testCoverage=(function(){
        function getAllStations(){
            //select git or branch, then load data.
            $("#select_git").change(function(){
                $('#select_branch').html("")
                $("#station_name").html("");
                $("#show_data").html(show_data_str);
                $("#tech_table").html(tech_table_str)

                getTCData();
            });

            $("#select_branch").change(function(){
                $("#station_name").html("");
                $("#show_data").html(show_data_str);
                $("#tech_table").html(tech_table_str)

                getTCData();
            });

            //Pull TC and Refresh.
            $("#refresh_stationTC").click(function(){
                var project=$('#select-project').text()
                var git=$("#select_git").find("option:selected").text()
                var branch=$("#select_branch").find("option:selected").text()

                $("#station_name").html("");
                $("#show_data").html(show_data_str);
                $("#tech_table").html(tech_table_str)

                $('#hiddenDivId').css('display', 'block');

                $.post("pull_TC/",{project:project,git:git,branch:branch},function(data,status){          
                    if (!data.result){
                        alert("刷新失败！")
                    }else{
                        alert("刷新成功！")
                        $("#refresh_time").html(data.refresh_time)
                    }
                    $('#hiddenDivId').css('display', 'none');
                },dataType="JSON");
            });

        }
    
        function getStationInfo(){
            //refresh main screen first page by station
            $(document).on("click","a.a_station",function(e){
                var tab=$("#tech_table")
                var station_name=$(this).text();
                var project=$('#select-project').text()
                var git=$("#select_git").find("option:selected").text()
                var branch=$("#select_branch").find("option:selected").text()

                changeStationBgColor(this);
                $("show_data").html("");
                $("#station_name").html("");
                $("#show_data").html(show_data_str);
                tab.html(tech_table_str)

                $('#hiddenDivId').css('display', 'block');

                $.get("search_station/",{project:project,git:git,branch:branch,station:station_name,page:"first"},function(data,status){
                    $("#station_name").text(station_name);
                    $("#show_data").html(data);
                    $('#hiddenDivId').css('display', 'none');
                });
            });

            function changeStationBgColor(a_station){
                var stations=document.getElementsByClassName('a_station');

                for(i=0;i<stations.length;i++){
                    if(a_station==stations[i]){
                        stations[i].style.background="rgba(76,175,80,.8)";
                        stations[i].style.color="white";
                    }else{
                        stations[i].style.background="#fff";
                        stations[i].style.color="#666";
                    }
                }
            }

            $(".go_page").click(function(){
                var station_name=$("#station_name").text();
                var page=this.id;
                var project=$('#select-project').text()
                var git=$("#select_git").find("option:selected").text()
                var branch=$("#select_branch").find("option:selected").text()

                $('#hiddenDivId').css('display', 'block');

                if (station_name){
                    if (page=="second"){
                        $("#tech_table").html(tech_table_limit_str)
                    }else{
                        $("#tech_table").html(tech_table_str)
                    }

                    $.get("search_station/",{project:project,git:git,branch:branch,station:station_name,page:page},function(data,status){
                        $("#station_name").text(station_name);
                        $("#show_data").html(data);
                        $('#hiddenDivId').css('display', 'none');
                        low_table_page=page;
                    });
                }else{
                    $('#hiddenDivId').css('display', 'none');
                    alert("请选择站位！")
                }   
            });        

        }
    
        function getItemInfo(){
            //Change bgcolor and tech_item table onclick tr in table
            $(document).on("click","tr.item",function(e){
                var tr=document.getElementsByTagName('tr');
                var project=$('#select-project').text()
                var git=$("#select_git").find("option:selected").text()
                var branch=$("#select_branch").find("option:selected").text()
                //点击Tech测项时
                if ($(this).hasClass('search_tech_items')){
                    return false;
                }
                if ($(this).hasClass('tech_items')){
                    //点击Tech中 测项的第一行
                    if($(this.children).length>5){
                        //得到这个测项的测项名
                        var item_name=$(this.children[1])[0].innerText;
                        //tech中所有行，移除选中的背景
                        $("tr.tech_items").removeClass("select")
                        //给点击测项的所有行添加背景
                        $("tr."+item_name).addClass("select")
                        //并读取该侧向limit，显示在页面下部分
                        getItemLimit(item_name);
                    }else{
                        //点击Tech中，测项非第一行
                        //得到该行所有的class name
                        var attrs=$(this).attr("class").split(" ")
                        //刷选出有测项名字的class
                        for(a=0;a<attrs.length;a++){
                            if(attrs[a]!="item" && attrs[a]!="tech_items" && attrs[a]!="select" && attrs[a]!="tr_hover"){
                            item_name=attrs[a]
                            }
                        }
                        $("tr.tech_items").removeClass("select")
                        $("tr."+item_name).addClass("select")

                        getItemLimit(item_name);               
                    }
                }else{
                    for(i=2;i<tr.length;i++){
                        if(this==tr[i] && this.id != "tech_item"){
                            currentLine=i;
                            var station_name=$("#station_name").text();
                            var item=tr[i].children[1].innerText;

                            $("#show_data tr").eq(i).addClass("select")
                            $("#tech_table").html(tech_table_limit_str)

                            $.get("get_ItemTech/",{project:project,git:git,branch:branch,station:station_name,item:item},function(data,status){
                            $("#tech_table").html(data)
                            });               
                        }else{
                            $("#show_data tr").eq(i).removeClass("select")
                        }
                    }         
                }     
            });
        }
    
        function serachInfo(){
            //search content by item or command
            $(".dropdown-item").click(function(){
                $('#select_type').text($(this).text());
                $("#optionvalue").val($(this).text())
                $("#search_type").attr("placeholder","Search "+($(this).text()));
            });    
            
            //search Info by item or command
            $("#search_type").keydown(function(e){
                if(e.keyCode==13){
                    var mark=search_form.mark.value;
                    var inputStr=search_form.inputStr.value;
                    var project=$('#select-project').text()
                    var git=$("#select_git").find("option:selected").text()
                    var branch=$("#select_branch").find("option:selected").text()
                    $.post("searchByItemOrCommand/",{
                        mark:mark,
                        inputStr:inputStr,
                        project:project,
                        git:git,
                        branch:branch
                    },function(data,status){
                        $("#info_screen").html(data);
                    });
                }
            });
        }
    
        function createTCFile(){
            //form表单提交数据

            //get stations when download TC file
            $(document).on("click","#download_stationTC",function (e) {
                var station_name=$("#station_name").text();
                if (station_name){
                    $("#station_select").html("<option active>"+station_name+"</option>")
                }
            });
        }


        //use drap_line to resize the main and tech height
        function drapLine(){
            var max_height = $(window).height()*0.8;
            var min_height = 0;
            var mouse_y = 0;

            function drap_mouseMove(event){
                var top_height = event.clientY - mouse_y;
                top_height = top_height < min_height ? min_height : top_height;
                top_height = top_height > max_height ? max_height : top_height;

                $('#right_screen_main').height(top_height);
                $('#right_screen_tech').css({
                'top':top_height + 'px'
                });
                $('#right_screen_tech').height($(window).height()*0.8-top_height);
            };

            function drap_mouseUp() {
                document.onmousemove = null;
                document.onmouseup = null;
                //localStorage设置
                localStorage.setItem('sliderWidth', $('#right_screen_main').height)
            };

            $('#drap-line').mousedown(function(event){
                event.preventDefault();                //阻止默认事件

                mouse_y = event.clientY - $('#right_screen_main').get(0).offsetHeight;
                document.onmousemove = drap_mouseMove;
                document.onmouseup = drap_mouseUp;
            });
        }

        function updownKey(){
            function getIndexDown() {//获取当前的索引,向下
                var index=currentLine
                var len = $("#show_data tr").length;

                for(var i = 2; i < len; i++) {
                    if ($("#show_data tr").eq(i).hasClass("select")){
                        $("#show_data tr").eq(i %len).removeClass("select");
                        index = i + 1;
                    }
                }
                return index > (len-1) ? (len-1) : (index % len);
            }
            
            function getIndexUp() {//获取当前的索引,向上
                var len = $("#show_data tr").length;
                var index = currentLine

                for(var i = 2; i < len; i++) {
                    if ($("#show_data tr").eq(i).hasClass("select")){
                        $("#show_data tr").eq(i % len).removeClass("select");
                        index = i - 1;
                    }
                }
                return(index < 2) ? 2 : (index % len);
            }
            
            //Main表格使用上下键选中行
            $("#right_screen_main").attr('tabindex', 1).keydown(function(e) {
                //上下键只对第一页的main起作用
                if(low_table_page=="first"){
                    var key = (e.keyCode) || (e.which) || (e.charCode);//兼容IE(e.keyCode)和Firefox(e.which)
                    if (key == "38"){//向上
                        var up_tr=$("#show_data tr").eq(getIndexUp());
                        var tr_height=up_tr.height()

                        $("#right_screen_main").animate({ scrollTop: "-="+tr_height }, 100);
                        up_tr.addClass("select");

                        if(low_table_page=="first"){
                            getItemTech(up_tr[0].children[1].innerText)
                        }else if (low_table_page=="second"){
                            getItemLimit(up_tr[0].children[1].innerText)
                        }  
                    }
                    if (key == "40"){//向下
                        var down_tr=$("#show_data tr").eq(getIndexDown());

                        $("#right_screen_main").animate({ scrollTop: "+="+down_tr.height() }, 100);
                        down_tr.addClass("select");

                        if(low_table_page=="first"){
                            getItemTech(down_tr[0].children[1].innerText)
                        }else if (low_table_page=="second"){
                            getItemLimit(down_tr[0].children[1].innerText)
                        } 
                    }
                }
            });
        }

        function fixedThread(){
            //当滚动这个div的时候，将表头th都放到顶部
            $('#right_screen_main').on('scroll',function(){
                var top=$(this)[0].scrollTop;
                var thead=$('th.th_top');

                if(top>48){
                    thead.css('top',top-52);
                }else{
                    thead.css('top',0);
                }
            });

            //当滚动这个div的时候，将表头th都放到顶部
            $('#right_screen_tech').on('scroll',function(){
                var top=$(this)[0].scrollTop;
                var thead=$('th.th_top_tech');

                if(top>0){
                    thead.css('top',top-13);
                }else{
                    thead.css('top',0);
                }
            });  
        }
    
        function searchForTable(){
            //search table by input's value
            $(document).on("keyup",".search_group",function(e){
                var tr = $('tr');
                var n = 0;

                $("tr").hide();
                $(tr[0]).show();
                $(tr[1]).show();

                for (var i = 0; i < tr[0].children.length; i++) {
                    if(tr[0].children[i].children[0]==this){
                        n = i;
                    }else{
                        $(tr[0].children[i].children[0]).val("");
                    }
                }
                
                for (var i = 2; i < tr.length; i++) {
                    if((n==1) &&($(tr[i].children[1]).attr("rowspan")) && (tr[i].children[1].innerText.toUpperCase().includes(this.value.toUpperCase())) ){
                        for (var j= 0;j<$(tr[i].children[1]).attr("rowspan");j++){
                            $(tr[i+j]).show();
                        }
                    }else if(tr[i].children[n].innerText.toUpperCase().includes(this.value.toUpperCase())){
                        if (tr[i].children.length>5){
                            $(tr[i]).show();
                        }
                    }
                }
                // e.stopPropagation();//阻止冒泡过程
            });
        }
        var fns = {
            getAllStations: getAllStations,
            getStationInfo: getStationInfo,
            getItemInfo: getItemInfo,
            serachInfo: serachInfo,
            createTCFile: createTCFile,
            drapLine:drapLine,
            updownKey:updownKey,
            fixedThread:fixedThread,
            searchForTable:searchForTable,
        };

        return fns;

    })();

    initVar();
    testCoverage.getAllStations();
    testCoverage.getStationInfo();
    testCoverage.getItemInfo();
    testCoverage.serachInfo();
    testCoverage.createTCFile();
    testCoverage.drapLine();
    testCoverage.updownKey();
    testCoverage.fixedThread();
    testCoverage.searchForTable();
 
});