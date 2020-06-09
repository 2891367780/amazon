!(function ($) {
  function showlist(sid, num) {
    //   1.获取后端数据-------------------------------------
    $.ajax({
      url: "http://localhost/amazon/php/6.cart.php",
      dataType: "json",
    }).done(function (data) {
      console.log(data);

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
          $clonebox.find(".show4-price").html(value.price);
          $clonebox.find(".show5-num").val(num);

          //   计算小计
          $clonebox.find(".show6-sum").html((value.price * num).toFixed(2));
          // 设置克隆的li显示出来，添加到ul中
          $clonebox.css("display", "block");
          $(".cartshow").append($clonebox);
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
      console.log(s[index], n[index]);

      showlist(s[index], n[index]);
    });
  }
})(jQuery);
