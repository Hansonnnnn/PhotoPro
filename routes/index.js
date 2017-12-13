var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');
var db = require("../public/javascripts/databaseJS");



/* GET home page. */
/**
 *首页请求，回传渲染首页需要的数据
 */
router.get('/', function(req, res, next) {
    console.log(req.session.loginUser);
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    console.log(isLogined);
    res.render('index', {
        list:[
            {id:"1", pname: "Tania", year: "1010", portrait: "https://cn-ali.muscache.com/im/pictures/user/06841989-b28e-48a4-b481-1ff49ad532b2.jpg?aki_policy=profile_x_medium",
                paths:["https://cn-ali.muscache.com/im/pictures/4fc2bee6-e928-433c-a01f-ef74bfb01a2f.jpg?aki_policy=xx_large",
        "https://cn-ali.muscache.com/im/pictures/0b31dfed-ca17-432b-a290-3d7d64774fa5.jpg?aki_policy=xx_large",
        "https://cn-ali.muscache.com/im/pictures/1d9dd403-7383-4a39-8352-a0544dc38352.jpg?aki_policy=xx_large"], intro: ["印度，住进粉色之城的大户人家","夜色与酒吧的最佳搭配","视觉统一，墙上的酒头整齐排列"]},
            {id:"2", pname: "YScina", year: "980", portrait: "https://cn-ali.muscache.com/im/pictures/user/9a837bb7-834d-4517-85da-11abfdad748b.jpg?aki_policy=profile_x_medium",
                paths:["https://cn-ali.muscache.com/im/pictures/8b9b584a-da5d-4187-a7e7-b6048a94618d.jpg?aki_policy=xx_large",
            "https://cn-ali.muscache.com/im/pictures/e54d9629-3118-428c-9828-48f17060b54b.jpg?aki_policy=xx_large",
            "https://cn-ali.muscache.com/im/pictures/957fe132-1ed9-486f-bd06-12d99380e43c.jpg?aki_policy=xx_large"],intro: ["老爸，竟然也可以一秒变潮叔","退休老爸的京都变潮记","隔天换装和服"]},
            {id:"3", pname: "家豪", year: "868", portrait: "https://cn-ali.muscache.com/im/pictures/user/fef7dc90-be10-4fd5-abbe-798f13d24670.jpg?aki_policy=profile_x_medium",
                paths:["https://cn-ali.muscache.com/im/pictures/2236dd0a-b576-4196-a5e2-7deecbb54742.jpg?aki_policy=xx_large",
            "https://cn-ali.muscache.com/im/pictures/b8c320b9-288a-4c52-a7ba-6bf69d35c843.jpg?aki_policy=xx_large",
            "https://cn-ali.muscache.com/im/pictures/5d5b7aea-a215-4aff-bf4d-eadcd8aa6adc.jpg?aki_policy=xx_large"],intro: ["喝一杯咖啡，对一家店上瘾","喝一杯咖啡，对一家店上瘾","喝一杯咖啡，对一家店上瘾"]}],
        isLogined: isLogined,
        name: loginUser || '',
        perList:[{pname:"家豪",portrait:"https://z1.muscache.cn/im/pictures/user/fef7dc90-be10-4fd5-abbe-798f13d24670.jpg?aki_policy=profile_x_medium"},
            {pname:"Tania",portrait:"https://cn-ali.muscache.com/im/pictures/user/06841989-b28e-48a4-b481-1ff49ad532b2.jpg?aki_policy=profile_x_medium"},
            {pname:"Ryan",portrait:"https://z1.muscache.cn/im/pictures/user/0b7d7b44-0e4d-446d-8e02-8ce152a9e320.jpg?aki_policy=profile_x_medium"},
            {pname:"Iris",portrait:"https://z1.muscache.cn/im/pictures/f3010699-a6eb-423e-8576-71de239b1215.jpg?aki_policy=profile_x_medium"},
            {pname:"Gabriel",portrait:"https://z1.muscache.cn/im/pictures/user/f923f358-ec8e-4602-bcc6-e0ab6d0d9974.jpg?aki_policy=profile_x_medium"},
            {pname:"小鱼",portrait:"https://z1.muscache.cn/im/pictures/user/44280e61-5197-4add-816c-feaa8920bdce.jpg?aki_policy=profile_x_medium"}]
    });
});

// /**
//  *失效的方法
//  */
// router.get('/firstPage', function (req, res, next) {
//     res.render('firstPage')
// });


/**
 *跳转到个人中心---普通用户
 */
router.get('/personalPage', function (req, res, next) {
    // var username = req.query.username;
    var loginUser = req.session.loginUser;
    var isLogined = !!loginUser;
    if(loginUser){
        //数据库查找对应用户的信息
        db.getUserInfo(loginUser, function (data) {
            res.render('personalPage',
                {information: JSON.parse(data),
                    isLogined: isLogined,
                    name: loginUser || ''}
                );
        });
    }else{
        res.redirect('/');
    }

});

