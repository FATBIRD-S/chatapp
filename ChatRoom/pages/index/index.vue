<template>
	<view class="content">
		<view class="top-bar">
			<navigator :url="'../details/details?id=' + uid" class="top-bar-left">
				<image :src="imgurl"></image>
			</navigator>
			<view class="top-bar-center">
				<view class="title">消息</view>
			</view>
			<view class="top-bar-right">
				<view class="search">
					<image @tap="toSearch" src="../../static/images/index/search@2x.png"></image>
				</view>
				<view class="add">
					<image src="../../static/images/index/addgroup@2x.png"></image>
				</view>
			</view>
		</view>


		<view class="chart-list">
			<!-- 好友请求 -->
			<view class="apply">
				<view class="chart-list-item">
					<view class="head-port" @tap="toRequest">
						<image style="background-color: yellow;" src="../../static/images/index/addfriend.png"></image>
						<text class="notice-num" v-show="friendRequest.length>0 ? true: false">{{friendRequest.length}}</text>
					</view>
					<view class="frend-information" @tap="toRequest">
						<view class="frend-info">
							<view class="frend-name">
								好友请求
							</view>
							<view class="message-time">
								<!-- {{friendRequest[0].lastTime}} -->
							</view>
						</view>
						<view class="frend-message">{{friendRequest.length}}人请求添加你为好友</view>
					</view>

				</view>
			</view>
			<!-- 聊天项 -->
			<view class="chart-list-item" v-for="(item, index) in userFriendArr" :key="index">
				<view class="head-port" @tap="toChartroom(item)">
					<image :src="item.imgurl"></image>
					<text class="notice-num" v-show="item.tip>0 ? true: false">{{item.tip}}</text>
				</view>
				<view class="frend-information" @tap="toChartroom(item),msgReaded(item.id)">
					<view class="frend-info">
						<view class="frend-name">
							{{item.markname?item.markname:item.name}}
						</view>
						<view class="message-time">
							{{newsChTime(item.lastTime)}}
						</view>
					</view>
					<view class="frend-message">{{item.message}}</view>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	import myfunc from "../../common/js/myFunction.js"
	export default {
		data() {
			return {
				uid: '', //用户id
				imgurl: '', //用户头像
				token: '', //token
				userFriendArr: [], //好友列表信息
				friendRequest: [] //好友请求列表
			}
		},
		onLoad() {},
		onReady() {
			this.getStorages();
			this.getFriendList();
			this.getRequestList();
			this.join(this.uid);
			// this.sockettest()

		},
		onPullDownRefresh() {
			this.userFriendArr = []
			this.getStorages()
			this.getFriendList()
			this.getRequestList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		computed: {
			requestNUM: function() {
				return this.friendRequest.length
			},

		},
		methods: {
			//获取本地缓存
			getStorages: function() {
				try {
					const value = uni.getStorageSync('user')
					if (value) {
						this.uid = value.id
						this.imgurl = this.serverUrl + '/user/' + value.imgurl
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
			newsChTime: function(date) {
				return myfunc.dateTime(date);
			},
			toSearch: function() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			toChartroom: function(e) {
				uni.navigateTo({
					url: '../chatroom/chatroom?id=' + e.id + "&imgurl=" + e.imgurl
				})
			},
			toRequest: function() {
				uni.navigateTo({
					url: '../request/request?id=' + this.uid
				})
			},
			//获取好友列表
			getFriendList: function() {
				uni.request({
					url: this.serverUrl + "/index/getfriend",
					data: {
						uid: this.uid,
						state: 0,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status === 200) {
							let res = data.data.result
							for (let i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl
								res[i].message = ""
								res[i].tip = 0
							}
							this.getLastMsg(res);
							this.getReadedMsgNum(res);
							this.userFriendArr = res;
						} else if (status === 400) {

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
			//与好友最后通讯消息
			getLastMsg: function(req) {
				for (let i = 0; i < req.length; i++) {
					uni.request({
						url: this.serverUrl + "/index/getlastmsg",
						data: {
							uid: this.uid,
							fid: req[i].id,
							token: this.token
						},
						method: "POST",
						success: (data) => {
							let status = data.data.status;
							if (status === 200) {
								let res = data.data.result
								req[i].message = res.message
								req[i].types = res.types
								req[i].time = res.time
							} else if (status === 400) {

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
			//好友消息未读数
			getReadedMsgNum: function(req) {
				for (let i = 0; i < req.length; i++) {
					uni.request({
						url: this.serverUrl + "/index/unreadmsg",
						data: {
							fid: this.uid,
							uid: req[i].id,
							token: this.token
						},
						method: "POST",
						success: (data) => {
							let status = data.data.status;
							if (status === 200) {
								let res = data.data.result
								req[i].tip = res
								console.log(res)
							} else if (status === 400) {

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
			//获取好友请求
			getRequestList: function(res) {
				uni.request({
					url: this.serverUrl + "/index/getfriend",
					data: {
						uid: this.uid,
						state: 1,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status === 200) {
							let result = data.data.result
							for (let i = 0; i < result.length; i++) {
								result[i].lastTime = this.newsChTime(result[i].lastTime)
							}
							this.friendRequest = result
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
			//消息已读
			msgReaded: function(fid) {
				uni.request({
					url: this.serverUrl + "/index/readedmsg",
					data: {
						uid: this.uid,
						fid: fid,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status;
						if (status === 200) {
							console.log('消息已读')
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
			//socket模块
			//登录时socket注册
			join: function(uid) {
				this.socket.emit('login', uid)
			},
			//服务器消息接受测试
			// sockettest: function() {
			// 	this.socket.on('msg', (id) => {
			// 		// console.log('后端发送的id：' + id)
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// padding-top: var(--status-bar-height);
	}

	.top-bar {
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
	}

	.chart-list {
		padding-top: 150rpx;
	}

	.chart-list-item {
		display: flex;
		position: relative;
		flex-direction: row;
		align-items: center;
		height: 100rpx;
		width: 750rpx;
		padding-top: $uni-spacing-col-base;

		.head-port {
			height: 96rpx;
			width: 96rpx;
			margin-left: $uni-spacing-row-base;

			image {
				height: 96rpx;
				width: 96rpx;
				border-radius: $uni-border-radius-base;
			}

			.notice-num {
				position: absolute;
				top: 20rpx;
				left: 116rpx;
				display: block;
				height: 36rpx;
				min-width: 20rpx;
				padding: 0 8rpx;
				text-align: center;
				border-radius: $uni-border-radius-base;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				background: rgba(255, 93, 91, 1);
				color: rgba(255, 255, 255, 1);
				line-height: 36rpx;
			}
		}

		.frend-information {
			margin-left: $uni-spacing-row-base;

			.frend-info {
				height: 50rpx;
				width: 542rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.frend-name {
					font-size: 36rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(39, 40, 50, 1);
					line-height: 50rpx;
				}

				.message-time {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(39, 40, 50, 0.4);
					line-height: 34rpx;
				}
			}

			.frend-message {
				width: 542rpx;
				height: 40rpx;
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.6);
				line-height: 40rpx;
				overflow: hidden;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
			}
		}

	}
</style>
