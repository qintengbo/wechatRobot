const request = require('superagent');
const constant = require('../config/constant');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 订餐服务
ordering = async(room, contact, keywordArr, menuList) => {
  const tip1 = '订餐失败<br>菜名超出菜单范围或订餐格式不正确，请重新订餐哦';
  const tip2 = '订餐失败<br>订餐格式不正确，请重新订餐哦';
  const tip3 = '订餐成功<br>波波已经将你的订餐需求牢记在小本本上了';
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

  request.post(`${constant.host}/addOrdering`)
  .set('Content-Type', 'application/x-www-form-urlencoded')
  .send(params)
  .then(async res => {
    let text = JSON.parse(res.text);
    const { code, msg, data } = text;
    if (code === 0) {
      const str = `@${contact.name()} ${tip3}`;
      await delay(2000);
      await room.say(str);
      return;
    }
    await delay(2000);
    await room.say(`@${contact.name()} ${tip4}`);
    console.log(msg);
  });
}

module.exports = ordering;
