const router = require('koa-router')();
const addSchedule = require('./schedule/addSchedule');
const scheduleList = require('./schedule/scheduleList');
const updateSchedule = require('./schedule/updateSchedule');

addSchedule(router); // 添加定时任务接口
scheduleList(router); // 获取定时任务列表接口
updateSchedule(router); // 更新定时任务状态接口

module.exports = (app) => {
  router.prefix('/api'); // 所有路由前加上拦截器
  app.use(router.routes());
  app.use(router.allowedMethods());
}