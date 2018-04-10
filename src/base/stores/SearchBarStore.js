let { observable, action, computed, runInAction, toJS } = mobx;
import {EnumStore} from './EnumStore';

export default class SearchBarStore {
    constructor() {
        this.enumStore = new EnumStore();
    }
    //定义观察变量
    @observable loading=false;
    @observable searchKey='';
    @observable searchVal='';
    item;

    get Item() {
        return this.item;
    }
    @computed get Pm() {
        let _pm = {};
        _pm[this.searchKey] = this.searchVal;
        return _pm;
    }

    @action setLoading(value) {
        this.loading = value;
    }
    @action setSearchKey(key,item) {
        this.searchKey = key;
        this.searchVal = '';
        this.item = item;
    };
    @action setSearchVal(value) {
        if (value === "null") {
            value = null;
        }
        this.searchVal = value;
    };
};
