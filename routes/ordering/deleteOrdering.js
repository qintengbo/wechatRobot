const Ordering = require('../../models/ordering');

module.exports = router => {
  // 删除订餐
  router.post('/deleteOrdering', async (ctx, next) => {
    cancel = data => {
      return new Promise(resolve => {
        Ordering.remove(data, err => {
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
    console.log(111, body);
    let res = await cancel({ _id: body._id });
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}