const common = require('./common');
const fs = require('fs');

const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const lessToJs = require('less-vars-to-js');

const SOURCE_MAP = false;
const ENV_PRODUCTION = 'production';
const ENV_BETA = 'beta';
const ENV_DEVELOPMENT = 'development';
const ENV_ALPHA = 'alpha';
const ENV_TEST = 'test';

const env = process
    .env
    .NODE_ENV
    .trim();

let usePreact = common.usePreact;

const antdTheme = lessToJs(fs.readFileSync(path.join(common.path.src, './assets/less/theme/antd-theme.less'), 'utf8'));

const config = {
    node: {
        __filename: true,
        fs: 'empty'
    },
    entry: {
        app: [path.join(common.path.src, 'app.js')],
        vendor: usePreact ? ['react-redux', 'redux', 'preact', 'preact-compat'] : [
            'react',
            'react-dom',
            'react-redux',
            'redux'
        ]
    },
    output: {
        path: path.join(path.join(path.resolve(__dirname, '..'), 'dist' + common.DEPLOY_SERVICE_PATH), 'static'),
        publicPath: common.DEPLOY_SERVICE_PATH + '/static/'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [
            '.js', '.jsx'
        ], // 此选项不再需要传一个空字符串。
        alias: {
            ASSET: path.resolve(common.path.src, 'assets'),
            COMPONENT: path.resolve(common.path.src, 'components'),
            ACTION: path.resolve(common.path.src, 'actions'),
            REDUCER: path.resolve(common.path.src, 'reducers'),
            STORE: path.resolve(common.path.src, 'store'),
            ROUTE: path.resolve(common.path.src, 'routes'),
            SERVICE: path.resolve(common.path.src, 'services'),
            UTIL: path.resolve(common.path.src, 'utils'),
            VIEW: path.resolve(common.path.src, 'views'),
            CONSTANT: path.resolve(common.path.src, 'utils/constant'),
            REQUEST: path.resolve(common.path.src, 'utils/HttpRequest'),
            SCSS: path.resolve(common.path.src, 'assets/scss'),
            IMAGE: path.resolve(common.path.src, 'assets/images'),
            CONFIG: path.resolve(common.path.src, 'config'),
            LESS: path.resolve(common.path.src, 'assets/less')
        }
    },
    resolveLoader: {
        modules: ['src', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                options: {
                    retainLines: process.env.NODE_ENV !== ENV_PRODUCTION,
                    cacheDirectory: process.env.NODE_ENV !== ENV_PRODUCTION,
                    babelrc: false,
                    comments: false,
                    compact: true,
                    presets: ['env', 'react'],
                    plugins: [
                        ['transform-runtime', {
                            'helpers': false, // defaults to true
                            'polyfill': false, // defaults to true
                            'regenerator': true, // defaults to true
                            'moduleName': 'babel-runtime' // defaults to "babel-runtime"
                        }],
                        ['transform-object-rest-spread', {'useBuiltIns': true}],
                        ['syntax-dynamic-import'],
                        ['transform-class-properties'],
                        ["import", {libraryName: "antd", style: true}] // `style: true` 会加载 less 文件
                    ]
                },
                include: common.path.src,
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                use: {
                    loader: 'json-loader'
                }
            }, {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240, // 10KB 以下使用 base64
                        name: 'images/[name]-[hash:6].[ext]'
                    }
                }
            },
            {
                test: /\.woff/,
                loader: 'url-loader?prefix=font/&limit=10000&mimetype=application/font-woff'
            }, {
                test: /\.ttf/,
                loader: 'file-loader?prefix=font/'
            }, {
                test: /\.eot/,
                loader: 'file-loader?prefix=font/'
            }, {
                test: /\.svg/,
                loader: 'file-loader?prefix=font/'
            }, {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'clean-css-loader', 'postcss-loader', 'sass-loader']
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'clean-css-loader', 'postcss-loader', {
                        loader: 'less-loader', options: {
                            "modifyVars": antdTheme
                        }
                    }]
                })
            }
        ]
    },
    plugins: [new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        __APP_ID__: JSON.stringify(common.APP_ID),
        __DEV__: env === 'development',
        __TEST__: env === 'test',
        __ALPHA__: env === 'alpha',
        __BETA__: env === 'beta',
        __PROD__: env === 'production',
        __SIT__: env === 'sit',
        __UAT__: env === 'uat',
        __COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
        __WHY_DID_YOU_UPDATE__: false // 是否检测不必要的组件重渲染
    }), new webpack.BannerPlugin(new Date().toISOString())]
};
if (usePreact) {
    // config.externals = {
    //     'react': 'React',
    //     'react-dom': "ReactDOM"
    // };
    config.resolve.alias["react"] = "preact-compat";
    config.resolve.alias["react-dom"] = "preact-compat";
    config.resolve.alias["create-react-class"] = "preact-compat/lib/create-react-class";
}
console.log('Use Preact:', usePreact);

