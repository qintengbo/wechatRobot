const router = require('koa-router')();
const addSchedule = require('./schedule/addSchedule');
const scheduleList = require('./schedule/scheduleList');
const updateSchedule = require('./schedule/updateSchedule');
const deleteSchedule = require('./schedule/deleteSchedule');
const addMenu = require('./menu/addMenu');
const menuList = require('./menu/menuList');
const addOrdering = require('./ordering/addOrdering');
const orderingList = require('./ordering/orderingList');
const updateOrdering = require('./ordering/updateOrdering');
const deleteOrdering = require('./ordering/deleteOrdering');

addSchedule(router); // 添加定时任务接口
scheduleList(router); // 获取定时任务列表接口
updateSchedule(router); // 更新定时任务状态接口
deleteSchedule(router); // 删除定时任务接口
addMenu(router); // 新增菜名接口
menuList(router); // 获取菜单列表接口
addOrdering(router); // 新增订餐任务接口
orderingList(router); // 获取订餐任务列表接口
updateOrdering(router); // 更新订餐信息接口
deleteOrdering(router); // 删除订餐接口

module.exports = (app) => {
  router.prefix('/api'); // 所有路由前加上拦截器
  app.use(router.routes());
  app.use(router.allowedMethods());
}