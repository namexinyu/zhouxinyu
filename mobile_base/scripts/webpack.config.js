const fs = require('fs');
const path = require('path');

const nodeConfig = process.argv.splice(2).reduce((pre, cur) => {
    let arg = cur.split('=');
    arg.length && (pre[arg[0]] = arg[1] || true);
    return pre;
}, {});

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');

const projectConf = JSON.parse(fs.readFileSync(path.resolve(rootPath, 'project.config.json')));
const isDev = nodeConfig.env === projectConf.mode.dev;
const mode = isDev ? projectConf.mode.dev : projectConf.mode.prod;

const config = {
    mode,
    node: {
        __filename: true,
        fs: 'empty'
    },
    entry: {
        [projectConf.name]: ['./src/index.js']
    },
    resolve: {
        extensions: [
            '.js', '.jsx'
        ],
        alias: {
            '@ant-design/icons/lib/dist$': path.resolve(__dirname, '../src/utils/icon.js')
        }
    },
    resolveLoader: {
        modules: ['src', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                include: srcPath,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: isDev,
                        plugins: [
                            ["import", [
                                { libraryName: "antd-mobile", style: true },
                                { libraryName: "antd", style: true }
                            ]]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?importLoaders=1',
                    'postcss-loader',
                    `less-loader?{"javascriptEnabled":true,"sourceMap":true}`
                ]
            },
            { test: /\.(png|svg|jpe?g|gif)$/, use: ['file-loader'] },
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader'] },
            { test: /\.(csv|tsv)$/, use: ['csv-loader'] },
            { test: /\.(xml|xlsx)$/, use: ['file-loader?name=[name].[ext]'] }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev ? '[name].css' : '[name].[chunkhash:8].css',
            chunkFilename: isDev ? '[name].chunk.css' : '[name].[chunkhash:8].chunk.css'
        }),
        new webpack.DefinePlugin({
            __ALIYUN_ENV__: JSON.stringify(nodeConfig.aliyun_env),
            __BASE_NAME__: JSON.stringify(projectConf.basename)
        })
    ]
};

for (let child of fs.readdirSync(srcPath)) {
    let childPath = `${srcPath}/${child}`;
    let info = fs.statSync(childPath);
    info.isDirectory() && (config.resolve.alias[child.toUpperCase()] = childPath);
}

if (isDev) {
    config.entry[projectConf.name].push('webpack-hot-middleware/client?reload=true');
    config.output = {
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].chunk.js',
        publicPath: '/'
    };
    config.devtool = 'source-map';
    config.module.rules
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
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new BrowserSyncPlugin({
            host: '127.0.0.1',
            port: projectConf.port,
            proxy: `http://127.0.0.1:${projectConf.port}/`,
            logConnections: false,
            startPath: projectConf.basename,
            notify: false
        }, { reload: false })
    );
    config.plugins.push(new HtmlWebpackPlugin({
        favicon: path.join(srcPath, 'favicon.ico'),
        template: path.join(srcPath, 'index.html'),
        chunks: [projectConf.name],
        filename: 'index.html',
        title: typeof projectConf.title === 'object' ? projectConf.title[mode] : projectConf.title,
        chunksSortMode: 'none'
    }));
} else {
    config.output = {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js',
        path: path.join(distPath, 'static'),
        publicPath: "/static/"
    };
    config.module.rules[0].use.options.plugins.push([
        "transform-remove-console", {
            "exclude": ["error", "warn"]
        }
    ]);
    config.optimization = {
        minimize: true,
        splitChunks: {
            chunks: "async",
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
        runtimeChunk: {
            name: "manifest"
        }
    };
    config.plugins.push(
        new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new CleanWebpackPlugin('dist', { root: rootPath, verbose: false })
    );
    config.plugins.push(new HtmlWebpackPlugin({
        title: typeof projectConf.title === 'object' ? projectConf.title[mode] : projectConf.title,
        filename: '../index.html',
        template: path.join(srcPath, 'index.html'),
        chunks: [projectConf.name, 'vendors', 'manifest'],
        chunksSortMode: "none",
        favicon: path.join(srcPath, 'favicon.ico'),
        minify: {
            caseSensitive: true,
            collapseWhitespace: true,
            removeComments: true
        }
    }));
}

exports.config = config;
exports.projectConf = projectConf;
exports.nodeConfig = nodeConfig;