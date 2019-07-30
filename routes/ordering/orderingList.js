const Ordering = require('../../models/ordering');

module.exports = router => {
  // 订餐列表
  router.get('/orderingList', async (ctx, next) => {
    const find = data => {
      return new Promise(resolve => {
        Ordering.find(data, (err, doc) => {
          let opts = [{ path: 'menuId' }];
          if (err) {
            return resolve({
              code: -1,
              msg: '获取订餐列表失败'
            });
          }
          Ordering.populate(doc, opts, (error, collection) => {
            if (error) {
              return resolve({
                code: -1,
                msg: '获取订餐列表失败'
              });
            }
            return resolve({
              code: 0,
              msg: '获取订餐列表成功',
              data: collection
            });
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