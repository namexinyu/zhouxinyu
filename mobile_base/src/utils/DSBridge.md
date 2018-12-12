
# 同步或异步调用RN方法
``` javascript

/**
 * 同步或异步调用RN方法
 * @param {*} method                        RN方法名称（可包含命名空间）
 * @param {*} arg                           参数，JSON对象
 * @param {*} callback(string returnValue)  仅在异步情况下使用。returnValue是RN方法返回值  
 */
import dsBridge from 'dsbridge';
dsBridge.call(method, [arg, callback]);

```

# JS注册方法（或命名空间）供RN调用
``` javascript
/**
 * JS注册方法（或命名空间）供RN调用
 */

/**
 * JS注册方法供RN调用
 */
import dsBridge from 'dsbridge';
dsBridge.register(methodName | namespace, function| synApiObject);
dsBridge.register('addValue', function (l, r) {
    return l + r;
});

dsBridge.registerAsyn(methodName | namespace, function| asyApiObject);
dsBridge.registerAsyn('append', function (arg1, arg2, arg3, responseCallback) {
    responseCallback(arg1 + " " + arg2 + " " + arg3);
});

/**
 * JS注册命名空间供RN调用
 */

//namespace test for synchronous
dsBridge.register("test", {
    tag: "test",
    test1: function () {
        return this.tag + "1"
    },
    test2: function () {
        return this.tag + "2"
    }
});

//namespace test1 for asynchronous calls  
dsBridge.registerAsyn("test1", {
    tag: "test1",
    test1: function (responseCallback) {
        return responseCallback(this.tag + "1")
    },
    test2: function (responseCallback) {
        return responseCallback(this.tag + "2")
    }
});

```