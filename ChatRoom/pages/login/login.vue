<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image src="../../static/images/login/cancel.png"></image>
			</view>
			<view class="top-bar-right">
				<view class="top-bar-text" @tap="tosingUP">
					注册
				</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/logo.gif"></image>
		</view>
		<view class="main">
			<view class="slogan">欢迎使用</view>
			<view class="input">
				<input type="text" placeholder="用户名/邮箱" v-model="user" />
			</view>
			<view class="input">
				<input type="password" placeholder="密码" v-model="psw" />
			</view>
		</view>
		<view class="block-login">
			<view class="login" @tap="login">登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '',
				psw: '',
				token: ''
			}
		},
		onLoad: function(e) {
			if (e.user) {
				this.user = e.user
			}
		},
		methods: {
			//跳转到注册页面
			tosingUP: function() {
				uni.navigateTo({
					url: '../signUP/signUP'
				})
			},
			login: function() {
				if (this.user && this.psw) {
					uni.request({
						url: this.serverUrl + '/signin/match',
						data: {
							data: this.user,
							psw: this.psw,
						},
						method: 'POST',
						success: (data) => {
							let status = data.data.status
							if (status === 200) {
								//成功登陆
								//本地存储用户信息
								let res = data.data.userinfo
								try{
									uni.setStorageSync('user',{'id':res.id,'name':res.name,'imgurl':res.imgurl,'token':res.token})
								}catch(e){
									console.log("数据库错误")
								}
								
								//跳转到首页
								uni.redirectTo({
									url: '../index/index'
									
								})
							} else if (status === 400) {
								uni.showToast({
									title:"登陆失败，请检查登陆信息",
									icon:"none",
									duration:2000
								})
								
							} else if (status === 500) {
								//服务器出错
								uni.showToast({
									title: "服务器出错，请稍后再试",
									icon: "none",
									duration: 2000
								})
							}
						}
					})
				}
			},

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
	}

	.logo {
		image {
			width: 300rpx;
			height: 300rpx;
			margin-top: 260rpx;
		}
	}

	.main {

		.slogan {
			font-size: 40rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(39, 40, 50, 0.3);
			line-height: 56rpx;
			margin-top: $uni-spacing-row-base;
			text-align: center;
		}

		.input {
			font-size: 32rpx;
			font-family: AvenirNext-Medium, AvenirNext;
			font-weight: 500;
			color: rgba(39, 40, 50, 0.8);
			line-height: 44rpx;
			margin-top: $uni-spacing-row-base;
			border-bottom: 1rpx solid rgba(39, 40, 50, 0.1);
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