// router.get('/ppcenterPage', function (req, res, next) {
//     var loginUser = req.session.loginUser;
//     var isLogined = !!loginUser;
//     if(loginUser){
//         //数据库查找对应用户的信息
//         // db.getUserInfo(loginUser, function (data) {
//             res.render('personalPage',
//                 {information: JSON.parse(data),
//                     isLogined: isLogined,
//                     name: loginUser || ''}
//             );
//         });
//     }else{
//         res.redirect('/');
//     }
// })

/**
 *跳转到摄影师主页
 */
router.get('/photographerPage', function (req, res, next) {
    var pname = req.query.pname;
    var loginUser = req.session.loginUser;
    var isLogined = !!loginUser;
    req.session.pname = pname;
    db.getPhotographerInfo(pname, function (data) {
        // console.log("这是在get方法中判断data的类型：" + data === undefined);
        db.testFollowed(loginUser, JSON.parse(data)[0].pname, function (data1) {
            console.log("这里是index.js第84行" + data1.followed);
            res.render('photographerPage',
                {information: JSON.parse(data),
                    isLogined: isLogined,
                    name: loginUser || '',
                    followed: data1.followed});
        });
    });
});

/**
 *实现上传图片的功能
 */
/* 上传*/
router.post('/file/uploading', function(req, res, next){
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/files/'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log('parse error: ' + err);
        } else {
            // console.log('parse files: ' + filesTmp);
            // console.log(files.file);
            var inputFile = files.file[0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/files/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });
        }
        var pname = req.session.pname;
        var loginUser = req.session.loginUser;
        var isLogined = !!loginUser;
        db.getPhotographerInfo(pname, function (data) {
            // console.log("这是在get方法中判断data的类型：" + data === undefined);
            db.testFollowed(loginUser, JSON.parse(data)[0].pname, function (data1) {
                console.log("这里是index.js第84行" + data1.followed);
                res.render('photographerPage',
                    {information: JSON.parse(data),
                        isLogined: isLogined,
                        name: loginUser || '',
                        followed: data1.followed});
            });
        });
        // res.render('photographerPage', {
        //     information: [{
        //         portrait: "https://cn-ali.muscache.com/im/pictures/fe80274d-22a3-49fe-b2c5-71310aa29143.jpg?aki_policy=profile_x_medium",
        //         name: "杨峰工作室",
        //         inTime: "2017年10月16日",
        //         location: "中国-江苏省-南京市-鼓楼区",
        //         style: "温暖、安详、静谧、细节",
        //         cv: 191,
        //         circle1: "98%",
        //         circle2: "101次",
        //         circle3: "1000+",
        //         startUpTime: "2010年11月8日",
        //         member: [{name: "杨峰", intro: "1976年出生，中国著名民族元素时尚摄影大师，" +
        //         "北京市麦道百清文化艺术中心创始人、艺术总监。他的作品极具特色，曾荣获中国国际时装周第一" +
        //         "届摄影作品大赛艺术摄影铜奖等。他与国内外各大杂志建立了长期合作关系，除此之外，他还是多" +
        //         "家著名民族服装品牌的御用摄影师，如五色风马、雪莲、鄂尔多斯等。"}
        //             ,{name: "王琳", intro: "自由摄影师，擅长观念摄影、婚纱摄影。自高中无意间接触摄影，到后来机缘巧合大学期间就读摄影专业，" +
        //             "成为专业摄影师的种子开始在他心中萌芽。"}],
        //         slogan: "瞬间，转瞬即逝，而我们，希望帮您留住瞬间，使其永恒。"
        //     }]
        // });
        // res.end();
    });
});

/**
 *实现登录功能
 */
router.post('/signIn', function(req, res, next) {
    console.log("登录操作-----后端接收到请求");
    var username = req.body.username;
    var password = req.body.password;
    db.validateUP(username, password, function (data) {
        if(JSON.parse(data)[1] === "true"){
            req.session.regenerate(function(err) {
                if(err){
                    return res.json({ret_code: 2, ret_msg: '登录失败'});
                }
                req.session.loginUser = username;
                res.json({ret_code: 0, ret_msg: '登录成功'});
                // res.json(["status", "true"]);
            });

        }else{
            // res.json(["status", "false"]);
            res.json({ret_code: 1, ret_msg: '账号或密码错误'});
        }
    });
});

/**
 *实现登出功能
 */
router.get('/logout', function(req, res, next){
    console.log("登出操作后端接收到请求");
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug
    // req.session.destroy(function(err) {
    //     if(err){
    //         res.json({ret_code: 2, ret_msg: '退出登录失败'});
    //         return;
    //     }
    //
    //     req.session.loginUser = null;
    //     // res.clearCookie(identityKey);
    //     res.redirect('/');
    // });
    req.session.loginUser = null;
    // res.redirect('/');
    res.json({ret_code:0, ret_msg: "退出登录成功"});
});

/**
 * 验证是否有用户为在线状态
 */
router.get('/validateOnline', function (req, res, next) {
    var loginUser = req.session.loginUser;
    var isLogined = !!loginUser;
    res.json({isOnline: isLogined})
});


/**
 *前端界面发送邀约请求提交表单触发的逻辑
 */
