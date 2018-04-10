import { debounce } from '../consts/Utils';
import { AutoComplete, Spin } from '../components/AntdComp';
const Option = AutoComplete.Option;
let { observable, action, computed, runInAction, createTransformer } = mobx;

export default class AutoSelectStore {
    @observable.shallow selectList = [];
    @observable loading = false;
    
    dropdownMatchSelectWidth = false;
    filterOption = false;
    style = { width: '100%' };
    className = "base-autocomplete";
    keyName = "";
    displayName = [];
    format = "{0}[{1}]";

    @action
    setList(list) {
        this.selectList = list || [];
    }

    @action.bound
    updateSelectList(json) {
        if (json.status === 2000) {
            this.setList(json.data.list);
        };
        this.loading = false;
        return json;
    }
    @computed
    get dataSource() {
        return this.loading ?
            [<Option key="loading" value="loading" disabled={true}><Spin size="small"></Spin></Option>]
            :
            this.selectList.slice().map((item, index) => <Option
                key={String(item[this.keyName])}
                data={item}
                {...this.getOptionProps(item) }
            >
                {
                    this.getOption(item,index)
                }
            </Option>
        )
    }

    getOptionProps() { }
    getOption(item, index) {
        let displayItem = this.displayName.map(key => item[key]);
        return this.format.format(displayItem)
    }

    constructor() {
        this.transformer = createTransformer((store) => ({
            dropdownMatchSelectWidth: store.dropdownMatchSelectWidth,
            filterOption: store.filterOption,
            style: store.style,
            className: store.className,
            keyName: store.keyName,
            dataSource: store.dataSource,
        }));
    }

    get Props() {
        return this.transformer(this);
    }

}

