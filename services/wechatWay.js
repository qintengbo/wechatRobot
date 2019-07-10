const Qrterminal = require('qrcode-terminal');
const request = require('superagent');
const schedule = require('node-schedule');
const constant = require('../config/constant');
const txRobotReply = require('./txRobot');
const qykRobotReply = require('./qykRobot');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = (robot) => {
  // 生成登录二维码
  onScan = (qrcode) => {
    // 在命令行终端生成登录二维码
    console.log('请用移动端微信扫码登录');
    Qrterminal.generate(qrcode);
  }

  // 登录事件
  onLogin = async user => {
    const name = user.name();
    console.log(`${name} => 微信登录成功`);
    // 登录后获取定时任务列表
    request.get(`${constant.host}/getScheduleList`).then(res => {
      let text = JSON.parse(res.text);
      const { code, msg, data } = text;
      if (code === 0) {
        let scheduleList = data;
        // 初始化定时任务列表
        for (item of scheduleList) {
          let time = item.isLoop ? item.time : new Date(item.time);
          schedule.scheduleJob(time, async () => {
            let contact = await robot.Contact.find({ name: item.subscriber });
            await contact.say(item.content);
            if (!item.isLoop) {
              request.post(`${constant.host}/updateSchedule`)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send({ id: item._id })
              .then(result => {
                let resText = JSON.parse(result.text);
                const { msg } = resText;
                console.log(msg);
              });
            }
          });
        }
      } else {
        console.log(msg);
      }
    });
  }

  // 登出事件
  onLogout = user => {
    const name = user.name();
    console.log(`${name} => 微信退出登录成功`);
  }

  // 消息监听
  onMessage = async msg => {
    const contact = msg.from();
    const text = msg.text();
    const room = msg.room();
    // 如果机器人自己发的消息则不执行
    if (msg.self()){ return; }
    if (room) {
      const topic = await room.topic();
      console.log(`群名: ${topic} | 发消息人: ${contact.name()} | 内容: ${text}`);
      if (text.indexOf('@Robot-波波') > -1 || text.indexOf('@波波') > -1) {
        let content = '';
        let replyContent = '';
        if (text.indexOf('@Robot-波波') > -1) {
          content = text.replace('@Robot-波波', '');
        } else if (text.indexOf('@波波') > -1) {
          content = text.replace('@波波', '');
        }
        console.log(111, content)

        if (content === '') {
          replyContent = '你好，波波在的';
        } else {
          switch (constant.defaultBot) {
            case 0:
              replyContent = `@${contact.name()} ` + await txRobotReply(content);
              break;
            case 1:
              replyContent = `@${contact.name()} ` + await qykRobotReply(content);
              break;
          }
          console.log('机器人回复：', replyContent);
        }
        await delay(2000);
        await room.say(replyContent);
      }
    }
  }

  // 发送、接受好友请求
  onFriendShip = async (friendship) => {
    try {
      // 获取发送好友请求的联系人
      const friendName = friendship.contact().name();
      switch (friendship.type()) {
        // 新的好友请求
        case Friendship.Type.Receive:
          console.log(`${friendName}请求加为好友`);
          await delay(60000);
          await friendship.accept(); // 延时一分钟后同意好友请求，防止微信封号
          break;
        // 好友同意加好友（好友请求为自己所发)
        case Friendship.Type.Confirm:
          console.log(`${friendName}已同意加为好友`);
          break;
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 加群提醒
  onRoomJoin = async (room, inviteeList, inviter) => {
    const nameList = inviteeList.map(c => c.name()).join(',');
    const topic = await room.topic();
    console.log(`群名： ${topic} | 加入新成员： ${nameList} | 邀请人： ${inviter}`);
    room.say(`欢迎新同学【${nameList}】加入${topic}群`);
  }

  robot.on('scan', onScan);
  robot.on('login', onLogin);
  robot.on('logout', onLogout);
  robot.on('message', onMessage);
  robot.on('friendship', onFriendShip);
  robot.on('room-join', onRoomJoin);
  robot.start().then(() => { 
    console.log('开始登陆微信');
  })
  .catch(e => console.error(e.message));
}
