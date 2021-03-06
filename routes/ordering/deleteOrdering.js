const Ordering = require('../../models/ordering');

module.exports = router => {
  // 删除订餐
  router.post('/deleteOrdering', async (ctx, next) => {
    const cancel = data => {
      return new Promise(resolve => {
        Ordering.deleteOne(data, err => {
          if (err) {
            return resolve({
              code: -1,
              msg: '删除订餐失败'
            });
          }
          return resolve({
            code: 0,
            msg: '删除订餐成功'
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