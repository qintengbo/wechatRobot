// 常量表
module.exports = {
  host: 'http://127.0.0.1:3008/api',
  txBotApi: 'http://api.tianapi.com/txapi/robot/', // 天行机器人api
  txRubbishApi: 'http://api.tianapi.com/txapi/lajifenlei/', // 天行垃圾分类接口
  qykBotApi: 'http://api.qingyunke.com/api.php', // 青云客机器人api
  defaultBot: 1, // 0-天行机器人 1-青云客机器人
  getOneUrl: 'http://wufazhuce.com/', // 每日一句url
  sendDate: '0 0 8 * * *', // 微信每日说定时发送时间，每天8点0分0秒发送，规则见 /schedule/index.js
  orderingStartDate: '0 01 17 * * *', // 工作日订餐开始时间
  orderingTipDate: '0 02 17 * * *', // 订餐即将结束提醒时间
  orderingEndDate: '0 03 17 * * *', // 工作日订餐结束时间
  mojiHost: 'https://tianqi.moji.com/weather/china/guangdong/', // 中国墨迹天气url
  zhihuHotUrl: 'https://www.zhihu.com/hot', // 知乎热榜url
  holidayUrl: 'https://www.mxnzp.com/api', // 万年历url
  city: 'shenzhen', // 所在城市
  roomName: '微信每日说', // 群组名称
  orderingRoomName: '测试', // 订餐群名称
};
