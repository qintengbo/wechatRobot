const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 订餐集合字段
const OrderingSchema = new Schema({
	subscriber: { // 订餐者
		type: String,
		required: true
	},
	menuId: { // 预订菜名
		type: Schema.Types.ObjectId,
		ref: 'Menu',
		required: true
	},
	num: { // 份数
		type: Number,
		default: 1
	},
	isSpicy: { // 是否加辣
		type: Boolean,
		default: false
	},
	isExpired: { // 是否过期
		type: Boolean,
		default: false
	},
	isDine: { // 是否打包
		type: Boolean,
		default: false
	},
	createDate: { // 创建时间
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Ordering', OrderingSchema);
