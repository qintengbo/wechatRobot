const request = require('superagent');
const constant = require('../config/constant');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 订餐服务
ordering = async(room, contact, keywordArr, menuList) => {
  const tip1 = '订餐失败<br>菜名超出菜单范围或订餐格式不正确，请重新订餐哦';
  const tip2 = '订餐失败<br>订餐格式不正确，请重新订餐哦';
  const tip3 = `订餐成功<br>${constant.robotName}已经将你的订餐需求牢记在小本本上了`;
  const tip4 = '订餐失败<br>网络开小差啦，麻烦重新订餐哦';
  let params = {};
  let menuId = ''; // 菜名id
  const reg = /^[1-9]\d*份$/;
  let menuName = keywordArr[0].replace('#', '').replace(/\s*/g, '');
  if (menuName === '') {
    await delay(2000);
    await room.say(`@${contact.name()} 订餐失败<br>菜名为空，请重新订餐哦`);
    return;
  }
  let isMenu = false;
  for (let i = 0; i < menuList.length; i++) {
    if (menuName === menuList[i].name) {
      isMenu = true;
      menuId = menuList[i]._id;
    }
  }
  if (!isMenu) {
    await delay(2000);
    await room.say(`@${contact.name()} ${tip1}`);
    return;
  } else {
    params.menuId = menuId;
    params.subscriber = contact.name();
  }
  
  if (keywordArr.length === 2) {
    if (!reg.test(keywordArr[1]) && !/^打包$/.test(keywordArr[1]) && !/^加辣$/.test(keywordArr[1])) {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip2}`);
      return;
    }
    if (reg.test(keywordArr[1])) {
      params.num = keywordArr[1].replace(/[^0-9]/ig, '');
    }
    if (/^打包$/.test(keywordArr[1])) {
      params.isDine = true;
    }
    if (/^加辣$/.test(keywordArr[1])) {
      params.isSpicy = true;
    }
  }

  if (keywordArr.length === 3) {
    if (!reg.test(keywordArr[1])) {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip2}`);
      return;
    } else {
      params.num = keywordArr[1].replace(/[^0-9]/ig, '');
    }
    if (!/^打包$/.test(keywordArr[2]) && !/^加辣$/.test(keywordArr[2])) {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip2}`);
      return;
    }
    if (/^打包$/.test(keywordArr[2])) {
      params.isDine = true;
    }
    if (/^加辣$/.test(keywordArr[2])) {
      params.isSpicy = true;
    }
  }

  if (keywordArr.length === 4) {
    if (!reg.test(keywordArr[1])) {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip2}`);
      return;
    } else {
      params.num = keywordArr[1].replace(/[^0-9]/ig, '');
    }
    if (!/^打包$/.test(keywordArr[2])) {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip2}`);
      return;
    } else {
      params.isDine = true;
    }
    if (!/^加辣$/.test(keywordArr[3])) {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip2}`);
      return;
    } else {
      params.isSpicy = true;
    }
  }

  if (keywordArr.length > 4) {
    await delay(2000);
    await room.say(`@${contact.name()} ${tip2}`);
    return;
  }

  request.post(`${constant.host}/addOrdering`)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send(params)
  .then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    console.log(msg);
    if (code === 0) {
      const str = `@${contact.name()} ${tip3}`;
      await delay(2000);
      await room.say(str);
      return;
    }
    await delay(2000);
    await room.say(`@${contact.name()} ${tip4}`);
  });
}

// 取消订餐
cancelOrdering = async (room, contact, keywordArr) => {
  const tip1 = '取消失败<br>您名下没有任何订餐信息';
  const tip2 = `取消成功<br>欢迎下次使用${constant.robotName}的订餐服务`;
  const tip3 = `取消失败<br>格式不正确，请重新回复“@${constant.robotName} 取消 序号”`;
  const tip4 = '取消失败<br>网络开小差啦，麻烦重新取消订餐哦';
  const tip5 = `取消失败<br>未能查询到该序号对应的订餐信息，请核对后重新回复“@${constant.robotName} 取消 序号”`;
  // 删除订单
  const cancel = id => {
    request.post(`${constant.host}/deleteOrdering`)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({ _id: id })
    .then(async res => {
      let text = JSON.parse(res.text);
      const { code, msg } = text;
      console.log(msg);
      if (code === 0) {
        await delay(2000);
        await room.say(`@${contact.name()} ${tip2}`);
        return;
      }
      await delay(2000);
      await room.say(`@${contact.name()} ${tip4}`);
    });
  }
  if (keywordArr.length === 1) {
    // 查询订餐人名下的订单
    request.get(`${constant.host}/orderingList`).query({ subscriber: contact.name(), isExpired: false }).then(async res => {
      let text = JSON.parse(res.text);
      const { code, msg, data } = text;
      console.log(msg);
      if (code === 0) {
        if (data.length === 0) {
          await delay(2000);
          await room.say(`@${contact.name()} ${tip1}`);
        }
        if (data.length === 1) {
          cancel(data[0]._id);
        }
        if (data.length > 1) {
          let listText = '';
          for (let i = 0; i < data.length; i ++) {
            let name = '';
            if (data[i].menuId.name.length < 6) {
              let centerText = '';
              for (let j = 0; j < (6 - data[i].menuId.name.length); j++) {
                centerText += `　`;
              }
              name = `${data[i].menuId.name} ${centerText}`;
            } else {
              name = `${data[i].menuId.name} `;
            }
            listText += `${i + 1}. ${name}　${data[i].num}份 ${data[i].isSpicy ? '加辣' : ''} ${data[i].isDine ? '打包' : ''}<br>`;
          }
          const str = `查询到您名下有如下订餐信息:<br><br>${listText}<br>请回复“@${constant.robotName} 取消 序号”取消对应的订餐`;
          await delay(2000);
          await room.say(`@${contact.name()} ${str}`);
        }
        return;
      }
      await delay(2000);
      await room.say(`@${contact.name()} ${tip4}`);
    });
  }
  if (keywordArr.length > 1) {
    if (/^[0-9]+$/.test(keywordArr[1])) {
      request.get(`${constant.host}/orderingList`).query({ subscriber: contact.name(), isExpired: false }).then(async res => {
        let text = JSON.parse(res.text);
        const { code, msg, data } = text;
        console.log(msg);
        if (code === 0) {
          if (data.length === 0) {
            await delay(2000);
            await room.say(`@${contact.name()} ${tip5}`);
          }
          if (data.length > 0) {
            if (keywordArr[1] > data.lenght) {
              await delay(2000);
              await room.say(`@${contact.name()} ${tip5}`);
            } else {
              cancel(data[keywordArr[1] - 1]._id);
            }
          }
          return;
        }
        await delay(2000);
        await room.say(`@${contact.name()} ${tip4}`);
      });
    } else {
      await delay(2000);
      await room.say(`@${contact.name()} ${tip3}`);
    }
  }
}

