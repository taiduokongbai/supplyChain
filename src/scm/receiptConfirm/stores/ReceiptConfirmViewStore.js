import moment from "moment";
import ReceiptConfirmFetch from './ReceiptConfirmUrls';
let { observable, action, computed, runInAction, toJS } = mobx;

//收货确认单详情
export class ReceiptConfirmViewStore {
    @observable loading = false;
    @observable visible = false;
    detail = {};
    title = '费用明细';
    width = 620;
    className = "expense-detail-cont";
    expenseDetail = {};
    @action
    setVisible(value) {
        this.visible = value;
    }
    @action
    setExpenseDetail(value) {
        this.expenseDetail = value;
    }
    @action
    fetchReceiptConfirmDetail(pm) {
        this.loading = true;
        this.detail = {};
        return ReceiptConfirmFetch.receiptConfirmDetail(pm).then(json => {
            if (json.status === 2000) {
                runInAction(() => {
                    this.detail = { ...json.data };
                });
            };
            runInAction(() => {
                this.loading = false;
            })
            return json;
        })
    }
   
}
const receiptConfirmViewStore = new ReceiptConfirmViewStore();
export { receiptConfirmViewStore };