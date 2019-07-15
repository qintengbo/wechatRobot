const Ordering = require('../../models/ordering');

module.exports = router => {
	// 更新订餐信息
	router.post('/updateOrdering', async (ctx, next) => {
		update = () => {
			return new Promise(resolve => {
				Ordering.updateMany({ isExpired: false }, { isExpired: true }, (err, doc) => {
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

		let res = await update();
		ctx.response.status = 200;
    ctx.body = res;
    next();
	});
}