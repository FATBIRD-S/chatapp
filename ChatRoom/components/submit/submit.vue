<template>
	<view class="input-area">
		<view class="submit">

			<view class="button-bottom">
				<view class="btn-img" @tap="inputChange">
					<image :src="inputtype"></image>
				</view>
				<textarea @focus="focus" @input="inputs" v-model="msg" class="btn chat-send" :class="{displaynone:isrecord}"
				 auto-height="true" fixed="true">
			 </textarea>
				<view class="record btn" :class="{displaynone:!isrecord}" 
				@touchstart="startRecord" 
				@touchend="endRecord"
				@touchmove="recordCancel">按住说话</view>
				<view class="btn-img" @tap="emoji">
					<image src="../../static/images/chatroom/expression.png"></image>
				</view>
				<view class="btn-img" @tap="add" v-if="!msgHad">
					<image src="../../static/images/chatroom/add.png"></image>
				</view>
				<view class="send-button" @tap="sendbtn" v-if="msgHad">发送</view>
			</view>

			<!-- 表情选择 -->
			<view class="bottom-hiden" v-if="showEmoji">
				<view class="emoji-send-det">
					<image @tap="delateMsg" src="../../static/images/chatroom/backspace.png"></image>
				</view>
				<emoji @emojiItem="emojiItem"></emoji>
			</view>
			<!-- 其他功能 -->
			<view class="bottom-hiden" v-if="showAdd">
				<view class="button-item" @tap="sendImg(0)">
					<image src="../../static/images/chatroom/photo.png"></image>
					<view class="item-name">图片</view>
				</view>
				<view class="button-item" @tap="sendImg(1)">
					<image src="../../static/images/chatroom/canera.png"></image>
					<view class="item-name">拍摄</view>
				</view>
				<view class="button-item" @tap="chooseLocation">
					<image src="../../static/images/chatroom/position.png"></image>
					<view class="item-name">位置</view>
				</view>
				<view class="button-item">
					<image src="../../static/images/chatroom/vedio.png"></image>
					<view class="item-name">录像</view>
				</view>
				<view class="button-item">
					<image src="../../static/images/chatroom/file.png"></image>
					<view class="item-name">文件</view>
				</view>
			</view>
		</view>
		<view class="record-bg" :class="{displaynone:!recordBg}">
			<view class="record-bg-len">
				<view class="record-bg-time" :style="{width: voiceTime/0.6 + '%'}">{{voiceTime}}"</view>
			</view>
			<view class="record-del" >上滑取消录音</view>
		</view>
	</view>
</template>

<script>
	import emoji from './emoji/emoji.vue'

	const recorderManager = uni.getRecorderManager();

	export default {
		data() {
			return {
				recordIcon: ['../../static/images/chatroom/audio.png', '../../static/images/chatroom/keyboard.png'],
				inputtype: '../../static/images/chatroom/audio.png',
				isrecord: false,
				showEmoji: false,
				showAdd: false,
				msg: "",
				msgHad: false,
				voicePath: '',
				voiceTimer: '',
				voiceTime: 1,
				recordBg: false,
				tourchPageY: 0,
				
			};
		},
		watch: {
			showEmoji(val, oldval) {
				if (val === true) {
					this.showAdd = false
				}
			},
			showAdd(val, oldval) {
				if (val === true) {
					this.showEmoji = false
				}
			}
		},
		components: {
			emoji
		},
		methods: {
			//语音 键盘输入切换
			inputChange: function() {
				if (this.isrecord == false) {
					this.inputtype = this.recordIcon[1];
					this.isrecord = true;
				} else {
					this.inputtype = this.recordIcon[0];
					this.isrecord = false;
				}
			},
			// 表情输入弹窗
			emoji: function() {
				if (this.showEmoji === true) {
					this.showEmoji = false
				} else {
					this.showEmoji = true
				}
				this.isrecord = false;
				this.inputtype = this.recordIcon[0];
				setTimeout(() => {
					this.getheight()
				}, 50)
			},
			// 其他功能显示
			add: function() {
				if (this.showAdd === true) {
					this.showAdd = false
				} else {
					this.showAdd = true
				}
				setTimeout(() => {
					this.getheight()
				}, 50)
			},
			// 信息输入
			inputs: function(e) {
				let chatm = e.detail.value;
				let pos = chatm.indexOf('\n');
				if (pos != -1 && chatm.length > 1) {
					this.sendMsg(this.msg, 0)

				}
				if (this.msg != "") {
					this.msgHad = true;
				} else {
					this.msgHad = false;
				}
			},
			// 输入框获取焦点 关闭表情 其他功能
			focus: function() {
				this.showEmoji = false
				this.showAdd = false
			},
			// bottom area 高度获取
			getheight: function() {
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit('heights', data.height);
				}).exec()
			},
			// 向消息添加表情
			emojiItem: function(e) {
				this.msg = this.msg + e;
				this.msgHad = true;
			},
			// 消息发送
			sendMsg: function(mes, type) {
				let data = {
					message: mes,
					types: type
				}
				//types 0文字 1图片 2语音 3位置
				this.$emit('inputsVal', data);
				this.msg = '';
				this.msgHad = false;
			},
			// 图片消息发送
			sendImg: function(source) {
				let sourceTy = [];
				let count = 9;
				if (source == 0) {
					count = 9;
					sourceTy[0] = 'album';
				} else {
					count = 1;
					sourceTy[0] = 'camera';
				}
				uni.chooseImage({
					count: count, //照片数
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: sourceTy, //从相册选择album  camera相机
					success: (res) => {
						const filePaths = res.tempFilePaths;
						for (let i = 0; i < filePaths.length; i++) {
							this.sendMsg(filePaths[i], 1)
						}
					}
				});
			},
			//发送按钮事件
			sendbtn: function() {
				this.sendMsg(this.msg, 0)
			},
			// backspace
			delateMsg: function() {
				this.msg = this.msg.substr(0, this.msg.length - 2)
				if (this.msg == "") {
					this.msgHad = false;
				}
			},
			//录音以及录音播放
			//开始录音
			startRecord: function(e) {
				this.tourchPageY = e.changedTouches[0].pageY
				console.log(this.tourchPageY);
				this.recordBg = true;
				let i = 1;
				this.voiceTimer = setInterval(() => {
					this.voiceTime = i
					i++;
					if(this.voiceTime == 60){
						this.endRecord()
					}
					console.log(i);
				}, 1000)
				recorderManager.start();
			},
			//结束录音
			endRecord: function() {
				console.log('录音结束');
				clearInterval(this.voiceTimer)
				recorderManager.stop();
				recorderManager.onStop((res) => {
					let data = {
						voice: res.tempFilePath,
						voiceTime: this.voiceTime
					}
					// console.log('recorder stop' + JSON.stringify(res));
					// this.voicePath = res.tempFilePath;
					if(this.recordBg == true){
						// console.log(data)
						this.sendMsg(data, 2)
					}
					this.voiceTime = 0
					this.recordBg = false;
					setTimeout(() => {
						this.getheight()
					}, 50)
					console.log('send success')
				});
				
			},
			//取消录音
			recordCancel: function(e) {
				let pageY = e.changedTouches[0].pageY;
				if(this.tourchPageY - pageY > 100){
					//录音显示背景关闭
					this.recordBg = false;
					
				}
			},
			//地图位置选择
			chooseLocation: function(){
				uni.chooseLocation({
				    success:(res) => {
						let data = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						}
						this.sendMsg(data,3)
				        // console.log('位置名称：' + res.name);
				        // console.log('详细地址：' + res.address);
				        // console.log('纬度：' + res.latitude);
				        // console.log('经度：' + res.longitude);
				    }
				});
			}
		}
	}
