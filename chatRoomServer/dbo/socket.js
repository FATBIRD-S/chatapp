var dbserver = require("../dbo/dbserver")

module.exports = function(io){
    var users = {};

    io.on('connect',(socket)=>{
        //socket 用户注册

        //用户登录注册
        socket.on('login',(id)=>{
            console.log(socket.id + '连接')
            socket.emit('msg',socket.id)

            socket.name = id;
            users[id] = socket.id
            // console.log(users)
            

        });

         //消息接收发送
        socket.on('msg',(msg,fromid,toid)=>{
            console.log(msg)
            console.log(users)
            // console.log(toid)
            //发送给目标用户
            dbserver.msg(msg,fromid,toid)
            if(users[toid]){
                socket.to(users[toid]).emit('msg',msg,fromid)
            }

        });

        //用户离开
        socket.on('disconnecting',()=>{


            if(users.hasOwnProperty(socket.name)){
                delete users[socket.name]
                console.log(socket.id + '离开')

            }

        })
    })
}