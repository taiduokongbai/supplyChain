import TableStore from '../../../base/stores/TableStore';
import { PurRecFetch } from '../../consts/PurRecUrls';

let { observable, action, computed, runInAction, toJS } = mobx;

export class PurRecNoticeViewStore extends TableStore {
    @observable detail = {};
    @action
    fetchList(pm) {
        this.loading = true;
        return PurRecFetch.purRecNoticeDetail(pm)
            .then(json => {
                if (json.status == 2000) {
                    this.detail = json.data;
                }
                return json;
            })
            .then(this.updateTableList);
    }
    fetchPushDown(pm) {
        this.loading = true;
        return PurRecFetch.purRecNoticePush(pm).then((json) => {
            this.loading = false;
            return json;
        });
    }
};
let purRecNoticeViewStore = new PurRecNoticeViewStore();


export { purRecNoticeViewStore };