// 配置常量
module.exports = {
  robotName: '波波', // 机器人微信名
  host: 'http://127.0.0.1:3008/api',
  txBotApi: 'http://api.tianapi.com/txapi/robot/', // 天行机器人api
  txRubbishApi: 'http://api.tianapi.com/txapi/lajifenlei/', // 天行垃圾分类接口
  qykBotApi: 'http://api.qingyunke.com/api.php', // 青云客机器人api
  tuRingBotApi: 'http://biz.turingos.cn/apirobot/dialog/homepage/chat', // 图灵机器人api
  defaultBot: 2, // 0-天行机器人 1-青云客机器人 2-图灵机器人
  getOneUrl: 'http://guozhivip.com/nav/api/api.php', // 每日一句url
  sendDate: '0 0 8 * * *', // 微信每日说定时发送时间，每天8点0分0秒发送，规则见 /schedule/index.js
  orderingStartDate: '0 30 10 * * 1-5', // 工作日订餐开始时间
  orderingCenterDate: '0 0 11 * * 1-5', // 订餐中途提醒时间
  orderingTipDate: '0 25 11 * * 1-5', // 订餐即将结束提醒时间
  orderingEndDate: '0 30 11 * * 1-5', // 工作日订餐结束时间
  holidayDate: '0 0 1 * * *', // 获取每日万年历信息
  mojiHost: 'https://tianqi.moji.com/weather/china/guangdong/', // 中国墨迹天气url
  zhihuHotUrl: 'https://www.zhihu.com/hot', // 知乎热榜url
  holidayUrl: 'https://www.mxnzp.com/api', // 万年历url
  city: 'shenzhen', // 所在城市
  roomName: '微信每日说', // 群组名称
  orderingRoomName: '税局二楼-雅枫餐厅', // 订餐群名称
};
