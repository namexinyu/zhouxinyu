# 单元测试

单元测试框架采用mocha + chai + sinon + enzyme + jsDom构建。

mocha: 流行的前端测试框架 [GitHub](https://github.com/mochajs/mocha)

chai: 提供了良好封装的断言 [GitHub](https://github.com/chaijs/chai)

sinon: 提供了包括接口在内mock [GitHub](https://github.com/sinonjs/sinon)

enzyme: 根据react官方测试工具封装，测试react-dom [GitHub](https://github.com/airbnb/enzyme)

jsdom: 模拟浏览器的dom环境 [GitHub](https://github.com/tmpvar/jsdom)

后续可能会添加 [istanbul](https://github.com/gotwarlost/istanbul) 的支持

# 如何使用

## Step 1: 编写测试用例

根据产品需求和程序逻辑，编写测试用例文件放在 ```test```目录下。编写方法参见下文

## Step 2: 执行测试
``` shell
npm run test
```

## Step 3: 查看测试结果

查看用例中那一部分执行错误。如果一眼望去，全是绿色的√，恭喜你！测试通过啦！

# 编写测试用例

（正在筹备中......）
