var multer = require('multer');
var mkdir = require("../dbo/mkdir");
//磁盘存储
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let url= req.body.url;
        mkdir.mkdirs('../data/'+url, err => {
            console.log(err);
        })


        cb(null, './data/'+url);
    },
    filename: function (req, file, cb) {
        let suffix = file.originalname.replace(/.+\./, ".");
        let name = req.body.name;
        cb(null, name + suffix);
    }
})

var upload = multer({ storage: storage })

module.exports = function (app) {
    app.post('/files/upload', upload.array('file', 10), function (req, res, next) {
        // req.files 是 `photos` 文件数组的信息
        // req.body 将具有文本域数据，如果存在的话
        //获取文件地址信息
        let url = req.body.url;
        let name = req.files[0].filename;
        let data = url + name
            
        //返回前端
        res.send(data);
    })
}