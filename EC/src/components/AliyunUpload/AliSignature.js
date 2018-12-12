import OSS from 'ali-oss';
import AliyunService from 'SERVICE/AliyunService';
import oss from 'CONFIG/ossConfig';

const CONFIG = {
    REGION: 'oss-cn-shanghai',
    BUCKET_PRIVATE: oss.bucket_private,
    BUCKET_PUBLIC: oss.bucket_public,
    END_POINT: 'aliyun-oss'
};

export default class AliSignature {
    clientWrapper(opts) {
        // return new Promise(function (resolve, reject) {
        //     let client = new OSS.Wrapper({
        //         accessKeyId: 'l4amBfKiUG4PIo1C',
        //         accessKeySecret: 'YeuFlvTSKx4Ume86mki91YCtRCe4gy',
        //         bucket: 'mirage-private',
        //         region: 'oss-cn-hangzhou'
        //     });
        //     resolve(client);
        // });
        // fuck!!!!
        return new Promise(function (resolve, reject) {
            AliyunService.getSercetKey().then(function (res) {
                console.log(" AliyunService.getSercetKey(", res);
                let client = new OSS.Wrapper({
                    accessKeyId: res.AccessKeyId,
                    accessKeySecret: res.AccessKeySecret,
                    bucket: opts.bucket || CONFIG.BUCKET_PUBLIC,
                    region: opts.region || CONFIG.REGION,
                    stsToken: res.SecurityToken
                });
                resolve(client);
            }, function () {
                alert('Get aliyun sercetKey error.');
                reject('Get aliyun sercetKey error.');
            });
        });
    }
}