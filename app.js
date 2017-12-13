var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('sessiontest'));
app.use(express.static(path.join(__dirname, 'public')));

//session模块
var identityKey = 'skey';
// app.use(session({ secret: 'wilson'}));
app.use(session({
    name: identityKey,
    secret: 'sessiontest',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 600 * 1000  // 有效期，单位是毫秒，有效期30分钟
    }
}));




app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});





// 登录接口
// app.post('/signIn', function(req, res, next){
//     // var user = findUser(req.body.name, req.body.password);
//     var username = req.body.username;
//     var password = req.body.password;
//     console.log("21333333333333" + req.session);
//     if(username){
//         req.session.regenerate(function(err) {
//             if(err){
//                 return res.json({ret_code: 2, ret_msg: '登录失败'});
//             }
//
//             req.session.loginUser = username;
//             res.json({ret_code: 0, ret_msg: '登录成功'});
//         });
//     }else{
//         res.json({ret_code: 1, ret_msg: '账号或密码错误'});
//     }
// });


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
