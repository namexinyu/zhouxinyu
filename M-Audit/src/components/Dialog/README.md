# Dialog组件使用方式

## 打开弹窗

```javascript

import openDialog from 'ACTION/Dialog/openDialog';
 openDialog({
    id: '自定义ID',            // 【必填】自定义ID，同一个页面不要重复（type:spinner时可以重复，程序会自动判断）
    type: 'confirm',        // 【必填】弹窗类型，spinner, alert, confirm, toast
    title: '我了个去',      // 【必填】标题内容，默认：温馨提示
    message: '自定义内容',    // 【必填】自定义内容
    cancelText: '取消按钮文字', // 【非必填】默认：取消
    okText: '确认按钮文字',       // 【非必填】默认：确定
    theme: 'danger',        // 【非必填】样式主题，danger, success, info, warning
    titleTheme: 'className',   // 【非必填】自定义标题样式名
    cancelBtnTheme: 'className', // 【非必填】自定义取消按钮样式名
    okBtnTheme: 'className',     // 【非必填】自定义确定按钮样式名
    beforeCloseCall: function(type){}, // 【非必填】定义关闭前动作，如果return false，则弹窗不会关闭。
                                        // type：cancel | ok | auto 分别对应点击了取消，确定，自动关闭
    afterCloseCall: function(type){}, // 【非必填】定义关闭后动作
                                        // type: cancel | ok | auto 分别对应点击了取消，确定，自动关闭
    autoClose: 3    // 【非必填】【Number类型】【单位：秒】定义弹窗是否自动关闭，默认toast弹窗2秒关闭。其他弹窗不自动关闭
});

```

## 关闭弹窗

```javascript
import closeDialog from 'ACTION/Dialog/openDialog';
closeDialog(id, delayTime);   // id【必填】,对应openDialog的ID
                            // timeout【选填】【单位：秒】延迟关闭时间
```