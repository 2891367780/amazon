/* 
1.发送ajax,将输入框输入的用户名和密码传给后端
2.后端代码中和数据库比对,返回比对结果
3.前端根据结果,如果成功,跳转到首页并且存储用户名密码
*/

!(function ($) {
  const $username = $(".username");
  const $pass = $(".password");
  const $span = $(".btnspan");
  $(".btn").on("click", function () {
    $.ajax({
      type: "post",
      url: "http://10.31.162.42/amazon/php/2.login.php",
      data: {
        user: $username.val(),
        pass: hex_sha1($pass.val()), //密码通过sha1加密
      },
    }).done(function (result) {
      // 如果成功,页面跳转,本地存储用户名和密码
      if (result) {
        location.href = "http://10.31.162.42/amazon/src/1.index.html";
        localStorage.setItem("username", $username.val());
      } else {
        $span.html("用户名或密码错误").css("color", "red");
      }
    });
  });
})(jQuery);
