import { store } from '../../data/StoreConfig';
import TableStore from '../../../base/stores/TableStore';
import { AllotFetch } from '../../consts/InventoryUrls';
import TabsAct from '../../actions/TabsAct';
import { allotListStore } from './AllotListStore'

let { observable, action, computed, runInAction, toJS } = mobx;

class AllotDetailsStore {
@observable info = {};
    @observable outRecord = [];
    @observable inRecord = [];
    @observable loading = true;

    @action
    setLoading = (allotOrderCode) => {
        this.loading = true;
        Promise.all([
            this.getAllotDetails({allotOrderCode:allotOrderCode}),
            allotDetailsTableStore.fetchTableList({allotOrderCode:allotOrderCode,page:1,pageSize:15}),
            this.getAllotOutRecord({allotOrderCode:allotOrderCode}),
            this.getAllotInRecord({allotOrderCode:allotOrderCode})
        ]).then(values => {
            runInAction(() => {
                this.loading = false
            })
        }, reason => {
            runInAction(() => {
                this.loading = false
            })
        });
    };

    //获取订单详情-基本信息
    @action
    getAllotDetails = (pm) => {
        AllotFetch.getAllotDetails(pm)
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.info = json.data;
                    })
                }
            })
    };

    //获取订单详情-调出记录
    @action
    getAllotOutRecord = (pm) => {
        AllotFetch.getAllotDetailsOutRecord(pm)
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.outRecord = json.data.list;
                    })
                }
            })
    };

    //获取订单详情-调入记录
    @action
    getAllotInRecord = (pm) => {
        AllotFetch.getAllotDetailsInRecord(pm)
            .then(json => {
                if(json.status === 2000) {
                    runInAction(()=>{
                        this.inRecord = json.data.list;
                    })
                }
            })
    };

    callback = () => {
        store.dispatch(TabsAct.TabRemove("inventoryAllotDetails", "inventoryAllotList"));
        store.dispatch(TabsAct.TabAdd({
            title: "直接调拨单",
            key: "inventoryAllotList"
        }));
        allotListStore.fetchTableList({ page: 1,pageSize: 15});
    }
}

// 获取订单详情-明显列表
class AllotDetailsTableStore extends TableStore {
    pages = {
        page: 1,
        pageSize: 15
    };

    paging = {
        total: 0,
        current: 1,
        pageSize: 15,
    };
    pageSizeOptions = ['10', '15','20', '30', '50'];
    //改变状态
    @action
    fetchTableList(params) {
        this.loading = true;
        let pm = { ...this.pages,...params };
        return AllotFetch.getAllotDetailsList(pm)
            .then(this.updateTableList)
            .then(json => {
                return json
            });
    }
}

let allotDetailsStore = new AllotDetailsStore();
let allotDetailsTableStore = new AllotDetailsTableStore();
export { allotDetailsStore, allotDetailsTableStore }