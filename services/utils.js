// 获取今天日期
getToday = () => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (day >= 0 && day <= 9) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
}

// 转换定时格式
convertTime = time => {
  let array = time.split(':');
  if (array[1] === '00') {
    array[1] = '0';
  }
  return '0 ' + array[1] + ' ' + array[0] + ' * * *';
}

// 获取天数
getDay = date => {
  let date2 = new Date();
  let date1 = new Date(date);
  let iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
  return iDays;
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

// 判断当前时间是否在指定两个时间范围内
isTimeRang = (startTime, endTime) => {
  const startArr = startTime.split(':');
  const endArr = endTime.split(':');
  if (startArr.length !== 3) {
    return false;
  }
  if (endArr.length !== 3) {
    return false;
  }
  let start = new Date();
  let end = new Date();
  let now = new Date();

  start.setHours(startArr[0]);
  start.setMinutes(startArr[1]);
  start.setSeconds(startArr[2]);
  end.setHours(endArr[0]);
  end.setMinutes(endArr[1]);
  end.setSeconds(endArr[2]);

  if (now.getTime() - start.getTime() > 0 && now.getTime() - end.getTime() < 0) {
    return true;
  }
  return false;
}

module.exports = {
  getDay,
  getToday,
  convertTime,
  isRealDate,
  isTimeRang
};
