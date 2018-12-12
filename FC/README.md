# Multi-application Manage System (MAMS)

## 使用说明

### Step1 克隆/下载代码
使用git工具克隆或下载代码到指定目录

### Step2 安装node依赖
``` shell
npm install
```
或者用阿里的npm
``` shell
cnpm install
```
因为项目可能会涉及到 sass 的编译，而 node-sass 的依赖包下载可能会被墙。建议先安装阿里
### *Step for React or PReact*
参照

``` javascript
// 如果要使用react，请将usePreact设置为false。默认根据package.json中是否有preact-compat进行判断
var usePreact = !!require("../package.json").dependencies['preact-compat'];
// var usePreact = false;
```

### Step3 配置你的应用信息
* 打开```build/common.js```
* 修改你的```DEPLOY_SERVICE_PATH``` (服务器相对根目录的发布地址，例如:/doctor) 和 ```APP_ID``` (应用的ID，通常来说指定后不再改变)

### Step4 运行
``` shell
npm run start
```
访问```http://localhost:9094``` 即可看到应用

## 编码规范

### react-redux 项目规范

#### 代码风格

* 采用Visual Studio Code自带的format工具, Visual Studio Code版本大于1.3.1。或者采用webstrom
* 代码缩进采用4个空格

#### 语法规范

* 严格使用ES6语法规范
* 每个js文件只包含一个React组件
* 组件名称和文件名称一致，采用驼峰命名，开头字母必须大写
* 组件申明不要使用displayName方法
``` javascript
// bad
export default {
  // your code
}
// good
const c = {
  // your code
}
export default c;
```

* 变量采用驼峰命名，开头字母必须小写。除了方法内变量允许以 ```_``` 开头外，其他一律不允许
* js/jsx中的字符串引号使用，强制使用单引号。html中属性强制使用双引号
``` javascript
// js
let str = 'abc';
// jsx
render() {
  return (
    <div>
      <input type="text" id="input">
      {this.state.type === 'wellcome' && <p classNmae="hello-style">ok, wellcome</p>}
    </div>
  )
}
```

* 使用React.PureComponent
* Component中按照生命周期来排列代码
``` javascript
calss Example extends React.PureComponent{
  // ------------START----------------
  // 在END结束前的这一些方法，必须根据现有的顺序书写，方便代码逻辑查看
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    // 
  }
  componentDidMount() {
    //
  }
  componentWillReceiveProps() {
    //
  }
  componentWillUpdate() {
    //
  }
  componentDidUpdate() {
    //
  }
  // ······
  //------------ END -----------------
  // END之后再定义自己的操作方法
  handleA() {
    //
  }
  handleB() {
    //
  }
  // ······
}
```

* 针对jsx中事件方法的命名
``` javascript
// onClick
handleClick***() {}
// onFocus
handleFocus***() {}
// onBlur
handleBlur***() {}
// onChange
handleChange***() {}
```

* 代码中禁止出现以数字命名的方法```function method1(){}``` , ```function method2(){}``` ……

### 资源引入
* 在js代码中，使用下面方式引入图片路径
``` javascript
import myImg from 'IMAGE/myimg.jpg';
// in jsx code
<img src={myImg}/>
```

* 在css样式中，使用相对路径。因为css样式必然在assets目录中，images文件夹也在assets目录中，故采用相对路径即可。webpack默认会转化路径

## 样式定义
* 所有样式命名采用蛇形命名法，所有字母小写。如```.sub-main-class```
* 每个页面单独添加页面样式的命名空间（类似页面可以共享一个命名空间）。如```.login-page```。避免和公有样式造成冲突
* 尽量使用公有样式，减少自定义样式
* 根据视觉规范，每个项目的主题样式定义在 ```scss/theme/XXX-theme/```目录下，主要是variables.
* 常用公共样式写在 ```scss/theme/``` 目录下，主要包括normalize, button, cell, layout等项目中使用频繁的公共样式
* 项目中组件（指的不是react组件，react概念中整个项目都是组件）样式书写在 ```scss/theme/component/``` 目录下，例如dialog, datepicker, tab等，不同项目有自定义风格，且在一个项目中有共通之处的组件。关于组件的定义，请@方柏蜃@何源海
* 所有页面样式写在 ```src/assets/scss/pages/``` 目录下，并与项目目录结构保持一致

## react + redux 的书写规范
* action，reducer, store, route, views, service 根据项目树形结构保持目录结构一致，例如路径文件夹命名都为 Document, 相关的内容写在该目录下。
* 一个action必须为一个文件，且每个action的事务必须保持单例。如：请求列表数据，根据列表数据数量显示不同内容或样式。这里应该是2个action或者只有一个请求列表数据的action，显示不同内容应该在render里面处理
* views中的树结构应该和routes中的结构一致。对应页面的组成部分（react component）可以放在对应模块的blocks下面。
* 所有的component function 采用createPureComponent()方法创建。

