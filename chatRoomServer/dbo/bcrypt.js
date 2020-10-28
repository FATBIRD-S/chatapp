var bcrypt = require('bcryptjs');

//加密
exports.encryption = function (e) {
    //生成随机字符串
    let salt = bcrypt.genSaltSync(10);
    //hash 加密
    let hash = bcrypt.hashSync(e, salt);

    return hash;
}

//解密验证
exports.verification = function (e, hash) {
    let verif = bcrypt.compareSync(e, hash);
    
    return verif;
}
