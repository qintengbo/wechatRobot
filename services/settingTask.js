const request = require('superagent');
const schedule = require('node-schedule');
const moment = require('moment');
const constant = require('../config/constant');
const utils = require('./utils');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 添加定时任务
addTimeTask = async (robot, data) => {
  request.post(`${constant.host}/addSchedule`)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send(data)
  .then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    if (code === 0) {
      const { _id, subscriber, announcer, content, isLoop, time } = data;
      const rule = isLoop ? utils.convertTime(time) : new Date(time);
      const str1 = `亲爱的${subscriber}，现在时间是${time}，温馨提醒：${content.replace('我', '你')}`;
      const str2 = `亲爱的${subscriber}，${announcer}委托我提醒你，${content.replace('我', '你')}`;
      const word = announcer === subscriber ? str1 : str2;
      // 查找联系人
      const contact = await robot.Contact.find({ name: subscriber });
      schedule.scheduleJob(rule, async () => {
        await delay(10000);
        await contact.say(word);
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
  scheduleObj.announcer = contact.name();
  // 定时任务接收者
  scheduleObj.subscriber = keywordArray[1] === "我" ? contact.name() : keywordArray[1];
  // 判断是否属于循环任务
  if (keywordArray[2] === '每天' || keywordArray[2] === '每日') {
    console.log('已设置每日定时任务');
    scheduleObj.isLoop = true;
    scheduleObj.time = keywordArray[3].replace('：', ':');
    scheduleObj.content = keywordArray[4];
  } else if (keywordArray[2] === '明天' || keywordArray[2] === '明日') {
    console.log('已设置明日定时任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = moment().add(1, 'd').format('YYYY-MM-DD') + ' ' + keywordArray[3].replace('：', ':');
    scheduleObj.content = keywordArray[4];
  } else if (keywordArray[2] === '后天' || keywordArray[2] === '后日') {
    console.log('已设置后天定时任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = moment().add(2, 'd').format('YYYY-MM-DD') + ' ' + keywordArray[3].replace('：', ':');
    scheduleObj.content = keywordArray[4];
  } else if (keywordArray[2] && keywordArray[2].indexOf('-') > -1) {
    console.log('已设置指定日期时间任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = keywordArray[2] + ' ' + keywordArray[3].replace('：', ':');
    scheduleObj.content = keywordArray[4];
  } else {
    console.log('已设置当天任务');
    scheduleObj.isLoop = false;
    scheduleObj.time = `${today} ` + keywordArray[2].replace('：', ':');
    scheduleObj.content = keywordArray[3];
  }
  return scheduleObj;
}

// 设置提醒回复
taskReply = async (robot, contact, keywordArray) => {
  const tips1 = `${constant.robotName}已经把你的提醒牢记在小本本上了`;
  const tips2 = '提醒设置失败，请保证每个关键词之间使用空格分割开。正确格式为：“提醒(空格)我(空格)每天(空格)18:30(空格)下班回家”';
  const tips3 = '提醒设置失败，设置日期时间不能小于当前日期时间';
  const tips4 = '网络开小差啦，麻烦重新取消提醒';
  const tips5 = '提醒取消失败，您没有设置任何提醒任务';
  const tips6 = '提醒取消成功，欢迎下次使用定时提醒服务';
  const tips7 = '提醒取消失败，格式不正确，请重新回复“提醒 取消 序号”';
  const tips8 = '提醒取消失败，未能查询到该序号对应的提醒任务信息，请核对后重新回复“提醒 取消 序号”';

  const cancel = id => {
    request.post(`${constant.host}/deleteSchedule`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({ _id: id })
    .then(async res => {
      let text = JSON.parse(res.text);
      const { code, msg } = text;
      console.log(msg);
      if (code === 0) {
        await delay(2000);
        contact.say(tips6);
        return;
      }
      await delay(2000);
      contact.say(tips4);
    });
  }

  if (keywordArray.length > 3) {
    let scheduleText = contentDistinguish(contact, keywordArray);
    if (keywordArray[2] === '每天' || keywordArray[2] === '每日' || keywordArray[2] === '明天' || keywordArray[2] === '明日' || keywordArray[2] === '后天' || keywordArray[2] === '后日') {
      if (keywordArray[3].indexOf(':') > -1 || keywordArray[3].indexOf('：') > -1) {
        addTimeTask(robot, scheduleText);
        await delay(2000);
        contact.say(tips1);
      } else {
        await delay(2000);
        contact.say(tips2);
      }
    } else {
      console.log('日期格式: ', scheduleText.time, '结果: ', utils.isRealDate(scheduleText.time));
      if (keywordArray[2] === '昨天' || keywordArray[2] === '昨日') {
        await delay(2000);
        contact.say(tips3);
        return;
      }
      if (!moment().isBefore(new Date(scheduleText.time))) {
        await delay(2000);
        contact.say(tips3);
        return;
      }
      let isTime = utils.isRealDate(scheduleText.time);
      if (isTime) {
        addTimeTask(robot, scheduleText);
        await delay(2000);
        contact.say(tips1);
      } else {
        await delay(2000);
        contact.say(tips2);
      }
    }
    return;
  }
  if (keywordArray.length === 2) {
    if (keywordArray[1].indexOf('取消') > -1) {
      // 查询发布人名下的提醒任务
      request.get(`${constant.host}/getScheduleList`).query({ announcer: contact.name(), isExpired: false }).then(async res => {
        let text = JSON.parse(res.text);
        const { code, msg, data } = text;
        console.log(msg);
        if (code === 0) {
          if (data.length === 0) {
            await delay(2000);
            contact.say(tips5);
          }
          if (data.length === 1) {
            cancel(data[0]._id);
          }
          if (data.length > 1) {
            let listText = '';
            for (let [index, ele] of data.entries()) {
              listText += `${index + 1}. 提醒 ${ele.subscriber === ele.announcer ? '我' : ele.subscriber} ${ele.isLoop ? '每天' : ''} ${ele.time} ${ele.content}<br>`;
            }
            const str = `查询到您名下有如下定时提醒任务:<br><br>${listText}<br>请回复“提醒 取消 序号”取消对应的定时提醒任务`;
            await delay(2000);
            contact.say(str);
          }
          return;
        }
        await delay(2000);
        contact.say(tips4);
      });
      return;
    }
    await delay(2000);
    contact.say(tips2);
    return;
  }
  if (keywordArray.length === 3) {
    if (/^[0-9]+$/.test(keywordArray[2])) {
      request.get(`${constant.host}/getScheduleList`).query({ announcer: contact.name(), isExpired: false }).then(async res => {
        let text = JSON.parse(res.text);
        const { code, msg, data } = text;
        console.log(msg);
        if (code === 0) {
          if (data.length === 0) {
            await delay(2000);
            contact.say(tips5);
          }
          if (data.length > 0) {
            if (keywordArray[2] > data.length) {
              await delay(2000);
              contact.say(tips8);
            } else {
              cancel(data[keywordArray[2] - 1]._id);
            }
          }
          return;
        }
        await delay(2000);
        contact.say(tips4);
      });
    } else {
      await delay(2000);
      contact.say(tips7);
    }
    return;
  }
  await delay(2000);
  contact.say(tips2);
}

module.exports = {
  contentDistinguish,
  taskReply
};
