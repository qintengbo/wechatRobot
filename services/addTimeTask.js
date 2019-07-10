const request = require('superagent');
const schedule = require('node-schedule');
const constant = require('../config/constant');

// 添加定时任务提醒
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