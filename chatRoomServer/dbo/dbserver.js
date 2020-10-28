//数据库操作

var bcrypt = require('./bcrypt');
var jwt = require('./jwt');
var dbmodel = require('../model/dbmodel');
// const { findOne } = require('../model/dbmodel');


const User = dbmodel.model('User');
const Friend = dbmodel.model('Friend');
const Group = dbmodel.model('Group');
const GroupUser = dbmodel.model('GroupUser');
const Message = dbmodel.model('Message');
const GroupMsg = dbmodel.model('GroupMsg');


exports.findUser = function (res) {
    User.find(function (err, val) {
        if (err) {
            console.log('用户数据查找失败' + err);

        } else {
            res.send(val);
        }
    })
}

//新建用户
exports.buildUser = function (name, email, psw, res) {

    let password = bcrypt.encryption(psw)

    let data = {
        name: name,
        email: email,
        time: new Date(),
        psw: password
    }

    let newuser = new User(data)

    let wherestr = {}
    wherestr.email = email

    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if(result === 0){
                newuser.save(function (err, result) {
                    if (err) {
                        res.send({ status: 500 })
                    } else {
                        res.send({ status: 200, result })
                    }
                })
            }
        }
    })

    
}

//是否有相应用户查询（匹配用户个数）
exports.UserCount = function (data, type, res) {
    let wherestr = {}
    wherestr[type] = data
    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//用户验证
exports.userMatch = function (data, pwd, res) {
    let wherestr = { $or: [{ 'name': data }, { 'email': data }] };
    let out = { 'name': 1, 'imgurl': 1, 'psw': 1 };


    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result == '') {
                res.send({ status: 400 })
            }

            result.map(function (e) {

                let pwdMatch = bcrypt.verification(pwd, e.psw)

                if (pwdMatch) {
                    let token = jwt.generateToken(e._id)
                    let userinfo = {
                        id: e._id,
                        name: e.name,
                        imgurl: e.imgurl,
                        token: token
                    }
                    res.send({ status: 200, userinfo })
                } else {
                    res.send({ status: 400 })
                }
            })
        }
    })
}

//搜索用户
exports.searchU = function (data, res) {
    let wherestr = {}
    if (data == 'JS') {
        wherestr = {}
    } else {
        wherestr = {
            $or: [
                { 'name': { $regex: data } },
                { 'email': { $regex: data } }
            ]
        }
    }
    let out = { 'name': 1, 'imgurl': 1, 'email': 1 }

    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })

}

//是否是好友
exports.isFriend = function (uid, fid, res) {
    let wherestr = { 'userID': uid, 'friendID': fid, 'state': 0 }

    Friend.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result) {
                res.send({ status: 200 }) //是
            } else {
                res.send({ status: 400 })
            }
        }
    })
}

//群搜索
exports.searchG = function (data, res) {
    let wherestr = { 'name': { $regex: data } }
    let out = {
        'name': 1,
        'imgurl': 1
    }

    Group.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//是否在群内
exports.isGroupUser = function (uid, gid, res) {
    let wherestr = { 'userID': uid, 'groupID': gid }

    GroupUser.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            if (result) {
                res.send({ status: 200 })     //是
            } else {
                res.send({ status: 400 })
            }
        }
    })
}

//用户详情
exports.userDetial = function (id, res) {
    let wherestr = { '_id': id }
    let out = { 'psw': 0 }
    User.findOne(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500, err })
        } else {
            res.send({ status: 200, result })
            
        }
    })
}
//用户数据更新
function update(data, update, res) {
    User.findByIdAndUpdate(data, update, function (err, resu) {
        if (err) {
            res.send({ status: 500 });
        } else {
            res.send({ status: 200 });
        }
    })
}
//用户数据修改
exports.userUpdate = function (data, res) {
    let updatestr = {};
    //有密码验证修改
    if (typeof (data.psw) != 'undefined') {
        User.find({ '_id': data.id }, { 'psw': 1 }, function (err, result) {
            if (err) {
                res.send({ status: 500 });
            } else {
                if (result == '') {
                    res.send({ status: 400 });
                }
                result.map(function (e) {
                    const pswMatch = bcrypt.verification(data.psw, e.psw);
                    if (pswMatch) {
                        //密码修改
                        if (data.type == 'psw') {
                            let password = bcrypt.encryption(data.data);
                            updatestr[data.type] = password;
                        } else if (data.type == 'email') {
                            //邮箱修改
                            updatestr[data.type] = data.data;
                            User.countDocuments(wherestr, function (err, result) {
                                if (err) {
                                    res.send({ status: 500 });
                                } else {
                                    //无重复 可修改
                                    if (result == 0) {
                                        update(data.id, update, res);
                                    } else {
                                        res.send({ status: 300 });
                                    }
                                }
                            })
                        } else {
                            res.send({ status: 400 });
                        }


                    } else {
                        res.send({ status: 400 });
                    }
                })
            }
        })


    } else if (data.type == 'name') {
        updatestr[data.type] = data.data;
        User.countDocuments(wherestr, function (err, result) {
            if (err) {
                res.send({ status: 500 });
            } else {
                //无重复 可修改
                if (result == 0) {
                    update(data.id, update, res);
                } else {
                    res.send({ status: 300 });
                }
            }
        })
    } else {
        //无密码验证修改
        updatestr[data.type] = data.data;
        update(data.id, updatestr, res);
    }
}
//好友昵称
exports.getfMarkName = function (data, res) {
    let wherestr = { 'userID': data.uid, 'friendID': data.fid }
    let out = { 'markname': 1 }

    Friend.findOne(wherestr, out, function (err, result) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200, result })
        }
    })
}

