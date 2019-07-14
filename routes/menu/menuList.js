const Menu = require('../../models/menu');

module.exports = router => {
	// 获取菜单
	router.get('/menuList', async (ctx, next) => {
		find = data => {
			return new Promise(resolve => {
				Menu.find(data, (err, doc) => {
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

		const { params } = ctx;
		console.log(111, params)
		let res = await find(params);
		ctx.response.status = 200;
    ctx.body = res;
    next();
	});
}