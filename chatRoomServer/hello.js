const express = require('express')
const jwt = require('./dbo/jwt')
const app = express()
const port = 8848

//socket.io
var server = app.listen(8888);
var io = require('socket.io').listen(server);
require('./dbo/socket')(io);



app.get('/', (req, res) => res.send('Hello World!'))
//跨域
// app.all('*', function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Methods', '*');
//     res.header('Content-Type', 'application/json;charset=utf-8');
//     next();
// });

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', '*');
    res.header('X-Powered-By','3.2.1')
    res.header('Content-Type', 'application/json;charset=utf-8');
    if(req.method == 'OPTIONS'){
        res.sendStatus(200);
    }else{
        next();
    }
});

//前端jason数据解析
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended: true}));

//静态资源文件路径
app.use(express.static(__dirname + '/data'))

// token判断
app.use(function(req, res, next){
    console.log(req.body)
    if(typeof(req.body.token) != 'undefined'){
        let token = req.body.token
        let tokenMatch = jwt.verifyToken(token)
        if(tokenMatch == 0){
            res.send({err: '用户已过期', status: 300})
        }else{
            next()
        }
    }else{
        next()
    }
})


//引入路由
require('./router/index')(app);
require('./router/files')(app);
//page 404
app.use((req,res,next) => {
    let err = new Error('NOT FOUND');
    err.status = 404;
    next(err);
})

//err solution
app.use((err,req,res,next) => {
    res.status(err.status || 500)
    res.send(err.message)
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))