//修改好友昵称
exports.friendMarkName = function (data, res) {
    let wherestr = { 'userID': data.uid, 'friendID': data.fid }
    let updatestr = { 'markname': data.name }

    Friend.updateOne(wherestr, updatestr, function (err, rusult) {
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 }) 
        }
    })
}

//添加好友
// 添加好友表
exports.buildFriend = function (uid, fid, state, res) {
    let data = {
        userID: uid,
        friendID: fid,
        state: state,
        time: new Date(),
        lastTime: new Date()

    }

    let friend = new Friend(data)

    friend.save(function (err, result) {
        if (err) {
            // res.send({ status: 500 })
        } else {
            // res.send({ status: 200})
        }
    })
}

//添加一对一消息表
exports.insertMsg = function (uid, fid, msg, type, res) {
    let data = {
        userID: uid,              //用户id
        friendID: fid,            //好友id
        message: msg,                                        //消息内容
        types: type,                                          //消息类型
        state: 1,                                          //消息状态 0已读 1未读
        time: new Date()                                              //消息时间
    }

    let message = new Message(data);

    message.save(function (err, result) {
        if (err) {
            // res.send({ status: 500 })
        } else {
            // res.send({ status: 200, result })
        }
    })
}
//好友最后通讯时间
exports.upFriendLastTime = function(uid,fid,res){
    let wherestr = {'userID': uid,'friendID': fid};
    let updatestr = {'lastTime': new Date()};

    Friend.updateOne(wherestr,updatestr,function(err,result){
        if (err) {
            // res.send({ status: 500 })
        } else {
            // res.send({ status: 200 })

        }
    })
}

//好友申请
exports.applyFriend = function(data,res){
    //是否申请过
    let wherestr = {'userID': data.uid,'friendID': data.fid};
    Friend.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status: 500});
        }else{
            //result=0  初次申请
            if(result == 0){
                //添加到用户好友表 2为申请者
                this.buildFriend(data.uid,data.fid,2);
                //添加到好友好友表 1为被申请者
                this.buildFriend(data.fid,data.uid,1);

            }else{
                this.upFriendLastTime(data.uid,data.fid);
                this.upFriendLastTime(data.fid,data.uid);

            }
            this.insertMsg(data.uid,data.fid,data.msg,0,res)
        }
    })
}

