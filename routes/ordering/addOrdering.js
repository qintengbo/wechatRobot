const Ordering = require('../../models/ordering');

module.exports = router => {
  // 新增订餐
  router.post('/addOrdering', async (ctx, next) => {
    const add = data => {
      return new Promise(resolve => {
        Ordering.create(data, (err, doc) => {
          if (err) {
            return resolve({
              code: -1,
              msg: '新增订餐失败'
            });
          }
          return resolve({
            code: 0,
            msg: '新增订餐成功',
            data: doc
          });
        });
      });
    }

    const { body } = ctx.request;
    let params = { menuId: body.menuId, subscriber: body.subscriber };
    if (body.num) {
      params.num = Number(body.num);
    }
    if (body.isDine) {
      params.isDine = true;
    }
    if (body.isSpicy) {
      params.isSpicy = true;
    }
    let res = await add(params);
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}