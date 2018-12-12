import {message} from 'antd';

const OSS = {
    production: {
        bucket_private: 'woda-app-private',
        bucket_public: 'woda-app-public'
    },
    beta: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    },
    alpha: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    },
    test: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    },
    dev: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    },
    sit: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    },
    uat: {
        bucket_private: 'woda-app-private-test',
        bucket_public: 'woda-app-public-test'
    }
};
let oss;
if (__DEV__) {
    oss = OSS.dev;
}
if (__ALPHA__) {
    oss = OSS.alpha;
}
if (__TEST__) {
    oss = OSS.test;
}
if (__BETA__) {
    oss = OSS.beta;
}
if (__PROD__) {
    oss = OSS.production;
}
if (__SIT__) {
    oss = OSS.sit;
}
if (__UAT__) {
    oss = OSS.uat;
}
if (!oss) {
    console.error('The build enviroment error.');
}
oss.getImgPath = function (isPrivate = false) {
    return "http://" + (isPrivate ? this.bucket_private : this.bucket_public) + ".oss-cn-shanghai.aliyuncs.com/";
};
oss.checkImage = function (file) {
    if (!file) return false;
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
    if (!isJPG) {
        message.error('只允许上传jpg/png格式的图片');
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('上传图片大小不能超过2M');
        return false;
    }
    return true;
};
window.oss = oss;
export default oss;