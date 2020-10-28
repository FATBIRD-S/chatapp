var dbserver = require('../dbo/dbserver');

var emailserver = require('../dbo/emailserver')

var signup = require('../server/signup');

var signin = require('../server/signin')

var search = require('../server/search')

var userdetailset = require('../server/userdetailset')

var friend = require('../server/friend')

var index = require('../server/index')

var msg = require('../server/msg')

module.exports = function(app){
    app.get('/test',(req,res) => {
        dbserver.findUser(res);
        res.send('page test')
    })

    app.post('/mail', (req,res)=>{
        let data = req.body;
        emailserver.emailSignUp(data,res)
        // res.send(mail);
    })
    //  注册
    //用户注册
    app.post('/signup/adduser', (req, res) =>{
        signup.signup(req, res)
    })
    //邮箱占用检测
    app.post('/signup/judge', (req, res) =>{
        signup.judgeUsed(req, res)
    }) 
    //  登录页
    //登录验证
    app.post('/signin/match', (req, res)=>{
        signin.signIn(req,res)
    })

    // 搜索页
    //用户搜索
    app.post('/search/user',(req, res) => {
        search.searchUser(req,res)
    })
    //群搜索
    app.post('/search/group',(req,res) => {
        search.searchGroup(req,res)
    })
    //判断是否是好友
    app.post('/search/isfriend',(req,res) => {
        search.isFriend(req,res)
    })
    //判断是否是群用户
    app.post('/search/isgroupuser',(req,res) => {
        search.isInGroup(req,res)
    })

    //用户详情
    app.post('/user/detail',(req,res) => {
        userdetailset.userDetail(req,res)
    })
    //用户信息修改
    app.post('/user/userupdate',(req,res) => {
        userdetailset.userUpdate(req,res)
    })
    //好友昵称
    app.post('/user/getfmarkname',(req,res) => {
 
        userdetailset.getfMarkName(req,res)
    })
    //修改好友昵称
    app.post('/user/fmarkname',(req,res) => {
        userdetailset.friendMarkName(req,res)
    })


    //好友操作
    //好友申请
    app.post('/friend/applyfriend',(req,res)=>{
        
        friend.applyFriend(req,res)
    })
    //好友状态修改
    app.post('/friend/updatefriendstate',(req,res)=>{
        
        friend.updateFriendState(req,res)
    })
    //删除好友
    app.post('/friend/deletefriend',(req,res)=>{
        
        friend.deleteFriend(req,res)
    })

    //主页
    //好友获取
    app.post('/index/getfriend',(req,res)=>{
        index.getFriend(req,res)
    })
    //获取最后一条消息
    app.post('/index/getlastmsg',(req,res)=>{
        
        index.getLastMsg(req,res)
    })
    //消息未读数
    app.post('/index/unreadmsg',(req,res)=>{
        
        index.unreadMsg(req,res)
    })
    //消息已读
    app.post('/index/readedmsg',(req,res)=>{
        index.readedMsg(req,res)
    })

    //群获取 未读数-------------未验证
    app.post('/index/getgroup',(req,res)=>{
        index.getGroup(req,res)
    })
    //获取最后一条群消息
    app.post('/index/getlastgroupmsg',(req,res)=>{
        
        index.getLastGroupMsg(req,res)
    })
    //消息已读------------------end
    app.post('/index/readedgroupmsg',(req,res)=>{
        index.readedMsg(req,res)
    })

    //chat
    //分页消息获取
    app.post('/chat/getmsg',(req,res)=>{
        msg.getMsg(req,res)
    })
}


