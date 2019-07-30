const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 菜单集合字段
const MenuSchema = new Schema({
  name: { // 菜名
    type: String,
    required: true
  },
  price: { // 价格
    type: Number,
    required: true
  },
  spicy: { // 辣度 0-不辣 1-微辣 2-中辣 3-重辣
    type: Number,
    default: 0 
  },
  createDate: { // 创建时间
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Menu', MenuSchema);
