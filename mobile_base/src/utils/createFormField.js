import { createFormField as cff } from 'rc-form';

export default function createFormField(fields, withValue) {
    return Object.entries(fields || {}).reduce((pre, cur) => {
        pre[cur[0]] = cff(withValue ? cur[1] : { value: cur[1] });
        return pre;
    }, {});
}