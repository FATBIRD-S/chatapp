var mongoose = require('mongoose');
var db = require('../config/db');
var Schema = mongoose.Schema;
//用户表
var UserSchema = new Schema({
    name: String,                                       //用户名
    psw: String,                                        //密码
    email: String,                                      //邮箱
    sex: {type:String, default: 'asexual'},             //性别
    birth: {type: Date},                                //生日
    phone: String,                                      //电话
    explain: String,                                    //介绍
    imgurl: {type: String, default: 'user.jpg'},        //用户头像
    register: {type: Date}                              //组测日期

});
//好友表
var FriendSchema = new Schema({
    userID: {type: Schema.Types.ObjectId, ref:'User'},              //用户id
    friendID: {type: Schema.Types.ObjectId, ref:'User'},            //好友id
    state: {type: String},                                          //好友状态 0好友，1被申请中 2申请者
    time: {type: Date},                                              //添加日期
    markname: {type: String},
    lastTime: {type: Date}                                          //最后通信时间
});
//一对一消息表
var MessageSchema = new Schema({
    userID: {type: Schema.Types.ObjectId, ref:'User'},              //用户id
    friendID: {type: Schema.Types.ObjectId, ref:'User'},            //好友id
    message: {type: String},                                        //消息内容
    types: {type: String},                                          //消息类型
    state: {type: Number},                                          //消息状态 0已读 1未读
    time: {type: Date}                                              //消息时间

});
//群表
var GroupSchema = new Schema({
    userID: {type: Schema.Types.ObjectId, ref:'User'},              //用户id
    name: {type: String},                                           //群名称
    imgurl: {type: String, default: 'group.png'},                   //群头像
    notice: {type: String},                                         //群公告
    time: {type: Date}                                              //创建时间

});
//群成员表
var GroupUserSchema = new Schema({
    groupID: {type: Schema.Types.ObjectId, ref:'Group'},            //群id
    userID: {type: Schema.Types.ObjectId, ref:'User'},              //用户id
    name: {type: String},                                           //群内名称
    tip: {type: Number, default: 0},                                //消息数
    shield: {type: Number},                                         //消息屏蔽
    time: {type: Date},                                              //加入时间
    lastTime: {type: Date}                                          //最后通信时间

});
//群消息表
var GroupMsgSchema = new Schema({
    groupID: {type: Schema.Types.ObjectId, ref:'Group'},            //群ID
    userID: {type: Schema.Types.ObjectId, reg:'User'},              //用户ID
    message: {type: String},                                        //消息内容
    types: {types: Number},                                         //消息类型
    time: {type: Date}                                              //加入时间
})


module.exports = db.model('User', UserSchema);
module.exports = db.model('Friend', FriendSchema);
module.exports = db.model('Message', MessageSchema);
module.exports = db.model('Group', GroupSchema);
module.exports = db.model('GroupUser', GroupUserSchema);
module.exports = db.model('GroupMsg', GroupMsgSchema);