// 查询订餐
inquiryOrdering = async (room, contact) => {
  const tip1 = '您名下没有任何订餐信息';
  const tip2 = '网络开小差啦，麻烦重新查询哦';
  // 查询名下订餐
  request.get(`${constant.host}/orderingList`).query({ subscriber: contact.name(), isExpired: false }).then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    console.log(msg);
    if (code === 0) {
      if (data.length === 0) {
        await delay(2000);
        await room.say(`@${contact.name()} ${tip1}`);
      } else {
        let listText = '';
        for (let i = 0; i < data.length; i ++) {
          let name = '';
          if (data[i].menuId.name.length < 6) {
            let centerText = '';
            for (let j = 0; j < (6 - data[i].menuId.name.length); j++) {
              centerText += `　`;
            }
            name = `${data[i].menuId.name} ${centerText}`;
          } else {
            name = `${data[i].menuId.name} `;
          }
          listText += `• ${name}　${data[i].num}份 ${data[i].isSpicy ? '加辣' : ''} ${data[i].isDine ? '打包' : ''}<br>`;
        }
        const str = `查询到您名下有如下订餐信息:<br><br>${listText}`;
        await delay(2000);
        await room.say(`@${contact.name()} ${str}`);
      }
      return;
    }
    await delay(2000);
    await room.say(`@${contact.name()} ${tip2}`);
  });
}

// 查询订餐详情
orderingDetail = async (room, contact) => {
  const tip1 = '今日无人订餐，暂无订餐详情哦';
  const tip2 = '网络开小差啦，麻烦重新查询订餐详情哦';
  // 查询所有订餐信息
  request.get(`${constant.host}/orderingList`).query({ isExpired: false }).then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    console.log(msg);
    if (code === 0) {
      if (data.length === 0) {
        await delay(2000);
        await room.say(`@${contact.name()} ${tip1}`);
      } else {
        let nameArr = [];
        let resArr = [];
        for (let i = 0; i < data.length; i ++) {
          // 判断是否是同一个人名下的订餐
          const num = nameArr.indexOf(data[i].subscriber);
          if (num > -1) {
            resArr[num].push(data[i]);
          } else {
            nameArr.push(data[i].subscriber);
            resArr.push([]);
            resArr[nameArr.length - 1].push(data[i]);
          }
        }
        let menuText = ''
        for (let i = 0; i < resArr.length; i ++) {
          let listText = '';
          let amount = 0;
          for (let j = 0; j < resArr[i].length; j ++) {
            let name = '';
            if (resArr[i][j].menuId.name.length < 6) {
              let centerText = '';
              for (let n = 0; n < (6 - resArr[i][j].menuId.name.length); n ++) {
                centerText += `　`;
              }
              name = `${resArr[i][j].menuId.name} ${centerText}`;
            } else {
              name = `${resArr[i][j].menuId.name} `;
            }
            amount += resArr[i][j].menuId.price * resArr[i][j].num;
            listText += `${name} ${resArr[i][j].num}份 ${resArr[i][j].isSpicy ? '加辣' : ''} ${resArr[i][j].isDine ? '打包' : ''}<br>`;
          }
          menuText += `【${nameArr[i]}】(￥${amount})<br>${listText}_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _<br><br>`;
        }
        const resText = `订餐详情如下:<br><br>${menuText}注：早上10:30之前的查询结果为昨日的订餐详情`;
        await delay(2000);
        await room.say(resText);
      }
      return;
    }
    await delay(2000);
    await room.say(`@${contact.name()} ${tip2}`);
  });
}

module.exports = { ordering, cancelOrdering, inquiryOrdering, orderingDetail };