router.post('/submitYaoYueForm', function (req, res, next) {
    console.log("提交YaoYue表单-----后端接收到请求");
    //从前端拿来的数据
    var realName = req.body.realName;
    var phone = req.body.tel;
    var location = req.body.location;
    var lowPrice = req.body.lowPrice;
    var highPrice = req.body.highPrice;
    var description = req.body.description;
    var requirements = req.body.requirements;
    var pname = req.body.pname;
    //后端自己生成的数据
    var state = 0;//订单的四种状态：待确认-0；正在进行-1；已结束-2；被拒绝-3
    var startTime = getNowTime();
    var username = req.session.loginUser;
    console.log(startTime + "这是现在的时间");
    db.addOrder(realName, username, phone, location, lowPrice, highPrice, description, requirements, pname, state, startTime, function (data) {
        res.json(data);
    });

});
/**
 *获取当前时间的本地方法
 */
//上一个过程中需要调用的方法来获取当前时间，存到数据库
function getNowTime() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var date1 = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    return year + "年" + month + "月" + date1 + "日 " + hour + ":" + minutes + ":" + second;
}

/**
 *跳转到故事界面
 */
router.get('/storyPage', function (req, res, next) {
    var loginUser = req.session.loginUser;
    var isLogined = !!loginUser;
    var pname = req.session.pname;
    var storyTitle = req.session.storyTitle;
    // console.log(pname);
    // console.log(storyTitle);
    //    数据库查询
    db.getStory(pname, storyTitle, function (data, data1) {
        console.log(data);
        console.log(data1);
        console.log(data[0].content);
        console.log(data[0].images);
        var contents = data[0].content.split('&&');
        var images = data[0].images.split('&&');
        var portrait = data1[0].portrait;
        var slogan = data1[0].slogan;
        var times = data1[0].times;
        var stars = data1[0].stars;
        res.render('storyPage', {isLogined: isLogined, name: loginUser || '',
            pname: data[0].pname, title: data[0].title, timeAndLocation: data[0].timeAndLocation,
            contents: contents, images: images,
            portrait: portrait, slogan: slogan, times: times, stars: stars});
    });

});

/**
 *为什么这里又有post，上面又有get，因为这个post中不能直接实现render，所以必须将结果返回到前端，前端再发起get请求
 */
router.post('/storyPage', function (req, res, next) {
    console.log("跳转到故事界面-----后端接收到请求");
    var pname = req.body.pname;
    var storyTitle = req.body.storyTitle;
    console.log(storyTitle);
    req.session.pname = pname;
    req.session.storyTitle = storyTitle;
    res.json({redirectUrl: '/storyPage'});
});


/**
 * 跳转到搜索结果界面
 */
router.get('/searchResultPage', function (req, res, next) {
    var content = req.query.content;
    var loginUser = req.session.loginUser;
    var isLogined = !!loginUser;
    if(content === "" || content === null){
        db.getDefaultList(function (data1, data2) {
            res.render('searchResultPage', {isLogined: isLogined, name: loginUser || '', contentIsNull: true,
                perListIsEmpty: true, storyListIsEmpty: true, perList: data1, storyList: data2});
        });
    }else{
        db.getSearchResult(content, function (data1, data2, tag) {
            //该data包含：摄影师的列表、故事的列表
            if(tag[0].perListIsEmpty === 'true' && tag[0].storyListIsEmpty === 'true'){
                res.render('searchResultPage', {isLogined: isLogined, name: loginUser || '', contentIsNull: false,
                    perListIsEmpty: true, storyListIsEmpty: true,
                    perList: data1, storyList: data2});
            }else if(tag[0].perListIsEmpty === 'true' && tag[0].storyListIsEmpty === 'false'){
                res.render('searchResultPage', {isLogined: isLogined, name: loginUser || '', contentIsNull: false,
                    perListIsEmpty: true, storyListIsEmpty: false,
                    perList: data1, storyList: data2});
            }else if(tag[0].perListIsEmpty === 'false' && tag[0].storyListIsEmpty === 'true'){
                res.render('searchResultPage', {isLogined: isLogined, name: loginUser || '', contentIsNull: false,
                    perListIsEmpty: false, storyListIsEmpty: true,
                    perList: data1, storyList: data2});
            }else{
                res.render('searchResultPage', {isLogined: isLogined, name: loginUser || '', contentIsNull: false,
                    perListIsEmpty: false, storyListIsEmpty: false,
                    perList: data1, storyList: data2});
            }

        })
    }

});

/**
 * 负责处理前端点击了关注按钮之后触发的过程
 */
router.post('/follow', function (req, res, next) {
    console.log("关注操作-----后端接收到请求");
    var uname = req.session.loginUser;
    var pname = req.body.pname;
    db.follow(uname, pname, function (data) {
        res.json(data);
    })
});
/**
 * 取消关注逻辑
 */
router.post('/unFollow', function (req, res, next) {
    console.log("取消关注操作-----后端接收到请求");
    var uname = req.session.loginUser;
    var pname = req.body.pname;
    db.unFollow(uname, pname, function (data) {
        res.json(data);
    })
});

module.exports = router;
