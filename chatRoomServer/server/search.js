var dbserver = require('../dbo/dbserver');

//用户搜索
exports.searchUser = function(req, res){
    let data = req.body.data;

    dbserver.searchU(data,res);
}

//是否是好友
exports.isFriend = function(req, res){
    let uid = req.body.uid;
    let fid = req.body.fid;

    dbserver.isFriend(uid,fid,res);
}

//群搜索
exports.searchGroup = function(req, res){
    let data = req.body.data;

    dbserver.searchG(data,res);
}

//是否是群成员
exports.isInGroup = function(req, res){
    let uid = req.body.uid;
    let gid = req.body.gid;

    dbserver.isGroupUser(uid,gid,res);
}