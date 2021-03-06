const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const mongoose = require("mongoose");
const { Wechaty } = require('wechaty');
const config = require('./config/config');
const routes = require('./routes/routeConfig');
const wechatWay = require('./services/wechatWay');
const app = new Koa();

const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.respose.status = err.statusCode || err.status || 500;
    ctx.response.type = 'html';
    ctx.response.body = `<p>${err.message}</p>`;
    ctx.app.emit('error', err, ctx);
  }
}

app.use(bodyParser());
app.use(handler);
app.on('error', (err) => {
  console.error('server error:', err);
});

// 路由引入
routes(app);

// 连接数据库
mongoose.connect(config.dbPath, { useNewUrlParser: true });
// 连接成功
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + config.dbPath);
});
// 连接失败
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err);
});
// 连接断开
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

app.listen(3008, () => {
  console.log('listening on port: ' + 3008);
});

// 登录微信
const robot = new Wechaty({ name: 'wechatRobot' });
wechatWay(robot);