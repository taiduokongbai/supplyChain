import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls';
import { SALES_RETURN_STORE_DIALOG_REDU, SALES_RETURN_AUTO_COMPLETE_REDU, SALES_RETURN_STORE_EDIT_TOP } from '../../consts/ActTypes';
import { fromJS, toJS } from 'immutable';
import { message } from '../../../base/components/AntdComp'
import SalesReturnStoreEidtTopAct from './SalesReturnStoreEidtTopAct';

const actions = {
    show: () => (dispatch, getState) => {
        let state = getState()[SALES_RETURN_STORE_DIALOG_REDU].set("visible", true);
        dispatch({ type: SALES_RETURN_STORE_DIALOG_REDU, state });
    },
    hide: () => (dispatch, getState) => {
        let state = getState()[SALES_RETURN_STORE_DIALOG_REDU].set("visible", false);
        dispatch({ type: SALES_RETURN_STORE_DIALOG_REDU, state });
    },
    setLoading: (bool) => (dispatch, getState) => {
        let state = getState()[SALES_RETURN_STORE_DIALOG_REDU].set("loading", bool);
        dispatch({ type: SALES_RETURN_STORE_DIALOG_REDU, state });
    },
    initDataSource: (record) => (dispatch, getState) => {
        let state = getState()[SALES_RETURN_STORE_DIALOG_REDU].set('record', record);
        dispatch({ type: SALES_RETURN_STORE_DIALOG_REDU, state });
        dispatch(actions.show())
    },
    searchPosition: (pm = '') => (dispatch, getState) => {
        let siteCode = getState()[SALES_RETURN_STORE_EDIT_TOP].get('formInfo').deliverySiteCode,   // 收货站点获取
            stockId = getState()[SALES_RETURN_STORE_EDIT_TOP].get('formInfo').stockId;     // 收货仓库
        let params = { siteCode: siteCode||'' };
            stockId ? params.stockId = stockId : null;
        return ReqApi.get({
            url: Urls.GET_UNLOCK_LIST_FORIN,
            pm: Object.assign({}, params, {code: pm, name: pm})
        }).then((json) => {
            if (json.status === 2000 && json.data.list && json.data.list.length > 0) {
                return json.data.list
            } else {
                return []
            }
        });
    },
    tableData: (list) => (dispatch, getState) => {
        let record = getState()[SALES_RETURN_STORE_DIALOG_REDU].get('record'),
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
        let pagePM = getState()[SALES_RETURN_STORE_EDIT_TOP].get('orderinfoPagePm');
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
                    dispatch(SalesReturnStoreEidtTopAct.getInitialData(pagePM))
                } 
                dispatch(actions.setLoading(false));
                return json;
            });
        }
    }
}

export default actions