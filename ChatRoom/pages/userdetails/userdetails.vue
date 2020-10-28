<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image @tap="backOne" src="../../static/images/signUp/leftBack@2x.png"></image>
			</view>
			<view class="top-bar-center">
				详细
			</view>
			<view class="top-bar-right"></view>
		</view>
		<view class="item-list">
			<view class="region-style1">
				<view class="title">头像</view>
				<view class="cont-image">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>

					<image :src="cropFilePath" @tap="upload" ></image>

				</view>
				<view class="more" @tap="upload" v-if="revisabiliy" >
					<image  src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1" >
				<view class="title">昵称</view>
				<view class="cont" @tap="modifyAnimate('昵称','name')">
					{{userdata.name}}
				</view>
				<view class="more" v-if="revisabiliy" @tap="modifyAnimate('昵称','name')">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1" v-if="isfriend" >
				<view class="title">备注</view>
				<view class="cont" @tap="modifyAnimate('备注','markname')">
					{{userdata.markname}}
				</view>
				<view class="more" v-if="isfriend" @tap="modifyAnimate('备注','markname')">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1" >
				<view class="title">签名</view>
				<view class="cont" @tap="modifyAnimate('签名','explain')">
					{{userdata.explain}}
				</view>
				<view class="more" @tap="modifyAnimate('签名','explain')" v-if="revisabiliy">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1">
				<view class="title">性别</view>
				<view class="cont">
					<picker @change="SexPickerChange" :value="index" :range="array" :disabled="!revisabiliy">
						<view class="uni-input">{{array[index]}}</view>
					</picker>
				</view>
				<view class="more" v-if="revisabiliy">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1">
				<view class="title">生日</view>
				<view class="cont">
					<picker mode="date" :value="userdata.birth" :start="startDate" :end="endDate" @change="bindDateChange" :disabled="!revisabiliy">
						<view class="uni-input">{{date}}</view>
					</picker>
				</view>
				<view class="more" v-if="revisabiliy">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>


			<view class="region-style1" >
				<view class="title">电话</view>
				<view class="cont" @tap="modifyAnimate('电话','phone')">
					{{userdata.phone}}
				</view>
				<view class="more" @tap="modifyAnimate('电话','phone')" v-if="revisabiliy">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1" >
				<view class="title">邮箱</view>
				<view class="cont" @tap="modifyAnimate('邮箱','email');pwdShowfun()">
					{{userdata.email}}
				</view>
				<view class="more" @tap="modifyAnimate('邮箱','email');pwdShowfun()" v-if="revisabiliy">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
			<view class="region-style1" >
				<view class="title">密码</view>
				<view class="cont" @tap="pwdShowfun();modifyAnimate('密码','psw')">
					****
				</view>
				<view class="more" @tap="pwdShowfun();modifyAnimate('密码','psw')" v-if="revisabiliy">
					<image src="../../static/images/common/more.png"></image>
				</view>
			</view>
		</view>
		<view class="signOut" v-if="revisabiliy">退出登录</view>
		<view class="modify" :style="{bottom: '-'+widHeight+'px'}" :animation="animationDate">
			<view class="modify-header">
				<view class="close" @tap="modifyAnimate">取消</view>
				<view class="title">{{rowTitle}}</view>
				<view class="define" @tap="modifySubmit();modifySubmitAnimate()">确定</view>
			</view>
			<view class="modify-main">
				<input v-if="pwdShow" type="text" v-model="psw" placeholder="旧密码" class="modify-pwd" placeholder-style="color:#aaa;font-weight:400;" />
				<textarea class=" modify-content" v-model="submitVal"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "../../components/ling-imgcropper/ling-imgcropper.vue"
	import myfunc from "../../common/js/myFunction.js"
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				userdata: [],
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				array: ['男', '女','未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '../../static/logo.png',
				cropFilePath: '',
				titleArr: ['昵称', '签名', '电话'],
				submitVal: '',			//弹窗修改的内容
				psw: '',
				isModify: false,
				animationDate: {},
				widHeight: '', //页面高度
				rowTitle: '',	//修改项名称
				submitType: "explain",   //修改项
				pwdShow: false,
				
				
				id: '',			//目标id
				uid: '',		//用户id
				token: '',
				revisabiliy: true,   //是否可修改信息
				isfriend: false,
			};
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		onLoad(e) {
			if(e.id){
				this.id = e.id
			}
		},
		onReady() {
			this.getStorages()
			this.getElmement()
			this.getUserDetail()
			this.judgeObject()
		},
		methods: {
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//获取本地用户信息
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id
						this.token = value.token
					} else {
						//无用户缓存，跳转到登录页
						uni.navigateTo({
							url: '../login/login'
						})
					}
				} catch (e) {
					console.log(e)
				}
			},
			//存储到本地缓存
			saveStorages: function(){
				let res = this.userdata
				try{
					uni.setStorageSync('user',{'id':res._id,'name':res.name,'imgurl':res.imgurl,'token':res.token})
				}catch(e){
					console.log("无法本地缓存")
				}
			},
			//退出登录 清除指定key
			removeStorage: function(){
				try {
				    uni.removeStorageSync('user');
				} catch (e) {
				    // error
				}
			},
			//性别日期选择
			SexPickerChange: function(e) {
				// console.log('picker发送选择改变，携带值为', e.target.value)
				if(this.revisabiliy == true){
					let type = e.target.value
					if(type == 0){
						this.userdata.sex = "male"
					}else if(type == 1){
						this.userdata.sex = "female"
					}else if(type == 2){
						this.userdata.sex = "asexual"
					}
					uni.request({
						url: this.serverUrl + "/user/userupdate",
						data:{
							id: this.userdata._id,
							data: this.userdata.sex,
							type: "sex",
							token: this.token
						},
						method:"POST",
						success: (data) => {
							let status = data.data.status
							if(status === 200){
								this.index = type
								uni.showToast({
									title:"修改成功",
									icon: "none",
									duration: 2000
								})
							}
						}
						
					})
				}
				
			},
			bindDateChange: function(e) {
				this.date = e.target.value
				uni.request({
					url: this.serverUrl + "/user/userupdate",
					data:{
						id: this.userdata._id,
						data: this.date,
						type: "birth",
						token: this.token
					},
					method:"POST",
					success: (data) => {
						let status = data.data.status
						if(status === 200){
							this.index = type
							uni.showToast({
								title:"修改成功",
								icon: "none",
								duration: 2000
							})
						}
					}
					
				})
			},
			getDate: function(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			// 图片裁剪
			upload: function() {
				if(this.revisabiliy == true){
					
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择
						success: (res) => {
							this.tempFilePath = res.tempFilePaths.shift()

						}
					});
				}
			},
			confirm: function(e) {

				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				//除了H5端返回base64数据外，（APP-PLUS||MP就是APP和小程序就执行编译。）其他端都是返回临时地址，所以你要判断base64还是已上传文件名，
				//按我这里是先上传裁剪得来的临时文件地址然后得到已上传的文件名，
				//呆活你要判断是H5还是其他端传给后端类型参数让后端判断执行何种情况代码就OK了

				uni.uploadFile({
					url: this.serverUrl + '/files/upload',
					filePath: this.headimg,
					name: 'file',
					fileType: 'image',
					formData: {
					    'url': 'user/',
						name: this.id
					},
					//formData:{},传递参数
					success: (uploadFileRes) => {
						var result = uploadFileRes.data;
						this.userdata.imgurl = result
						console.log(this.userdata)
						uni.request({
							url: this.serverUrl + "/user/userupdate",
							data:{
								id: this.userdata._id,
								data: this.userdata.imgurl,
								type: "imgurl",
								token: this.token
							},
							method:"POST",
							success: (data) => {
								let status = data.data.status
								if(status === 200){
									uni.showToast({
										title:"修改成功",
										icon: "none",
										duration: 2000
									})
									this.saveStorages()
								}else if(status===500){
									uni.showToast({
										title:"服务器错误",
										icon: "none",
										duration: 2000
									})
								}
							}
						})
					},
					complete() {
					},
					fail(e) {
						console.log("this is errormes " + e.message)
					}

				});

			},
			cancel: function() {
				console.log('canceled');
				this.tempFilePath = "";

			},
			// 修改弹窗
			getElmement: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					this.widHeight = data.height
				}).exec();
			},
			//弹窗修改动画
			modifyAnimate: function(val,type) {
				//选择的修改项
				if(this.revisabiliy || this.isfriend){
					this.submitType = type
					if (typeof val == 'string') {
						this.rowTitle = val
					}
					this.isModify = !this.isModify
					var animation = uni.createAnimation({
						duration: 200,
						timingFunction: 'linear'
					})
					if (this.isModify) {
						animation.bottom(0).step()
					} else {
						this.pwdShow = false
						animation.bottom(-this.widHeight).step()
					}
					this.animationDate = animation.export()
					
				}
				
			},
			//弹窗取消动画
			modifySubmitAnimate: function(){
				this.modifyAnimate()
				this.pwdShow = false
			},
			//弹窗确认提交
			modifySubmit: function() {
				let submitType = this.submitType
				console.log(submitType)
				//无需密码修改
				if(submitType == "name" || submitType == "explain" || submitType == "phone"){
					this.userdata[submitType] = this.submitVal
					uni.request({
						url: this.serverUrl + "/user/userupdate",
						data:{
							id: this.userdata._id,
							data: this.submitVal,
							type: submitType,
							token: this.token
						},
						method:"POST",
						success: (data) => {
							let status = data.data.status
							if(status === 200){
								uni.showToast({
									title:"修改成功",
									icon: "none",
									duration: 2000
								})
							}else if(status===500){
								uni.showToast({
									title:"服务器错误",
									icon: "none",
									duration: 2000
								})
							}
						}
					})
				}else if(submitType == "email" || submitType == "psw"){
					uni.request({
						url: this.serverUrl + "/user/userupdate",
						data:{
							id: this.userdata._id,
							data: this.submitVal,
							type: submitType,
							psw: this.psw,
							token: this.token
						},
						method:"POST",
						success: (data) => {
							let status = data.data.status
							if(status === 200){
								uni.showToast({
									title:"修改成功",
									icon: "none",
									duration: 2000
								})
							}
						}
					})
					
					setTimeout(function() {
						this.getUserDetail()
					}, 500);
				}else if(submitType == "markname"){
					this.userdata[submitType] = this.submitVal
					uni.request({
						url: this.serverUrl + "/user/fmarkname",
						data:{
							uid: this.uid,
							fid: this.id,
							name: this.submitVal,
							token: this.token
						},
						method:"POST",
						success: (data) => {
							let status = data.data.status
							if(status === 200){
								uni.showToast({
									title:"修改成功",
									icon: "none",
									duration: 2000
								})
							}else if(status===500){
								uni.showToast({
									title:"服务器错误",
									icon: "none",
									duration: 2000
								})
							}
						}
					})
				}
				console.log(this.userdata)

			},
			pwdShowfun: function(){
				this.pwdShow = true
				console.log(this.pwdShow)
				
			},
			//信息获取
			getUserDetail: function(){
				uni.request({
					url: this.serverUrl + "/user/detail",
					data:{
						id: this.id
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status
						if(status == 200){
							let res = data.data.result
							let sex = res.sex
							res.imgurl = this.serverUrl + "/user/" + res.imgurl
							if(sex == "male"){
								this.index = 0
							}else if(sex == "female"){
								this.index = 1
							}else if(sex == "asexual"){
								this.index = 2
							}
							
							console.log(res)
							this.userdata = res
							this.cropFilePath = res.imgurl
							
							// try{
							// 	uni.setStorageSync('user',{'id':res.id,'name':res.name,'imgurl':res.imgurl,'token':res.token})
							// }catch(e){
							// 	console.log("数据库错误")
							// }
						}
					}
				})
			},
			//用户判断
			judgeObject: function(){
				if(this.uid == this.id){
					//用户本人
					this.revisabiliy = true
				}else {
					//好友
					this.revisabiliy = false
					this.isfriend = true
					this.getMarkname()
					
				}
			},
			//获取好友昵称
			getMarkname:function(){
				uni.request({
					url: this.serverUrl + '/user/getfmarkname',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status === 200) {
							if(data.data.result != undefined){
								this.userdata.markname = data.data.result.markname
								console.log(this.userdata)
							}
						} else if (status === 500) {
							uni.showToast({
								title: '服务器错误，请稍后再试',
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			},
		},
		components: {
			ImageCropper
		},
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";


	.top-bar {
		border-bottom: 1px solid $uni-border-color;

		.top-bar-left {
			margin-left: $uni-spacing-row-base;
			display: flex;
			width: 40rpx;
			height: 40rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				border-radius: $uni-border-radius-base;
			}
		}

		.top-bar-center {
			font-size: 40rpx;
			letter-spacing: 10rpx;
		}
	}


	.item-list {
		flex-direction: column;
		margin-top: 120rpx;
		// height: 112rpx;

		.region-style1 {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: center;
			position: relative;
			height: 112rpx;

			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			line-height: 44rpx;

			.title {
				position: relative;
				left: -26rpx;
				color: rgba(39, 40, 50, 1);
				width: 70rpx;
			}

			.cont {
				position: relative;
				color: rgba(39, 40, 50, 0.6);
				width: 530rpx;
				height: 50rpx;
				line-height: 50rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}

			.cont-image {
				position: relative;
				width: 530rpx;
				height: 104rpx;
				border-radius: 20rpx;

				image {
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
				}

			}

			.more {
				position: relative;
				left: 20rpx;
				width: 28rpx;

				image {
					width: 28rpx;
					height: 28rpx;
				}
			}
		}
	}
			.signOut {
				width: 144rpx;
				height: 44rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FF5D5B;
				line-height: 44rpx;
				text-align: center;
				padding-top: 100rpx;
			}

	//弹窗修改
	.modify {
		position: fixed;
		z-index: 10003;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #FFFFFF;

		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;

			.close {
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				padding-left: $uni-spacing-col-base;

			}

			.title {
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;

			}

			.define {
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}

		.modify-main {
			display: flex;
			flex-direction: column;
			padding: $uni-spacing-col-base;

			.modify-pwd {
				flex: auto;
				padding: 20rpx;
				margin-bottom: $uni-spacing-col-base;
				height: 88rpx;
				background-color: rgba(243, 244, 246, 1);
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}

			.modify-content {
				flex: auto;
				width: 686rpx;
				height: 386rpx;
				background-color: rgba(243, 244, 246, 1);
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
				padding: $uni-spacing-col-sm;
			}
		}
	}
</style>
