!(function ($) {
  const $mainleft2_list = $(".render1");
  const $mainleft3_list = $(".mainleft3-list");
  //1.请求数据渲染--------------------------------------------------------------------
  $.ajax({
    url: "http://10.31.162.42/amazon/php/1.index.php",
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

    //2.添加懒加载效果-----------------------------------------------------------------
    $(function () {
      $("img.lazy").lazyload({ effect: "fadeIn" });
    });
  });

  //3.二级导航-------------------------------------------------------------------------
  const $menuli = $(".menu li");
  const $cartlist = $(".menulist");
  const $items = $(".item");
  const $banner = $(".banner");

  //1.左侧的菜单li进行移入移出。
  $menuli.on("mouseover", function () {
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

  // 4.楼梯效果----------------------------------------------------------------------
  const $louti = $("#loutinav"); //旁边整个导航栏
  const $contents = $(".louti"); //每一块内容的集合
  const $loutili = $("#loutinav li").not(".last"); //旁边的导航栏li楼梯(不包括顶部)

  //封装滚动条滚动函数
  scroll();
  function scroll() {
    //滚动条滚动时=========================================================
    $(window).on("scroll", function () {
      let $scrolltop = $(window).scrollTop(); //滚动条距离顶部的距离
      //1.如果滚动条滚动距离大于某个值的时候,让导航栏固定在页面的中间
      if ($scrolltop > 280) {
        $louti.css({
          top: 200,
        });
      } else {
        $louti.css({
          top: 700,
        });
      }
      //2.滚动条滚动时,对应导航栏显示红色================================================
      //当滚动条滚动距离小于每一块内容的top值(根据效果可以微调大一点)的时候,就让对应的导航栏加class名变红色
      //每一块内容的top值固定的
      $contents.each(function (index, ele) {
        //index当前的一块内容的索引  ele当前内容的元素
        $contenttop = $(this).offset().top + $(ele).height() / 2; //每一块内容的top值
        if ($scrolltop < $contenttop) {
          //当前内容的高度比滚动条高,当前内容的导航变红
          $loutili.removeClass("active"); //先让所有导航都删除样式,再让当前内容的导航变红
          $loutili.eq(index).addClass("active");
          return false;
        }
      });
    });
  }

  //点击旁边导航栏==========================================================================
  $loutili.on("click", function () {
    $(window).off("scroll"); //在点击导航栏li的时候,不要滚动条按照顺序滚动
    //点击的li,变红,添加类active,兄弟元素删除active
    $(this).addClass("active").siblings("li").removeClass("active");

    //点击导航栏li,跳到对应的内容--求出对应内容的top值,然后将对应内容的top值赋给滚动条高度
    //$(this).index():点击内容对于的索引值
    let $h = $contents.eq($(this).index()).offset().top; //对应内容的top值
    //$("html,body"):让整个html的滚动条top变化,兼容写法 (针对整个html和body的)
    $("html,body")
      .stop(true)
      .animate(
        //animate的方法使用
        {
          scrollTop: $h,
        },
        function () {
          //因为上面关闭了滚动事件,所以需要重新打开滚动事件,并且执行滚动函数
          //在动画完成时,再执行下面的函数
          $(window).on("scroll");
          scroll();
        }
      );
  });

  //点击回到顶部==========================================================================
  $(".last").on("click", function () {
    $("html,body").stop(true).animate({
      scrollTop: 0, //点击回到顶部,滚动条top为0(针对整个html和body的)
    });
  });

  // 5.轮播图效果-------------------------------------------------------------------
  $lunbo = $(".lunbo");
  $picul = $(".lunbo ul");
  $picli = $picul.children(); //4个
  $btnli = $(".lunbo ol li"); //4个按钮
  $leftarrow = $(".left");
  $rightarrow = $(".right");
  $index = 0;
  $timer = null;

  // 初始化函数
  init();
  function init() {
    let _this = this;
    // 点击4个按钮
    $btnli.on("click", function () {
      $index = $(this).index(); //存当前点击的按钮的下标
      tabswitch();
    });

    // 点击右边箭头
    $rightarrow.on("click", function () {
      rightevent();
    });

    // 点击左边箭头
    $leftarrow.on("click", function () {
      leftevent();
    });

    // 自动轮播
    $timer = setInterval(function () {
      $rightarrow.click();
    }, 3000);

    // 鼠标移入移出停止开启轮播
    $lunbo.hover(
      function () {
        clearInterval($timer);
      },
      function () {
        $timer = setInterval(function () {
          $rightarrow.click();
        }, 3000);
      }
    );
  }

  //============================================================
  //1.点击4个按钮,按钮颜色变化,对应的图片透明度改变
  function tabswitch() {
    // 当前点击的变成红色,其他的取消
    $btnli
      .eq($index)
      .css("background",'orange')
      .siblings("ol li")
      .css("background",'none')
    $picli
      .eq($index)
      .animate({
        opacity: 1,
      })
      .siblings("ul li")
      .animate({
        opacity: 0,
      });
  }

  // 2.点击左右箭头图片改变
  function rightevent() {
    $index++;
    if ($index > $btnli.length - 1) {
      $index = 0;
    }
    tabswitch();
  }

  function leftevent() {
    $index--;
    if ($index < 0) {
      $index = $btnli.length - 1;
    }
    tabswitch();
  }
})(jQuery);
