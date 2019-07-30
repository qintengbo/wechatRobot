const Assistant = require('../../models/assistant');

module.exports = router => {
  // 更新定时任务状态
  router.post('/updateSchedule', async (ctx, next) => {
    const update = data => {
      return new Promise(resolve => {
        Assistant.updateOne(data, { isExpired: true }, (err, doc) => {
          if (err) {
            return resolve({
              code: -1,
              msg: '更新定时任务状态失败'
            });
          }
          return resolve({
            code: 0,
            msg: '更新定时任务状态成功',
            data: doc
          });
        });
      });
    }

    const params = { _id: ctx.request.body.id };
    let res = await update(params);
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}
