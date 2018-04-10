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
        return item.attribute.isStock === 0;
    };

    @action.bound
    buildTree() {
        let data = this.selectList,
            key = this.keyName,
            name = this.LabelName,
            disabledNode = this.disabledNode;

        if (Array.isArray(data.slice())) {
            let loop = data => data.slice().map((item) => {
                item.key = item[key] + '';
                if(item.attribute.isStock === 1){
                    item.value = item.attribute.stockCode ?  `${item.attribute.stockCode}` :  "";
                }else {
                    item.value = `disable_${item[key]}`;
                }
                item.label = item[name];
                if (disabledNode(item)) {
                    item.disabled = true;
                }
                if (item.children) loop(item.children);
                return item;
            });
            return loop(data);
        } else {
            return []
        };
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


export  let siteStore = new InSiteStore()