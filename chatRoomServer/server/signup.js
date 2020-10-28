var dbserver = require('../dbo/dbserver')

//用户注册
exports.signup = function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let psw = req.body.psw;
    // console.log(req.body)
    // res.send({name,mail,psw})
    dbserver.buildUser(name, email, psw, res);
}

//用户或邮箱是否占用
exports.judgeUsed = function (req, res) {
    let data = req.body.data;
    let type = req.body.type;
    dbserver.UserCount(data, type, res);
    // res.send({data, type})
}
