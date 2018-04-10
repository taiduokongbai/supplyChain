import TableStore from '../../../base/stores/TableStore';
import { SelfMadeInFetch } from '../../consts/SelfMadeInUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

export class SelfMadeInNoticeViewStore extends TableStore {
    @observable detail = {};
    @observable receiveLogList = [];

    @action fetchList(pm) {
        this.loading = true;
        return SelfMadeInFetch.selfMadeInDetail(pm)
            .then(json => {
                if (json.status == 2000) {
                    json.data.list = json.data.detailList;
                    this.detail = json.data;
                }
                return json;
            })
            .then(this.updateTableList);
    }

    @action fetchReceiveLogList(billCode) {
        this.loading = true;
        let pm = {
            operationType : 0,
            billType : 99,
            billCode 
        };
        return SelfMadeInFetch.receiveLog(pm)
            .then(json => {
                if (json.status == 2000) {
                    this.receiveLogList = json.data.list;
                }
                return json;
            })
    }

};
let selfMadeInViewStore = new SelfMadeInNoticeViewStore();


export { selfMadeInViewStore };