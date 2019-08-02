const request = require('superagent');
const constant = require('../config/constant');

// 图灵机器人
tuRingRobotReply = async content => {
  try {
    let params = { deviceId: 'ee88ee88-ee88-ee88-ee88-ee88ee88ee88', question: content };
    let res = await request.post(constant.tuRingBotApi)
    .set('Content-Type', 'multipart/form-data;')
    .type('form')
    .send(params);
    const doc = JSON.parse(res.text);
    if (doc.code === 10000) {
      let result = '';
      result = doc.data.results[0].values.text.replace(/智娃/g, constant.robotName).replace(/学生/g, '程序猿');
      return result;
    } else {
      return '我好像迷失在无边的网络中了，暂时无法回答你的问题';
    }
  } catch (e) {
    console.error(e.message);
    return '抱歉！我暂时无法回答你的问题哦';
  }
}

module.exports = tuRingRobotReply;