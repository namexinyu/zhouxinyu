import oss from 'CONFIG/ossConfig';
let uploadRule = {
    // 企业认证信息
    entCertPicture: {
        bucket: oss.bucket_private,
        path: '/web/ent/cert/'
    },
    // 企业素材信息
    entMaterialPicture: {
        bucket: oss.bucket_public,
        path: '/web/ent/material/'
    },
    // 大老板认证信息
    laborBossCertPicture: {
        bucket: oss.bucket_private,
        path: '/web/laborBoss/cert/'
    },
    // 劳务面试名单、结算名单
    laborNameList: {
        bucket: oss.bucket_private,
        path: '/web/labor/nameList/'
    },
    // 劳务公司资质
    companyCertPicture: {
        bucket: oss.bucket_private,
        path: '/web/laborCompany/cert/'
    },
    // 劳务公司logo
    companyLogo: {
        bucket: oss.bucket_public,
        path: '/web/laborCompany/logo/'
    },
    // 审核样例
    auditExamplePic: {
        bucket: oss.bucket_public,
        path: '/web/auditExample/'
    },
    // 银行卡
    bankCardPic: {
        bucket: oss.bucket_private
    },
    // 身份证
    idCardPic: {
        bucket: oss.bucket_private
    },
    // 工牌
    workerCardPic: {
        bucket: oss.bucket_private
    },
    // 考勤
    attendancePic: {
        bucket: oss.bucket_private
    }
};

export default uploadRule;