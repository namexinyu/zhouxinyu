import Storage from 'UTIL/storage';

const ecStorage = Storage.sessionStorage('mams_ec_login_info');

export default {
    LOGIN_INFO_SESSION_STORAGE: ecStorage,
    getEmployeeID: () => ecStorage.getItem('employeeId')
};