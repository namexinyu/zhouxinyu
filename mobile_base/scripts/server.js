const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const { config, projectConf, nodeConfig } = require('./webpack.config.js');

if (config.mode === projectConf.mode.dev) {
    const express = require('express');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const WebpackHotMiddleware = require('webpack-hot-middleware');
    const fallback = require('connect-history-api-fallback');
    const net = require('net');
    const getPort = (port) => new Promise((resolve, reject) => {
        if (port >= 65535) reject(new Error('no available port!'));
        let server = net.createServer();
        server.listen(port, function (errr) {
            server.once('close', function () {
                resolve(port);
            });
            server.close();
        });
        server.on('error', function (errr) {
            getPort(port + 1).then(res => {
                resolve(res);

            }).catch(err => {
                reject(err);
            });
        });
    });

    const app = express();
    app.use(express.static('dist'));
    app.use(fallback());
    getPort(projectConf.port).then(port => {
        const compiler = webpack(config);
        app.use(webpackDevMiddleware(compiler, {
            publicPath: config.output.publicPath
        }));
        app.use(WebpackHotMiddleware(compiler));
        if (nodeConfig.proxy) {
            const config = require(projectConf.proxy);
            const proxy = require('http-proxy-middleware');
            config.forEach(item => app.use(proxy(item.context, item.opts)));
        } else if (nodeConfig.mock) {
            const apiMocker = require('webpack-api-mocker');
            apiMocker(app, path.resolve(__dirname, projectConf.mock));
        }
        app.listen(port, () => {
            console.log('app listening at http://localhost:%s', port);
        });
    }).catch(err => {
        console.error(err);
    });
} else {
    webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log('webpack error!', err ? err : stats);
            return;
        }
        console.log('webpack success!');
        fs.writeFileSync('build.log', stats.toString({ maxModules: Infinity }));
    });
}