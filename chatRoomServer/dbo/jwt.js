const jwt = require('jsonwebtoken');


var secret = 'ilovejs';


//生成token
exports.generateToken = function(id, res){
    let payload = {id:id, time: new Date()};
    let token = jwt.sign(payload, secret, { expiresIn: 60 * 60 * 24 });
    return token; 
}

//解码token
exports.verifyToken = function(e){
    let payload = jwt.verify(e, secret,(err, result) => {
        if(err){
            return 0
        }else{
            return 1
        }
    });
    
    return payload;
}