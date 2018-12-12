import {Form} from 'antd';
import {isObservableArray, toJS} from 'mobx';

export default function createFormField(fields, withValue) {
    return Object.entries(fields || {}).reduce((pre, cur) => {
        pre[cur[0]] = Form.createFormField(withValue ? isObservableArray(cur[1].value) ? toJS(cur[1]) : cur[1] : {value: isObservableArray(cur[1]) ? toJS(cur[1]) : cur[1]});
        return pre;
    }, {});
}