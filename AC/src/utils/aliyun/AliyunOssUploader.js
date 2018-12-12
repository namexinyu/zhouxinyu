import OSS from 'ali-oss';
import WDAliyunService from 'SERVICE/AliyunService';
import ossConfig from 'CONFIG/ossConfig';

const CONFIG = {
    REGION: 'oss-cn-shanghai',
    PUBLIC_BUCKET: ossConfig.bucket_public,
    PRIVATE_BUCKET: ossConfig.bucket_private
};

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class AliyunOssUploader {
    constructor(isPublic = true) {
        this.option = {
            region: CONFIG.REGION,
            bucket: isPublic ? CONFIG.PUBLIC_BUCKET : CONFIG.PRIVATE_BUCKET
        };
        this.client = null;
    }

    getToken() {
        return WDAliyunService.getSercetKey();
    }

    createClient(token) {
        token = token || this.token;
        if (!token) return;
        this.client = new OSS.Wrapper({
            region: this.option.region,
            accessKeyId: token.AccessKeyId,
            accessKeySecret: token.AccessKeySecret,
            stsToken: token.SecurityToken,
            bucket: this.option.bucket
        });
    }

    clientPromise() {
        let promise = new Promise((resolve, reject) => {
            if (this.client) {
                resolve(this.client);
            } else {
                this.getToken().then(
                    (res) => {
                        this.createClient(res.Data);
                        resolve(this.client);
                    },
                    (err) => {
                        console.log(err);
                        reject('get token failed');
                    }
                );
            }
        });
        return promise;
    }

    // 单个文件上传，callback允许两个参数，成功是返回callback(res)，失败时返回callback(null,err)
    uploadFile(file, callback = (res, err) => null, path) {
        if (file == null || file == undefined || file.name == null || file.name == undefined) return;
        this.clientPromise().then((client) => {
            let yyyyMMdd = (new Date()).Format('yyyyMMdd');
            let newFileName = guid() + file.name.substr(file.name.lastIndexOf('.'));
            console.log(path);
            let filePath = path || `/biz/${yyyyMMdd}/`;
            client.multipartUpload(filePath + newFileName, file).then((res) => {
                if (!res.url && res.res && res.res.requestUrls) {
                    res.url = res.res.requestUrls[0];
                }
                console.log('aliyun update res', res);
                callback(res);
            }, (err) => {
                callback(null, err);
            });
        }, (err) => callback(null, err));
        return;
    }
}

export default AliyunOssUploader;