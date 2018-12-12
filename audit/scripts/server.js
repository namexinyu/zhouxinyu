const webpack = require('webpack');
const {config, common, nodeConfig} = require('./webpack.config.js');

if (config.mode === common.modes.dev) {
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
    // app.use('public', express.static('dist'));
    app.use(fallback({
        // index: '/app.html',
        rewrites: common.entries.map(item => {
            let from = eval('/^\\/' + item.name + '(\\/|$)/');
            let to = '/' + (typeof item.filename === 'object' ? item.filename[config.mode] : item.filename);
            return {from, to};
        })
    }));
    getPort(common.port).then(port => {
        getPort(port + 1).then(plugin_port => {
            const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
            config.plugins.push(new BrowserSyncPlugin({
                host: '127.0.0.1',
                port: plugin_port,
                proxy: `http://127.0.0.1:${common.port}/`,
                logConnections: false,
                startPath: common.entries[0].name,
                notify: false
            }, {reload: false}));
            const compiler = webpack(config);
            compiler.apply(new webpack.ProgressPlugin());
            // Tell express to use the webpack-dev-middleware and use the webpack.config.js
            // configuration file as a base.
            app.use(webpackDevMiddleware(compiler, {
                publicPath: config.output.publicPath
            }));
            app.use(WebpackHotMiddleware(compiler));
            if (nodeConfig.proxy) {
                const config = require(common.proxy);
                const proxy = require('http-proxy-middleware');
                config.forEach(item => app.use(proxy(item.context, item.opts)));
            } else if (nodeConfig.mock) {
                const proxyMiddleware = require('./mock.middleware');
                proxyMiddleware(app, common.mock);
            }
            app.listen(port, () => {
                // let host = server.address().address;
                // let port = server.address().port;
                // console.log('app listening at http://%s:%s', host, port);
            });
        }).catch(err => {
            console.error(err);
        });
    }).catch(err => {
        console.error(err);
    });
} else {
    webpack(config, (e, stats) => {
        // show build info to console
        console.log(stats.toString({chunks: false, color: true}));
        // save build info to file
        // fs.writeFile(path.join(common.distPath, '__build_info.log'), stats.toString({color: false}));
    });
}