<template>
	<view class="content">
		<view class="top-bar">
			<view @tap="backOne" class="top-bar-left">
				<image src="../../static/images/signUp/leftBack@2x.png"></image>
			</view>
			<view class="top-bar-right">
				<image @tap="toUserdetails" src="../../static/images/details/more@2x.png" v-if="relationship==0"></image>
			</view>
		</view>
		<view class="bg">
			<!-- <view class="bg-bai"></view> -->
			<image class="bg-img" :src="user.imgurl" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view v-show="isShow" :style="{background: sexBg}" class="sex" :animation="animationDate1">
					<image class="sex-img" :src="seximg"></image>
				</view>
				<view class="head-img" :animation="animationDate2">
					<image class="user-img" :src="user.imgurl"></image>
				</view>
			</view>
			<view v-show="isShow" :animation="animationDate1" class="details-info">
				<view class="details-name">{{user.name}}</view>
				<!-- <view class="details-name">{{user.name}}</view> -->
				<view class="details-sign">{{user.explain}}</view>
			</view>

		</view>

		<view v-if="relationship" v-show="isShow" :animation="animationDate1" @tap="addAnimat" class="add-friend">加好友</view>
		<view v-if="relationship==0 && isMyself==0" class="add-friend">发送消息</view>

		<view v-if="relationship" class="addbox" :animation="animationDate" :style="{bottom: - addBoxHeigth +'px'}">
			<view class="friend-name">
				<view class="friend-name-show">{{user.name}}</view>
				<!-- <view class="placehold-none"></view> -->
			</view>
			<view class="message">
				<textarea :placeholder="name+'请求加为好友~~'" :value="msg" @blur="getvalue" class="message-area"></textarea>
			</view>
			<view class="button-bottom">
				<view @tap="addAnimat" class="cancle">取消</view>
				<view @tap="addFriend,addAnimat" class="add-friend">加好友</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uid: '', //用户id
				name: '', //用户名字
				id: '', //对象
				token: '',
				msg: '',//添加好友验证信息
				user: {},
				seximg: '',
				sexBg: '',
				relationship: 0, //0好友 1陌生人
				isMyself: 0, //1是
				isShow: true,
				addBoxHeigth: '2000',
				animationDate: {},
				animationDate1: {},
				animationDate2: {},
			};
		},
		onLoad: function(e) {
			if (e.id) {
				this.id = e.id
			}
		},
		onReady: function() {
			this.getElmement();
			this.getStorages();
			this.getUser();
			this.judgeFriend();
		},
		methods: {
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			toUserdetails: function(){
				uni.navigateTo({
					url: '../userdetails/userdetails?id=' + this.id
				})
			},
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id
						this.token = value.token
						this.name = value.name
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
			//获取用户详情
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detail',
					data: {
						id: this.id,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status === 200) {
							let res = data.data.result;
							//头像处理
							res.imgurl = this.serverUrl + '/user/' + res.imgurl;
							//是否有简介
							if (res.explain == undefined) {
								res.explain = "这个人很懒，什么都没有留下。。。"
							}
							//性别判断
							if (res.sex == "female") {
								//女
								this.seximg = '../../static/images/details/female.png'
								this.sexBg = 'red'
							} else if (res.sex == "male") {
								this.seximg = '../../static/images/details/male.png'
								this.sexBg = 'blue'
							} else {
								this.seximg = '../../static/images/details/asexual.png'
								this.sexBg = 'black'
							}
							this.user = res
							console.log(res)
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
			//判断用户关系
			judgeFriend: function() {
				//关系判断
				if (this.uid === this.id) {
					//自己
					this.isMyself = 1
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token
						},
						method: "POST",
						success: (data) => {
							let status = data.data.status;
							if (status === 200) {
								//是好友
								this.relationship = 0
								this.getMarkname();
							} else if (status === 400) {
								//不是好友
								this.relationship = 1
							} else if (status === 500) {
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
								this.user.name = data.data.result.markname
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
			//添加好友
			addFriend: function(){
				uni.request({
					url: this.serverUrl + '/friend/applyfriend',
					data: {
						uid: this.uid,
						fid: this.id,
						msg: this.msg,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status === 200) {
							uni.showToast({
								title: '添加信息以发送',
								icon: 'none',
								duration: 2000
							})
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
			//获取元素信息
			getElmement: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					this.addBoxHeigth = data.height
				}).exec();
			},
			addAnimat: function() {
				this.isShow = !this.isShow;
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'linear'
				})
				var animation1 = uni.createAnimation({
					duration: 400,
					timingFunction: 'linear'
				})
				var animation2 = uni.createAnimation({
					duration: 400,
					timingFunction: 'linear'
				})

				if (this.isShow) {
					animation.bottom(-this.addBoxHeigth).step()
					animation1.opacity(1).step()
					animation2.width().height().top().left().step()
				} else {
					animation.bottom(0).step()
					animation1.opacity(0).step()
					animation2.width(120).height(120).left(-75).step()
				}

				this.animationDate = animation.export()
				this.animationDate1 = animation1.export()
				this.animationDate2 = animation2.export()
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";

	.top-bar {
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
			width: 52rpx;
			height: 12rpx;

			image {
				width: 52rpx;
				height: 12rpx;
				border-radius: $uni-border-radius-base;
			}
		}
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		margin-top: env(safe-area-inset-top);
		z-index: -2;

		.bg-bai {
			width: 100%;
			height: 100%;
		}

		.bg-img {
			width: 120%;
			height: 120%;
			left: -60rpx;
			top: -60rpx;
			filter: blur(10rpx);
			opacity: 0.7;
			z-index: -1;
		}
	}

	.main {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		width: 100%;
		// margin-top: env(safe-area-inset-top);
		margin-top: 100rpx;
		// top: 0;
		// justify-content: center;
		align-items: center;

		// position: relative;
		.user-header {
			position: relative;
			margin-top: 200rpx;
			width: 400rpx;
			height: 400rpx;
			z-index: 99;

			// .user-header {
			// 			position: relative;
			// 			top: -120rpx;
			// 			left: 60rpx;
			// 			width: 240rpx;
			// 			height: 240rpx;
			// 			box-shadow: 0px 18px 20px 0px rgba(39, 40, 50, 0.1);
			// 			border-radius: 120rpx;
			// 			border: 3px solid rgba(255, 255, 255, 1);

			// 			image {
			// 				width: 240rpx;
			// 				height: 240rpx;
			// 				border-radius: 120rpx;
			// 			}
			// 		}

			.sex {
				width: 64rpx;
				height: 64rpx;
				border-radius: 18px;
				position: absolute;
				z-index: 1000;
				right: 16rpx;
				bottom: 16rpx;

				.sex-img {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-16rpx, -16rpx);
					// margin-left: -16rpx;
					// margin-top: -16rpx;
					width: 32rpx;
					height: 32rpx;
				}
			}

			.head-img {
				position: relative;
				top: 0;
				left: 0;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);

				.user-img {
					top: 0;
					width: 100%;
					height: 100%;
					border-radius: 48rpx;
				}
			}
		}

		.details-info {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;

			.details-name {
				// display: flex;
				width: 600rpx;
				height: 74rpx;
				font-size: 52rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 1);
				margin-top: $uni-spacing-row-base;
				// line-height:37px;
			}

			// .details-name {

			// 	width: 600rpx;
			// 	height: 40rpx;
			// 	font-size: 28rpx;
			// 	font-family: PingFangSC-Regular, PingFang SC;
			// 	font-weight: 400;
			// 	color: rgba(39, 40, 50, 1);
			// 	line-height: 20px;
			// 	margin-top: 14rpx;
			// }

			.details-sign {
				width: 600rpx;
				// height:85rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Light, PingFang SC;
				font-weight: 300;
				color: rgba(39, 40, 50, 1);
				line-height: 48rpx;
				margin-top: 20rpx;
			}
		}

	}

	.add-friend {
		position: absolute;
		bottom: 70rpx;
		width: 600rpx;
		height: 80rpx;
		background: rgba(255, 228, 49, 1);
		border-radius: 10rpx;
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(39, 40, 50, 1);
		line-height: 80rpx;
		text-align: center;

	}

	.addbox {
		position: fixed;
		display: flex;
		height: 75%;
		width: 100%;
		// bottom: 0;
		background: rgba(255, 255, 255, 1);
		border-radius: 20px 20px 0px 0px;
		opacity: 0.8;

		.friend-name {
			// display: flex;
			position: absolute;
			width: 75%;
			margin-top: 20%;
			flex-direction: row;
			align-items: center;
			height: 80rpx;

			.friend-name-show {
				width: 50%;
				text-align: center;
				font-size: 52rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 1);
				line-height: 74rpx;
			}

			.placehold-none {
				width: 50%;
			}
		}

		.message {
			margin-top: 35%;
			position: absolute;
			display: flex;
			width: 100%;
			height: 60%;
			justify-content: center;

			.message-area {
				width: 90%;
				height: 100%;
				// margin-left: 5%;
				background: rgba(243, 244, 246, 1);
				border-radius: 20rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 1);
				line-height: 50rpx;
				padding: 10rpx;
			}
		}

		.button-bottom {
			position: absolute;
			bottom: 60rpx;
			display: flex;
			flex-direction: row;
			text-align: center;
			width: 100%;
			height: 80rpx;

			.cancle {
				width: 172rpx;
				height: 80rpx;
				background: rgba(39, 40, 50, 0.1);
				border-radius: 10rpx;
				line-height: 80rpx;
				margin-left: 36rpx;
			}

			.add-friend {
				position: static;
				width: 480rpx;
				height: 80rpx;
				background: rgba(255, 228, 49, 1);
				border-radius: 10rpx;
				line-height: 80rpx;
				margin-left: 36rpx;
			}
		}
	}
</style>
