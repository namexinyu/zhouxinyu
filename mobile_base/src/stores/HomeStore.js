import { observable, action } from 'mobx';

export default class {
    @observable homeData = {};

    @action.bound
    setData = async () => {
        this.homeData = {
            key: 'value'
        };
    }
}