const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssistantSchema = new Schema({
  subscriber: { // 订阅者
    type: String,
    required: true
  },
  announcer: { // 发布者
    type: String,
    required: true
  },
  content: { // 内容
    type: String,
    required: true
  },
  time: { // 设定时间
    type: String,
    required: true
  },
  isLoop: { // 是否为循环定时任务
    type: Boolean,
    default: false
  },
  isExpired: { // 任务是否过期
    type: Boolean,
    default: false
  },
  createDate: { // 创建时间
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assistant', AssistantSchema);
