import { Express } from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';

export default function (app: Express) {
  const config = require('../../webpack.config.js');
  const compiler = webpack(config);

  app.get('/main', function (req, res, next) {
    // 由於本地開發尚未產生 dist 資料夾，所以暫以導向到以下路徑代替(webpack 編譯好的 client 頁面)
    res.redirect('/main/main.html');
  });

  app.get('/chatRoom', function (req, res, next) {
    // 由於本地開發尚未產生 dist 資料夾，所以暫以導向到以下路徑代替(webpack 編譯好的 client 頁面)
    res.redirect('/chatRoom/chatRoom.html');
  });

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    })
  );
}
