<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<image @tap="backOne" src="../../static/images/signUp/leftBack@2x.png"></image>
			</view>
			<view class="top-bar-center">
				{{markname}}
			</view>
			<view class="top-bar-right">
				<image src="../../static/images/details/more@2x.png"></image>
			</view>
		</view>

		<scroll-view class="chat" @scrolltoupper="loadingAni" scroll-y="true" scroll-with-animation="false" :scroll-into-view="scrollToView">
			<view class="chat-area" :style="{paddingBottom: inputh+'px'}">
				<view class="loading" :class="{displaynone: !isloading}">
					<image :animation="animationData" class="loading-img" src="../../static/images/common/Loading-b.png"></image>
				</view>
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg-'+item.id">
					<view class="message-lastTime" v-if="changeTime(item.time) != '刚刚'">{{changeTime(item.time)}}</view>
					<view class="friend-news" v-if="item.fromID != uid">
						<view class="friend-head">
							<image :src="firImgurl" @tap="toFriendDetail"></image>
						</view>
						<view class="news">
							<!-- 文本消息 -->
							<view class="msg-text" v-if="item.types == 0">{{item.message}}</view>
							<!-- 图片消息 -->
							<view class="msg-img" v-else-if="item.types == 1">
								<image :src="item.message" mode="widthFix" @tap="previewImg(item.message)"></image>
							</view>
							<!-- 语音消息 -->
							<view class="msg-audio" v-else-if="item.types == 2" @tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/msg_audio.png"></image>
								<view class="msg-audio-time">{{item.message.voiceTime}}"</view>
							</view>
							<view @tap="openLocation(item.message)" class="msg-map" v-else="item.types == 3">
								<view class="msg-map-name">{{item.message.name}}</view>
								<view class="msg-map-address">{{item.message.address}}</view>
								<image class="map" mode="widthFix" src="../../static/images/chatroom/LOA.jpg"></image>
								<!-- <map class="map" :markers="covers(item.message)" :latitude="item.message.latitude" :longitude="item.message.longitude"></map> -->
							</view>
						</view>
					</view>
					<view class="user-news" v-if="item.fromID == uid">
						<view class="user-head">
							<image :src="imgurl"></image>
						</view>
						<view class="news">
							<view class="msg-text" v-if="item.types == 0">{{item.message}}</view>
							<view class="msg-img" v-else-if="item.types == 1">
								<image :src="item.message 	" mode="widthFix" @tap="previewImg(item.message)"></image>
							</view>
							<view class="msg-audio" v-else-if="item.types == 2" @tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/msg_audio.png"></image>
								<view class="msg-audio-time">{{item.message.time}}"</view>
							</view>
							<view @tap="openLocation(item.message)" class="msg-map" v-else="item.types == 3">
								<view class="msg-map-name">{{item.message.name}}</view>
								<view class="msg-map-address">{{item.message.address}}</view>
								<image class="map" mode="widthFix" src="../../static/images/chatroom/LOA.jpg"></image>
								<!-- <map class="map" :markers="covers(item.message)" :latitude="item.message.latitude" :longitude="item.message.longitude"></map> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<submit @inputsVal="inputMessage" @heights="bottomHeight"></submit>


	</view>
</template>

