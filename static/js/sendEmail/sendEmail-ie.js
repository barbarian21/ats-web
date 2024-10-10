function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

$(function () {
  var self = window; // 获取preview-content元素

  self.getPreviewContentElem = function () {
    return $('#preview-content');
  }; // 设置preview-content高度


  self.setPreviewContentHeight = function () {
    var winHeight = $(window).outerHeight(true);
    var navHeight = $('nav').outerHeight(true);
    var preTitleHeight = $('#preview-title').outerHeight(true);
    var footerHeight = $('#footer').outerHeight(true);
    var $previewContent = getPreviewContentElem();
    var height = winHeight - (navHeight + 2 * preTitleHeight + footerHeight);
    $previewContent.css('minHeight', height);
    $previewContent.children().each(function () {
      $this = $(this);
      if ($this.children().length == 0) $this.hide();else $this.children().each(function () {
        $(this).hide();
      });
    });
  }; // 绘制页面


  self.drawPages = function () {
    // 获取页面按钮html
    function getPageBtnsHtml() {
      return "\n\t\t\t\t<div class=\"row mt-2 mb-2\">\n\t\t\t\t\t<div class=\"col-sm-12 text-center\">\n\t\t\t\t\t\t<button class=\"col-sm-3 btn btn-outline-secondary float-left\" type=\"button\" data-func=\"cls\">Clear</button>\n\t\t\t\t\t\t<button class=\"col-sm-3 btn btn-outline-secondary\" type=\"button\" data-dir=\"back\">Back</button>\n\t\t\t\t\t\t<button class=\"col-sm-3 btn btn-outline-secondary float-right\" type=\"button\" data-dir=\"next\">Next</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t";
    } // 获取描述文件html


    function getDescFileHtml() {
      return "<div class=\"row mt-2 mb-2\" data-desc=\"desc-file\">\n\t\t\t\t\t\t<div class=\"col-sm-12\">\n\t\t\t\t\t\t\t<a class=\"col-sm-12 btn btn-info\"  href=\"/static/sendEmail/New Line Application Format.xlsx\">New Line Application Format</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>";
    } // 获取每页的ps信息


    function getPagePsInfo() {
      function drawPs(data) {
        var ps = data;
        $pages = $('div[data-page]');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = $pages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var page = _step.value;
            var $page = $(page);
            var key = $page.data('page');
            var psInfos = ps[key];
            var html = '';
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = psInfos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var psInfo = _step2.value;
                html += "<p>".concat(psInfo, "</p>");
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            $("div[data-page=".concat(key, "] div[data-desc=ps]")).append(html);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      $.ajax({
        url: '/ps/',
        type: 'POST',
        dataType: 'json',
        success: function success(data) {
          // console.log(data);
          drawPs(data);
        },
        error: function error(XMLHttpRequest, textStatus) {
          console.log(textStatus);
        }
      });
    } // 删除page1的back按钮


    function removePage1BackBtn() {
      $('div[data-page=page1] button:nth-child(2)').remove();
    } // 修正page4


    function modifyPage4() {
      $('div[data-page=page4] button:nth-child(3)').html('Send')[0].dataset.dir = 'null';
    }

    var btns = getPageBtnsHtml();
    var descFileHtml = getDescFileHtml();
    $pages = $('div[data-page]');
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = $pages[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var page = _step3.value;
        var $page = $(page);
        var key = $page.data('page');
        var html = "\n\t\t\t\t<div data-desc=\"ps\">\n\t\t\t\t\t\t<div><b>Ps:</b></div>\n\t\t\t";
        html += "</div>";
        $page.append(btns).append(descFileHtml).append(html);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    removePage1BackBtn();
    modifyPage4(); // 隐藏页面

    $('div[data-page]:gt(0)').hide();
    getPagePsInfo();
  }; // 获取紧急联系人


  self.getEmergency = function () {
    // 渲染紧急联系人
    function drawEmergency(data) {
      var t = data;
      var teams = ['PGPD', 'PGKS'];
      var html = '';

      for (var _i = 0, _teams = teams; _i < _teams.length; _i++) {
        var team = _teams[_i];
        var emergencys = t[team];
        html += "<div>For ".concat(team, "\uFF1A</div>");
        html += '<div>';
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = emergencys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var emergency = _step4.value;
            html += "<span class=\"emerge mr-2 ml-2\">(".concat(emergency[0], ")").concat(emergency[1], "&nbsp;").concat(emergency[2], "(").concat(emergency[3], ")</span>");
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        html += '</div>';
      }

      $('#emergency').append(html);
    }

    $.ajax({
      url: '/emergency/',
      type: 'POST',
      dataType: 'json',
      success: function success(data) {
        // console.log(data);
        drawEmergency(data);
      },
      error: function error(XMLHttpRequest, textStatus) {
        console.log(textStatus);
      }
    });
  }; // 获取工厂和服务器信息


  self.getFactoryAndServer = function () {
    // 渲染工厂和服务器信息
    function drawFactoryAndServer(data) {
      var $1th = $('#page1-1th-row');
      var html = '';

      for (var key in data) {
        var factory = key.split(',');
        var fid = factory[0];
        var fname = factory[1];
        var servers = data[key];
        html += "\n\t\t\t\t\t<div class=\"row\">\n\t\t\t\t\t\t<div class=\"col-sm-2 border border-top-0\" data-fid=\"".concat(fid, "\">").concat(fname, "</div>\n\t\t\t\t\t\t<div class=\"col-sm-10 border-bottom border-right\">\n\t\t\t\t\t\t<form>\n\t\t\t\t");
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = servers[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var server = _step5.value;
            var sid = server[0];
            var sname = server[1];
            html += "\n\t\t\t\t\t\t<label><input type=\"checkbox\" data-fid=\"".concat(fid, "\" data-sid=\"").concat(sid, "\">").concat(sname, "</label>\n\t\t\t\t\t");
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        html += "\n\t\t\t\t\t\t\t</form>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t";
      }

      $1th.after(html);
    }

    $.ajax({
      url: '/factoryAndServer/',
      type: 'POST',
      dataType: 'json',
      success: function success(data) {
        // console.log(data);
        drawFactoryAndServer(data);
      },
      error: function error(XMLHttpRequest, textStatus) {
        console.log(textStatus);
      }
    });
  }; // 获取产品信息


  self.getProduct = function () {
    // 渲染产品信息
    function drawProduct(data) {
      var $products = $('#products');
      var products = data;
      var html = '<form>';
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = products[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var product = _step6.value;
          var pid = product[0];
          var pname = product[1];
          html += "<label class=\"mr-1\"><input type=\"radio\" name=\"optradio\" data-pid=\"".concat(pid, "\">").concat(pname, "</label>");
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      html += '</form>';
      $products.html(html);
    }

    $.ajax({
      url: '/product/',
      type: 'POST',
      dataType: 'json',
      success: function success(data) {
        // console.log(data);
        drawProduct(data);
      },
      error: function error(XMLHttpRequest, textStatus) {
        console.log(textStatus);
      }
    });
  }; // 设置方向


  self.setDir = function () {
    var from_tos = [['page1', 'page2'], ['page2', 'page3'], ['page3-1', 'page4'], ['page3-2', 'page4'], ['page3-3-1', 'page4'], ['page3-3-2', 'page4'], ['page3-3-3', 'page4'], ['page3-3-4', 'page4'], ['page3-4', 'page4']];

    for (var _i2 = 0, _from_tos = from_tos; _i2 < _from_tos.length; _i2++) {
      var from_to = _from_tos[_i2];
      var nextBtn = $("div[data-page=".concat(from_to[0], "] button[data-dir=next]"))[0];
      var backBtn = $("div[data-page=".concat(from_to[1], "] button[data-dir=back]"))[0];
      nextBtn.dataset.to = from_to[1];
      backBtn.dataset.from = from_to[0];
    }

    setPage3Dir();
    setPage33Dir();

    function setPage3Dir() {
      function setPage3NextBtn() {
        $('div[data-page=page3] button[data-dir=next]')[0].dataset.dir = 'null';
      }

      setPage3NextBtn();
    }

    function setPage33Dir() {
      function setPage33NextBtn() {
        $('div[data-page=page3-3] button[data-dir=next]')[0].dataset.dir = 'null';
      }

      setPage33NextBtn();
    }
  }; // 获取当前页面


  self.getCurrentPage = function ($btn) {
    while ($btn.attr('data-page') == undefined) {
      $btn = $btn.parent();
    }

    return $btn.attr('data-page');
  }; // 点击next按钮


  self.clickNextBtn = function () {
    function vali(page) {
      function valiDiff(page, selector, selector2) {
        function isNone() {
          var $inputs = $("div[data-page=".concat(page, "] ").concat(selector2));
          var _iteratorNormalCompletion7 = true;
          var _didIteratorError7 = false;
          var _iteratorError7 = undefined;

          try {
            for (var _iterator7 = $inputs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
              var input = _step7.value;
              if (input.getAttribute('type') == 'radio') if (input.checked) return [true, 'pass'];
              if (input.getAttribute('type') == 'text') if (input.value) return [true, 'pass'];
            }
          } catch (err) {
            _didIteratorError7 = true;
            _iteratorError7 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                _iterator7.return();
              }
            } finally {
              if (_didIteratorError7) {
                throw _iteratorError7;
              }
            }
          }

          return [false, 'fail:null'];
        }

        var _isNone = isNone(),
            _isNone2 = _slicedToArray(_isNone, 2),
            isPass = _isNone2[0],
            msg = _isNone2[1];

        if (isPass) {
          var $inputs = $("div[data-page=".concat(page, "] ").concat(selector));

          for (var i = 0; i < $inputs.length; i += 2) {
            var before = $inputs[i];
            var after = $inputs[i + 1];

            if (before.value != '' && after.value != '' && before.value == after.value) {
              $(after).focus();
              return [false, 'fail:diff'];
            }
          }

          return [true, 'pass'];
        }

        return [isPass, msg];
      }

      function valiPage1() {
        return $('div[data-page=page1] input:checked').length == 0 ? [false, 'fail:null'] : [true, 'pass'];
      }

      function valiPage2() {
        return $('div[data-page=page2] input:checked').length == 0 ? [false, 'fail:null'] : [true, 'pass'];
      }

      function valiPage31() {
        return $('#new-line').val() == '' ? [false, 'fail:null'] : [true, 'pass'];
      }

      function valiPage32() {
        return $('div[data-page=page3-2] input[data-vali=stationType]').val() == '' ? [false, 'fail:null'] : $('div[data-page=page3-2] input[data-search=line]').val() == '' ? [false, 'fail:null'] : [true, 'pass'];
      }

      function valiPage331() {
        return valiDiff('page3-3-1', 'input:not(:last)', 'input');
      }

      function valiPage332() {
        return $('div[data-page=page3-3-2] input[data-search=line]').val() == '' ? [false, 'fail:linenull'] : valiDiff('page3-3-2', 'input[type=text]:not(:first)', 'input:not(:first)');
      }

      function valiPage333() {
        return $('div[data-page=page3-3-3] input[data-desc=station-type]').val() == '' ? [false, 'fail:stationnull'] : valiDiff('page3-3-3', 'input[type=text]:not(:first)', 'input:not(:first)');
      }

      function valiPage334() {
        return valiDiff('page3-3-4', 'input[type=text]:gt(1)', 'input:gt(1)');
      }

      function valiPage34() {
        return $('div[data-page=page3-4] input[data-search=line]').val() == '' ? [false, 'fail:null'] : [true, 'pass'];
      }

      var valiPages = {
        'page1': valiPage1,
        'page2': valiPage2,
        'page3-1': valiPage31,
        'page3-2': valiPage32,
        'page3-3-1': valiPage331,
        'page3-3-2': valiPage332,
        'page3-3-3': valiPage333,
        'page3-3-4': valiPage334,
        'page3-4': valiPage34
      };
      return valiPages[page];
    }

    function showMsg(page) {
      function showMsg1(msg) {
        info('请至少选择一台server');
      }

      function showMsg2(msg) {
        info('请选择一个产品');
      }

      function showMsg31(msg) {
        info('请输入新线体名称');
      }

      function showMsg32(msg) {
        info('请填写必填项');
      }

      function showMsg331(msg) {
        if (msg == 'fail:null') info('请至少修改一项');
        if (msg == 'fail:diff') info('检查光标所在的输入框，注意修改内容前后必须不同');
      }

      function showMsg332(msg) {
        if (msg == 'fail:linenull') info('线体不能为空');
        showMsg331(msg);
      }

      function showMsg333(msg) {
        if (msg == 'stationnull') info('请填写站位类型');
        showMsg331(msg);
      }

      function showMsg334(msg) {
        showMsg331(msg);
      }

      function showMsg34(msg) {
        info('请填写要删除的线名');
      }

      var showMsgs = {
        'page1': showMsg1,
        'page2': showMsg2,
        'page3-1': showMsg31,
        'page3-2': showMsg32,
        'page3-3-1': showMsg331,
        'page3-3-2': showMsg332,
        'page3-3-3': showMsg333,
        'page3-3-4': showMsg334,
        'page3-4': showMsg34
      };
      return showMsgs[page];
    }

    $('#pages').on('click', 'button[data-dir=next]', function () {
      var $this = $(this);
      var currentPage = getCurrentPage($this);

      var _vali = vali(currentPage)(),
          _vali2 = _slicedToArray(_vali, 2),
          isPass = _vali2[0],
          msg = _vali2[1];

      if (isPass) {
        var nextPage = $this.data('to');
        $("div[data-page=".concat(currentPage, "]")).hide();
        $("div[data-page=".concat(nextPage, "]")).show();
        $("div[data-page=".concat(nextPage, "] button[data-dir=back]"))[0].dataset.from = currentPage;
      } else showMsg(currentPage)(msg);
    });
  }; // page3跳转


  self.page3Next = function () {
    $('div[data-page=page3] button[data-dir=null]').click(function () {
      var $this = $(this);
      var isPass = valiPage3();

      if (isPass) {
        var $radio = $('div[data-page=page3] input:checked');
        var currentPage = getCurrentPage($this);
        var nextPage = $radio.data('to');
        $("div[data-page=".concat(currentPage, "]")).hide();
        $("div[data-page=".concat(nextPage, "]")).show();
        $("div[data-page=".concat(nextPage, "] button[data-dir=back]"))[0].dataset.from = currentPage;
      } else info('请选择一项设置');
    });

    function valiPage3() {
      var $radios = $('div[data-page=page3] input[type=radio]');
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = $radios[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var radio = _step8.value;
          if (radio.checked) return true;
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      return false;
    }
  }; // page3-3跳转


  self.page33Next = function () {
    function setVal(page) {
      function setPage332() {
        $('div[data-page=page3-3-2] input:first')[0].value = $('div[data-page=page3-3] input:eq(0)')[0].value;
      }

      function setPage333() {
        $('div[data-page=page3-3-3] input:first')[0].value = $('div[data-page=page3-3] input:eq(1)')[0].value;
      }

      function setPage334() {
        $('div[data-page=page3-3-4] input:eq(0)')[0].value = $('div[data-page=page3-3] input:eq(2)')[0].value;
        $('div[data-page=page3-3-4] input:eq(1)')[0].value = $('div[data-page=page3-3] input:eq(3)')[0].value;
      }

      var pages = {
        'page3-3-2': setPage332,
        'page3-3-3': setPage333,
        'page3-3-4': setPage334
      };
      if (pages.hasOwnProperty(page)) pages[page]();
    }

    $page33NextBtn = $('div[data-page=page3-3] button[data-dir=null]');
    $page33NextBtn.click(function () {
      setPage33Next();
      var $this = $(this);
      var currentPage = getCurrentPage($this);
      var nextPage = $this[0].dataset.to;
      $("div[data-page=".concat(currentPage, "]")).hide();
      $("div[data-page=".concat(nextPage, "]")).show();
      $("div[data-page=".concat(nextPage, "] button[data-dir=back]"))[0].dataset.from = currentPage;
      setVal(nextPage);
    }); // 获取page3-3的input元素

    function getPage33InputElem() {
      return $('div[data-page=page3-3] input');
    } // 获取page3-3的input下标


    function getPage33InputIndex() {
      var $inputs = getPage33InputElem();

      for (var i = $inputs.length; i > 0; i--) {
        if ($($inputs[i - 1]).val()) return i;
      }

      return 0;
    } // 设置page3-3的next的data-to


    function setPage33Next() {
      var d = {
        0: 'page3-3-1',
        1: 'page3-3-2',
        2: 'page3-3-3',
        3: 'page3-3-4',
        4: 'page3-3-4'
      };
      var index = getPage33InputIndex();
      $page33NextBtn[0].dataset.to = d[index];
    }
  }; // 点击back按钮


  self.clickBackBtn = function () {
    $('#pages').on('click', 'button[data-dir=back]', function () {
      var $this = $(this);
      confirm('确定要返回上一页吗', $this, 'back');
    });
  }; // 搜索


  self.search = function () {
    function getEmailName() {
      $.ajax({
        url: 'http://eip.sh.pegatroncorp.com:789/StaffSearch.Web/StaffList.aspx?R1=EName&T1=Tito_Wu',
        dataType: "jsonp",
        success: function success(data) {
          console.log(data);
        },
        error: function error(XMLHttpRequest, textStatus) {
          console.log(textStatus);
        }
      });
    }

    function searchBind(selector, search) {
      function split(val) {
        return val.split(/,\s*/);
      }

      function extractLast(term) {
        return split(term).pop();
      }

      $(selector) // don't navigate away from the field on tab when selecting an item
      .on("keydown", function (event) {
        if (event.keyCode === $.ui.keyCode.TAB && $(this).autocomplete("instance").menu.active) {
          event.preventDefault();
        }
      }).autocomplete({
        source: function source(request, response) {
          $.getJSON(search, {
            term: extractLast(request.term)
          }, response);
        },
        search: function search() {
          // custom minLength
          var term = extractLast(this.value);

          if (term.length < 1) {
            return false;
          }
        },
        focus: function focus() {
          // prevent value inserted on focus
          return false;
        },
        select: function select(event, ui) {
          var terms = split(this.value); // remove the current input

          terms.pop(); // add the selected item

          terms.push(ui.item.value); // add placeholder to get the comma-and-space at the end

          terms.push("");
          this.value = terms.join(", ");
          $(this).keyup();
          return false;
        }
      });
    }

    var o = {
      'input[data-search=line]': 'line',
      'input[data-search=osx]': 'osx',
      'input[data-search=build]': 'build'
    };

    for (var key in o) {
      searchBind(key, o[key]);
    } // getEmailName();

  }; // 功能


  self.pagesFunc = function () {
    function addContent(pid, addHtml) {
      if (addHtml) $("#".concat(pid)).html(addHtml).show();else $("#".concat(pid)).html(addHtml).hide();
    }

    function keyupWriter(input) {
      var $input = $(input);
      var title = $input.parent().prev().text();
      var content = $input.val();
      var pid = $input[0].dataset.pid;
      var addHtml = title + ': ' + content;
      if (content) addContent(pid, addHtml);else addContent(pid, '');
    }

    function autoAddContentForKeyUp(page, selector) {
      $("div[data-page=".concat(page, "]")).on('keyup', selector, function () {
        keyupWriter(this);
      });
    }

    function changeWriterForKeyUp(page, selector) {
      $("div[data-page=".concat(page, "]")).on('keyup', selector, function () {
        var $this = $(this);
        var $title = $this.parent().parent().children(':eq(0)');
        var pid = $title[0].dataset.pid;
        var title = $title.text();
        var before = $title.next().children(':first').val();
        var after = $title.next().next().children(':first').val();
        var addHtml = "".concat(title, ": ").concat(before, " => ").concat(after);
        if (before == '' && after == '') addContent(pid, '');else addContent(pid, addHtml);
      });
    }

    function changeWriterForKeyUp2() {
      var $this = $(this);
      var $title = $this.parent().parent().parent().parent().parent().children(':eq(0)');
      var pid = $title[0].dataset.pid;
      var title = $title.text();
      var before = $title.next().find('input:checked').parent().text();
      var after = $title.next().next().find('input:checked').parent().text();
      var addHtml = "".concat(title, ": ").concat(before, " => ").concat(after);
      if (before == '' && after == '') addContent(pid, '');else addContent(pid, addHtml);
    }

    function emailSub(page, selector, desc) {
      var fn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (val) {};

      function emailSubject(extra) {
        var subject = combinaSubject() + extra;
        $('div[data-page=page4] #subject')[0].value = subject;
      }

      $("div[data-page=".concat(page, "] ").concat(selector)).change(function () {
        var extra = "".concat(desc, " ").concat(this.value);
        emailSubject(extra);
        fn(this.value);
      });
    }

    function relateBtn(page) {
      function calc() {
        var $radios = $("div[data-page=".concat(page, "] input[type=radio]"));
        var pos = $radios.index(this);
        var i = 4 * Math.floor(pos / 4) + 4 - 1 - pos % 4;
        $radios[i].checked = true;
        changeWriterForKeyUp2.bind($radios[i])();
      }

      $("div[data-page=".concat(page, "]")).on('click', 'input[type=radio]', function () {
        var $this = $(this);
        calc.bind(this)();
      });
    }

    function page1Func() {
      $('div[data-page=page1]').on('click', 'input[type=checkbox]', function () {
        $checked = $('div[data-page=page1] input:checked');
        var title = 'GH Server: ';
        var txt = '';
        var _iteratorNormalCompletion9 = true;
        var _didIteratorError9 = false;
        var _iteratorError9 = undefined;

        try {
          for (var _iterator9 = $checked[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
            var checked = _step9.value;
            txt += $(checked).parent().text() + ',';
          }
        } catch (err) {
          _didIteratorError9 = true;
          _iteratorError9 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
              _iterator9.return();
            }
          } finally {
            if (_didIteratorError9) {
              throw _iteratorError9;
            }
          }
        }

        if (txt) addContent('page1', title + txt.slice(0, -1));else addContent('page1', '');
      });
    }

    function page2Func() {
      var $product = $('div[data-page=page3-3-1] #product');
      $('div[data-page=page2]').on('click', 'input[type=radio]', function () {
        var txt = $('div[data-page=page2] input:checked').parent().text();
        var title = 'Product: ';
        addContent('page2', title + txt);
        $product.html(txt);
      });
    }

    function page3Func() {
      $('div[data-page=page3]').on('click', 'input[type=radio]', function () {
        var title = 'Request Category: ';
        var txt = $('div[data-page=page3] input:checked').parent().text();
        addContent('page3', title + txt);
      });
    }

    function page31Func() {
      autoAddContentForKeyUp('page3-1', 'input');
      emailSub('page3-1', '#new-line', 'For Line ');
    }

    function page32Func() {
      autoAddContentForKeyUp('page3-2', 'input');
      emailSub('page3-2', 'input:first', 'For Station ');
    }

    function page33Func() {
      autoAddContentForKeyUp('page3-3', 'input');
      emailSub('page3-3', 'input:first', 'For Line ', function (val) {
        $('div[data-page=page3-3-2] input:first')[0].value = val;
      });
      emailSub('page3-3', 'input:eq(1)', 'For Station ', function (val) {
        $('div[data-page=page3-3-3] input:first')[0].value = val;
      });
      emailSub('page3-3', 'input:eq(2)', 'For Unit ', function (val) {
        $('div[data-page=page3-3-4] input:eq(0)')[0].value = val;
      });
      emailSub('page3-3', 'input:eq(3)', 'For Unit ', function (val) {
        $('div[data-page=page3-3-4] input:eq(1)')[0].value = val;
      });
    }

    function page331Func() {
      changeWriterForKeyUp('page3-3-1', 'input:not(:last)');
      autoAddContentForKeyUp('page3-3-1', 'input:last');
    }

    function page332Func() {
      autoAddContentForKeyUp('page3-3-2', 'input:first');
      changeWriterForKeyUp('page3-3-2', 'input[type=text]:not(:first)');
      emailSub('page3-3-2', 'input:first', 'For Line ');
      relateBtn('page3-3-2');
    }

    function page333Func() {
      autoAddContentForKeyUp('page3-3-3', 'input:first');
      changeWriterForKeyUp('page3-3-3', 'input[type=text]:not(:first)');
      emailSub('page3-3-3', 'input:first', 'For Station ');
      relateBtn('page3-3-3');
    }

    function page334Func() {
      autoAddContentForKeyUp('page3-3-4', 'input:lt(2)');
      changeWriterForKeyUp('page3-3-4', 'input[type=text]:gt(1)');
      emailSub('page3-3-4', 'input:eq(0)', 'For Unit ');
      emailSub('page3-3-4', 'input:eq(1)', 'For Unit ');
      relateBtn('page3-3-4');
    }

    function page34Func() {
      autoAddContentForKeyUp('page3-4', 'input');
      emailSub('page3-4', 'input:first', 'For Line ');
    }

    function page4Func() {}

    page1Func();
    page2Func();
    page3Func();
    page31Func();
    page32Func();
    page33Func();
    page331Func();
    page332Func();
    page333Func();
    page334Func();
    page34Func();
    page4Func();
  }; // 清除


  self.clear = function (page) {
    function clsSelect() {
      $("div[data-page=".concat(page, "] input:checked")).each(function () {
        this.checked = false;
      });
    }

    function clsInput() {
      $("div[data-page=".concat(page, "] input[type=text]")).each(function () {
        this.value = '';
      });
    }

    function clsSelectAndInput() {
      clsSelect();
      clsInput();
    }

    function clsContent() {
      if ($("#".concat(page)).children().length) $("#".concat(page)).children().each(function () {
        this.innerHTML = '';
        this.style.display = 'none';
      });else $("#".concat(page)).html('').hide();
    }

    function clsPage1() {
      clsSelect();
      clsContent();
    }

    function clsPage2() {
      clsSelect();
      clsContent();
    }

    function clsPage3() {
      clsSelect();
      clsContent();
    }

    function clsPage31() {
      clsInput();
      clsContent();
    }

    function clsPage32() {
      clsInput();
      clsContent();
    }

    function clsPage33() {
      clsInput();
      clsContent();
    }

    function clsPage331() {
      clsInput();
      clsContent();
    }

    function clsPage332() {
      clsSelect();
      clsInput();
      clsContent();
    }

    function clsPage333() {
      clsSelect();
      clsInput();
      clsContent();
    }

    function clsPage334() {
      clsSelect();
      clsInput();
      clsContent();
    }

    function clsPage34() {
      clsInput();
      clsContent();
    }

    function clsPage4() {
      $("div[data-page=".concat(page, "] input:not(:eq(2))")).each(function () {
        this.value = '';
      });
    }

    var clsPages = {
      'page1': clsPage1,
      'page2': clsPage2,
      'page3': clsPage3,
      'page3-1': clsPage31,
      'page3-2': clsPage32,
      'page3-3': clsPage33,
      'page3-3-1': clsPage331,
      'page3-3-2': clsPage332,
      'page3-3-3': clsPage333,
      'page3-3-4': clsPage334,
      'page3-4': clsPage34,
      'page4': clsPage4
    };
    return clsPages[page];
  };

  self.readyCls = function () {
    (function () {
      $('#pages').on('click', 'button[data-func=cls]', function () {
        confirm('确定要对当前页做清空操作吗', $(this), 'clear');
      });
    })();
  }; // 邮件


  self.sendEmail = function () {
    function getUserName() {
      return $('#usr').val().trim();
    }

    function getPassWord() {
      return $('#pwd').val().trim();
    }

    function getSubject() {
      return $('#subject').val().trim();
    }

    function getBody() {
      function getNodes($parent) {
        var $children = $parent.children();
        var _iteratorNormalCompletion10 = true;
        var _didIteratorError10 = false;
        var _iteratorError10 = undefined;

        try {
          for (var _iterator10 = $children[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
            var child = _step10.value;
            if ($(child).children().length) getNodes($(child));else arr.push(child.innerText);
          }
        } catch (err) {
          _didIteratorError10 = true;
          _iteratorError10 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
              _iterator10.return();
            }
          } finally {
            if (_didIteratorError10) {
              throw _iteratorError10;
            }
          }
        }
      }

      var arr = [];
      var text = 'Hi groundhog team,\n\nPlease help on this, thanks~\n\n';
      getNodes($('#preview-content'));

      for (var _i3 = 0, _arr2 = arr; _i3 < _arr2.length; _i3++) {
        var txt = _arr2[_i3];
        if (txt) text += txt + '\n';
      }

      return text;
    }

    function getF() {
      return $('#f').val().trim();
    }

    function getTo() {
      return $('#to').val().trim();
    }

    function getCC() {
      var cc = $('#cc')[0].value.trim();

      if (cc) {
        var arr = cc.split(';');
        var a = [];
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = arr[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var item = _step11.value;
            if (item) a.push(item);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return a;
      }

      return [];
    }

    function valiEmail() {
      var usr = $('#usr').val();
      var pwd = $('#pwd').val();
      var f = $('#f').val();
      var to = $('#to').val();
      if (usr && pwd && f && to) return true;else return false;
    }

    $('#hide-email').click(function () {
      var formData = new FormData();
      formData.append('usr', getUserName());
      formData.append('pwd', getPassWord());
      formData.append('subject', getSubject());
      formData.append('body', getBody());
      formData.append('f', getF());
      formData.append('to', getTo());
      formData.append('cc', JSON.stringify(getCC()));
      formData.append('appendix', $('#myFile')[0].files[0]);
      $.ajax({
        url: '/email/',
        type: 'POST',
        cache: false,
        processData: false,
        contentType: false,
        data: formData,
        dataType: 'text',
        success: function success(data) {
          info(data);
        },
        error: function error(XMLHttpRequest, textStatus) {
          info('密码错误');
        }
      });
    });
    $('div[data-page=page4] button:last').click(function () {
      if (valiEmail()) {
        confirm('请确认信息无误，是否发出mail', this, 'email');
      } else info('请检查必填项');
    });
  }; // 拼接邮件subject


  self.combinaSubject = function () {
    var txt = '';
    {
      var $servers = $('div[data-page=page1] input:checked');
      var arr = [];
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = $servers[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var server = _step12.value;
          arr.push(server.parentNode.innerText);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      txt = '[' + arr.join('|') + ']';
    }
    {
      var $product = $('div[data-page=page2] input:checked');
      txt += "[".concat($product.parent().text(), "]");
    }
    {
      var $select = $('div[data-page=page3] input:checked');
      txt += "[".concat($select.parent().text(), "]");
    }
    return txt;
  };
}); // 主流程

$(function () {
  // 设置preview-content高度
  setPreviewContentHeight(); // 获取工厂和服务器信息

  getFactoryAndServer(); // 获取产品信息

  getProduct(); // 获取紧急联系人

  getEmergency(); // 绘制页面

  drawPages(); // 设置方向

  setDir(); // 点击next按钮

  clickNextBtn(); // page3跳转

  page3Next(); // page3-3跳转

  page33Next(); // 点击back按钮

  clickBackBtn(); // 搜索

  search(); // 功能

  pagesFunc(); // 清除

  readyCls(); // 邮件

  sendEmail();
}); // 提示信息

function info(msg) {
  $("#dialog-message").dialog({
    draggable: false,
    modal: true,
    buttons: {
      '确定': function _() {
        $(this).dialog("close");
      }
    }
  }).html(msg);
  $('button.ui-dialog-titlebar-close').html('<i class="fa fa-times" aria-hidden="true"></i>');
} // 确认


function confirm(msg, $this, operate) {
  $("#confirm").dialog({
    draggable: false,
    modal: true,
    buttons: {
      '确定': function _() {
        $(this).dialog("close");

        if (operate == 'back') {
          clear(getCurrentPage($this))();
          var prevPage = $this[0].dataset.from;
          var currentPage = getCurrentPage($this);
          $("div[data-page=".concat(currentPage, "]")).hide();
          $("div[data-page=".concat(prevPage, "]")).show();
        }

        if (operate == 'clear') clear(getCurrentPage($this))();
        if (operate == 'email') $('#hide-email').click();
      },
      '取消': function _() {
        $(this).dialog("close");
      }
    }
  }).html(msg);
  $('button.ui-dialog-titlebar-close').html('<i class="fa fa-times" aria-hidden="true"></i>');
}
