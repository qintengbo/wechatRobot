const request = require('superagent');
const constant = require('../config/constant');

// 开始订餐服务
orderingStart = async robot => {
	const room = await robot.Room.find({ topic: constant.orderingRoomName });
	const str = '叮咚！订餐时间到啦！不吃饱怎么有力气工作呢<br><br>1. 各位同学请“@波波 #菜名”(例如“@波波 #鱼香肉丝饭”)进行订餐<br><br>2. 菜名只限菜单范围，超出范围无法预订，订餐默认为堂食，份数默认为1份，可回复“@波波 菜单”查看菜单详情<br><br>3. 如果订餐份数大于1份或需要打包的请在菜名后加“几份”或“打包”二字，例如“@波波 #鱼香肉丝饭 2份 打包”<br><br>4. 如需要加辣，请在最后备注“加辣”，例如“@波波 #鱼香肉丝饭 2份 打包 加辣”<br><br>5. 如需取消订餐，可回复关键词“@波波 取消”<br><br>6. 订餐时间为60分钟，11:30波波会将订餐结果统计后发到群里，超过订餐时间的请人工预订哦';
	await room.say(str);
}

// 订餐中途提醒
orderingCenter = async robot => {
  const room = await robot.Room.find({ topic: constant.orderingRoomName });
  const str = '温馨提醒：离订餐时间结束还有30分钟，还未订餐的同学可回复“@波波 菜单”查看菜单详情<br>回复“@波波 #菜名”(例如“@波波 #农家小炒肉”)进行订餐<br>如需取消订餐，可回复“@波波 取消”';
  await room.say(str);
}

// 订餐即将结束提醒
orderingTip = async robot => {
	const room = await robot.Room.find({ topic: constant.orderingRoomName });
	const str = '温馨提醒：订餐时间还剩5分钟，还未订餐的同学速度“@波波 #菜名”(例如“@波波 #红烧茄子饭”)进行订餐哦！';
	await room.say(str);
}

// 结束订餐服务
orderingEnd = async robot => {
	const room = await robot.Room.find({ topic: constant.orderingRoomName });
  request.get(`${constant.host}/orderingList`).query({ isExpired: false }).then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    console.log(msg);
    if (code === 0) {
      let tsNameArr = [];
      let dbNameArr = [];
      let tsNum = 0; // 堂食份数
      let dbNum = 0; // 打包份数
      let tsAmount = 0; // 堂食金额
      let dbAmount = 0; // 打包金额
      let tsSpicyArr = [];
      let dbSpicyArr = [];
      data.forEach(item => {
        for (let i = 0; i < item.num; i++) {
          if (item.isDine) {
            dbNameArr.push(item.menuId.name);
            dbNum += 1;
            dbAmount += item.menuId.price;
            if (item.isSpicy) {
              dbSpicyArr.push(item.menuId.name);
            }
          } else {
            tsNameArr.push(item.menuId.name);
            tsNum += 1;
            tsAmount += item.menuId.price;
            if (item.isSpicy) {
              tsSpicyArr.push(item.menuId.name);
            }
          }
        }
      });
      // 统计堂食信息
      const tsCount = tsNameArr.reduce((names, name) => {
        if (name in names) {
          names[name] ++;
        } else {
          names[name] = 1;
        }
        return names;
      }, {});
      // 统计打包信息
      const dbCount = dbNameArr.reduce((names, name) => {
        if (name in names) {
          names[name] ++;
        } else {
          names[name] = 1;
        }
        return names;
      }, {});
      // 统计堂食加辣信息
      const tsSpicyCount = tsSpicyArr.reduce((names, name) => {
        if (name in names) {
          names[name] ++;
        } else {
          names[name] = 1;
        }
        return names;
      }, {});
      // 统计打包加辣信息
      const dbSpicyCount = dbSpicyArr.reduce((names, name) => {
        if (name in names) {
          names[name] ++;
        } else {
          names[name] = 1;
        }
        return names;
      }, {});

      generateText = (obj, spicyObj, num, amount) => {
        let text = '';
        let name = '';
        for (let i in obj) {
          let arr = {};
          if (i.length < 6) {
            let centerText = '';
            for (let j = 0; j < (6 - i.length); j++) {
              centerText += `　`;
            }
            name = `${i} ${centerText}`;
          } else {
            name = `${i} `;
          }
          if (JSON.stringify(spicyObj) === '{}') {
            arr[i] = '';
          } else {
            for (let j in spicyObj) {
              if (i === j) {
                let spicyText = `(含加辣${spicyObj[j]}份)`;
                arr[i] = spicyText;
              } else {
                arr[i] = '';
              }
            }
          }
          text += `${name}${obj[i]} 份 ${arr[i]}<br>`;
        }
        return `${text}<br>份数: 　${num} 份<br>金额: 　${amount} 元`;
      }
      // 堂食文本
      let tsStr = '';
      if (tsNameArr.length === 0) {
        tsStr = '<br>无';
      } else {
        tsStr = generateText(tsCount, tsSpicyCount, tsNum, tsAmount);
      }
      // 打包文本
      let dbStr = '';
      if (dbNameArr.length === 0) {
        dbStr = '<br>无';
      } else {
        dbStr = generateText(dbCount, dbSpicyCount, dbNum, dbAmount);
      }
      let lastText = '';
      if ((tsNum + dbNum) === 0) {
        lastText = '竟然没有人愿意使用波波的订餐服务，波波很不开心！';
      } else {
        lastText = '感谢大家使用波波的订餐服务，祝大家用餐愉快！';
      }
      const resultText = `叮咚！订餐时间结束，本次订餐结果统计如下:<br><br>【堂食】<br>${tsStr}<br>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _<br><br>【打包】<br>${dbStr}<br>_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _<br><br>总份数: 　${tsNum + dbNum} 份<br>总金额: 　${tsAmount + dbAmount} 元<br><br>${lastText}`;
      await room.say(resultText);
      return;
    }
    await room.say('@随遇而安 订餐结果统计失败，请及时解决');
  });
}

module.exports = { orderingStart, orderingCenter, orderingTip, orderingEnd };
