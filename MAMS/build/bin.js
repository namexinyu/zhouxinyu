const fs = require('fs');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');
const WebpackHotMiddleware = require('webpack-hot-middleware');
const ConnectHistoryApiFallback = require('connect-history-api-fallback');

const config = require('./webpack.conf.js');
const common = require('./common');

console.log('Process Env: %s', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    let app = express();

    app.use(common.DEPLOY_SERVICE_PATH + '/static', express.static(common.path.staticDir));
    app.use(ConnectHistoryApiFallback());
    var compiler = webpack(config);
    app.use(WebpackDevMiddleware(compiler, {
        noInfo: false,
        publicPath: '/'
    }));
    app.use(WebpackHotMiddleware(compiler));
    app.listen(9000, '127.0.0.1', function (err) {
        err && console.log(err);
    });
} else {
    webpack(config, function (err, stats) {
        // show build info to console
        console.log(stats.toString({ chunks: false, color: true }));

        // save build info to file
        fs.writeFile(path.join(path.join(common.path.rootPath, 'dist'), '__build_info__'), stats.toString({ color: false }));
    });
}