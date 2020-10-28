export default {
	dateTime(t) {
		let oldTime = new Date(t)
		let nowTime = new Date()
		// 获取oldTime具体时间
		let d = oldTime.getTime()
		let h = oldTime.getHours()
		let m = oldTime.getMinutes()
		let Y = oldTime.getYear()
		let M = oldTime.getMonth() + 1
		let D = oldTime.getDate()
		if (h == '0') {
			h = h + '0'
		}
		// 获取nowTime具体时间
		let nd = nowTime.getTime()
		let nh = nowTime.getHours()
		let nm = nowTime.getMinutes()
		let nY = nowTime.getYear()
		let nM = nowTime.getMonth()
		let nD = nowTime.getDate()

		let old = Date.parse(oldTime) / 1000
		let now = Date.parse(nowTime) / 1000
		let mistiming = now - old

		if (mistiming < 120) {
			return '刚刚'
		} else if (mistiming < 1800) {
			let mt = parseInt(mistiming / 60)
			return mt + '分钟以前'
		} else if (mistiming < 86400 && D != nD) {

			return '昨天 ' + h + ':' + m
		} else if (mistiming < 86400 && D == nD) {
			if (m < 10) {
				return h + ':' + '0' + m
			} else {
				return h + ':' + m

			}
		} else if (mistiming > 86400) {
			if (m < 10) {
				return M + '月' + D + '日 ' + h + ':' + '0' + m
			} else {
				return M + '月' + D + '日 ' + h + ':' + m
			
			}
		}

	}
}
