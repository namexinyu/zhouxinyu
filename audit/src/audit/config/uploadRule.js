import oss from 'AUDIT_CONFIG/ossConfig';

let uploadRule = {
    weekWageImp: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/weeklyWageManager/import/'
    },
    monthWageImp: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/monthlyWageManager/import/'
    },
    // 劳务账户上传凭证
    labourCertificate: {
        bucket: oss.bucket_private,
        path: '/zhouxinxin/web/labourAccountManager/labourCertificate/'
    },
    resourceLogo: {
        bucket: oss.bucket_public,
        path: ' /zhouxinxin/web/resource/logo/'
	},
	// 身份证照片
	idCardPic: {
		bucket: oss.bucket_private,
		path: '/zhouxinxin/web/spAccountManager/fundAdujRequestCredence/'
	},
	// 银行卡照片
	bankCardPic: {
		bucket: oss.bucket_private,
		path: '/zhouxinxin/web/spAccountManager/fundAdujRequestCredence/'
	},
	// 工牌照片
	workCardPic: {
		bucket: oss.bucket_public,
		path: '/zhouxinxin/web/spAccountManager/fundAdujRequestCredence/'
	}
};
export default uploadRule;