var util = require('util');
var sqlite3 = require('sqlite3');

sqlite3.verbose();
var db = new sqlite3.Database("/Users/xiezhenyu/IdeaProjects/PhotoPro/photoDB");

/*
 数据库名是直接硬编码的，所以当调用connect和setup函数时，当前目录中就会生成chap06.sqlite3文件
 */
function getPhotographerInfo(pname, callback) {
    db.all("select * from photographer where pname = " + "'" + pname + "'" ,function (err, res) {
        if(!err){
            // console.log(JSON.stringify(res));
            callback(JSON.stringify(res))
        }else{
            console.log(err);
        }
    });
}

function validateUP(username, password, callback) {
    db.all("select * from common_user where username = " + "'" + username + "'", function (err, res) {
        // console.log(JSON.stringify(res));
        // console.log(res.username);
        var u = res[0].username;
        var p = res[0].password;
        if(!err){
            if((username === u) && (password === p)){
                callback(JSON.stringify(["status", "true"]));
            }else{
                callback(JSON.stringify(["status", "false"]));
            }
        }else{
            console.log(err);
        }
    });
}

function getUserInfo(username, callback) {
    db.all("select * from common_user where username = " + "'" + username + "'", function (err, res) {
        if(!err){
            console.log(JSON.stringify(res));
            callback(JSON.stringify(res))
        }else{
            console.log(err);
        }
    })
}

function addOrder(realName, uname, phone, location, lowPrice, highPrice, des, requirements, pname, state, startTime, callback) {
    db.run("insert into yaoyueOrder (uname, pname, state, startTime, phone, " +
        "des, requirement, lowPrice, highPrice, location, realName) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [uname, pname, state, startTime, phone, des, requirements, lowPrice, highPrice,location, realName], function (err, res) {
            if(err){
                console.log("插入yaoyueOrder表失败，见database.js文件50行");
                callback({ret_code: 1, ret_msg: 'failed'})
            }else{
                callback({ret_code: 0, ret_msg: 'success'})
            }
        })
}

function getStory(pname, title, callback) {
    db.all("select * from story where pname = " + "'" + pname + "'" + " and title = " + "'" + title + "'", function (err, res1) {
        if(err){
            console.log("查询故事表出错，见databaseJS.js第63行");
        }else{
            db.all("select portrait, slogan, times, stars from photographer where pname = " + "'" + pname + "'", function (err, res2) {
                if(err){
                    console.log("查询故事表回调查询摄影师表出错，见databaseJS.js第63行")
                }else{
                    // console.log("res1: " + res1);
                    // console.log("res2: " + res2);
                    callback(res1, res2);
                }
            });
        }
    })
}


function getSearchResult(content, callback) {
    var defaultPerList;
    var defaultStoryList;
    db.all("select * from photographer", function (err, res) {
        if(err){
            console.log("搜索时获取默认推荐列表查询摄影师表出错，见databaseJS.js第82行")
        }else{
            defaultPerList = res;
        }
    });
    db.all("select * from story", function (err, res) {
        if(err){
            console.log("搜索时获取默认推荐列表查询故事表出错，见databaseJS.js第82行")
        }else{
            defaultStoryList = res;
        }
    });
    //这里容易出错，两层循环的四种不同分支的嵌套
    var sql1 = db.prepare("select * from photographer where pname like ?");
    var sql2 = db.prepare("select * from story where title like ?");
    sql1.all('%'+content+'%', function (err, res1) {
        if(err){
            console.log("搜索时查询摄影师表出错，见databaseJS.js第82行1")
        }else{
            //当查询结果为空时，返回默认推荐列表
            if(res1.length === 0){
                //查询故事表
                sql2.all('%'+content+'%', function (err, res2) {
                    if(err){
                        console.log("搜索时查询故事表出错，见databaseJS.js第82行2")
                    }else{
                        if(res2.length === 0){
                            console.log("摄影师没，故事没");
                            console.log("res1: " + JSON.stringify(res1));
                            console.log("res2: " + JSON.stringify(res2));
                            callback(defaultPerList, defaultStoryList, [{perListIsEmpty: 'true', storyListIsEmpty: 'true'}]);
                        }else{
                            console.log("摄影师没，故事有");
                            console.log("res1: " + JSON.stringify(res1));
                            console.log("res2: " + JSON.stringify(res2));
                            callback(defaultPerList, res2, [{perListIsEmpty: 'true', storyListIsEmpty: 'false'}]);
                        }
                    }
                })
            }else{
             //当查询结果不为空时，返回默认推荐列表
                sql2.all('%'+content+'%', function (err, res2) {
                    if(err){
                        console.log("搜索时查询故事表出错，见databaseJS.js第82行3")
                    }else{
                        if(res2.length === 0){
                            console.log("摄影师有，故事没");
                            console.log("res1: " + JSON.stringify(res1));
                            console.log("res2: " + JSON.stringify(res2));
                            callback(res1, defaultStoryList, [{perListIsEmpty: 'false', storyListIsEmpty: 'true'}]);
                        }else{
                            console.log("摄影师有，故事有");
                            console.log("res1: " + JSON.stringify(res1));
                            console.log("res2: " + JSON.stringify(res2));
                            callback(res1, res2, [{perListIsEmpty: 'false', storyListIsEmpty: 'false'}]);
                        }
                    }
                })
            }
        }
    })
}

function getDefaultList(callback){
    db.all("select * from photographer", function (err, res1) {
        if(err){
            console.log("搜索时获取默认推荐列表查询摄影师表出错，见databaseJS.js第82行")
        }else{
            db.all("select * from story", function (err, res2) {
                if(err){
                    console.log("搜索时获取默认推荐列表查询故事表出错，见databaseJS.js第82行")
                }else{
                    callback(res1, res2);
                }
            });
        }
    });

}

function follow(uname, pname, callback) {
    db.run("insert into followRelation (uname, pname) values (?, ?);", [uname, pname], function (err, res) {
        if(err){
            console.log("插入followRelation表失败，见database.js文件167行");
            callback({ret_code: 1, ret_msg: 'failed'})
        }else{
            callback({ret_code: 0, ret_msg: 'success'})
        }
    })
}

function unFollow(uname, pname, callback) {
    var  delSql=db.prepare("DELETE from followRelation where uname=? and pname=?");
    delSql.run(uname, pname, function (err, res) {
        if(err){
            console.log("删除followRelation表某行失败，见database.js文件181行");
            callback({ret_code: 1, ret_msg: 'failed'})
        }else{
            callback({ret_code: 0, ret_msg: 'success'})
        }
    })
}

function testFollowed(uname, pname, callback) {
    db.all("select * from followRelation where uname = " + "'" + uname + "' and pname = " + "'" + pname + "'", function (err, res) {
        if(err){
            console.log("查询followRelation表失败，见database.js文件178行");
        }else{
            if(res.length === 0){
                callback({followed: false})
            }else{
                callback({followed: true})
            }
        }
    })
}

module.exports.getPhotographerInfo = getPhotographerInfo;

module.exports.validateUP = validateUP;

module.exports.getUserInfo = getUserInfo;

module.exports.addOrder = addOrder;

module.exports.getStory = getStory;

module.exports.getSearchResult = getSearchResult;

module.exports.getDefaultList = getDefaultList;

module.exports.follow = follow;

module.exports.testFollowed = testFollowed;

module.exports.unFollow = unFollow;