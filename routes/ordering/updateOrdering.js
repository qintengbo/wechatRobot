const Ordering = require('../../models/ordering');

module.exports = router => {
	// 更新订餐信息
	router.post('/updateOrdering', async (ctx, next) => {
		update = data => {
			return new Promise(resolve => {
				Ordering.update({ isExpired: false }, data, { multi: true }, (err, doc) => {
					if (err) {
						return resolve({
							code: -1,
							msg: '更新订餐信息失败'
						});
					}
					return resolve({
						code: 0,
						msg: '更新订餐信息成功',
						data: doc
					});
				});
			});
		}

		const { params } = ctx;
		let res = await update(params);
		ctx.response.status = 200;
    ctx.body = res;
    next();
	});
}