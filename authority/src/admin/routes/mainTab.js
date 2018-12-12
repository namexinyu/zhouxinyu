import systemManager from './systemManager';

export default function () {
    return {
        path: '/',
        indexPage: { // 首页，
            path: '/system/woda/role/pt'
        },
        children: [
            ...systemManager
        ],
        onLastClose: { // 有些特殊页面，当最后一个关闭，需要跳转到指定页面
        }
    };
};