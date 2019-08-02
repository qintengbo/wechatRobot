const request = require('superagent');
const config = require('../config/config');
const constant = require('../config/constant');

// 天行机器人
txRobotReply = async content => {
  try {
    let res = await request.get(constant.txBotApi).query({ key: config.apiKey, question: content });
    const doc = JSON.parse(res.text);
    if (doc.code === 200) {
      let result = '';
      switch (doc.datatype) {
        case 'text':
          result = doc.newslist[0].reply.replace('小小', constant.robotName).replace('小主', '你');
          break;
        case 'view':
          result = `虽然我不太懂你说的是什么，但是感觉很高级的样子，因此我也查找了类似的文章去学习，你觉得有用吗<br>《${content.newslist[0].title}》${content.newslist[0].url}`
          break;
        default:
          result = '你问的问题已经触及我的知识盲区了，我要去学习了，不然没法回答你的问题';
      }
      return result;
    } else {
      return '我好像迷失在无边的网络中了，暂时无法回答你的问题';
    }
  } catch (e) {
    console.error(e.message);
    return '抱歉！我暂时无法回答你的问题哦';
  }
}

module.exports = txRobotReply;