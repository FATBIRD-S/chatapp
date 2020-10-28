import Vue from 'vue'
import App from './App'
//weapp.socket.id 模块
import io from './common/js/socket/weapp.socket.io.js'


Vue.config.productionTip = false

//服务器地址
// Vue.prototype.serverUrl = "http://192.168.3.11:3000"
// Vue.prototype.socket = io("http://192.168.3.11:8888")
Vue.prototype.serverUrl = "http://www.fatbird-s.com:8848"
Vue.prototype.socket = io("http://www.fatbird-s.com:8888")

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
