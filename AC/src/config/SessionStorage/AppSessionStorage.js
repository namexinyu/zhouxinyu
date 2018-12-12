import Storage from 'UTIL/storage';

export default {
    LOGIN_INFO_SESSION_STORAGE: Storage.sessionStorage('mams_assistant_session_login_info'),
    DG_SESSION_STORAGE: Storage.sessionStorage('mams_assistant_dg'),
    ENUM_MAPPING_SESSION_STORAGE: Storage.sessionStorage('mams_assistant_session_enum_mapping')
};