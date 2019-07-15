const Menu = require('../../models/menu');

module.exports = router => {
	// 添加菜名
	router.post('/addMenu', async (ctx, next) => {
		add = data => {
			return new Promise(resolve => {
				Menu.create(data, (err, doc) => {
					if (err) {
						return resolve({
							code: -1,
							msg: '新增菜名失败'
						});
					}
					return resolve({
						code: 0,
						msg: '新增菜名成功',
						data: doc
					});
				});
			});
		}

		const { body } = ctx.request;
		let res = await add(body);
		ctx.response.status = 200;
    ctx.body = res;
    next();
	});
}