const request = require('superagent');
const cheerio = require('cheerio');
const constant = require('../config/constant');

// 获取每日一句
getOne = async () => {
  let res = await request.get(constant.getOneUrl).accept('json');
  let todayOne = res.text.substring(res.text.indexOf('(') + 1, res.text.lastIndexOf(')') - 1).replace(/"/g, '');
  return todayOne;
}

module.exports = getOne;
