!(function ($) {
  function showlist(sid, num) {
    //   1.获取后端数据-------------------------------------
    $.ajax({
      url: "http://10.31.162.42/amazon/php/6.cart.php",
      dataType: "json",
    }).done(function (data) {
      // console.log(data);

      $.each(data, function (index, value) {
        // console.log(value);

        // 2.将详情页点击添加购物车传过来的cookie值，渲染到购物车中------------------------
        if (sid == value.sid) {
          let $clonebox = $(".cartshow-list1:hidden").clone(true, true);
          //   console.log($clonebox);
          $clonebox.find(".show2-img").attr("src", value.url).css({
            width: 100,
            height: 100,
          });
          $clonebox.find(".show2-img").attr("sid", value.sid);
          $clonebox.find(".show2-title").html(value.title);
          $clonebox.find(".show4-price").html(value.price); //单价
          $clonebox.find(".show5-num").val(num); //数量

          //   计算小计
          $clonebox.find(".show6-sum").html((value.price * num).toFixed(2));
          // 设置克隆的li显示出来，添加到ul中
          $clonebox.css("display", "block");
          $(".cartshow").append($clonebox);
          zsum();
        }
      });
    });
  }

  //   3.获取cookie值,传给函数sid和num-----------------------------------------------
  if ($.cookie("cookiesid") && $.cookie("cookienum")) {
    //   $.cookie("cookiesid")----1,2,3  是，分割的字符串
    // console.log($.cookie("cookiesid"));

    // 将字符串转成数组
    let s = $.cookie("cookiesid").split(",");
    let n = $.cookie("cookienum").split(",");
    // 遍历数组，分别将cookie中sid和数量传给函数，渲染数据
    $.each(s, function (index, value) {
      // console.log(s[index], n[index]);
      showlist(s[index], n[index]);
    });
  }

  // 4.数量的改变---------------------------------------------------------
  // 点击-号--数量减少========
  $(".numjian").on("click", function () {
    //$(this)指的是减号
    // 找到点击的元素的父元素
    let $num = $(this).parent(".cartshow5").find("input").val();
    $num--;
    if ($num < 1) {
      $num = 1;
    }
    // 将加加减减后的数量再给input的value值
    $(this).parents(".cartshow5").find("input").val($num);
    // 执行小计函数,将计算后的小计赋值
    $(this)
      .parents(".cartshow")
      .find(".show6-sum")
      .html(getshow6sum($(this)));
    // 计算总价
    zsum();
    setcookie($(this));
    // console.log($(this).parent(".cartshow5").find("input").val());
    // console.log(
    //   $(this)
    //     .parents(".cartshowwrap")
    //     .find(".cartshow-list1:visible")
    //     .find(".cartshow4 .show4-price")
    //     .html()
        
    // );
  });

  // 点+号--数量增加==========
  $(".numjia").on("click", function () {
    //$(this)指的是减号
    // 找到点击的元素的父元素
    let $num = $(this).parent(".cartshow5").find("input").val();
    $num++;
    // 将加加减减后的数量再给input的value值
    $(this).parents(".cartshow5").find("input").val($num);
    // 执行小计函数,将计算后的小计赋值
    $(this)
      .parents(".cartshow")
      .find(".show6-sum")
      .html(getshow6sum($(this)));
    // 计算总价
    zsum();
    setcookie($(this));
  });

  // 输入框输入商品数量=============
  $(".cartshow5 input").on("input", function () {
    let $reg = /^\d+$/g; //只能输入数字
    let $value = $(this).val();
    // 如果输入的不符合,值设为1
    if (!$reg.test($value)) {
      $(this).val(1);
    }
    $(this)
      .parents(".cartshowwrap")
      .find(".show6-sum")
      .html(getshow6sum($(this)));
    // 计算总价
    zsum();
    setcookie($(this));
  });

  // 5.全选-------------------------------------
  // 当头部全选选中,找到其他的全选框,也设为选中---------------
  $(".topallcheck").on("change", function () {
    $(".cartshow-list1:visible")
      .find(":checkbox")
      .prop("checked", $(this).prop("checked"));
    $(".footcheckbox").prop("checked", $(this).prop("checked"));
    $(".topallcheck").prop("checked", $(this).prop("checked"));
    zsum(); //计算总价
  });

  // 当底部全选选中,找到其他的全选框,也设为选中------------------
  $(".footcheckbox").on("change", function () {
    $(".cartshow-list1:visible")
      .find(":checkbox")
      .prop("checked", $(this).prop("checked"));
    $(".footcheckbox").prop("checked", $(this).prop("checked"));
    $(".topallcheck").prop("checked", $(this).prop("checked"));
    zsum(); //计算总价
  });

  //商品复选框选中时,两个全选也要选中--------------------------------
  let $checkboxs = $(".cartshow-list1:visible").find(":checkbox");
  // console.log($checkboxs);
  //取出所有的checkbox元素集合
  $(".cartshowwrap").on("change", $checkboxs, function () {
    if (
      $(".cartshow-list1:visible").find(":checkbox").length ===
      $(".cartshow-list1:visible").find("input:checked").size()
    ) {
      $(".topallcheck").prop("checked", true);
      $(".footcheckbox").prop("checked", true);
    } else {
      $(".topallcheck").prop("checked", false);
      $(".footcheckbox").prop("checked", false);
    }
    zsum(); //计算总价
  });

  // 6.将修改后的数量存到cookie中------------------------------------------
  let arrsid = []; //用于存储商品的sid
  let arrnum = []; //用于存储商品的数量
  function changecookie() {
    if ($.cookie("cookiesid") && $.cookie("cookienum")) {
      arrsid = $.cookie("cookiesid").split(",");
      arrnum = $.cookie("cookienum").split(",");
    } else {
      arrsid = [];
      arrnum = [];
    }
  }

  // 7.重新设置cookie-----------------------------------------------------
  function setcookie(obj) {
    changecookie();
    // 找到obj传入对象对应的sid
    let $sid = obj.parents(".cartshow-list1").find("img").attr("sid");
    arrnum[$.inArray($sid, arrsid)] = obj
      .parents(".cartshow-list1")
      .find(".show5-num")
      .val();
    $.cookie("cookienum", arrnum, { expires: 7, path: "/" });
  }

  //8.删除操作--------------------------------------------------------------
  // 传入需要删除的商品sid,如果cookie中存在,就分别删除数组中的sid和num
  function delgood(sid, arrsid) {
    let $index = -1;
    $.each(arrsid, function (index, value) {
      if (sid === value) {
        $index = index;
      }
    });
    // 从哪个索引开始,删除1个
    arrsid.splice($index, 1);
    arrnum.splice($index, 1);

    $.cookie("cookiesid", arrsid, { expires: 7, path: "/" });
    $.cookie("cookienum", arrnum, { expires: 7, path: "/" });
  }

  // 点击商品上的删除按钮操作----------------------------------------------
  $(".cartshow7 a").on("click", function () {
    changecookie();
    if (window.confirm("你确定要删除该商品吗?")) {
      // 将点击元素的父元素删除
      $(this).parents(".cartshow-list1").remove();
      let delgoodsid = $(this)
        .parents(".cartshow-list1")
        .find("img")
        .attr("sid");
      delgood(delgood, arrsid); //将删除的商品sid传到cookie中,从cookie中删除掉这个商品
      zsum(); //计算总价
    }
  });

  // 点击下面的删除选中商品按钮------------------------------------
  $(".cartfoot-del a").on("click", function () {
    changecookie();
    if (window.confirm("你确定要删除该商品吗?")) {
      // 遍历所有商品列表,找到复选框为选中的,删除掉
      $(".cartshow-list1:visible").each(function () {
        if ($(this).find(":checkbox").is(":checked")) {
          $(this).remove();
          let delgoodsid = $(this)
            .parents(".cartshow-list1")
            .find("img")
            .attr("sid");
          delgood(delgood, arrsid); //将删除的商品sid传到cookie中,从cookie中删除掉这个商品
        }
      });
      zsum(); //计算总价
    }
  });

  // ==============计算小计的函数封装===========================
  function getshow6sum(good) {
    // 找到当前商品对应的单价
    let $goodprice = parseFloat(
      good.parents(".cartshowwrap").find('.cartshow-list1:visible').find(".show4-price").html()
    );

    // 找到当前商品对应的数量
    let $goodnum = parseInt(good.parents(".cartshow5").find("input").val());

    return ($goodprice * $goodnum).toFixed(2);
  }

  //=================计算总价的封装======================
  function zsum() {
    let $num = 0; //商品的数量
    let $zcount = 0; //商品的总价
    // 遍历除了隐藏的所有的商品列表
    // 找到被勾选的商品的数量和价格
    $(".cartshow-list1:visible").each(function (index, ele) {
      if ($(ele).find(".cartshow1 input").prop("checked")) {
        $num += parseInt($(ele).find(".cartshow5 input").val()); //商品数量
        $zcount += parseFloat($(ele).find(".show6-sum").html()); //小计
      }
    });
    // 将勾选的商品数量更新到下面的已选几件商品里
    $(".cartfoot-goodscount").find("em").html($num);
    // 将计算后的总价更新到合计
    $(".cartfoot-zcount").find("strong").html($zcount.toFixed(2));
  }
})(jQuery);
