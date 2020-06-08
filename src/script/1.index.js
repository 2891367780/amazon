!(function ($) {
  const $mainleft2_list = $(".render1");
  const $mainleft3_list = $(".mainleft3-list");
  //1.请求数据渲染----------------------------------------------------
  $.ajax({
    url: "http://localhost/amazon/php/1.index.php",
    dataType: "json",
  }).done(function (data) {
    // console.log(data);
    // 渲染第一部分--------------------------------------------
    let $main1str = "";
    $.each(data, function (index, value) {
      // console.log(value);
      if (index < 10) {
        $main1str += `
                <li>
                  <a href="" target="_blank">
                    <img
                    class="lazy" data-original="${value.url}" width="200" height="200"
                    />
                    <span class="price">
                      <em>￥</em>
                      ${value.price}
                    </span>
                    <p>${value.title}</p>
                    <i>距结束</i>
                  </a>
                </li>
                `;
      }
      $mainleft2_list.html($main1str);
    });

    // 渲染第二第三部分---------------------------------------
    // 懒加载中img必须添加class="lazy" data-original="${value.url}" width="200" height="200"
    let $main2str = "";
    $.each(data, function (index, value) {
      // console.log(value);
      if (index < 5) {
        $main2str += `
                <li>
                  <a href="" target="_blank">
                    <img
                    class="lazy" data-original="${value.url}" width="200" height="200"
                    />
                    <span class="price">
                      <em>￥</em>
                      ${value.price}
                    </span>
                    
                  </a>
                </li>
                `;
      }
    });
    $mainleft3_list.html($main2str);

    //2.添加懒加载效果------------------------------------------
    $(function () {
      $("img.lazy").lazyload({ effect: "fadeIn" });
    });
  });

  //3.二级导航
  //   const $menuli = $(".menu ul li");
  //   const $menulist = $(".menulist");
  //   const $menuitem = $(".menulist .item");
  //   const $menu = $(".menu");

  //   $menuli.on("mouseover", function () {
  //     $menulist.show();
  //     $menuitem.eq($(this).index()).show().siblings(".item").hide();
  //   });

  //   $menuli.on("mouseout", function () {
  //     $menulist.hide();
  //   });

  //   //cartlist自身移入移出
  //   $menulist.on("mouseover", function () {
  //     $(this).show();
  //   });

  //   $menulist.on("mouseout", function () {
  //     $(this).hide();
  //   });

  const $menuli = $(".menu li");
  const $cartlist = $(".menulist");
  const $items = $(".item");
  const $banner = $(".banner");

  //1.左侧的菜单li进行移入移出。
  $menuli.on("mouseover", function () {
    // $(this).addClass("active").siblings(".menu li").removeClass("active");
    //滚动条的top值如果大于$banner盒子的top值，$cartlist的top就是前面滚动条的top值 - $banner盒子的top值
    // if ($(window).scrollTop() > $banner.offset().top) {
    //   $cartlist.css({
    //     top: $(window).scrollTop() - $banner.offset().top,
    //   });
    // } else {
    //   $cartlist.css({
    //     top: 0,
    //   });
    // }
    $cartlist.show();
    $items.eq($(this).index()).show().siblings(".item").hide();
  });

  $menuli.on("mouseout", function () {
    $cartlist.hide();
  });

  //cartlist自身移入移出
  $cartlist.on("mouseover", function () {
    $(this).show();
  });

  $cartlist.on("mouseout", function () {
    $(this).hide();
  });
})(jQuery);
