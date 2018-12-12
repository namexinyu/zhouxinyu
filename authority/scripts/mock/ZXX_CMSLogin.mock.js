let IsNeedCreate = 0;

module.exports = [{
    path: '/WDGP_Authority/WDGP_AUTH_Login',
    method: 'post',
    response: (req, res) => {
        IsNeedCreate = Math.abs(IsNeedCreate - 1);
        return {
            "Code": 0,
            "Desc": "成功",
            "Data": {
                "EmployeeID": "100009",
                "EnName": "EnName",
                "Token": "n2BKxfm96Z4YbmHqo0HUmXHFc5DefEjD3c4x0PJIFdQ=",
                "TokenExpireTimeStamp": 1529305036
            }
        };
    }
}];