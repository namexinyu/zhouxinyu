import OSS from 'ali-oss';
import WDAliyunService from 'SERVICE/AliyunService';
import guid from 'UTIL/uuid/uuid';
import ossConfig from 'CONFIG/ossConfig';

const CONFIG = {
    REGION: 'oss-cn-shanghai',
    PUBLIC_BUCKET: ossConfig.bucket_public,
    PRIVATE_BUCKET: ossConfig.bucket_private
};


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
                    (token) => {
                        this.createClient(token);
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

    upload(fileArr, callback = () => null) {
        if (Object.prototype.toString.call(fileArr) !== '[object Array]') fileArr = [fileArr];
        console.log('fileArr', fileArr[0]);
        let uploadRes = {resultList: [], dealNum: 0, successNum: 0, failNum: 0, message: ''};
        this.clientPromise().then((client) => {
            let yyyyMMdd = (new Date()).Format('yyyyMMdd');
            for (let index in fileArr) {
                let file = fileArr[index];
                let newFileName = guid() + file.name.substr(file.name.lastIndexOf('.'));
                client.multipartUpload(`Broker/${yyyyMMdd}/${newFileName}`, file).then((res) => {
                    ++uploadRes.successNum;
                    ++uploadRes.dealNum;
                    // 临时用于填充原res结构中的url位置
                    if (!res.url && res.res && res.res.requestUrls) {
                        res.url = res.res.requestUrls[0];
                    }
                    uploadRes.resultList.push(res);
                    if (uploadRes.dealNum == fileArr.length) callback(uploadRes);
                    console.log(res);
                }, (err) => {
                    ++uploadRes.failNum;
                    ++uploadRes.dealNum;
                    if (uploadRes.dealNum == fileArr.length) callback(uploadRes);
                    console.log(err);
                });
            }
        }, (err) => (Object.assign(uploadRes, {message: err})));
        return;
    }

    // 单个文件上传，callback允许两个参数，成功是返回callback(res)，失败时返回callback(null,err)
    uploadFile(file, callback = (res, err) => null, path) {
        if (file == null || file == undefined || file.name == null || file.name == undefined) return;
        this.clientPromise().then((client) => {
            let yyyyMMdd = (new Date()).Format('yyyyMMdd');
            let newFileName = guid() + file.name.substr(file.name.lastIndexOf('.'));
            console.log(path);
            let filePath = path || `/Finance/${yyyyMMdd}/`;
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