<script>
	import datas from '../../common/js/datas.js'
	import myfun from '../../common/js/myFunction.js'
	import submit from '../../components/submit/submit.vue'

	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				uid: '',
				firImgurl: '',

				id: '',
				imgurl: '',

				token: '',
				markname: '',

				msgs: [],

				imgMsg: [],

				scrollToView: "",
				inputh: "60",
				animationData: {},
				nowPage: 0,
				msgNum: 0,
				pageSize: 10,
				loading: '',
				isloading: false,
				repetLoading: true
			};
		},
		onLoad: function(e) {
			if (e.id) {
				this.id = e.id
				this.firImgurl = e.imgurl
			}

			this.receiveSocketMsg()
		},
		onReady() {
			this.getStorages();
			this.getmessage()
		},
		components: {
			submit
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

				this.getMarkname();
			},
			backOne: function() {
				uni.navigateBack({
					delta: 1
				})
			},
			toFriendDetail: function() {
				uni.navigateTo({
					url: "../details/details?id=" + this.id
				})
			},
			// 设置页面滚动位置
			setPageScrollTo: function(selector) {
				let view = uni.createSelectorQuery().in(this).select(selector);
				view.boundingClientRect((res) => {
					uni.pageScrollTo({
						scrollTop: res.top - 30, // -30 为多显示出大半个消息的高度，示意上面还有信息。
						duration: 0
					});
				}).exec();
			},
			getmessage: function() {
				uni.request({
					url: this.serverUrl + "/chat/getmsg",
					data: {
						uid: this.uid,
						fid: this.id,
						nowPage: this.nowPage,
						// nowPage: 0,
						pageSize: this.pageSize,
						token: this.token
					},
					method: "POST",
					success: (data) => {
						let status = data.data.status
						if (status === 200) {
							let res = data.data.result
							// console.log(res)
							if (res.length > 0) {
								for (let i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									if (res[i].types == 1) {
										res[i].message = this.serverUrl + res[i].message
										this.imgMsg.push(res[i].message)
									}
									this.msgs.unshift(res[i])
								}
								// 获取待滚动元素选择器，解决插入数据后，滚动条定位时使用
								// let selector = '';

								// if (this.nowPage > 0) {
								// 	// 非第一页，则取历史消息数据的第一条信息元素
								// 	selector = `#msg-${res[res.length-1].id}`;
								// } else {
								// 	// 第一页，则取当前消息数据的最后一条信息元素
								// 	selector = `#msg-${res[0].id}`;
								// }

								//判断 nowPage
								if (res.length == this.pageSize) {
									this.nowPage++;
								} else {
									this.nowPage = -1;
								}

								//页面定位
								this.$nextTick(function() {
									// this.setPageScrollTo(selector)
									this.scrollToView = 'msg-' + res[0].id;
									clearInterval(this.loading);
									//关闭Loding
									this.isloading = false;
									//允许加载
									this.repetLoading = true;

								})

							} else if (status === 500) {

							}
						}
					}


				})
			},
			changeTime: function(date) {
				return myfun.dateTime(date);
			},
			//loading 
			loadingAni: function() {
				if (this.nowPage > 0 && this.repetLoading) {

					this.repetLoading = false;
					this.isloading = true;

					var animation = uni.createAnimation({
						duration: 200,
						timingFunction: 'linear',
					})

					this.animation = animation
					for (let i = 1; i < 11; i++) {
						this.animation.rotate(i * -36).step()

					}
					this.animationData = animation.export()
					setTimeout(() => {
						this.getmessage()
					}, 2000)
				}
				// let i = 1
				// this.loading = setInterval(function() {
				// 	animation.rotate(i * 30).step()
				// 	this.animationData = animation.export()
				// 	i++;
				// 	if (i > 20) {
				// 		this.getMsg(this.nowPage)
				// 	}
				// }.bind(this), 200)
			},
			//图片消息浏览
			previewImg: function(e) {
				let index = 0;
				index = this.imgMsg.indexOf(e)
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//submit 消息接收
			inputMessage: function(e) {
				// console.log(e)
				let len = this.msgs.length;
				let data = {
					id: len,
					fromID: this.uid,
					imgurl: this.imgurl,
					message: e.message,
					time: new Date(),
					types: e.types,
				};
				console.log(data)
				if(e.types == 0 || e.types == 3){
					this.sendSocket(data)
				}else if (e.types == 1) {
					this.imgMsg.push(e.message)
					//url设置
					let url = '/message/'+this.uid + '/img/'
					const uploadTask = uni.uploadFile({
					    url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
					    filePath: e.message,
					    name: 'file',
					    formData: {
					        'url': url,
							name: new Date().getTime() + this.uid
					    },
					    success: (uploadFileRes) => {
							let imgMessage = {
								fromID:this.uid,
								imgurl:this.imgurl,
								message: uploadFileRes.data,
								types: 1,
								time: new Date()
							}
							// console.log(data)
							this.sendSocket(imgMessage)
							// console.log(uploadFileRes)
					    }
					});
				}else if(e.types == 2){
					let url = '/message/'+this.uid + '/voice/'
					const uploadTask = uni.uploadFile({
					    url: this.serverUrl + '/files/upload', //仅为示例，非真实的接口地址
					    filePath: e.message.voice,
					    name: 'file',
					    formData: {
					        'url': url,
							name: new Date().getTime() + this.uid
					    },
					    success: (uploadFileRes) => {
							let data = {
								message: uploadFileRes.data,
								types: 2,
								time: new Date()
							}
							this.sendSocket(data)
							// console.log(data)
							// console.log(uploadFileRes)
					    }
					});
				}
				this.msgs.push(data)
				this.goBottom()

			},
			//聊天数据发送给后端
			sendSocket: function(e){
				this.socket.emit('msg',e,this.uid,this.id);
			},
			//socket数据接收
			receiveSocketMsg: function(){
				this.socket.on('msg',(msg,formid)=>{
						
					if(msg.fromID == this.id){
						let res = msg
						if(res.types == 1){
							res.message = this.serverUrl + res.message
						}
						this.msgs.push(res)
					}
				})
			},
			// 语音信息播放
			playVoice: function(e) {
				// innerAudioContext.autoplay = true;
				innerAudioContext.src = e;
				innerAudioContext.onPlay();
			},
			bottomHeight: function(e) {
				// console.log(e)
				this.inputh = e;
				this.goBottom()
			},
			goBottom: function() {
				this.scrollToView = '';
				this.$nextTick(function() {
					let len = this.msgs.length - 1;
					this.scrollToView = 'msg-' + this.msgs[len].id;
				})
			},
			// 地图定位标记
			covers: function(e) {
				let map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatroom/location.png'
				}]
				return map
			},
			openLocation: function(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address: e.address,
					success: () => {
						console.log('success');
					}
				});
			},
			//获取好友昵称
			getMarkname: function() {
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
							if (data.data.result != undefined) {
								let resdata = data.data.result
								this.markname = resdata.markname
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
	}
</script>

<style lang="scss">
	@import "../../common/css/mycss.scss";

	page {
		height: 100%;
	}

	.content {
		height: 100%;
	}

	.displaynone {
		display: none;
	}

	.top-bar {
		z-index: 10;
		background-color: rgba(255, 255, 255, 1);

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

	.chat {
		height: 100%;
		width: 100%;
		margin-top: env(safe-area-inset-top);


		.chat-area {
			padding-top: 100rpx;
			display: flex;
			flex-direction: column;

			.loading {
				text-align: center;

				.loading-img {
					width: 50rpx;
					height: 50rpx;
				}
			}

			.chat-ls {
				.message-lastTime {
					margin-top: 30rpx;
					margin-bottom: 10rpx;
					text-align: center;
					height: 34rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: rgba(39, 40, 50, 0.3);
					line-height: 34rpx;
				}

				.friend-news {
					// height: min($number: 80rpx);
					width: 100%;
					display: flex;
					flex-direction: row;
					margin-top: 30rpx;
					margin-bottom: 30rpx;
					margin-left: 20rpx;

					.friend-head {
						width: 80rpx;
						height: 80rpx;

						image {
							width: 80rpx;
							height: 80rpx;
							border-radius: $uni-border-radius-sm;
						}
					}

					.news {
						margin-left: 20rpx;
						max-width: 480rpx;

						.msg-text {
							padding: 20rpx;
							background: #F4F4F4;
							border-radius: 0rpx 20rpx 20rpx 20rpx;
							word-break: break-all;
							font-size: 32rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #191D23;
							line-height: 40rpx;

						}

						.msg-img {
							image {
								max-width: 480rpx;
								border-radius: 10rpx;
							}
						}

						.msg-audio {
							display: flex;
							flex-direction: row;
							font-size: 32rpx;
							height: 80rpx;
							background: #F4F4F4;
							border-radius: 0rpx 20rpx 20rpx 20rpx;

							.msg-audio-time {
								text-align: center;
								height: 80rpx;
								line-height: 80rpx;
								padding: 0 20rpx;
							}

							image {
								width: 80rpx;
								height: 40rpx;
								padding: 20rpx;
							}
						}

						.msg-map {
							background: #F4F4F4;
							border-radius: 20rpx 0rpx 20rpx 20rpx;
							width: 460rpx;

							.msg-map-name {
								font-size: $uni-font-size-lg;
								color: $uni-text-color;
								line-height: 44rpx;
								padding: 18rpx 24rpx 0 24rpx;
								overflow: hidden;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;

							}

							.msg-map-address {
								font-size: $uni-font-size-sm;
								color: $uni-text-color-disable;
								padding: 10rpx 24rpx;
								overflow: hidden;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 1;
							}

							.map {
								width: 460rpx;
							}
						}
					}
				}

			}

			.user-news {
				// width: 100%;
				display: flex;
				flex-direction: row-reverse;
				margin-top: 30rpx;
				margin-bottom: 30rpx;
				margin-right: 20rpx;

				.user-head {
					width: 80rpx;
					height: 80rpx;

					image {
						width: 80rpx;
						height: 80rpx;
						border-radius: $uni-border-radius-sm;
					}
				}

				.news {
					margin-right: 20rpx;
					max-width: 480rpx;

					.msg-text {
						background: #FFEADE;
						word-break: break-all;
						border-radius: 20rpx 0rpx 20rpx 20rpx;
						padding: 20rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #191D23;
						line-height: 40rpx;

					}

					.msg-img {
						image {
							max-width: 480rpx;
							border-radius: 10rpx;
						}
					}

					.msg-audio {
						display: flex;
						flex-direction: row-reverse;
						font-size: 32rpx;
						height: 80rpx;
						min-width: 120rpx;
						max-width: 480rpx;
						background: #F4F4F4;
						border-radius: 20rpx 0rpx 20rpx 20rpx;

						.msg-audio-time {
							text-align: center;
							height: 80rpx;
							line-height: 80rpx;
							padding: 0 20rpx;
						}

						image {
							width: 80rpx;
							height: 40rpx;
							padding: 20rpx;
						}
					}

					.msg-map {
						background: #F4F4F4;
						border-radius: 20rpx 0rpx 20rpx 20rpx;
						width: 460rpx;

						.msg-map-name {
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 44rpx;
							padding: 18rpx 24rpx 0 24rpx;
							overflow: hidden;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;

						}

						.msg-map-address {
							font-size: $uni-font-size-sm;
							color: $uni-text-color-disable;
							padding: 10rpx 24rpx;
							overflow: hidden;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
						}

						.map {
							width: 460rpx;
						}
					}
				}
			}
		}
	}
</style>