var PrintChunksPlugin = function () {
};
PrintChunksPlugin.prototype.apply = function (compiler) {
    compiler.plugin('compilation', function (compilation, params) {
        compilation.plugin('after-optimize-chunk-assets', function (chunks) {
            chunks.map(function (c) {

            });
        });
    });
};

if (process.env.NODE_ENV !== ENV_DEVELOPMENT) {
    config.output.filename = '[name].[chunkhash:6].js';
    config.output.chunkFilename = '[id].chunk.[chunkhash:6].js';
    config
        .plugins
        .push(new CleanWebpackPlugin('dist', {
                root: common.path.rootPath,
                verbose: false
            }), new CopyWebpackPlugin([
                {
                    context: common.path.staticDir,
                    from: '**/*',
                    ignore: ['*.md']
                }
            ]), new webpack.optimize.UglifyJsPlugin({
                uglifyOptions: {
                    parse: {
                        html5_comments: false
                    },
                    mangle: {
                        toplevel: true
                    },
                    output: {
                        comments: false
                    },
                    compress: {
                        warnings: false,
                        drop_console: true
                    }
                }

            }), new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor', 'mainifest']
            }),
            new webpack.optimize.AggressiveMergingPlugin(),
            // new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 30000 }),
            new ExtractTextPlugin({filename: '[name].[contenthash:6].css', allChunks: true}),
            new HtmlWebpackPlugin({
                filename: '../index.html',
                template: common.path.indexHTML,
                chunksSortMode: "dependency",
                minify: {
                    caseSensitive: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            }), new PrintChunksPlugin());
} else {
    config.output.filename = '[name].js';
    config.output.chunkFilename = '[id].js';
    config.output.publicPath = '/';
    // add hot-reload
    config.entry.app.push('eventsource-polyfill', 'webpack-hot-middleware/client?reload=true', 'webpack/hot/only-dev-server');
    // add dev rules
    config
        .module
        .rules
        .push({
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            exclude: /(node_modules|bower_components|\.spec\.js)/,
            use: [
                {
                    loader: 'eslint-loader',
                    options: {
                        failOnWarning: false,
                        failOnError: true
                    }
                }
            ]
        });
    // plugins
    config
        .plugins
        .push(new webpack.SourceMapDevToolPlugin(
            {
                filename: '[name].js.map',
                exclude: ['vendor.js']
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new ExtractTextPlugin('[name].css'),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: common.path.indexHTML,
                chunksSortMode: 'none',
                minify: {
                    caseSensitive: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            }),
            new BrowserSyncPlugin({
                host: '127.0.0.1',
                port: 9093,
                proxy: 'http://127.0.0.1:9003/',
                logConnections: false,
                startPath: common.DEPLOY_SERVICE_PATH,
                notify: false
            }, {reload: false})
        );
}

module.exports = config;