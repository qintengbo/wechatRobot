const { Friendship } = require('wechaty');
const Qrterminal = require('qrcode-terminal');
const request = require('superagent');
const schedule = require('node-schedule');
const { FileBox } = require('file-box');
const constant = require('../config/constant');
const txRobotReply = require('./txRobot');
const qykRobotReply = require('./qykRobot');
const initDay = require('./initDay');
const settingTask = require('./settingTask');
const getRubbishType = require('./getRubbishType');
const initOrdering = require('./initOrdering');
const getHoliday = require('./getHoliday');
const orderingService = require('./ordering');
const utils = require('./utils');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = (robot) => {
  let dateData = {}; // 万年历数据
  let menuList = []; // 菜单数据

  // 生成登录二维码
  onScan = qrcode => {
    // 在命令行终端生成登录二维码
    console.log('请用移动端微信扫码登录');
    Qrterminal.generate(qrcode);
  }

  // 登录事件
  onLogin = async user => {
    const name = user.name();
    console.log(`${name} => 微信登录成功`);

    // 获取每日万年历信息
    schedule.scheduleJob(constant.holidayDate, async () => {
      const date = utils.getToday().replace(/-/g, '');
      dateData = await getHoliday(date);
      console.log('当日万年历信息获取成功');
    });

    // 获取定时任务列表
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
            // 任务执行完毕之后更新任务状态为过期
            if (!item.isLoop) {
              request.post(`${constant.host}/updateSchedule`)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send({ id: item._id })
              .then(result => {
                let resText = JSON.parse(result.text);
                console.log(resText.msg);
              });
            }
          });
        }
      }
      console.log(msg);
    });

    // 初始化微信每日说
    schedule.scheduleJob(constant.sendDate, async () => {
      console.log('微信每日说启动成功');
      initDay(robot);
    });

    // 初始化订餐服务
    schedule.scheduleJob(constant.orderingStartDate, async () => {
      // 获取菜单信息
      request.get(`${constant.host}/menuList`).query({ isExpired: false }).then(res => {
        let text = JSON.parse(res.text);
        const { code, msg, data } = text;
        if (code === 0) {
          menuList = data;
        }
        console.log(msg);
      });

      // 更新往日订餐状态
      request.post(`${constant.host}/updateOrdering`).then(async res => {
        let text = JSON.parse(res.text);
        const { code, msg, data } = text;
        if (code === 0) {
          if (dateData && dateData.data.type === 0) {
            console.log('开始订餐启动');
            initOrdering.orderingStart(robot);
          } else {
            console.log('当日不是工作日，订餐服务不启动');
          }
        } else {
          const room = await robot.Room.find({ topic: constant.orderingRoomName });
          await room.say('@随遇而安 订餐数据库初始化失败，请尽快解决');
        }
        console.log(msg);
      });
    });
    schedule.scheduleJob(constant.orderingCenterDate, async () => {
      if (dateData && dateData.data.type === 0) {
        console.log('订餐中途提醒启动');
        initOrdering.orderingCenter(robot);
      }
    })
    schedule.scheduleJob(constant.orderingTipDate, async () => {
      if (dateData && dateData.data.type === 0) {
        console.log('订餐即将结束提醒启动');
        initOrdering.orderingTip(robot);
      }
    });
    schedule.scheduleJob(constant.orderingEndDate, async () => {
      if (dateData && dateData.data.type === 0) {
        console.log('订餐结束启动');
        initOrdering.orderingEnd(robot);
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
    const meiri = await robot.Room.find({ topic: constant.roomName });
    // 如果机器人自己发的消息则不执行
    if (msg.self()) { return; }
    if (room) {
      const topic = await room.topic();
      console.log(`群名: ${topic} | 发消息人: ${contact.name()} | 内容: ${text}`);
      if (text.indexOf('@Robot-波波') > -1 || text.indexOf('@波波') > -1) {
        let content = '';
        if (text.indexOf('@Robot-波波') > -1) {
          content = text.replace(/@Robot-波波\s?/, '');
        } else if (text.indexOf('@波波') > -1) {
          content = text.replace(/@波波\s?/, '');
        }

        if (content === '') {
          await delay(2000);
          await room.say(`@${contact.name()} 你好，波波在的`);
          return;
        }

        // 把多个空格替换成一个空格，并使用空格作为标记，拆分关键词
        let keywordArray = content.replace(/(^\s*)|(\s*$)/g, '').replace(/#\s*/, '#').replace(/\s+/g, ' ').split(' ');
        console.log("分词后效果", keywordArray);
        // 订餐群消息
        if (topic === constant.orderingRoomName) {
          const startArr = constant.orderingStartDate.split(' ');
          const endArr = constant.orderingEndDate.split(' ');
          dateFn = data => {
            let arr = [];
            for (let i = 0; i < 3; i ++) {
              if (data[i] === '0') {
                arr.unshift('00');
              } else {
                arr.unshift(data[i]);
              }
            }
            return arr.toString().replace(/,/g, ':');
          }
          const stStr = dateFn(startArr);
          const enStr = dateFn(endArr);
          const isRang = utils.isTimeRang(stStr, enStr);
          // 订餐
          if (content.indexOf('#') > -1) {
            // 判断是否在订餐时间内
            if (dateData && dateData.data.type === 0 && isRang) {
              orderingService.ordering(room, contact, keywordArray, menuList);
            } else {
              await delay(2000);
              await room.say(`@${contact.name()} 抱歉！现在不是订餐时间，还请人工预定哦`);
            }
            return;
          }
          // 取消订餐
          if (content.indexOf('取消') > -1) {
            // 判断是否在订餐时间内
            if (dateData && dateData.data.type === 0 && isRang) {
              orderingService.cancelOrdering(room, contact, keywordArray);
            } else {
              await delay(2000);
              await room.say(`@${contact.name()} 抱歉！现在不在订餐时间范围内，无法取消订餐哦`);
            }
            return;
          }
          // 查询订餐
          if (content.indexOf('查询') > -1) {
            // 判断是否在订餐时间内
            if (dateData && dateData.data.type === 0 && isRang) {
              orderingService.inquiryOrdering(room, contact);
            } else {
              await delay(2000);
              await room.say(`@${contact.name()} 抱歉！现在不在订餐时间范围内，无法查询订餐信息哦`);
            }
            return;
          }
          // 查看菜单
          if (content.indexOf('菜单') > -1) {
            const menuImg = FileBox.fromFile('../wechatRobot/static/menu.jpg');
            await delay(2000);
            await room.say(menuImg);
            return;
          }
          // 查询订餐详情
          if (content.indexOf('详情') > -1) {
            if (dateData && dateData.data.type === 0 && isRang) {
              await delay(2000);
              await room.say(`@${contact.name()} 抱歉！订餐时间还未结束，无法查询订餐详情`);
            } else {
              orderingService.orderingDetail(room, contact);
            }
            return;
          }
        }

        // 不在功能范围的则机器人回复
        let replyContent = '';
        switch (constant.defaultBot) {
          case 0:
            replyContent = `@${contact.name()} ` + await txRobotReply(content);
            break;
          case 1:
            replyContent = `@${contact.name()} ` + await qykRobotReply(content);
            break;
        }
        console.log('机器人回复：', replyContent);
        await delay(2000);
        await room.say(replyContent);
      }
    } else {
      console.log(`发消息人: ${contact.name()} | 消息内容: ${text}`);
      // 添加好友消息则不执行
      if (contact.name() === 'Friend recommendation message') { return; }
      // 把多个空格替换成一个空格，并使用空格作为标记，拆分关键词
      let keywordArray = text.replace(/(^\s*)|(\s*$)/g, '').replace(/\s+/g, ' ').split(' ');
      console.log("分词后效果", keywordArray);
      if (text.indexOf('开启了朋友验证') > -1 || contact.name() === '朋友推荐消息') { return; }
      if (text.indexOf('你已添加') > -1 || text.indexOf('帮助') > -1) {
        await delay(2000);
        contact.say('你好呀！我是微信机器人波波，很高兴认识你<br>1. 回复关键词“加群”或“微信每日说”<br>2. 或回复“提醒 我 18:30 下班回家”，创建你的专属提醒<br>3. 回复“？垃圾名称”可查询垃圾分类<br>4. 如使用过程中遇到问题，可回复关键词“联系作者”添加作者微信，此账号为机器人小号，不做任何回复');
        return;
      }
      if (text.indexOf('加群') > -1 || text.indexOf(constant.roomName) > -1) {
        if (meiri) {
          try {
            await delay(2000);
            contact.say('波波正在处理你的入群申请，请不要重复回复...');
            await delay(10000);
            const group = FileBox.fromFile('../wechatRobot/static/group.png');
            await contact.say(group);
            // await meiri.add(contact);
          } catch (e) {
            console.error(e);
          }
        } else {
          await delay(2000);
          await contact.say('哎呀！群组好像不见了，回复关键词“联系作者”报告问题吧');
        }
        return;
      }
      if (keywordArray[0] === "提醒") {
        settingTask.taskReply(robot, contact, keywordArray);
        return;
      }
      if (text && text.indexOf('你好') > -1) {
        await delay(2000);
        await contact.say('你好，波波很高兴成为你的小秘书，来试试我的新功能吧！回复案例：“提醒 我 18:30 下班回家”，创建你的专属提醒，记得关键词之间使用空格分隔开哦');
        return;
      }
      if (text && text.indexOf('联系作者')> -1) {
        // 添加本地文件
        const auth = FileBox.fromFile('../wechatRobot/static/auth.jpg');
        await delay(2000);
        await contact.say(auth);
        return;
      }
      // 垃圾分类
      if (text.substr(0, 1) === '?' || text.substr(0, 1) === '？') {
        let rubbishName = text.replace('?', '').replace('？', '');
        let res = await getRubbishType(rubbishName);
        await delay(2000);
        await contact.say(res);
        return;
      }

      // 不在功能范围内的机器人回复
      let replyContent = '';
      switch (constant.defaultBot) {
        case 0:
          replyContent = await txRobotReply(text);
          break;
        case 1:
          replyContent = await qykRobotReply(text);
          break;
      }
      console.log('机器人回复：', replyContent);
      await delay(2000);
      contact.say(replyContent);
    }
  }

  // 发送、接受好友请求
  onFriendShip = async friendship => {
    try {
      // 获取发送好友请求的联系人
      const contact = friendship.contact();
      const name = contact.name();
      switch (friendship.type()) {
        // 新的好友请求
        case Friendship.Type.Receive:
          console.log(`${name}请求加为好友`);
          await delay(60000);
          await friendship.accept(); // 延时一分钟后同意好友请求，防止微信封号
          break;
        // 同意加好友
        case Friendship.Type.Confirm:
          console.log('已同意加为好友');
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
    if (topic === constant.roomName) {
      await room.say(`欢迎新同学【${nameList}】加入${topic}<br>本群每日早8点天气预报以及每日说，有什么问题可以在群里提出来哦<br>如果无聊，请@我和我聊天吧`);
    }
    if (topic === constant.orderingRoomName) {
      await room.say(`欢迎新同学【${nameList}】加入${topic}<br>本群为雅枫餐厅订餐群，波波的订餐服务时间为工作日早上10:30-11:30，其他时间段请人工预订哦<br>可回复“@波波 菜单”查看菜单详情`)
    }
  }

  // 自动通过入群邀请
  onRoomInvite = async roomInvitation => {
    try {
      const inviter = await roomInvitation.inviter();
      const name = inviter.name();
      const topic = await roomInvitation.topic();
      console.log(`进群群名：${topic} | 邀请人：${name}`);
      await delay(2000);
      await roomInvitation.accept();
      const room = await robot.Room.find({ topic });
      await delay(2000);
      room.say('大家好，我是微信机器人-波波，大家只需要@我就可以和我聊天啦');
    } catch (e) {
      console.error(e);
    }
  }

  robot.on('scan', onScan);
  robot.on('login', onLogin);
  robot.on('logout', onLogout);
  robot.on('message', onMessage);
  robot.on('friendship', onFriendShip);
  robot.on('room-join', onRoomJoin);
  // robot.on('room-invite', onRoomInvite); // 网页版微信不支持自动入群
  robot.start().then(() => { 
    console.log('开始登陆微信');
  })
  .catch(e => console.error(e.message));
}
