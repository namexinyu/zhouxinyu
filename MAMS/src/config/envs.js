const envs = {
    production: {
        aliyun_api: 'http://wd.a.wodedagong.com',
        api_url: 'http://wd.a.wodedagong.com',
        mams_url: 'http://b.wodedagong.com'
    },
    beta: {
        aliyun_api: 'http://101.132.163.225',
        api_url: 'http://101.132.163.225',
        mams_url: 'http://101.132.163.225:8090'
    },
    alpha: {
        aliyun_api: 'http://139.224.170.14',
        api_url: 'http://139.224.170.14',
        // api_url: 'http://101.132.163.216',
        mams_url: 'http://139.224.170.14:8090'
    },
    test: {
        aliyun_api: 'http://139.224.170.14',
        api_url: 'http://192.168.199.134',
        mams_url: 'http://192.168.199.135:8090'
    },
    dev: {
        aliyun_api: 'http://139.224.170.14',
        api_url: 'http://139.224.170.14',
        // api_url: 'https://yapi.nmirage.cc/mock/30',
        mams_url: 'http://localhost:9099'
    },
    sit: {
        aliyun_api: 'http://106.14.200.76',
        api_url: 'http://106.14.200.76',
        mams_url: 'http://106.14.200.76:8090'
    },
    uat: {
        aliyun_api: 'http://139.196.72.249',
        api_url: 'http://139.196.72.249',
        mams_url: 'http://139.196.72.249:8090'
    }
};
let env;
if (__DEV__) {
    env = envs.dev;
}
if (__ALPHA__) {
    // env = envs.alpha;
    let tempEnvName = 'mams_temp_env';
    let tempEnv = JSON.parse(window.localStorage.getItem(tempEnvName) || '{}');
    window.envDebug = {
        open: function () {
            let j = JSON.parse(window.localStorage.getItem(tempEnvName) || '{}');
            j.debug = true;
            window.localStorage.setItem(tempEnvName, JSON.stringify(j));
            console.warn('----------------------------------------\nEnvDebug: true\n----------------------------------------');
            window.location.href = window.location.href;
        },
        close: function () {
            let j = JSON.parse(window.localStorage.getItem(tempEnvName) || '{}');
            j.debug = false;
            window.localStorage.setItem(tempEnvName, JSON.stringify(j));
            console.warn('----------------------------------------\nEnvDebug: false\n----------------------------------------');
            window.location.href = window.location.href;
        },
        setVariables: function (value) {
            let j = JSON.parse(window.localStorage.getItem(tempEnvName) || '{}');
            j.variables = value;
            window.localStorage.setItem(tempEnvName, JSON.stringify(j));
            console.warn('----------------------------------------\nEnvDebug: true, 您修改了环境变量\n----------------------------------------');
            window.location.href = window.location.href;
        }
    };
    if (tempEnv && tempEnv.debug) {
        if (tempEnv.variables && Object.keys(tempEnv.variables).length) {
            console.warn('----------------------------------------\nEnvDebug: true\n----------------------------------------');
            env = tempEnv.variables;
        } else {
            console.warn('----------------------------------------\nEnvDebug: true, 您已经开启了debug模式，但是没有设置环境变量\n----------------------------------------');
            env = envs.alpha;
        }
    } else {
        env = envs.alpha;
    }
}
if (__TEST__) {
    env = envs.test;
}
if (__BETA__) {
    env = envs.beta;
}
if (__PROD__) {
    env = envs.production;
}
if (__SIT__) {
    env = envs.sit;
}
if (__UAT__) {
    env = envs.uat;
}

window.envs = envs;
window.env = env;
export default env;
