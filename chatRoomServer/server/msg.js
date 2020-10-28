var dbserver = require('../dbo/dbserver');

exports.getMsg = function(req,res){
    let data = req.body

    dbserver.getMsg(data,res)
}
