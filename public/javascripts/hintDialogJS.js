//就这样调用该js文件中的方法
// $(".jumbotron").click(function (e) {
//     runIn("warning", "请先登录！");
//     setTimeout(runOut, 2000)
// })
/**
 * 实现提示框的滑入效果
 * @param type 提示、成功
 * @param content 显示的内容
 */
function runIn(type, content) {
    var hintDialog = $(".hintDialog");
    var img = $(".hintDialog img");
    var contentTag = $(".hintDialog h3");
    if(type === "warning"){
        img.attr("src", "/images/hint_warning.png");
    }else{
        img.attr("src", "/images/hint_success.png");
    }
    contentTag.text(content);
    hintDialog.addClass("runIn");
    hintDialog.removeClass("runOut");
}

/**
 * 实现提示框的滑出效果
 */
function runOut() {
    var hintDialog = $(".hintDialog");
    hintDialog.addClass("runOut");
    hintDialog.removeClass("runIn");
}