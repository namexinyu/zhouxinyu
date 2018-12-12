import { Toast } from 'antd-mobile';

const OSS_CONFIG = {
    production: {
        bucketPrivate: 'woda-app-private',
        bucketPublic: 'woda-app-public'
    },
    dev: {
        bucketPrivate: 'woda-app-private-test',
        bucketPublic: 'woda-app-public-test'
    }
};
let oss = OSS_CONFIG[__ALIYUN_ENV__];
if (!oss) oss = OSS_CONFIG.dev;
oss.getImgPath = function (isPrivate = false) {
    return "http://" + (isPrivate ? this.bucketPrivate : this.bucketPublic) + ".oss-cn-shanghai.aliyuncs.com/";
};
oss.checkImage = function (file) {
    if (!file) return false;
    const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
    if (!isJPG) {
        Toast.fail('只允许上传jpg/png格式的图片');
        return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        Toast.fail('上传图片大小不能超过2M');
        return false;
    }
    return true;
};
window.oss = oss;
export default oss;