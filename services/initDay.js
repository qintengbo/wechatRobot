const getOne = require('./getOne');
const getWeather = require('./getWeather');
const constant = require('../config/constant');

// 初始化微信每日说
initDay = async (robot) => {
  const room = await robot.Room.find({ topic: constant.roomName });
  // 获取每日一句
  let one = await getOne();
  // 获取天气
  let weather = await getWeather();
  let str = `今日天气<br>${weather.weatherTips}<br>${weather.todayWeather}<br>每日一句:<br>${one}`;
  await room.say(str);
}

module.exports = initDay;
