import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls';
import { PRE_RECEIPT_OPERATION, PRE_RECEIPT_AUTO_COMPLETE, PURCHASE_EIDT_TOP_REDU } from '../../consts/ActTypes';
import PurchaseEidtTopAct from './PurchaseEidtTopAct';
import { fromJS, toJS } from 'immutable';
import { message } from '../../../base/components/AntdComp'


const actions = {
    show: () => (dispatch, getState) => {
        let state = getState()[PRE_RECEIPT_OPERATION].set("visible", true);
        dispatch({ type: PRE_RECEIPT_OPERATION, state });
    },
    hide: () => (dispatch, getState) => {
        let state = getState()[PRE_RECEIPT_OPERATION].set("visible", false);
        dispatch({ type: PRE_RECEIPT_OPERATION, state });
    },
    setLoading: (bool) => (dispatch, getState) => {
        let state = getState()[PRE_RECEIPT_OPERATION].set("loading", bool);
        dispatch({ type: PRE_RECEIPT_OPERATION, state });
    },
    initDataSource: (record) => (dispatch, getState) => {
        let state = getState()[PRE_RECEIPT_OPERATION].set('record', record);
        dispatch({ type: PRE_RECEIPT_OPERATION, state });
        dispatch(actions.show())
    },
    searchPosition: (pm = '') => (dispatch, getState) => {
        let siteCode = getState()[PURCHASE_EIDT_TOP_REDU].get('formInfo').deliverySiteCode,
            stockId = getState()[PURCHASE_EIDT_TOP_REDU].get('formInfo').stockId;
        let params = { siteCode: siteCode || '' };
        stockId ? params.stockId = stockId : null;
        return ReqApi.get({
            url: Urls.GET_UNLOCK_LIST_FORIN,
            pm: Object.assign({}, params, { code: pm, name: pm })
        }).then((json) => {
            if (json.status === 2000 && json.data.list && json.data.list.length > 0) {
                return json.data.list
            } else {
                return []
            }
        });
    },
    tableData: (list) => (dispatch, getState) => {
        let record = getState()[PRE_RECEIPT_OPERATION].get('record'),
            amount = record.planAmount - record.receivedAmount,
            sumAccount = 0;
        list.map(item => {
            //delete item.warehouseName;
            delete item.line;
            item.id = record.id;
            sumAccount += item.materialAmount * 1;
            return item;
        })
        return amount >= sumAccount ? dispatch(actions.submitTableData(list)) : message.error('累计预收货数量不能超过计划数量！')
    },
    submitTableData: (list) => (dispatch, getState) => {
        let pagePM = getState()[PURCHASE_EIDT_TOP_REDU].get('orderinfoPagePm');
        list.map(item => {
            if (item.list) {
                delete item.list
            }
            return item;
        })
        if (list.some(item => {
            return item.isEdit == 1;
        })) {
            message.info('有待确认信息')
        } else {
            dispatch(actions.setLoading(true));
            return ReqApi.post({
                url: Urls.PRE_PUT_SAVE,
                pm: { list: list }
            }).then((json) => {
                if (json.status === 2000) {
                    dispatch(actions.setLoading(false));
                    dispatch(actions.hide())
                    dispatch(PurchaseEidtTopAct.getInitialData(pagePM))   // 取当前订单信息页码
                } 
                dispatch(actions.setLoading(false));
                return json;
            });
        }
    }
}

export default actions