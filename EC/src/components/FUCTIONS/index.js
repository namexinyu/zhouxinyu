import {message} from 'antd';
export default {
    messageSuccess: (str) => {
        message.destroy();
        message.success(str);
    },
    messageError: (str) => {
        message.destroy();
        message.error(str);
    },
    forFor: (loopBody, key, term, callback, errorback) => { // 分别为循环体loopBody，当前循环的某个参数key，循环条件term，回调函数
        for (var i = 0; i < loopBody.length; i++) {
            if(term && loopBody[i][key] === term) {
                callback(i);
                break;
            }
        }
        if(errorback && i === loopBody.length) {
            errorback();
        }
    }
};