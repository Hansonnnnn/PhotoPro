$(function () {
    $(".myButton").click(function () {
//            $('#loginModal').modal('show');
//            $(location).attr("href", "/personalPage");

        if('<%=isLogined%>' === 'true'){
            window.location.href = '/personalPage';
        }
    });
    var urlRoot = "http://localhost:3000";
    function signIn() {
        var username = $("#usernameField_I").val();
        var password = $("#passwordField_I").val();
        if(username !== "" && username !== null && password !== "" && password !== null){
            $.ajax({
                url: urlRoot + '/signIn',
                type:'POST', //POST
                async:true,    //或false,是否异步
                data:{
                    username: username,
                    password: password
                },
                dataType:'json',
                success:function(data){
                    if(data.ret_code === 0){
                        location.reload();
                    }else{
                        alert("session验证失败");
                    }
                },
                error:function(xhr,textStatus){
                    console.log('登录失败验证失败');
                }
            })
        }else{
            alert("请输入正确的用户名或密码");
        }

    }
    function signUp() {
        var username = $("#usernameField_I").val();
        var password = $("#passwordField_I").val();
        var password_r = $("#passwordConfirmField").val();
        var email = $("#emailField").val();
    }

    $("#signInButton").click(function (e) {
        signIn();
    });
    $("#signUpButton").click(function (e) {
        signUp();
    });

    $("#searchButton").click(function (e) {
        var content = $("#searchInput").val();
        $(location).attr("href", ("/searchResultPage?content=" + content));
    })
});