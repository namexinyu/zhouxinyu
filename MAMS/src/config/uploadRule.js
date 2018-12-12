import oss from 'CONFIG/ossConfig';

let uploadRule = {
    // 企业认证信息
    entCertPicture: {
        bucket: oss.bucket_private,
        path: '/ent/cert/'
    },
    // 企业素材信息
    entMaterialPicture: {
        bucket: oss.bucket_public,
        path: '/ent/material/'
    },
    // 大老板认证信息
    laborBossCertPicture: {
        bucket: oss.bucket_private,
        path: '/laborBoss/cert/'
    },
    // 劳务面试名单、结算名单
    laborNameList: {
        bucket: oss.bucket_private,
        path: '/labor/nameList/'
    },
    // 劳务公司资质
    companyCertPicture: {
        bucket: oss.bucket_private,
        path: '/laborCompany/cert/'
    },
    // 劳务公司logo
    companyLogo: {
        bucket: oss.bucket_public,
        path: '/laborCompany/logo/'
    },
    // 厂门口接站身份证
    idCardPic: {
        bucket: oss.bucket_private,
        path: '/IdCard/'
    },
    // 部门委托
    assistancePicture: {
        bucket: oss.bucket_public,
        path: '/Assistance/'
    }
};

export default uploadRule;