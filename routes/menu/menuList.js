const Menu = require('../../models/menu');

module.exports = router => {
  // 获取菜单
  router.get('/menuList', async (ctx, next) => {
    const find = () => {
      return new Promise(resolve => {
        Menu.find((err, doc) => {
          if (err) {
            return resolve({
              code: -1,
              msg: '查询菜单失败'
            });
          }
          return resolve({
            code: 0,
            msg: '查询菜单成功',
            data: doc
          });
        });
      });
    }

    let res = await find();
    ctx.response.status = 200;
    ctx.body = res;
    next();
  });
}