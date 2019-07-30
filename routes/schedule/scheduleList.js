const Assistant = require('../../models/assistant');

module.exports = router => {
  // 获取定时任务列表
  router.get('/getScheduleList', async (ctx, next) => {
    const find = data => {
      return new Promise(resovle => {
        Assistant.find(data, (err, doc) => {
          if (err) {
            return resovle({
              code: -1,
              msg: '获取定时任务列表失败'
            });
          }
          return resovle({
            code: 0,
            msg: '获取定时任务列表成功',
            data: doc
          });
        });
      });
    }

    const { query } = ctx;
    let res = await find(query);
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}
