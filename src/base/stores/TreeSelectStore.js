import { Select } from '../components/AntdComp';
const Option = Select.Option;
let { observable, action, computed, runInAction, createTransformer } = mobx;


export default class TreeSelectStore {
    @observable loading = false;
    @observable.shallow selectList = [];
    @observable.shallow treeData = [];

    style = {
        width: 200,
    };
    className = "base-tree-select";
    dropdownStyle = {
        overflow: 'auto', maxHeight: 400
    };
    dropdownClassName = "";
    keyName = "";
    labelName = "";
    treeDefaultExpandAll = true;



    multiple = false;
    size = "default"; //'large' | 'small'
    allowClear = false;
    disabled = false;
    filterOption = true;
    labelInValue = false;
    defaultActiveFirstOption = true;
    treeCheckable = false;
    disabledNode(item) { return false };



    @action
    setList(list) {
        this.selectList = list || [];
        this.treeData = this.buildTree();
    }

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data);
        };
        this.loading = !this.loading;
        return json;
    }
    @action.bound
    buildTree() {
        let data = this.selectList,
            key = this.keyName,
            name = this.LabelName,
            disabledNode = this.disabledNode;

        if (Array.isArray(data.slice())) {
            let loop = data => data.slice().map((item) => {
                item.key = item[key] + '';
                item.value = item[key] + '';
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

    getItem(pos) {
        pos = pos.split('-');//[0,0,1]
        let list = this.selectList.slice();
        let node;
        for (let i = 1; i < pos.length; i++) {
            node = list[pos[i]];
            if (node.children) list = node.children;
        }
        return node;
    }

    constructor() {
        this.transformer = createTransformer((store) => ({
            size: store.size,
            multiple: store.multiple,
            style: store.style,
            className: store.className,
            dropdownStyle: store.dropdownStyle,
            dropdownClassName: store.dropdownClassName,
            allowClear: store.allowClear,
            disabled: store.disabled,
            filterOption: store.filterOption,
            defaultActiveFirstOption: store.defaultActiveFirstOption,
            labelInValue: store.labelInValue,
            placeholder: store.placeholder,
            treeData: store.treeData.slice(),
            treeDefaultExpandAll: store.treeDefaultExpandAll,
            treeCheckable: store.treeCheckable,
        }));
    }

    get Props() {
        return this.transformer(this);
    }
}
