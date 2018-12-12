const loadBaiduMap = () => (
    new Promise((resolve, reject) => {
        if (!window.BMap) {
            let mapScript = document.createElement('script');
            mapScript.src = '//api.map.baidu.com/api?v=2.0&ak=utIIkRnygE6N0jTrsWNjksjVATGh4KrX&callback=init';
            mapScript.type = 'text/javascript';
            document.body.appendChild(mapScript);

            let timeOut = 30;
            let clockID = setInterval(() => {
                if (timeOut < 0 && !window.BMap) {
                    reject(new Error('加载百度地图API超时！'));
                } else {
                    if (!window.BMap) {
                        timeOut--;
                    } else {
                        clearInterval(clockID);
                        resolve();
                    }
                }
            }, 1000);
        } else {
            resolve();
        }
    })
);

const getPosition = () => (
    new Promise((resolve, reject) => {
        let BMap = window.BMap;
        if (BMap == undefined) {
            reject(new Error('加载百度地图API失败，刷新页面重试!'));
        } else {
            let geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition((r) => {
                let geoStatus = geolocation.getStatus();
                if (geoStatus == window.BMAP_STATUS_SUCCESS) {
                    resolve(r.point);
                } else {
                    let geoStatusMap = {
                        0: '检索成功',
                        1: '城市列表',
                        2: '位置结果未知',
                        3: '导航结果未知',
                        4: '非法密钥',
                        5: '非法请求',
                        6: '没有权限',
                        7: '服务不可用',
                        8: '超时'
                    };
                    reject(new Error(geoStatusMap[geoStatus]));
                }
            }, { enableHighAccuracy: true, maximumAge: 0, timeout: 30000 });
        }
    })
);

const getAddress = (point) => (
    new Promise((resolve, reject) => {
        let BMap = window.BMap;
        if (BMap == undefined) {
            reject(new Error('加载百度地图API失败，刷新页面重试!'));
        } else {
            let geoc = new BMap.Geocoder();
            geoc.getLocation(point, (res) => {
                if (res == null) {
                    reject(new Error('获取地址信息失败！'));
                } else {
                    resolve(res.address);
                }
            });
        }
    })
);

const getCurrentAddress = async () => {
    try {
        await loadBaiduMap();
        let point = await getPosition();
        let address = await getAddress(point);
        return {
            point,
            address
        };
    } catch (err) {
        return err;
    }
};

export {
    loadBaiduMap,
    getPosition,
    getAddress,
    getCurrentAddress
};