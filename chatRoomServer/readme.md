#### 技术栈
- 主要使用 express + mongoose + socket.io
- 邮件发送 采用插件nodemailer https://nodemailer.com/about/
- 图片文件存储  使用multer https://www.expressjs.com.cn/en/resources/middleware/multer.html
- token的生成 解码 jsonwebtoken  https://www.npmjs.com/package/jsonwebtoken
- 密码加密 解密  bcryptjs   https://www.npmjs.com/package/bcryptjs

#### 文档结构
- config 邮箱 数据库设置引用
- data 文件存储目录
- dbo 
    - bcrypt.js 密码加密解密
    - dbserber.js 数据库操作
    - emailserver.js 注册邮件发送
    - jwt.js token模块
    - mkdir.js 文件路径创建
    - socket.js socket通讯模块
- model 数据库模式类型设置 定义数据结构
- router 路由设置
- server 前端数据预处理


#### 目前后端为了测试已部署到服务器 地址查看接口文档