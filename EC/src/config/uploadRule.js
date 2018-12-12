import oss from 'CONFIG/ossConfig';
let uploadRule = {
    // 企业认证信息
    ec: {
        bucket: oss.bucket_private,
        path: '/ent/cert/'
    },
    // 企业素材信息
    entMaterialPicture: {
        bucket: oss.bucket_public,
        path: '/ent/material/'
    }
};

export default uploadRule;