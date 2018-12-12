import { observable, action } from 'mobx';

export default class {
    @observable globalData = {};

    @action.bound
    setData = async () => {
        this.globalData = {
            UserName: 'zhangsan'
        };
    }
}