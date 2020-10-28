<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-div">
				<input class="search" @confirm="search" type="search" v-model="searchVal" placeholder="搜索用户/群" />
				<view class="search-img">
					<image @tap="search" src="../../static/images/index/search@2x.png"></image>
				</view>
			</view>

			<view class="top-bar-right">
				<view @tap="backLogin" class="top-bar-text">
					取消
				</view>
			</view>
		</view>

		<view class="chart-list">
			<view class="classes" v-show="userarr.length > 0">用户</view>
			<view class="chart-list-item" v-for="(item, index) in userarr" :key="index">
				<navigator url="../details/details" class="head-port">
					<image :src="item.imgurl"></image>
				</navigator>
				<view class="friend-info">
					<view class="friend-name" v-html="item.name">
						<!-- {{item.name}} -->
					</view>
					<view class="friend-email" v-html="item.email">
						<!-- {{item.email}} -->
					</view>
				</view>
				<view class="handle">
					<view class="handle-text" @tap="toFriendDetail(index)">详细</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>

	export default {
		data() {
			return {
				userarr: [],
				searchVal: "",
				token: '',
				
			}
		},
		onReady() {
			this.getStorage()
		},
		methods: {
			backLogin: function(){
				uni.navigateBack({
					delta:1
				})
			},
			toFriendDetail: function(index){
				uni.navigateTo({
					url: '../details/details?id=' + this.userarr[index]._id
				})
			},
			getStorage: function(){
				try {
					const value = uni.getStorageSync('user')
					if (value) {
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
			search: function(){
				uni.request({
					url: this.serverUrl + "/search/user",
					data:{
						data: this.searchVal,
						token: this.token
					},
					method: 'POST',
					success: (data) => {
						let status = data.data.status
						if(status === 200){
							let res = data.data.result
							if(res.length > 0){
								res.forEach((item,index)=>{
									item.imgurl = this.serverUrl + '/user/' + item.imgurl;
								})
								this.userarr = res
								this.searchUser(this.searchVal)
							}else{
								uni.showToast({
									title: '未搜索到结果',
									icon: 'none',
									duration: 2000
								})
							}
						}else if(status === 500){
							uni.showToast({
								title: '服务器错误，请稍后再试',
								icon: 'none',
								duration: 2000
							})
						}
					}
				})
			},
			//关键词匹配高亮
			searchUser: function(e){
				let arr = this.userarr
				let exp = eval("/"+e+"/g")
				for(let i = 0; i< arr.length; i++){
					this.userarr[i].name = arr[i].name.replace(exp,"<span style='color:blue;'>" + e + "</span>")
					this.userarr[i].email = arr[i].email.replace(exp,"<span style='color:blue;'>" + e + "</span>")
				}
			}
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

		.search-div {
			margin-left: 32rpx;
			width: 580rpx;
			height: 60rpx;
			background: rgba(243, 244, 246, 1);
			border-radius: 10rpx;
			.search {
				width: 500rpx;
				height: 60rpx;
				padding-left: 20rpx;
				padding-right: 60rpx;
			}

			.search-img {
				width: 40rpx;
				height: 40rpx;
				z-index: 100;
				position: absolute;
				top: 20rpx;
				right: 160rpx;

				image {
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.top-bar-right {
			.top-bar-text {
				font-size: 28rpx;
				width: 56rpx;
				height: 40rpx;
				margin-right: 30rpx;
			}
		}
	}

	.chart-list{
		display: flex;
		flex-direction: column;
		margin-top: 100rpx;
		width: 100%;
	}
	.classes{
		width:100%;
		height:60rpx;
		text-align: left;
		font-size:44rpx;
		font-family:PingFangSC-Semibold,PingFang SC;
		font-weight:600;
		color:rgba(39,40,50,1);
		line-height:60rpx;
		margin-top: 20rpx;
		margin-left: 36rpx;
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
		}

		.friend-info {
			display: flex;
			flex-direction: column;
			margin-left: $uni-spacing-row-base;
			.friend-name {
				font-size: 36rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 500;
				color: rgba(39, 40, 50, 1);
				line-height: 50rpx;
				// margin-left: $uni-spacing-row-base;
			}
			.friend-email {
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: red;
			}
		}
		
		.handle {
			display: flex;
			position: absolute;
			right: 32rpx;
			justify-content: center;
			align-items: center;
			width: 120rpx;
			height: 48rpx;
			background: rgba(255, 228, 49, 1);
			border-radius: 48rpx;

			.handle-text {
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 400;
				color: rgba(39, 40, 50, 1);
				line-height: 34rpx;
			}
		}

	}
</style>
