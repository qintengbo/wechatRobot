const request = require('superagent');
const constant = require('../config/constant');

// 获取指定日期的万年历信息
getHoliday = async date => {
	try {
		let res = await request.get(`${constant.holidayUrl}/holiday/single/${date}`);
		const doc = JSON.parse(res.text);
		if (doc.code === 1) {
			return doc;
		} else {
			return false;
		}
	} catch (e) {
		console.error(e.message);
    return false;
	}
}

module.exports = getHoliday;