</script>

<style lang="scss">

	.submit {
		width: 100%;
		position: fixed;
		border-top: 1px solid $uni-border-color;
		padding-bottom: env(safe-area-inset-bottom);
		bottom: 0;
		left: 0;
		z-index: 1000;
	}

	.displaynone {
		display: none;
	}

	.button-bottom {
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: flex-end;
		justify-content: space-between;
		background-color: rgba($color: #ECEDEE, $alpha: 0.8);
		border-bottom: 1px solid $uni-border-color;
		box-sizing: border-box;
		padding: 10rpx;

		.btn {
			flex: auto;
			background-color: rgba($color: #fff, $alpha: 1.0);
			border-radius: 10rpx;
			font-size: 40rpx;
			line-height: 46rpx;
			height: 46rpx;
			padding: 20rpx;
			margin: 0 10rpx;
			max-height: 160rpx;
		}

		.record {
			text-align: center;
			letter-spacing: 10rpx;
		}

		.send-button {
			width: 160rpx;
			height: 60rpx;
			border-radius: $uni-border-radius-sm;
			text-align: center;
			line-height: 60rpx;
			font-weight: 500;
			font-family: PingFangSC-Regular, PingFang SC;
			flex: auto;
			background-color: rgba($color: #0a0, $alpha: 0.8);
			margin: 8rpx 10rpx;
		}

		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}
	}

	.bottom-hiden {
		width: 100%;
		height: 380rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;

		background-color: rgba($color: #ECEDEE, $alpha: 0.8);

		.button-item {
			width: 120rpx;
			height: 120rpx;
			background: rgba($color: #ECEDEE, $alpha: 0.8);
			border-radius: $uni-border-radius-base;
			margin: 10rpx 30rpx;
			text-align: center;
			line-height: 170rpx;

			.item-name {
				width: 120rpx;
				height: 24rpx;
				line-height: 24rpx;
				text-align: center;
				position: relative;
				top: -50rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 0.5);
			}

			image {
				width: 60rpx;
				height: 60rpx;
			}
		}

		.emoji-send-det {
			position: fixed;
			bottom: 0;
			right: 0;
			bottom: 10rpx;
			width: 110rpx;
			height: 80rpx;
			text-align: center;
			background-color: rgba($color: #fff, $alpha: 0.8);
			border-radius: $uni-border-radius-base;

			image {
				width: 100rpx;
				height: 80rpx;
			}
		}
	}

	.record-bg {
		height: 100%;
		width: 100%;
		position: fixed;
		background-color: rgba(0, 0, 0, 0.3);
		top: 0;
		left: 0;
		z-index: 100;

		.record-bg-len {
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255, 255, 255, 0.2);
			border-radius: 42rpx;
			text-align: center;
		}

		.record-bg-time {
			line-height: 84rpx;
			background-color: $uni-color-primary;
			border-radius: 42rpx;
			min-width: 80px;
			width: 80rpx;
			display: inline-block;
		}

		.record-del {
			position: absolute;
			bottom: 180rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			color: #FFFFFF;
			font-size: $uni-font-size-base;
			
		}
	}
</style>
