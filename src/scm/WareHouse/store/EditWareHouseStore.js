import SelectStore from "../../../base/stores/SelectStore";
import { WarehouseFetch } from "../../consts/WareHouseUrls";
import { WareHouseStore, SiteStore, MemberStore, AddrStore, NewAddrStore } from "./AddWareHouseStore";
let { observable, action, computed, runInAction, toJS } = mobx;

// 编辑仓库
export class EditWareHouseStore extends WareHouseStore {
    constructor() {
        super();
        this.sitestore = new SiteStore(); // 所属站点
        this.memberstore = new MemberStore(); // 负责人
        this.addrliststore = new AddrStore(this); // 地址
        this.newaddrstore = new NewAddrStore() // 新建地址modal
    }

    title = '编辑仓库';

    curModal = 'edit';

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
        runInAction(() => this.loading = true)
        return WarehouseFetch.editStock(pm);
    }

    // 获取仓库信息
    getStockInfo = (pm = {}) => {
        runInAction(() => {
            this.loading = true;
        })
        return WarehouseFetch.getStockInfo(pm).then(json => {
            if (json.status === 2000) {
                this.setDetail(json.data);
                this.sitestore.fetchSelectList();
                this.memberstore.fetchSelectList();
                this.addrliststore.fetchSelectList();
            }
            runInAction(() => {
                this.loading = false;
            })
        })
    }
}

let editwarehousestore = new EditWareHouseStore();
export { editwarehousestore };