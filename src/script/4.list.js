!(function ($) {
  let array_default = []; //排序前的li数组
  let array = []; //排序中的数组
  let prev = null;
  let next = null;

  const $right2 = $(".right2 ul");
  //1.请求数据渲染----------------------------------------------------
  $.ajax({
    url: "http://localhost/amazon/php/4.list.php",
    dataType: "json",
  }).done(function (data) {
    // console.log(data);
    // 渲染列表页--------------------------------------------
    let $mainright = "";
    $.each(data, function (index, value) {
      //   console.log(value);
      $mainright += `
      <li>
      <a href="" target="_blank">
        <img
        class="lazy" data-original="${value.url}" width="200" height="200"
        />
        <h3>
        ${value.title}
        </h3>
        <p>${value.title}</p>
        <span class="price">
        <em>￥</em>
        ${value.price}
        </span>
        <i>${value.sailnumber}</i>
      </a>
    </li>
                `;
    });
    $right2.html($mainright);

    //2.添加懒加载效果------------------------------------------
    $(function () {
      $("img.lazy").lazyload({ effect: "fadeIn" });
    });

    array_default = []; //排序前的li数组
    array = []; //排序中的数组
    prev = null;
    next = null;
    //将页面的li元素加载到两个数组中
    $(".right2 li").each(function (index, element) {
      array[index] = $(this);
      array_default[index] = $(this);
    });
  });

  //渲染的外部无法获取内部的元素对象，通过事件委托实现。

  //2.分页思路
  // 告知后端当前请求的是第几页数据。将当前的页面页码传递给后端(get和page)
  $(".page").pagination({
    pageCount: 3, //总的页数
    jump: true, //是否开启跳转到指定的页数，布尔值。
    coping: true, //是否开启首页和尾页，布尔值。
    prevContent: "上一页",
    nextContent: "下一页",
    homePage: "首页",
    endPage: "尾页",
    callback: function (api) {
      console.log(api.getCurrent()); //获取的页码给后端
      $.ajax({
        url: "http://localhost/amazon/php/4.list.php",
        data: {
          page: api.getCurrent(),
        },
        dataType: "json",
      }).done(function (data) {
        console.log(data);
        // 渲染列表页--------------------------------------------
        let $mainright = "";
        $.each(data, function (index, value) {
          // console.log(value);

          $mainright += `
              <li>
              <a href="" target="_blank">
                <img
                class="lazy" data-original="${value.url}" width="200" height="200"
                />
                <h3>
                ${value.title}
                </h3>
                <p>${value.title}</p>
                <span class="price">
                ￥
                ${value.price}
                </span>
                <i>${value.sailnumber}</i>
              </a>
            </li>
                        `;
        });
        $right2.html($mainright);

        array_default = []; //排序前的li数组
        array = []; //排序中的数组
        prev = null;
        next = null;

        //将页面的li元素加载到两个数组中
        $(".right2 li").each(function (index, element) {
          array[index] = $(this);
          array_default[index] = $(this);
        });
      });
    },
  });

  //3.排序

  $(".sortbn button")
    .eq(0)
    .on("click", function () {
      $.each(array_default, function (index, value) {
        $(".right2 ul").append(value);
      });
      return;
    });

  $(".sortbn button")
    .eq(1)
    .on("click", function () {
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          prev = parseFloat(array[j].find(".price").html().substring(1));
          next = parseFloat(array[j + 1].find(".price").html().substring(1));
          //通过价格的判断，改变的是li的位置。
          if (prev > next) {
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }

      $.each(array, function (index, value) {
        console.log(value); //n.fn.init [li, context: li]
        $(".right2 ul").append(value);
      });
    });

  $(".sortbn button")
    .eq(2)
    .on("click", function () {
      for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
          prev = parseFloat(array[j].find(".price").html().substring(1));
          next = parseFloat(array[j + 1].find(".price").html().substring(1));
          //通过价格的判断，改变的是li的位置。
          if (prev < next) {
            let temp = array[j];
            array[j] = array[j + 1];
            array[j + 1] = temp;
          }
        }
      }
      //清空原来的列表，将排序后的数据添加上去。
      //empty() : 删除匹配的元素集合中所有的子节点。
      // $('.list ul').empty();//清空原来的列表
      $.each(array, function (index, value) {
        // console.log(value);
        $(".right2 ul").append(value);
      });
    });
})(jQuery);
