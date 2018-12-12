import AliSignature from './AliSignature';

let getClient = function (oss) {
    console.log('getClient', oss);
    return new Promise((resolve, reject) => {
        let client = new AliSignature().clientWrapper({
            bucket: oss.bucket,
            region: oss.region
        }).then((client) => {
            console.log('clientWrapper success', client);
            resolve(client);
        }, (error) => {
            console.log('clientWrapper error', error);
            reject(error);
        });
    });
};
export default getClient;