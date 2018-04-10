import SelectStore from "../../../base/stores/SelectStore";
import { WarehouseFetch } from "../../consts/WareHouseUrls";
let { observable, action, computed, runInAction, toJS } = mobx;
import { Select } from '../../../base/components/AntdComp';
const Option = Select.Option;
// 仓库modal -- 公共
export class WareHouseStore {
    title = '新建仓库';
    curModal = 'add';
    @observable loading = false;
    @observable visible = false;

    initialData = {
        id: '',
        stockCode: '',
        stockName: '',
        siteCode: '',
        headCode: '',
        addressCode: '',
        remark: ''
    }

    @observable stockDetails = { ...this.initialData }

    @action
    resetStockDetails = () => {
        this.stockDetails = { ...this.initialData }
    }

    @computed get getDetail() {
        return this.stockDetails;
    }

    @action
    setDetail = (val) => {
        this.stockDetails = Object.assign({}, this.stockDetails, val);
    }

    @action
    changeVisible = (bool) => {
        this.visible = bool;
    }

}



// 新增仓库modal store
export class AddWareHouseStore extends WareHouseStore {
    constructor() {
        super();
        this.sitestore = new SiteStore(); // 所属站点
        this.memberstore = new MemberStore(); // 负责人
        this.addrliststore = new AddrStore(this); // 地址
        this.newaddrstore = new NewAddrStore() // 新建地址modal
    }

    // 选择站点 联动地址
    changeAddrBySite = (value) => {
        this.sitestore.selectList.map(item => {
            if (item.siteCode == value) {
                let newAddr = { addressCode: item.addressCode }   // 地址编码  要改
                this.setDetail(newAddr);
                return;
            }
        })
    }

    // 保存新建仓库
    saveStock = () => {
        let pm = this.stockDetails;
        delete pm.id;   // 新建 id是空的
        runInAction(() => this.loading = true)
        return WarehouseFetch.addStock(pm);
    }
}

// 所属站点 select store
export class SiteStore extends SelectStore {
    keyName = 'siteCode';
    labelName = 'siteName';

    @action
    fetchSelectList(pm = {}) {
        pm.status = 1;
        return WarehouseFetch.getAll(pm)
            .then(this.updateSelectList);
    }
}

// 负责人  select store
export class MemberStore extends SelectStore {
    keyName = 'empCode';
    labelName = 'empName';

    @action
    fetchSelectList(pm = {}) {
        return WarehouseFetch.getPrincipalList(pm)
            .then(this.updateSelectList);
    }
}

// 地址列表  addr store
export class AddrStore extends SelectStore {
    constructor(pstore) {
        super();
        this.pstore = pstore;
    }
    keyName = 'addressCode';
    labelName = 'addressName';

    @action
    fetchSelectList(pm = {}) {
        pm.status = 1;
        return WarehouseFetch.getAddrList(pm)
            .then(this.updateSelectList)
    }

    // 选择地址
    addrChange = (value) => {
        let newAddr = { addressCode: value }
        this.pstore.setDetail(newAddr)
    }

    @computed
    get options() {
        return this.selectList.slice().map((item, index) => <Option
            key={index}
            value={item[this.keyName]}
        >
            {
                `[${item.addressName}] ${item.addressDetl}`
            }
        </Option>
        )
    }

}

export class NewAddrStore {
    @observable loading = false;
    @observable visible = false;

    initial = {
        addressDetl: '',
        addressName: '',
        cityCode: '',
        coordinate: '',
        countryCode: '',
        countyCode: '',
        isBil: 0,
        isMag: 0,
        isOfe: 0,
        isReg: 0,
        isRep: 0,
        isSog: 0,
        isVisible: 0,
        provinceCode: '',
        status: 1,
    }

    @observable detailsInfo = { ...this.initial }

    @action
    resetDetailsInfo = () => {
        this.detailsInfo = { ...this.initial }
    }

    @computed get getDetail() {
        return this.detailsInfo;
    }

    @action
    setDetailsInfo = (data) => {
        this.detailsInfo = Object.assign({}, this.detailsInfo, data);
    }

    addNewAddr = (data) => {
        return WarehouseFetch.addNewAddr(data);
    }
}


let addwarehousestore = new AddWareHouseStore();
export { addwarehousestore }