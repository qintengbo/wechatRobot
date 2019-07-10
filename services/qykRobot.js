const request = require('superagent');
const config = require('../config/config');
const constant = require('../config/constant');

// 青云客机器人
qykRobotReply = async (content) => {
  let res = await request.get(constant.qykBotApi).query({ key: 'free', appid: 0, msg: content });
  const doc = JSON.parse(res.text);
  if (doc.result === 0) {
    console.log('机器人返回内容：', doc);
    let result = '';
    result = doc.content.replace(/菲菲/g, '波波').replace(/美女/g, '帅哥').replace(/{br}/g, '<br>');
    return result;
  } else {
    return '我好像迷失在无边的网络中了，暂时无法回答你的问题';
  }
}

module.exports = qykRobotReply;