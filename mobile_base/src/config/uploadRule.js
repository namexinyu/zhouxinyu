import oss from 'CONFIG/ossConfig';

let uploadRule = {
	pic1: {
		bucket: oss.bucketPrivate,
		path: '/zxx/IDCard/'
	}
};
export default uploadRule;