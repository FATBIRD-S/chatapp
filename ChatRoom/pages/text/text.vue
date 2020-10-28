<template>
	<view>
		<view @tap="uploadphoto" class="upload">upload photos</view>
		<image v-for="(item,index) in img" :key="index" :src="item"></image>
		<view @tap="test" class="test">test</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 'dddddddddd',
				img: []
			};
		},
		methods:{
			uploadphoto: function(){
				uni.chooseImage({
					    count: 9, //默认9
					    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					    sourceType: ['album'], //从相册选择
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
				        for(let i = 0; i < tempFilePaths.length; i++){
							const uploadTask = uni.uploadFile({
							    url: 'http://192.168.3.11:3000/files/upload', //仅为示例，非真实的接口地址
							    filePath: tempFilePaths[i],
							    name: 'file',
							    formData: {
							        'url': 'user/1',
									name: new Date().getTime() + this.id+"_"+i
							    },
							    success: (uploadFileRes) => {
									let data = uploadFileRes.data.split('\\');
									let path = data[1]+'/'+data[2]+'/'+data[3]
									this.img.push('http://192.168.3.11:3000/'+path)
							        console.log(2333);
							    }
							});
											
							uploadTask.onProgressUpdate((res) => {
							    console.log('上传进度' + res.progress);
							    console.log('已经上传的数据长度' + res.totalBytesSent);
							    console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
											
							    // // 测试条件，取消上传任务。
							    // if (res.progress > 50) {
							    //     uploadTask.abort();
							    // }
							});
						}
				    }
				});
			},
			test: function(){
				console.log('tap')
				uni.request({
					url:'http://192.168.3.11:3000/index/unreadmsg	',
					// url:'http://192.168.3.11:3000/friend/updatefriendstate',
					data:{
						// name: '小王',
						// mail:'xiaowang@163.com',
						// psw: 'xiaowang',
						// data: 'xiaosi@163.com',
						// id: '5f73fb8ddf95d53e0cca299b',
						// data: '123456789',
						// type: 'psw'
						uid:'5f7350b0df95d53e0cca2998',
						fid:'5f73fbdadf95d53e0cca299d',			
						msg: '小黑请求添加王为好友',
						// state: 1
					},
					method:'POST',
					success: (data) => {
						console.log(data)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.upload {
		text-align: center;
		margin-top: 100rpx;
		background-color: rgba($color: #0f0, $alpha: 0.5);
		height: 100rpx;
		line-height: 100rpx;
	}
	image {
		width: 500rpx;
	}
	.test {
		text-align: center;
		margin-top: 100rpx;
		background-color: rgba($color: #f00, $alpha: 0.5);
		height: 100rpx;
		line-height: 100rpx;
	}
</style>
