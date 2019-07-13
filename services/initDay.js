const getOne = require('./getOne');
const getWeather = require('./getWeather');
const constant = require('../config/constant');
const getZhiHuHot = require('./getZhiHuHot');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 初始化微信每日说
initDay = async (robot) => {
  const room = await robot.Room.find({ topic: '测试' });
  // 获取每日一句
  let one = await getOne();
  // 获取天气
  let weather = await getWeather();
  // 获取知乎热榜
  let hot = await getZhiHuHot();
  let hotContent = '';
  for (let i = 0; i < hot.length; i++) {
  	hotContent += `${i + 1}. ${hot[i].title}<br>(${hot[i].hotNum})<br>详情链接：${hot[i].url}<br>`;
  }
  let str1 = `【今日天气】<br>${weather.weatherTips}<br>${weather.todayWeather}<br>【每日一句】<br>${one}`;
  let str2 = `【知乎热榜前十】<br>${hotContent}`;
  await room.say(str1);
  await delay(2000);
  await room.say(str2);
}

module.exports = initDay;
