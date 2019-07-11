const request = require('superagent');
const cheerio = require('cheerio');
const constant = require('../config/constant');

// 获取每日一句
getOne = async () => {
  let res = await request.get(constant.getOneUrl);
  let $ = cheerio.load(res.text);
  let todayOneList = $('#carousel-one .carousel-inner .item');
  let todayOne = $(todayOneList[0]).find('.fp-one-cita').text().replace(/(^\s*)|(\s*$)/g, '');
  return todayOne;
}

module.exports = getOne;
