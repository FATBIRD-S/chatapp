var dbserver = require('../dbo/dbserver');

//登录
exports.signIn = function(req, res){
    let data = req.body.data;
    let pwd = req.body.psw;
    // console.log(req.body)
    dbserver.userMatch(data, pwd, res);
    // res.send({res})
}