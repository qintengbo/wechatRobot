// 获取今天日期
getToday = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + '-' + month + '-' + day + ' ';
}


// 转换定时格式
convertTime = time => {
  let array = time.split(':');
  return "0 " + array[1] + ' ' + array[0] + ' * * *';
}

// 获取天数
getDay = date => {
  let date2 = new Date();
  let date1 = new Date(date);
  let iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
  return iDays;
}

// 格式化日期
formatDate = date => {
  let tempDate = new Date(date);
  let year = tempDate.getFullYear();
  let month = tempDate.getMonth() + 1;
  let day = tempDate.getDate();
  let hour = tempDate.getHours();
  let min = tempDate.getMinutes();
  let second = tempDate.getSeconds();
  let week = tempDate.getDay();

  let str = ''
  if (week === 0) {
    str = '星期日';
  } else if (week === 1) {
    str = "星期一";
  } else if (week === 2) {
    str = "星期二";
  } else if (week === 3) {
    str = "星期三";
  } else if (week === 4) {
    str = "星期四";
  } else if (week === 5) {
    str = "星期五";
  } else if (week === 6) {
    str = "星期六";
  }

  if (hour < 10) {
    hour = "0" + hour;
  }
  if (min < 10) {
    min = "0" + min;
  }
  if (second < 10) {
    second = "0" + second;
  }
  return year + "-" + month + "-" + day + "日 " + hour + ":" + min + ' ' + str;
}

// 判断日期时间格式是否正确
isRealDate = str => {
  let reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
  let r = str.match(reg);
  if (r == null) return false;
  r[2] = r[2] - 1;
  let d = new Date(r[1], r[2], r[3], r[4], r[5]);
  if (d.getFullYear() != r[1]) return false;
  if (d.getMonth() != r[2]) return false;
  if (d.getDate() != r[3]) return false;
  if (d.getHours() != r[4]) return false;
  if (d.getMinutes() != r[5]) return false;
  return true;
}

module.exports = {
  getDay,
  getToday,
  convertTime,
  formatDate,
  isRealDate
};
