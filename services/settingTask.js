const request = require('superagent');
const schedule = require('node-schedule');
const constant = require('../config/constant');
const utils = require('./utils');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 添加定时任务
addTimeTask = async (robot, data) => {
  request.post(`${config.host}/addSchedule`)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send(data)
  .then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    if (code === 0) {
      const { _id, subscriber, content, isLoop, time } = data;
      const rule = isLoop ? time : new Date(time);
      // 查找联系人
      const conact = await robot.Conact.find({ name: subscriber });
      schedule.scheduleJob(time, async () => {
        await delay(10000);
        await contact.say(content);
        if (!isLoop) {
         request.post(`${constant.host}/updateSchedule`)
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ id: _id })
          .then(result => {
            let resText = JSON.parse(result.text);
            const { msg } = resText;
            console.log(msg);
          });
        }
      });
    } else {
      console.log(msg);
    }
  });
}

// 设置定时任务
contentDistinguish = (contact, keywordArray) => {
  let scheduleObj = {};
  let today = utils.getToday();
  // 设置定时任务的用户
  scheduleObj.setter = contact.name();
  // 定时任务接收者
  scheduleObj.subscribe = (keywordArray[1] === "我") ? contact.name() : keywordArray[1];
  // 判断是否属于循环任务
  if (keywordArray[2] === "每天") {
    console.log('已设置每日定时任务');
    scheduleObj.isLoop = true;
    let time = keywordArray[3].replace('：', ':');
    scheduleObj.time = convertTime(time);
    const str1 = `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}`;
    const str2 = `亲爱的${scheduleObj.subscribe}，${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`;
    scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = str1 : str2;
  } else if (keywordArray[2] && keywordArray[2].indexOf('-') > -1) {
    console.log('已设置指定日期时间任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':');
    const str1 = `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[4].replace('我', '你')}`;
    const str2 = `亲爱的${scheduleObj.subscribe}，${scheduleObj.setter}委托我提醒你，${keywordArray[4].replace('我', '你')}`;
    scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = str1 : str2;
  } else {
    console.log('已设置当天任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = today + keywordArray[2].replace('：', ':');
    const str1 = `亲爱的${scheduleObj.subscribe}，温馨提醒：${keywordArray[3].replace('我', '你')}`;
    const str2 = `亲爱的${scheduleObj.subscribe}，${scheduleObj.setter}委托我提醒你，${keywordArray[3].replace('我', '你')}`;
    scheduleObj.content = (scheduleObj.setter === scheduleObj.subscribe) ? scheduleObj.content = str1 : str2;
  }
  return scheduleObj;
}

// 设置提醒回复
taskReply = async (contact, keywordArray) => {
  const tips1 = '波波已经把你的提醒牢记在小本本上了';
  const tips2 = '每日提醒设置失败，请保证每个关键词之间使用空格分割开。正确格式为：“提醒(空格)我(空格)每天(空格)18:30(空格)下班回家”';
  if (keywordArray.length > 3) {
    let scheduleText = contentDistinguish(contact, keywordArray);
    if (keywordArray[2] === '每天' || keywordArray[2] === '每日') {
      if (keywordArray[3].indexOf(':') > -1 || keywordArray[3].indexOf('：') > -1) {
        addTimeTask(scheduleText);
        await delay(2000);
        contact.say(tips1);
      } else {
        await delay(2000);
        contact.say(tips2);
      }
    } else {
      console.log('日期格式: ', scheduleText.time, '结果: ', utils.isRealDate(scheduleText.time));
      let isTime = utils.isRealDate(scheduleText.time);
      if (isTime) {
        addTimeTask(scheduleText);
        await delay(2000);
        contact.say(tips1);
      } else {
        await delay(2000);
        contact.say(tips2);
      }
    }
  } else {
    await delay(2000);
    contact.say(tips2);
  }
}

module.exports = {
  contentDistinguish,
  taskReply
};
