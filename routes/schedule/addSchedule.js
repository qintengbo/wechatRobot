const Assistant = require('../../models/assistant');

module.exports = (router) => {
  // 添加定时任务
  router.post('/addSchedule', async (ctx, next) => {
    insert = (data) => {
      return new Promise(resolve => {
        Assistant.create(data, (err, doc) => {
          if (err) {
            return resolve({
              code: -1,
              msg: '添加定时任务失败'
            });
          }
          return resolve({
            code: 0,
            msg: '添加定时任务成功',
            data: doc
          });
        });
      });
    }

    const { body } = ctx.request;
    let res = await insert(body);
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}
