const request = require('superagent');
const cheerio = require('cheerio');
const constant = require('../config/constant');

// 获取墨迹天气
getWeather = async () => {
  let url = constant.mojiHost + constant.city;
  let res = await request.get(url);
  let $ = cheerio.load(res.text);
  let weatherTips = $('.wea_tips em').text();
  const today = $('.forecast .days').first().find('li');
  let todayInfo = {
    Day: $(today[0]).text().replace(/(^\s*)|(\s*$)/g, ""),
    WeatherText: $(today[1]).text().replace(/(^\s*)|(\s*$)/g, ""),
    Temp: $(today[2]).text().replace(/(^\s*)|(\s*$)/g, ""),
    Wind: $(today[3]).find('em').text().replace(/(^\s*)|(\s*$)/g, ""),
    WindLevel: $(today[3]).find('b').text().replace(/(^\s*)|(\s*$)/g, ""),
    PollutionLevel: $(today[4]).find('strong').text().replace(/(^\s*)|(\s*$)/g, "")
  };
  let obj = {
    weatherTips: weatherTips,
    todayWeather: todayInfo.Day + ': ' + todayInfo.WeatherText + '<br>' + '温度: ' + todayInfo.Temp + '<br>' +
    '风向: ' + todayInfo.Wind + todayInfo.WindLevel + '<br>' + '空气: ' + todayInfo.PollutionLevel + '<br>'
  };
  return obj;
}

module.exports = getWeather;
