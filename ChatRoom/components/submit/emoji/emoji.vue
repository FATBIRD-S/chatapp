<template>
	<view class="emoji">
		<view class="emoji-line" v-for="(line,i) in emoji" :key="i">
			<view @tap="emojiEnter(item)" class="emoji-item" v-for="(item,index) in line" :key="index">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return{
				emoji: [
					['😀','😁','😂','🤣','😃','😄','😆','😉'],
					['😊','😋','😎','😍','😘','😗','😚','🙂'],
					['🤗','🤔','😐','😶','🙄','😏','😣','😥'],
					['😮','😮','😪','😫','😛','😴','😌','😓'],
					['😤','😢','😭','😦','😧','😬','😳','😱']
				]
			}
		},
		methods: {
			emojiEnter: function(e){
				this.$emit('emojiItem',e)
			}
		}
	}
</script>

<style lang="scss">
	.emoji {
		width: 100%;
		height: 350rpx;
		padding: 16rpx;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		padding-bottom: 90rpx;
		.emoji-line {
			display: flex;
			.emoji-item {
				flex: 1;
				text-align: center;
				font-size: 45rpx;
				line-height: 80rpx;
			}
		}
	}
</style>
