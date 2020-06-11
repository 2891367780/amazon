/* 
1.前端通过form+submit+name将数据传给后端
2.后端需要先比对用户名的唯一性,再将用户名密码邮箱插入到数据库中
3.前端需要验证用户名  密码  邮箱
4.表单没有填正确的时候,都需要阻止按钮提交,需要给form加submit事件
5.每个表单加标记,只要输入有问题,就将标记设为false,输入正确标记设为true,阻止提交的时候,只要标记只要有一个false,就阻止
*/

!(function ($) {
  // 获取所有表单变量
  const $form = $("form");
  const $username = $(".username"); //用户名
  const $password = $(".password"); //设置密码
  const $repass = $(".repass"); //确认密码
  const $email = $(".email"); //邮箱
  const $checkbox_mess = $(".checkbox-mess"); //复选框
  const $userspan = $(".userspan"); //提示错误信息
  const $passspan = $(".passspan");
  const $repassspan = $(".repassspan");
  const $emailspan = $(".emailspan");
  const $checkspan = $(".checkspan");

  // 每个表单验证都加一个标记,不要使用1个标记(所有不正确的地方都加标记为false,后面根据标记是false的,就阻止提交)
  let userflag = true;
  let passflag = true;
  let repassflag = true;
  let emailflag = true;
  let checkflag = true;

  // 一.用户名验证-----------------------------------------------------------
  $username.on("blur", function () {
    // 1.判断用户名是否填写
    //输入有值  计算长度,将输入的1个中文转成2个英文  然后计算长度
    if ($(this).val() !== "") {
      let len = $(this)
        .val()
        .replace(/[\u4e00-\u9fa5]/g, "aa").length;

      //2.判断用户名长度
      // 如果长度符合要求小于14
      if (len < 14) {
        //   发送ajax,后台比对用户名的是否唯一
        $.ajax({
          type: "post",
          url: "http://10.31.162.42/amazon/php/3.registry.php",
          data: {
            username: $username.val(),
          },
        }).done(function (result) {
          if (!result) {
            //数据库中没找到用户名
            $username.css("border", "1px solid green");
            $userspan.html("√").css("color", "green");
            userflag = true;
          } else {
            //数据库中存在该用户名
            $userspan.html("该用户名已经存在").css("color", "red");
            userflag = false;
          }
        });

        //2.判断用户名长度-长度不符合要求
      } else {
        $userspan.html("请输入1-14位字母或数字组合").css("color", "red");
        userflag = false;
      }
    } else {
      //1.判断用户名是否填写-没填写
      $userspan.html("该用户名不能为空").css("color", "red");
      userflag = false;
    }
  });

  //   二.密码验证-----------------------------------------------------------
  $password.on("input", function () {
    //   将密码输入框的值存变量,方便后面使用
    let $pass = $(this).val();
    if ($pass.length >= 8 && $pass.length <= 14) {
      let regnum = /\d+/;
      let regupper = /[A-Z]+/;
      let reglower = /[a-z]+/;
      let regother = /[\W\_]+/; //不是数字字母至少1个

      //   1.判断包含几种字符,定义密码的强弱
      let $count = 0;
      if (regnum.test($pass)) {
        $count++;
      }

      if (regupper.test($pass)) {
        $count++;
      }

      if (reglower.test($pass)) {
        $count++;
      }

      if (regother.test($pass)) {
        $count++;
      }

      //   2.根据$count的数量来输出密码的强中弱
      switch ($count) {
        case 1:
          $passspan.html("弱").css("color", "red");
          passflag = false;
          break;

        case 2:
        case 3:
          $passspan.html("中").css("color", "orange");
          passflag = true;
          break;

        case 4:
          $passspan.html("强").css("color", "green");
          passflag = true;
          break;
      }
    } else {
      $passspan.html("请的密码长度有误").css("color", "red");
      passflag = false;
    }
  });

  //   3.密码框失去焦点
  $password.on("blur", function () {
    if ($(this).val() !== "") {
      if (passflag) {
        $password.css("border", "1px solid green");
        $passspan.html("√").css("color", "green");
        passflag = true;
      } else {
        $passspan.html("密码不能为空").css("color", "red");
        passflag = false;
      }
    }
  });

  //   三.确认密码----------------------------------------------------
  //   1.再次确认密码的输入框失去焦点
  $repass.on("blur", function () {
    if ($password.val() == $repass.val()) {
      $password.css("border", "1px solid green");
      $repassspan.html("√").css("color", "green");
      repassflag = true;
    } else {
      $repassspan.html("请输入正确的密码").css("color", "red");
      repassflag = false;
    }
  });

  //   四.邮箱验证

  $email.on("blur", function () {
    // 邮箱输入框有值
    let $emailtxt = $(this).val();
    let regemail = /^(\w+[\+\-\.]*\w+)\@(\w+[\-\.]*\w+)\.(\w+[\-\.]*\w+)$/;
    if ($emailtxt !== "") {
      if (regemail.test($emailtxt)) {
        $email.css("border", "1px solid green");
        $emailspan.html("√").css("color", "green");
        emailflag = true;
      } else {
        $emailspan.html("您的邮箱格式有误").css("color", "red");
        emailflag = false;
      }
    } else {
      $emailspan.html("邮箱不能为空").css("color", "red");
      emailflag = false;
    }
  });

  // 五.阻止表达提交  在form上加submit事件   阻止默认事件-------------------------
  //   jquery中阻止默认时间都用return false
  $form.on("submit", function () {
    //   当用户名  密码 确认密码 邮箱都输入正确  标记为true
    if ($username.val() === "") {
      $userspan.html("该用户名不能为空").css("color", "red");
      userflag = false;
    }

    if ($password.val() === "") {
      $passspan.html("密码不能为空").css("color", "red");
      userflag = false;
    }

    if ($repass.val() === "") {
      $repassspan.html("密码不能为空").css("color", "red");
      repassflag = false;
    }

    if ($email.val() === "") {
      $emailspan.html("邮箱不能为空").css("color", "red");
      emailflag = false;
    }

    if (!$checkbox_mess.prop("checked")) {
      $checkspan
        .html("要创建亚马逊账户，您必须同意网站的使用条件及隐私声明。")
        .css("color", "red");
      checkflag = false;
    } else {
      checkflag = true;
    }

    // 如果其中有一项为false,就阻止按钮提交
    if (!userflag || !passflag || !repassflag || !emailflag || !checkflag) {
      return false;
    }
  });
})(jQuery);
