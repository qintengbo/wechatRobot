// 常量表
module.exports = {
  host: 'http://127.0.0.1:3008/api',
  txBotApi: 'http://api.tianapi.com/txapi/robot/', // 天行机器人api
  txRubbishApi: 'http://api.tianapi.com/txapi/lajifenlei/', // 天行垃圾分类接口
  qykBotApi: 'http://api.qingyunke.com/api.php', // 青云客机器人api
  defaultBot: 1, // 0-天行机器人 1-青云客机器人
  getOneUrl: 'http://wufazhuce.com/', // 每日一句url
  sendDate: '0 0 8 * * *', // 微信每日说定时发送时间，每天8点0分0秒发送，规则见 /schedule/index.js
  mojiHost: 'https://tianqi.moji.com/weather/china/guangdong/', // 中国墨迹天气url
  city: 'shenzhen', // 所在城市
  roomName: '微信每日说', // 群组名称
  zhihuHotUrl: 'https://www.zhihu.com/hot', // 知乎热榜url
};
