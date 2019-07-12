const request = require('superagent');
const config = require('../config/config');
const constant = require('../config/constant');

// 天行垃圾分类接口
getRubbishType = async (name) => {
  try {
    let res = await request.get(constant.txRubbishApi, { key:config.apiKey, word: name });
    let content = JSON.parse(res.text);
    if (content.code === 200) {
      let type = '';
      switch (content.newslist[0].type) {
        case 0:
          type = '是可回收垃圾';
          break;
        case 1:
          type = '是有害垃圾';
          break;
        case 2:
          type = '是厨余(湿)垃圾';
          break;
        case 3:
          type = '是其他(干)垃圾';
          break;
      }
      const result = `${content.newslist[0].name}${type}<br>【解释】${content.newslist[0].explain}<br>【主要包括】${content.newslist[0].contain}<br>【投放提示】${content.newslist[0].tip}`;
      return result;
    } else {
      return '抱歉！暂时还没找到该物品所属的垃圾分类信息';
    }
  } catch (e) {
    console.error(e.message);
    return '抱歉！我暂时无法回答你的问题哦';
  }
}

module.exports = getRubbishType;
