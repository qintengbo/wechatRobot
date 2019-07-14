const getOne = require('./getOne');
const getWeather = require('./getWeather');
const getZhiHuHot = require('./getZhiHuHot');
const constant = require('../config/constant');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 初始化微信每日说
initDay = async (robot) => {
  const room = await robot.Room.find({ topic: constant.roomName });
  // 获取每日一句
  let one = await getOne();
  // 获取天气
  let weather = await getWeather();
  let str1 = `【今日天气】<br>${weather.weatherTips}<br>${weather.todayWeather}<br>【每日一句】<br>${one}`;
  await room.say(str1);

  // 获取知乎热榜
  let hot = await getZhiHuHot();
  if (!hot) {
		await delay(2000);
  	await room.say('@随遇而安 知乎热榜获取失败，请及时解决');
  	return;
  }
  let hotContent = '';
  for (let i = 0; i < hot.length; i++) {
  	hotContent += `${i + 1}. ${hot[i].title}<br>( ${hot[i].hotNum})<br>详情链接：${hot[i].url}<br>`;
  }
  let str2 = `【知乎热榜Top10】<br>${hotContent}`;
  await delay(2000);
  await room.say(str2);
}

module.exports = initDay;