//同意好友
exports.updateFriendState = function(data, res){
    let wherestr = {$or:[{'userID': data.uid,'friendID': data.fid},{'userID': data.fid,'friendID': data.uid}]}
    Friend.updateMany(wherestr,{'state': 0},(err,result)=>{
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//删除好友
exports.deleteFriend = function(data,res){
    let wherestr = {$or:[{'userID': data.uid,'friendID': data.fid},{'userID': data.fid,'friendID': data.uid}]}
    Friend.deleteMany(wherestr,(err,result)=>{
        if (err) {
            res.send({ status: 500 })
        } else {
            res.send({ status: 200 })
        }
    })
}

//按要求获取用户列表
exports.getUsers = function(data, res){
    let query = Friend.find({});
    //查询条件
    query.where({'userID': data.uid,'state': data.state});
    //查找friendID 关联的user对象
    query.populate('friendID');
    //按最后通讯时间倒序排序
    query.sort({'lastTime': -1})
    //查询结果
    query.exec().then(function(e){
        let result = e.map(function(ver){

            return {
                id: ver.friendID._id,
                name: ver.friendID.name,
                markname: ver.markname,
                imgurl: ver.friendID.imgurl,
                lastTime: ver.lastTime
            }
        })
        res.send({status: 200, result});
    }).catch(function(err){
        res.send({status:500});
    })
}

//按要求获取一条消息
exports.getLastMsg = function(data,res){
    let query = Message.findOne({});
    //查询条件
    query.where({$or:[{'userID': data.uid,'friendID': data.fid},{'userID': data.fid,'friendID': data.uid}]});
    //按最后通讯时间倒序排序
    query.sort({'time': -1})

    //查询结果
    query.exec().then(function(e){
        let result = {
                message: e.message,
                time: e.time,
                types: e.types
            
        }
        res.send({status: 200, result});
    }).catch(function(err){
        res.send({status:500});
    })
}

//分页聊天数据获取
exports.getMsg = function(data,res){
    let skip = data.nowPage * data.pageSize;

    let query = Message.find({});
    //查询条件
    query.where({$or:[{'userID': data.uid,'friendID': data.fid},{'userID': data.fid,'friendID': data.uid}]});
    //按最后通讯时间倒序排序
    query.sort({'time': -1});
    //查找USERID关联的user对象
    query.populate("userID");
    //跳过条数
    query.skip(skip)
    //一页条数
    query.limit(data.pageSize)
    //查询结果
    query.exec().then(function(e){
        let result = e.map(function(ver){
               return {
                    id: ver._id,
                    fromID: ver.userID._id,
                    imgurl: ver.userID.imgurl,
                    message: ver.message,
                    time: ver.time,
                    types: ver.types
               }
            
        })
        res.send({status: 200, result});
    }).catch(function(err){
        res.send({status:500});
    })
}

//一对一消息未读数
exports.unreadMsg = function(data,res){
    //条件
    let wherestr = {'userID': data.uid,'friendID': data.fid,'state': 1};
    Message.countDocuments(wherestr,(err,result)=>{
        if(err){
            res.send({status: 500});
        }else{
            res.send({status: 200,result})
        }
    })
}

//一对一消息已读
exports.readedMsg = function(data,res){
    //条件
    let wherestr = {'userID': data.fid,'friendID': data.uid,'state': 1};
    //修改已读
    let updatestr = {"state": 0}
    Message.updateMany(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status: 500});
        }else{
            res.send({status: 200})
        }
    })
}

//消息存入数据库
exports.msg = function(data,fromID,toID){
    let msg = {
        userID: fromID,
        friendID: toID,
        message: data.message,
        types: data.types,
        time: data.time,
        state: 1
    }
    let message = new Message(msg);

    message.save(function (err, result) {
        if (err) {
            // res.send({ status: 500 })
        } else {
            // res.send({ status: 200, result })
        }
    })
    
}



//按要求获取群列表--------------------------------------------------------------待定
exports.getGroup = function(data, res){
    let query = GroupUser.find({});
    //查询条件
    query.where({'userID': data.uid});
    //groupID 关联的user对象
    query.populate('groupID');
    //按最后通讯时间倒序排序
    query.sort({'lastTime': -1})
    //查询结果
    query.exec().then(function(e){
        let result = e.map(function(ver){
            return {
                gid: ver.groupID._id,
                name: ver.groupID.name,

                imgurl: ver.groupID.imgurl,
                lastTime: ver.lastTime,
                tip: ver.tip
            }
        })
        res.send({status: 200, result});
    }).catch(function(err){
        res.send({status:500});
    })
}

//按要求获取最后1条群消息
exports.getLastGroupMsg = function(data,res){
    let query = GroupMsg.findOne({});
    //查询条件
    query.where({'groupID': data.gid});
    //groupID 关联的user对象
    query.populate('userID');
    //按最后通讯时间倒序排序
    query.sort({'time': -1})
    //查询结果
    query.exec().then(function(e){
        let result = {
                message: e.message,
                time: e.time,
                types: e.types,
                name: e.userID.name
            
        }
        res.send({status: 200, result});
    }).catch(function(err){
        res.send({status:500});
    })
}

//群消息已读---------------------------------------------end
exports.readedGroupMsg = function(data,res){
    //条件
    let wherestr = {'groupID': data.uid,'userID': data.uid};
    //修改已读
    let updatestr = {"tip": 0}
    GroupMsg.updateMany(wherestr,updatestr,(err,result)=>{
        if(err){
            res.send({status: 500});
        }else{
            res.send({status: 200})
        }
    })
}