import AliSignature from './AliSignature';
let getClient = function (oss) {
    return new Promise((resolve, reject) => {
        let client = new AliSignature().clientWrapper({
            bucket: oss.bucket,
            region: oss.region,
            isPublic: oss.isPublic
        }).then((client) => {
            resolve(client);
        }, (error) => {
            reject(error);
        });
    });
};
export default getClient;