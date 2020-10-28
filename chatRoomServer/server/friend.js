
var dbserver = require('../dbo/dbserver');

//用户申请
exports.applyFriend = function(req,res){
    let data = req.body;
    
    dbserver.applyFriend(data,res);
}

//好友状态修改
exports.updateFriendState = function(req,res){
    let data = req.body

    dbserver.updateFriendState(data,res)
}

//删除好友
exports.deleteFriend = function(req,res){
    let data = req.body
    dbserver.deleteFriend(data,res)
}