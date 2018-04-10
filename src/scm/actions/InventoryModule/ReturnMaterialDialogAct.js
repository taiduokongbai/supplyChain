import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls';
import { RETURN_MATERIAL_DIALOG_REDU, RETURN_MATERIAL_AUTO_COMPLETE, RETURN_MATERIAL_TOP_REDU } from '../../consts/ActTypes';
import { fromJS, toJS } from 'immutable';
import { message } from '../../../base/components/AntdComp';
import ReturnMaterialTopAct from './ReturnMaterialTopAct';


const actions = {
    show: () => (dispatch, getState) => {
        let state = getState()[RETURN_MATERIAL_DIALOG_REDU].set("visible", true);
        dispatch({ type: RETURN_MATERIAL_DIALOG_REDU, state });
    },
    hide: () => (dispatch, getState) => {
        let state = getState()[RETURN_MATERIAL_DIALOG_REDU].set("visible", false);
        dispatch({ type: RETURN_MATERIAL_DIALOG_REDU, state });
    },
    setLoading: (bool) => (dispatch, getState) => {
        let state = getState()[RETURN_MATERIAL_DIALOG_REDU].set("loading", bool);
        dispatch({ type: RETURN_MATERIAL_DIALOG_REDU, state });
    },
    initDataSource: (record) => (dispatch, getState) => {
        let state = getState()[RETURN_MATERIAL_DIALOG_REDU].set('record', record);
        dispatch({ type: RETURN_MATERIAL_DIALOG_REDU, state });
        dispatch(actions.show())
    },
    searchPosition: (pm) => (dispatch, getState) => {
        pm = getState()[RETURN_MATERIAL_TOP_REDU].get('formInfo');
        return ReqApi.get({
            url: Urls.GET_FREIGHT_SPACE,
            pm: { siteCode: pm.deliverySiteCode || '' }
        }).then((json) => {
            if (json.status === 2000 && json.data.list && json.data.list.length > 0) {
                return json.data.list
            } else {
                return []
            }
        });
    },
    tableData: (list) => (dispatch, getState) => {
        let record = getState()[RETURN_MATERIAL_DIALOG_REDU].get('record'),
            amount = record.planAmount - record.receivedAmount,
            sumAccount = 0;
        list.map(item => {
            //delete item.warehouseName;
            delete item.line;
            item.id = record.id;
            sumAccount += item.materialAmount * 1;
            return item;
        })
        amount >= sumAccount ? dispatch(actions.submitTableData(list)) : message.error('累计预收货数量不能超过计划数量！')
    },
    submitTableData: (list) => (dispatch, getState) => {
        let pagePM = getState()[RETURN_MATERIAL_TOP_REDU].get('orderinfoPagePm');
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
            ReqApi.post({
                url: Urls.PRE_PUT_SAVE,
                pm: { list: list }
            }).then((json) => {
                if (json.status === 2000) {
                    dispatch(actions.setLoading(false));
                    dispatch(actions.hide())
                    dispatch(ReturnMaterialTopAct.getInitialData(pagePM))
                } else {
                    dispatch(actions.setLoading(false));
                }
            });
        }
    }
}

export default actions