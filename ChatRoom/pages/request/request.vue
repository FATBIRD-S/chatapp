<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image @tap="backOne" src="../../static/images/signUp/leftBack@2x.png"></image>
			</view>
			<view class="top-bar-center">
				好友请求
			</view>
			<view class="top-bar-right"></view>
		</view>
		<view class="main">
			<view class="friend-request"  v-for="(item,index) in reqArr" :key="index">
				<view class="handle">
					<view class="cancle" :style="{background:item.isAgree==0?green:yellow }" @tap="rejectFriend(item)">
						拒绝
					</view>
					<view class="head-img">
						<image class="user-img" :src="item.imgurl"></image>
					</view>
					<view class="agree" :style="{background:item.isAgree==1?green:yellow}" @tap="agreeFriend(item)">
						同意
					</view>
				</view>
				
				<view class="friend-info">
					<view class="frend-name">{{item.name}}</view>
					<view class="request-time">{{item.lastTime}}</view>
				</view>
				<view class="leave-message">
					<view class="mesage-info">留言：{{item.message}}</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import myfunc from '../../common/js/myFunction.js'
	export default {
		data() {
			return {
				uid: '',				//用户id
				token: '',				//token
				reqArr: [],				//好友申请
				green: "green",
				yellow: "yellow"
				
			};
		},
		onLoad: function(e) {
			if (e.id) {
				this.id = e.id
			}
		},
		onReady:function(){
			this.getStorages();
			this.getRequesters()
		},
		computed:{
			
		},
		methods: {
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
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			//时间修改
			timeChange: function(date){
				return myfunc.dateTime(date)
			},
			//好友获取
			getRequesters: function(){
				uni.request({
					url: this.serverUrl + "/index/getfriend",
					data:{
						uid: this.uid,
						state: 1			//1 被申请
					},
					method:"POST",
					success: (data) => {
						let status = data.data.status
						if(status === 200){
							let res = data.data.result
							res.forEach((item,index)=>{
								item.imgurl = this.serverUrl + '/user/' + item.imgurl;
								item.lastTime = this.timeChange(item.lastTime);
								item.isAgree = 2      //未操作
								this.getLastMsg(item,index)
							})
							this.reqArr= res
							console.log(this.reqArr)
						}
					}
				})
			},
			//获取申请消息
			getLastMsg: function(e,index){
				uni.request({
					url: this.serverUrl + "/index/getlastmsg",
					data:{
						uid: this.uid,
						fid: e.id		
					},
					method:"POST",
					success: (data) => {
						let status = data.data.status
						if(status === 200){
							let res = data.data.result
							e.message = res.message
						}
					}
				})
			},
			//拒绝好友
			rejectFriend: function(e){
				uni.request({
					url: this.serverUrl + "/friend/deletefriend",
					data:{
						uid: this.uid,
						fid: e.id		
					},
					method:"POST",
					success: (data) => {
						let status = data.data.status
						if(status === 200){
							//拒绝好友成功
							e.isAgree = 0   //拒绝
						}else if(status === 500){
							uni.showToast({
								title:"服务器繁忙",
								icon:"none",
								duration: 2000
							})
						}
					}
				})
			},
			//同意好友
			agreeFriend: function(e){
				uni.request({
					url: this.serverUrl + "/friend/updatefriendstate",
					data:{
						uid: this.uid,
						fid: e.id		
					},
					method:"POST",
					success: (data) => {
						let status = data.data.status
						if(status === 200){
							//同意
							e.isAgree = 1   
						}else if(status === 500){
							uni.showToast({
								title:"服务器繁忙",
								icon:"none",
								duration: 2000
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";

	.content {
		flex-direction: column;
		display: flex;
		justify-content: center;
		align-items: center;
	}

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
	}

	.main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 100rpx;
		width: 100%;


		.friend-request {
			box-shadow: 4rpx 24rpx 64rpx 4rpx rgba(0, 0, 0, 0.3);
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			flex-direction: column;
			font-size: 32rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 93, 91, 1);
			height: 400rpx;
			width: 95%;
			line-height: 64rpx;
			top: 100rpx;
			margin-bottom: 100rpx;
			border-radius: 40rpx;
			
			.handle {
				display: flex;
				flex-direction: row;
				align-items: center;
				text-align: center;
				position: relative;
				height: 64rpx;
				top: -32rpx;
				.cancle {
					width: 160rpx;
					height: 64rpx;
					// background: rgba(255, 93, 91, 0.1);
					border-radius: 40rpx;
					margin-left: 36rpx;
				}
				
				.head-img {
					position: relative;
					top: -75rpx;
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
					padding: 0 50rpx;
					.user-img {
						width: 150rpx;
						height: 150rpx;
						border-radius: 50%;
					}
				}
				
				.agree {
					width: 160rpx;
					height: 64rpx;
					// background: rgba(255, 228, 49, 1);
					border-radius: 40rpx;
					margin-right: 36rpx;
				}
			}
		}
		.friend-info{
			flex-direction: column;
			top: -50rpx;
			text-align: center;
			.frend-name{
				font-size: 36rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #272832;
				line-height: 50rpx;
			}
			.request-time {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.4);
				line-height: 34rpx;
			}
		}
		.leave-message{
			width: 622rpx;
			height: 120rpx;
			background: #F3F4F6;
			border-radius: 20rpx;
			position: relative;
			top: 40rpx;
			.mesage-info {
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.8);
				line-height: 20px;
				padding: 20rpx;
			}
		}
	}
</style>
