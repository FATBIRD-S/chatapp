var dbserver = require('../dbo/dbserver');

//获取好友列表
exports.getFriend = function(req,res){
    let data = req.body;
    dbserver.getUsers(data,res)
}

//获取最后一条消息
exports.getLastMsg = function(req,res){
    let data = req.body;

    dbserver.getLastMsg(data,res)
}

//一对一消息未读数
exports.unreadMsg = function(req,res){
    let data = req.body;
    dbserver.unreadMsg(data,res)
}

//消息已读
exports.readedMsg = function(req,res){
    let data = req.body;
    dbserver.readedMsg(data,res)
}


//获取群列表--------------------未验证
exports.getGroup = function(req,res){
    let data = req.body;
    dbserver.getGroup(data,res)
}

//获取最后一条群消息
exports.getLastGroupMsg = function(req,res){
    let data = req.body;

    dbserver.getLastGroupMsg(data,res)
}

//群消息已读---------------------end
exports.readedGroupMsg = function(req,res){
    let data = req.body;
    dbserver.readedGroupMsg(data,res)
}