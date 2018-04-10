let { observable, action, computed, runInAction, toJS } = mobx;

import {SiteStore} from '../../data/DropDownStore';

//调入仓库树
export class InSiteStore extends SiteStore {
    style = {

    };
    constructor(props){
        super(props);
    };

    @observable newArr = [];

    disabledNode(item) {
        return item.attribute.isStock == 0;
    };

    @action
    setListSelf = () => {
        let data = this.selectList.slice(),
            key = this.keyName,
            name = this.LabelName;
        let loop = data => data.map((item) => {
            item.key = item[key] + '';
            item.value = item[key] + '';
            item.label = item[name];
            delete item.disabled;
            if (item.children) loop(item.children);
            return item;
        });
        this.setList(loop(data));
    }
}


export default new InSiteStore();