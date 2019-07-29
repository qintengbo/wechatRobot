const request = require('superagent');
const cheerio = require('cheerio');
const constant = require('../config/constant');
const config = require('../config/config');

// 获取知乎热榜前十
getZhiHuHot = async () => {
	try {
		let res = await request.get(constant.zhihuHotUrl).set({
			'Cookie': config.zhihuCookie
		});
		let $ = cheerio.load(res.text);
		let itemArr = $('.HotItem');
		let hotList = [];
		for (let i = 0; i < 5; i++) {
			const title = $(itemArr[i]).find('.HotItem-title').text();
			const url = $(itemArr[i]).find('a').attr('href');
			const hotNum = $(itemArr[i]).find('.HotItem-metrics').text().replace(/\s?分享/, '');
			hotList.push({ title, url, hotNum });
		}
		return hotList;
	} catch (e) {
		console.error(e.message);
		return false;
	}
}

module.exports = getZhiHuHot;
