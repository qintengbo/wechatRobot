const Assistant = require('../../models/assistant');

module.exports = router => {
  // 删除定时任务
  router.post('/deleteSchedule', async (ctx, next) => {
    const cancel = data => {
      return new Promise(resolve => {
        Assistant.deleteOne(data, err => {
          if (err) {
            return resolve({
              code: -1,
              msg: '删除提醒失败'
            });
          }
          return resolve({
            code: 0,
            msg: '删除提醒成功'
          });
        });
      });
    }

    const { body } = ctx.request;
    let res = await cancel({ _id: body._id });
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}