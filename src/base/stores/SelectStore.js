import { debounce } from '../consts/Utils';
import { Select } from '../components/AntdComp';
const Option = Select.Option;
let { observable, action, computed, runInAction, createTransformer } = mobx;

export default class SelectStore {
    @observable loading = false;
    @observable.shallow selectList = [];

    style = {
        width: '100%'
    };
    className = "base-select";
    dropdownStyle = {};
    dropdownClassName = "";
    keyName = "";
    labelName = "";
    mode = "";  //'multiple' | 'tags' | 'combobox'
    size = "default"; //'large' | 'small'
    tokenSeparators = [','];
    allowClear = false;
    disabled = false;
    filterOption = true;
    labelInValue = false;
    defaultActiveFirstOption = true;

    @action
    setList(list) {
        this.selectList = list || [];
    }

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data.list);
        };
        this.loading = !this.loading;
        return json;
    }

    @computed
    get options() {
        return this.selectList.slice().map((item, index) => <Option
                key={index}
                value={item[this.keyName]+''}
            >
                {
                    this.getOption(item,index)
                }
            </Option>
        )
    }

    getOption(item, index) {
        return item[this.labelName];
    }

    getLabelName(value) {
        let selectList = this.selectList.slice();
        if (selectList.length > 0) {
            selectList.forEach(item => {
                if (item[this.keyName] === value) {
                    value = item[this.labelName];
                }
            })
        }
        return value;
    }

    constructor() {
        this.transformer = createTransformer((store) => ({
            size: store.size,
            mode: store.mode,
            style: store.style,
            className: store.className,
            dropdownStyle: store.dropdownStyle,
            dropdownClassName: store.dropdownClassName,
            allowClear: store.allowClear,
            disabled: store.disabled,
            filterOption: store.filterOption,
            defaultActiveFirstOption: store.defaultActiveFirstOption,
            labelInValue: store.labelInValue,
            tokenSeparators: store.tokenSeparators,
            placeholder: store.placeholder,
        }));
    }

    get Props() {
        return this.transformer(this);
    }
}

//example 
//value must be string

{/* 
<Select
    SelectStore.Props
>
    { SelectStore.options }
</Select>
*/}