const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const chalk = require('chalk');

const nodeConfig = process.argv.splice(2).reduce((pre, cur) => {
    let arg = cur.split('=');
    arg.length && (pre[arg[0]] = arg[1] || true);
    return pre;
}, {});

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackConfig = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const antdTheme = require('./theme-antd');

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.join(rootPath, 'src');
const distPath = path.join(rootPath, 'dist');

const common = yaml.load(fs.readFileSync(path.resolve(__dirname, 'common.config.yml'), 'utf8'));
const {entries, modes} = common;
const isDev = nodeConfig.env === modes.dev;
const mode = isDev ? modes.dev : modes.prod;

console.log(chalk.blue('webpack entries:'));
entries.forEach(item => console.log('  ' + chalk.bgBlue.black(` ${item.name} `), `${typeof item.title === 'object' ? item.title[mode] : item.title } ${item.template ? path.join(srcPath, item.entry) : ''}`));
console.log('');

const config = {
    mode,
    node: {
        __filename: true,
        fs: 'empty'
    },
    entry: entries.reduce((pre, cur) => {
        pre[cur.name] = [path.join(srcPath, cur.entry)];
        return pre;
    }, {}),
    resolve: {
        extensions: [
            '.js', '.jsx'
        ], // 此选项不再需要传一个空字符串。
        alias: {}
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
                                {libraryName: "antd-mobile", style: true},
                                {libraryName: "antd", style: true}
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
                    `less-loader?{"modifyVars":${JSON.stringify(antdTheme)},"javascriptEnabled":true,"sourceMap":true}`
                ]
            },
            {test: /\.(png|svg|jpe?g|gif)$/, use: ['file-loader']},
            {test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader']},
            {test: /\.(csv|tsv)$/, use: ['csv-loader']},
            {test: /\.(xml|xlsx)$/, use: ['file-loader?name=[name].[ext]']}
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Don't use hash in development, we need the persistent for "renderHtml.js"
            filename: isDev ? '[name].css' : '[name].[chunkhash:8].css',
            chunkFilename: isDev ? '[name].chunk.css' : '[name].[chunkhash:8].chunk.css'
        }),
        new webpackConfig.DefinePlugin({
            __ALIYUN_ENV__: JSON.stringify(nodeConfig.aliyun_env)
        })
    ]
};
entries.forEach(item => {
        const entryPath = path.join(srcPath, item.name);
        config.resolve.alias[item.name.toUpperCase()] = entryPath;
        for (let child of fs.readdirSync(entryPath)) {
            let childPath = `${entryPath}/${child}`;
            let info = fs.statSync(childPath);
            info.isDirectory() && (config.resolve.alias[`${item.name}_${child}`.toUpperCase()] = childPath);
        }
    }
);

if (isDev) {
    entries.forEach(item => config.entry[item.name].push('webpack-hot-middleware/client?reload=true'));
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
        new webpackConfig.HotModuleReplacementPlugin(),
        new webpackConfig.NoEmitOnErrorsPlugin()
    );
    config.plugins.push(...entries.map(item => new HtmlWebpackPlugin({
        favicon: path.join(srcPath, item.favicon),
        template: path.join(srcPath, item.template),
        chunks: [item.name],
        filename: typeof item.filename === 'object' ? item.filename[mode] : item.filename,
        title: typeof item.title === 'object' ? item.title[mode] : item.title,
        chunksSortMode: 'none'
    })));
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
        // runtimeChunk: true,
        runtimeChunk: {name: "manifest"},
        splitChunks: {
            chunks: 'async',
            // name: false,
            cacheGroups: {
                vendors: {
                    name: 'vendors',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    };
    config.plugins.push(
        // new WebpackBundleAnalyzer.BundleAnalyzerPlugin(),
        new CleanWebpackPlugin('dist', {root: rootPath, verbose: false})
    );
    config.plugins.push(...entries.map(item => new HtmlWebpackPlugin({
        title: typeof item.title === 'object' ? item.title[mode] : item.title,
        filename: typeof item.filename === 'object' ? item.filename[mode] : item.filename,
        template: path.join(srcPath, item.template),
        chunks: [item.name, 'vendors', 'manifest'],
        chunksSortMode: "none",
        favicon: path.join(srcPath, item.favicon),
        minify: {
            caseSensitive: true,
            collapseWhitespace: true,
            removeComments: true
        }
    })));
}

module.exports.config = config;
module.exports.common = common;
module.exports.nodeConfig = nodeConfig;