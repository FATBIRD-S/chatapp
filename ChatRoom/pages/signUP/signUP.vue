<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backLogin">
				<image src="../../static/images/signUp/leftBack@2x.png"></image>
			</view>
			<!-- <view class="top-bar-right">
				<image src="../../static/images/signUp/close@2x.png"></image>
			</view> -->
		</view>
		<view class="logo">
			<image src="../../static/images/logo.gif"></image>
		</view>
		<view class="main">
			<view class="slogan">完成注册成为会员！</view>
			<view class="input">
				<input type="text" placeholder="请设置用户名" @blur="getname" />
				<view class="tips" v-if="empty_name">已存在</view>
				<image v-if="had_name" src="../../static/images/signUp/Group3@2x.png"></image>
			</view>
			<view class="input">
				<input type="text" placeholder="请输入注册邮箱" @blur="getemal" />
				<image v-if="empty_email" src="../../static/images/signUp/Group3@2x.png"></image>
				<view class="tips" v-if="!empty_email">{{hint}}</view>
			</view>
			<view class="input">
				<input :type="type_input" placeholder="请设置密码" @blur="getpas" />
				<view>
					<image v-if="password_show" @tap="passwordLook" src="../../static/images/signUp/closeEar@2x.png"></image>
					<image v-if="!password_show" @tap="passwordLook" src="../../static/images/signUp/show@2x.png"></image>
				</view>
			</view>
		</view>
		<view class="block-login">
			<view class="login" @tap="signUp">注册</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				empty_name: false, //false 未注册过
				had_name: false, //false 已注册过用户
				empty_email: false, //false 已注册过邮箱
				password_show: false,
				type_input: 'password',
				legal_email: false, //邮箱是否合法
				hint: '', //邮箱提示
				userneme: '',
				email: '',
				pas: ''
			};
		},
		methods: {
			passwordLook: function() {
				//密码显示
				if (this.password_show) {
					this.type_input = 'password';
					this.password_show = !this.password_show;
				} else {
					this.type_input = 'text';
					this.password_show = !this.password_show;
				}
			},
			isEmail: function(e) {
				//邮箱格式验证
				// console.log(e.detail.value)
				var emailIput = e
				var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if (emailIput == '') {
					this.hint = ''
				} else if (!myreg.test(emailIput)) {
					this.empty_email = false
					this.hint = '邮箱错误'
					this.legal_email = false
				} else {
					this.empty_email = true
					this.legal_email = true
				}
			},
			backLogin: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			getname: function(e) {
				console.log(233)
				if (e.detail.value != "") {
					this.userneme = e.detail.value
					uni.request({
						url: this.serverUrl + "/signup/judge",
						data: {
							data: this.userneme,
							type: "name"
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
								console.log(data.data)
							if (status == 200) {
								if (data.data.result === 1) {
									//用户已经存在
									this.empty_name = true
									this.had_name = false
								} else {
									this.empty_name = false
									this.had_name = true
								}
							} else if (status == 500) {
								uni.showToast({
									title: '服务器错误，请稍后再试',
									icon: 'none',
									duration: 2000
								})
							}

						}
					})

				}
			},
			getemal: function(e) {
				this.isEmail(e.detail.value)
				if (this.legal_email == true) {
					this.email = e.detail.value
					uni.request({
						url: this.serverUrl + "/signup/judge",
						data: {
							data: this.email,
							type: "email"
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								console.log(data.data.result)
								if (data.data.result === 0) {
									this.empty_email = true
									this.hint = ""
								} else {
									//邮箱已注册
									this.empty_email = false
									this.hint = "已注册"
								}
							} else if (status == 500) {
								uni.showToast({
									title: '服务器错误，请稍后再试',
									icon: 'none',
									duration: 2000
								})
							}
						}
					})
				}
			},
			getpas: function(e) {
				this.pas = e.detail.value
			},
			signUp: function() {
				//用户名，邮箱存在，为空 不能注册
				if (this.had_name === true && this.empty_email === true && this.userneme != "" && this.pas != "") {
					uni.request({
						url: this.serverUrl + "/signup/adduser",
						data: {
							name: this.userneme,
							email: this.email,
							psw: this.pas
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status == 200) {
								// uni.showToast({
								// 	title: '注册成功，请返回登陆',
								// 	icon: 'none',
								// 	duration: 2000
								// })
								//注册成功 跳转回登录页
								uni.navigateTo({
									url: '../login/login?user=' + this.userneme
								})
								//发送组测成功邮件
								// this.succeedEmail()
							} else if (status == 500) {
								uni.showToast({
									title: '服务器错误，请稍后再试',
									icon: 'none',
									duration: 2000
								})
							}
						}
					})
				} else {
					uni.showToast({
						title: '请检测注册信息',
						icon: 'none',
						duration: 2000
					})
				}
			},
			succeedEmail: function() {
				uni.request({
					url: this.serverUrl + "/mail",
					data: {
						name: this.userneme,
						email: this.email,
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if (status == 200) {
							console.log("邮件发送成功")
						} else if (status == 500) {
							console.log("服务器错误")
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";

	page {
		background-color: rgba(247, 245, 249, 1);
	}

	.content {
		display: flex;
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// padding-top: var(--status-bar-height);
	}

	.top-bar {
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);

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

		.top-bar-right {
			margin-right: $uni-spacing-row-base;
			display: flex;
			width: 40rpx;
			height: 40rpx;

			image {
				width: 40rpx;
				height: 40rpx;
				border-radius: $uni-border-radius-base;
			}
		}
	}

	.logo {
		image {
			width: 300rpx;
			height: 300rpx;
			margin-top: 200rpx;
		}
	}

	.main {
		width: 620rpx;
		margin-left: $uni-spacing-row-lg;
		margin-right: $uni-spacing-row-lg;

		.slogan {
			font-size: 40rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(39, 40, 50, 0.3);
			line-height: 56rpx;
			margin-top: $uni-spacing-row-base;
		}

		.input {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 32rpx;
			font-family: AvenirNext-Medium, AvenirNext;
			font-weight: 500;
			color: rgba(39, 40, 50, 0.8);
			line-height: 44rpx;
			margin-top: $uni-spacing-row-base;
			border-bottom: 1rpx solid rgba(39, 40, 50, 0.1);

			input {
				width: 500rpx;
			}

			image {
				width: 40rpx;
				height: 40rpx;
				margin-left: $uni-spacing-row-base;
			}
		}

		.tips {
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: rgba(255, 93, 91, 1);
			line-height: 40rpx;
		}
	}

	.block-login {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 300rpx;
		height: 88rpx;
		background: rgba(181, 175, 242, 1);
		box-shadow: 0rpx 50rpx 32rpx -36rpx rgba(147, 134, 225, 1);
		border-radius: 48rpx;
		margin-top: $uni-spacing-row-base;

		.login {
			width: 64rpx;
			height: 44rpx;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 1000;
			color: rgba(39, 40, 50, 0.8);
			line-height: 44rpx;
		}
	}
</style>
