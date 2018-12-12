import moment from 'moment';

const DataTransfer = {
    phone: (telStr) => {
        if (telStr && telStr.length >= 11) {
            return telStr.substr(0, 3) + '****' + telStr.substr(7);
        }
        return telStr || '';
    },
    date: (dateStr, format = 'd') => {
        if (dateStr && moment(dateStr).isValid()) {
            let f_f = 'YYYY-MM-DD';
            switch (format) {
                case 'd':
                    f_f = 'YYYY-MM-DD';
                    break;
                case 'h':
                    f_f = 'YYYY-MM-DD HH';
                    break;
                case 'm':
                    f_f = 'YYYY-MM-DD HH:mm';
                    break;
                case 's':
                    f_f = 'YYYY-MM-DD HH:mm:ss';
                    break;
                default:
                    f_f = 'YYYY-MM-DD';
            }
            return moment(dateStr).format(f_f);
        }
        return dateStr || '';
    }
};

const paramTransfer = {
    releaseFormValue: (formObj) => {
        const obj = {};
        for (const k of Object.keys(formObj)) {
            obj[k] = formObj[k].value;
        }
        return obj;
    }
};

export {DataTransfer, paramTransfer};