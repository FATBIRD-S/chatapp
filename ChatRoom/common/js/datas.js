export default {
	friends: function() {
		let friendarr = [{
				id: 1,
				imgurl: '1.jpg',
				tip: 2,
				name: '乌蝇哥',
				time: new Date(),
				news: '食屎啦你？'
			},
			{
				id: 2,
				imgurl: '2.jpg',
				tip: 0,
				name: '李云龙',
				time: 'Sun Jun 07 2020 00:32:40 GMT+0800 (中国标准时间)',
				news: '你他娘的意大利炮呢？给我拉上来。'
			},
			{
				id: 3,
				imgurl: '3.jpg',
				tip: 1,
				name: '波澜哥',
				time: 'Sun May 07 2020 00:11:40 GMT+0800 (中国标准时间)',
				news: '掀起波澜~'
			},
			{
				id: 4,
				imgurl: '4.jpg',
				tip: 4,
				name: '刘醒',
				time: 'Sun Jun 06 2020 15:31:40 GMT+0800 (中国标准时间)',
				news: '呀屎啦，梁非凡。呀屎啦，梁非凡。呀屎啦，梁非凡。'
			}
		]
		return friendarr;
	},
	message: function() {
		let msgs = [
			{
				id: 'a',
				imgurl: '../../static/images/HeadPortraits/3.jpg',
				message: '街边焦急的我，餐厅忧郁的我，隔片沙玻璃，两眼带着悲伤',
				time: new Date() - 1000,
				types: 0,
				tip: 0
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: '冷雨扑向我，点点纷飞~',
				time: new Date() - 1000 * 10,
				types: 0,
				tip: 1
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: '千度高温波涛由你涌起，个个说我太狂笑我不羁，敢于交出真情哪算可鄙',
				time: new Date() - 1000 * 30,
				types: 0,
				tip: 2
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: '狂抱拥，不需休息的吻，不需呼吸空气，不需街边观众远离',
				time: new Date() - 1000 * 100,
				types: 0,
				tip: 3
			},
			{
				id: 'a',
				imgurl: '../../static/images/HeadPortraits/3.jpg',
				message: '微雨中 身边车辆飞过，街里路人走过，交通灯催促过剩下独是我跟你',
				time: new Date() - 1000 * 60 * 60,
				types: 0,
				tip: 4
			},
			{
				id: 'a',
				imgurl: '../../static/images/HeadPortraits/3.jpg',
				message: '微雨中 身边车辆飞过，街里路人走过，交通灯催促过剩下独是我跟你',
				time: new Date() - 1000 * 60 * 60 * 10,
				types: 0,
				tip: 5
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: '微雨中 身边车辆飞过，街里路人走过，交通灯催促过剩下独是我跟你',
				time: new Date() - 1000 * 60 * 60 * 24,
				types: 0,
				tip: 6
			},
			{
				id: 'a',
				imgurl: '../../static/images/HeadPortraits/3.jpg',
				message: '微雨中 身边车辆飞过，街里路人走过，交通灯催促过剩下独是我跟你',
				time: new Date() - 1000 * 60 * 60 * 56,
				types: 0,
				tip: 7
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: '../../static/images/HeadPortraits/1.jpg',
				time: new Date() - 1000 * 60 * 60 * 240,
				types: 1,
				tip: 8
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: '../../static/images/HeadPortraits/4.jpg',
				time: new Date() - 1000 * 60 * 60 * 244,
				types: 1,
				tip: 9
			},
			{
				id: 'a',
				imgurl: '../../static/images/HeadPortraits/3.jpg',
				message: {
					voice: 'b',
					time: 30
				},
				time: new Date() - 1000 * 60 * 60 * 250,
				types: 2,
				tip: 10
			},
			{
				id: 'b',
				imgurl: '../../static/images/HeadPortraits/2.jpg',
				message: {
					voice: 'a',
					time: 60
				},
				time: new Date() - 1000 * 60 * 60 * 222,
				types: 2,
				tip: 11
			},
			{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: {
						name: '地图位置',
						address: '北京市东城区东华门街道中山公园',
						latitude: 39.91094643455424,
						longitude: 116.39649937108474
					},
					time: new Date() - 1000000,
					types: 3,
					tip: 12
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: {
						name: '中山公园',
						address: '北京市东城区东华门街道中山公园',
						latitude: 39.91094643455424,
						longitude: 116.39649937108474
					},
					time: new Date() - 1000000,
					types: 3,
					tip: 13
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '微雨中 身边车辆飞过，街里路人走过，交通灯催促过剩下独是我跟你',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 14
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '微雨中 身边车辆飞过，街里路人走过，交通灯催促过剩下独是我跟你',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 15
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '../../static/images/HeadPortraits/1.jpg',
					time: new Date() - 1000 * 60 * 60 * 240,
					types: 1,
					tip: 16
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '../../static/images/HeadPortraits/4.jpg',
					time: new Date() - 1000 * 60 * 60 * 244,
					types: 1,
					tip: 17
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: {
						voice: 'b',
						time: 30
					},
					time: new Date() - 1000 * 60 * 60 * 250,
					types: 2,
					tip: 18
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: {
						name: '中山公园',
						address: '北京市东城区东华门街道中山公园',
						latitude: 39.91094643455424,
						longitude: 116.39649937108474
					},
					time: new Date() - 1000000,
					types: 3,
					tip: 19
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '2020',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 20
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '212121',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 21
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '2222222',
					time: new Date() - 1000 * 60 * 60,
					types: 0,
					tip: 22
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '232323',
					time: new Date() - 1000 * 60 * 60 * 10,
					types: 0,
					tip: 23
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '24',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 24
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '252525',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 25
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '26262626',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 26
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '27272727',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 27
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '28282828',
					time: new Date() - 1000 * 60 * 60,
					types: 0,
					tip: 28
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '2929292929',
					time: new Date() - 1000 * 60 * 60 * 10,
					types: 0,
					tip: 29
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '30',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 30
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '3131',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 31
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '32323232',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 32
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '3333333333333333333333',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 33
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '34343434343434',
					time: new Date() - 1000 * 60 * 60,
					types: 0,
					tip: 34
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '353535353535335535',
					time: new Date() - 1000 * 60 * 60 * 10,
					types: 0,
					tip: 35
				},
				{
					id: 'b',
					imgurl: '../../static/images/HeadPortraits/2.jpg',
					message: '3636363366363636',
					time: new Date() - 1000 * 60 * 60 * 24,
					types: 0,
					tip: 36
				},
				{
					id: 'a',
					imgurl: '../../static/images/HeadPortraits/3.jpg',
					message: '3737373737373737',
					time: new Date() - 1000 * 60 * 60 * 56,
					types: 0,
					tip: 37
				},
		]
		return msgs;
	}
}
