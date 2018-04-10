import SelectStore from './SelectStore';
let { observable, action, computed, runInAction, toJS } = mobx;

//枚举值下拉
export class EnumStore extends SelectStore {
    keyName = 'catCode';
    labelName = 'catName';
    @observable selectList = [];

    setList(enumCode) {
        this.selectList = window.ENUM.getEnum(enumCode);
    }

    @action.bound
    getOptions(enumCode) {
        this.setList(enumCode);
        return this.options;
    }

    @action.bound
    getEnum(enumCode, value, key) {
        this.setList(enumCode);
        let selectList = this.selectList.slice();
        if (selectList.length > 0) {
            selectList.forEach(item => {
                if (item[this.keyName] == value) {
                    value = item[key || this.labelName];
                }
            })
        }
        return value;
    }
}
let enumStore = new EnumStore();
export { enumStore };

//example
//enumStore.getOptions('purchaseSourceOrderType')}