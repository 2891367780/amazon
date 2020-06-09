!(function ($) {
  // 1.获取列表页通过地址栏传来的sid---------------------------
  let $sid = location.search.substring(1).split("=")[1];

  // 放大镜中变量
  const $smallpic = $("#smallpic");
  const $bpic = $("#bpic"); //大图
  const $title = $(".loadtitle");
  const $price = $(".loadpcp");
  const $buy = $(".buy");

  // 2.判断sid是否存在------------------------------------------
  if (!$sid) {
    $sid = 1;
  }

  //   3.将获取到的sid通过ajax传给后端----------------------------------
  $.ajax({
    url: "http://10.31.162.42/amazon/php/5.detail.php",
    data: {
      sid: $sid,
    },
    dataType: "json",
  }).done(function (d) {
    // console.log(d);
    // 分别按照传过来的sid找到对应的图片和标题赋值
    $smallpic.attr("src", d.url);
    $smallpic.attr("sid", d.sid);
    $bpic.attr("src", d.url);
    $buy.attr("src", d.buy);
    $title.html(d.title);
    $price.html(d.price);

    // 4.渲染小图----------------------------------------------------------
    // console.log(d.piclisturl.split(','));小图数据库中地址都是，分割的
    //转成数组，遍历数组中每个元素，也就是小图地址，分别渲染到li中的img地址上
    let picarr = d.piclisturl.split(",");
    let $strhtml = "";
    $.each(picarr, function (index, value) {
      $strhtml += '<li><img src="' + value + '"/><li>';
    });
    $("#list ul").html($strhtml);
  });

  // 5.放大镜效果
  const $spic = $("#spic"); //小图
  const $sf = $("#sf"); //小放
  const $bf = $("#bf"); //大放
  const $list = $("#list"); //小图列表

  // 放大镜比例：小图/大图=小放/大放
  // 小放=（小图*大放）/大图
  $sfwidth = ($spic.width() * $bf.width()) / $bpic.width();
  $sf.width($sfwidth);

  $sfheight = ($spic.height() * $bf.height()) / $bpic.height();
  $sf.height($sfheight);

  // 计算放大比例 大图/小图  放大比例大于1
  $bili = $bpic.width() / $spic.width();

  // 鼠标经过小图
  $spic.hover(
    function () {
      // 小放和大放显示
      $sf.css("visibility", "visible");
      $bf.css("visibility", "visible");

      // $(this)指的是鼠标滑过的对象
      $(this).on("mouseover", function (e) {
        // 计算放大镜的位移
        let $leftvalue =
          e.pageX - $(".detailmainpic_wrap").offset().left - $sf.width() / 2;
        let $topvalue =
          e.pageY - $(".detailmainpic_wrap").offset().top - $sf.height() / 2;

        // 限制放大镜四周位移的范围
        // 限定水平方向范围
        if ($leftvalue < 0) {
          $leftvalue = 0;
        } else if ($leftvalue >= $spic.width() - $sf.width()) {
          $leftvalue = $spic.width() - $sf.width();
        }

        // 限定垂直方向位移
        if ($topvalue < 0) {
          $topvalue = 0;
        } else if ($topvalue >= $spic.height() - $sf.height()) {
          $topvalue = $spic.height() - $sf.height();
        }

        // 给放大镜设置css样式
        $sf.css({
          left: $leftvalue,
          top: $topvalue,
        });

        // 大图需要移动的位置
        $bpic.css({
          left: -$leftvalue * $bili,
          top: -$topvalue * $bili,
        });
      });

      // 鼠标移出
    },
    function () {
      $sf.css("visibility", "hidden");
      $bf.css("visibility", "hidden");
    }
  );

  // 小图列表切换
  $("#list ul").on("click", "li", function () {
    // $(this)指当前点击的li，找到li中的img，取出属性src
    // 将当前点击的图片的路径分别赋值给小图和大图的src
    let $imgurl = $(this).find("img").attr("src");
    $smallpic.attr("src", $imgurl);
    $bpic.attr("src", $imgurl);
  });

  // 点击加入购物车操作
  let arrsid = [];
  let arrnum = [];

  // 获取cookie
  function cookietoarray() {
    if ($.cookie("cookiesid") && $.cookie("cookienum")) {
      arrsid = $.cookie("cookiesid").split(",");
      arrnum = $.cookie("cookienum").split(",");
    } else {
      arrsid = [];
      arrnum = [];
    }
  }

  //
  $(".cartbn").on("click", function () {
    // 获取点击的元素的sid，通过找到父级再找小图的sid
    let $sid = $(this).parents(".detailmain").find("#smallpic").attr("sid");
    // console.log($sid);
    cookietoarray();
    // 如果sid在cookie中找到了
    // 将cookie中的数量和输入框中值相加重新赋值给cookie中
    if ($.inArray($sid, arrsid) != -1) {
      let $num =
        parseInt(arrnum[$.inArray($sid, arrsid)]) + parseInt($("#count").val());
      arrnum[$.inArray($sid, arrsid)] = $num;
      $.cookie("cookienum", arrnum, { expires: 10, path: "/" });

      // 如果sid没有找到
      // 直接将sid放入数组中
    } else {
      arrsid.push($sid);
      $.cookie("cookiesid", arrsid, { expires: 10, path: "/" });
      arrnum.push($("#count").val());
      $.cookie("cookienum", arrnum, { expires: 10, path: "/" });
    }
    alert("已经加入购物车");
  });
})(jQuery);
