const path = require('path');
const AppSetting = require('../src/config/AppSetting');

const rootPath = path.resolve(__dirname, '..');
const src = path.join(rootPath, 'src');

const common = {
    // 部署目录
    // 例如访问为 http://h5.woda.com/crm，表示crm系统访问路径。则DEPLOY_SERVICE_PATH: '/crm'
    // 例如访问为 http://h5.woda.com/cms，表示cms系统访问路径。则DEPLOY_SERVICE_PATH: '/cms'
    // 例如访问为 http://h5.woda.com，表示我打平台的官网。因为访问域名根目录，则DEPLOY_SERVICE_PATH: ''
    DEPLOY_SERVICE_PATH: '/audit',
    APP_ID: AppSetting.AppId || '',
    path: {
        rootPath: rootPath,
        src: path.join(rootPath, 'src'),
        dist: path.join(rootPath, 'dist'),
        indexHTML: path.join(src, 'index.html'),
        staticDir: path.join(rootPath, 'static')
    },
    // 如果要使用react，请将usePreact设置为false。默认根据package.json中是否有preact-compat进行判断
    // usePreact: !!require("../package.json").dependencies['preact-compat']
    usePreact: false
};

module.exports = common;