const constant = require('../config/constant');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// 开始订餐服务
orderingStart = async robot => {
	const room = await robot.Room.find({ topic: constant.orderingRoomName });
	const str = '叮咚！订餐时间到啦！不吃饱怎么有力气工作呢<br><br>各位同学请“@波波 #菜名”(例如“@波波 #鱼香肉丝饭”)进行订餐<br><br>菜名只限菜单范围，超出范围无法预订，订餐默认为堂食，如需打包请在菜名后加“打包”二字，例如“@波波 #鱼香肉丝饭 打包”<br><br>订餐时间为30分钟，11:00波波会将订餐结果统计后发到群里，超过订餐时间的请人工预订哦';
	await room.say(str);
}

// 订餐中途提醒
orderingTip = async robot => {
	const room = await robot.Room.find({ topic: constant.orderingRoomName });
	const str = '温馨提醒：订餐时间还剩5分钟，还未订餐的同学速度“@波波 #菜名”(例如“@波波 #红烧茄子饭”)进行订餐哦！';
	await room.say(str);
}

// 结束订餐服务
orderingEnd = async robot => {
	const room = await robot.Room.find({ topic: constant.orderingRoomName });
	const str = '叮咚！订餐时间结束，本次订餐结果统计如下：';
	await room.say(str);
}

module.exports = { orderingStart, orderingTip, orderingEnd };
