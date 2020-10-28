const nodemailer = require('nodemailer');
const credential = require('../config/credentials');

let transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credential.qq.user,
        pass: credential.qq.pass
    }
})

exports.emailSignUp = function(data,res){
    let options = {
        from: '1092929899@qq.com',
        to: data.email,
        subject: '感谢注册~',
        html: `<span>欢迎加入,你的用户名是：${data.name}</span><a href="http:localhost:8080/">点击</a>`
    }

    transporter.sendMail(options,(err,msg) => {
        if(err){
            res.send(err)
            console.log(err)
        }else{
            res.send('邮箱发送成功！')
            console.log("email sent successfully")
        }
    })
}

exports.createSixNum = function(){
    var num = ""
    for(let i = 0;i < 6;i++){
        num += Math.floor(Math.random()*10)
    }
    return num
}