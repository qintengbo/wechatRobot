const Ordering = require('../../models/ordering');

module.exports = router => {
	// 订餐列表
	router.get('/orderingList', async (ctx, next) => {
		find = data => {
			return new Promise(resolve => {
				Ordering.find(data, (err, doc) => {
					let opts = [{ path: 'menuId' }];
					if (err) {
						return resolve({
							code: -1,
							msg: '获取订餐列表失败'
						});
					}
					let result = new Promise((resolveFn, reject) => {
						Ordering.populate(doc, opts, (error, collection) => {
							if (error) reject(error);
							return resolveFn({
								code: 0,
								msg: '获取订餐列表成功',
								data: collection
							});
						});
					});
					// let result = await Ordering.populate(doc, opts, (error, collection) => {
					// 	if (error) return error;
					// 	return {
					// 		code: 0,
					// 		msg: '获取订餐列表成功',
					// 		data: collection
					// 	};
					// });
					// return result;
				});
			});
		}

		const params = { isExpired: false };
		let res = await find(params);
		ctx.response.status = 200;
    ctx.body = res;
    next();
	});
}