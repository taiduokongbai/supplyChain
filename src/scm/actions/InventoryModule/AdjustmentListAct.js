import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls'
import { ADJUSTMENTLISTREDU, ADJUSTMENTMOVEDETAILSREDU } from '../../consts/ActTypes'
import TabsAct from '../TabsAct'
import PurchaseEidtTopAct from './PurchaseEidtTopAct'
import { message } from '../../../base/components/AntdComp'

const actions = {
    loading: (loading, value) => (dispatch, getState) => {
        let state = getState()[ADJUSTMENTLISTREDU].set(loading, value);
        dispatch({ type: ADJUSTMENTLISTREDU, state });
    },
    takeOrderPm: (pm = {}) => (dispatch, getState) => {//执行传参
        let state = getState()[ADJUSTMENTLISTREDU].set('takeOrderPm', pm);
        dispatch({ type: ADJUSTMENTLISTREDU, state })
    },
    details: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.setLoading(true));
        Promise.all([
            dispatch(actions.takeOrderDetailsMaterialPm({ adjustCode: pm.adjustCode,adjustTypeCode:pm.adjustTypeCode,id:pm.id})),
        ]).then(values => {
            dispatch(actions.setLoading(false))
        }, reason => {
            dispatch(actions.setLoading(false))
        });
    },
    takeOrderDetailsMaterialPm: (pm = {}) => (dispatch, getState) => {//详情传参获取物料列表查询和主界面信息
        dispatch(actions.materialLoading(true));
        return ReqApi.get({
            url: Urls.GET_ADJUSTDETAIL_LIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                let state = getState()[ADJUSTMENTMOVEDETAILSREDU].set('search', pm).set('dataSource', json.data.list).set('paging', { total: json.data.total, current: json.data.page, pageSize: json.data.pageSize }).set('takeOrderDetailsPm', json.data);
                dispatch({ type: ADJUSTMENTMOVEDETAILSREDU, state });
            }
            dispatch(actions.materialLoading(false));
            return json;

        });
    },
    materialLoading: (val) => (dispatch, getState) => {//详情传参获取物料列表查询Loading
        let state = getState()[ADJUSTMENTMOVEDETAILSREDU].set('materialLoading', val);
        dispatch({ type: ADJUSTMENTMOVEDETAILSREDU, state })
    },
    setLoading: (bool) => (dispatch, getState) => {//详情传参loading
        let state = getState()[ADJUSTMENTMOVEDETAILSREDU].set('DetailsPmLoading', bool);
        dispatch({ type: ADJUSTMENTMOVEDETAILSREDU, state })
    },
    tableLoading: (val) => (dispatch, getState) => {
        let state = getState()[ADJUSTMENTLISTREDU].set('tableLoading', val);
        dispatch({ type: ADJUSTMENTLISTREDU, state })
    },
    GetPurchaseList: (data, pm) => (dispatch, getState) => {
        let { list, total, page, pageSize } = data;
        let state = getState()[ADJUSTMENTLISTREDU].set('search', pm).set('dataSource', list)
            .set("paging", { total, current: page, pageSize });
        dispatch({ type: ADJUSTMENTLISTREDU, state });
    },
    PurchaseList: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.tableLoading(true));
        return ReqApi.get({
            url: Urls.GET_ADJUST_LIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                dispatch(actions.GetPurchaseList(json.data, pm));
            }
            dispatch(actions.tableLoading(false));
            dispatch(actions.btnLoading(false));
            return json;
        });
    },
    btnLoading: (val) => (dispatch, getState) => {
        let state = getState()[ADJUSTMENTLISTREDU].set('btnLoading', val);
        dispatch({ type: ADJUSTMENTLISTREDU, state })
    },

    GetCodeRule: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: Urls.GET_CODERULE,
            pm
        }).then(json => {
            return json;
        })
    },
    BusCodeList: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: Urls.PUB_BASIC_BUSCODE,
            pm
        }).then((json) => {
            if (json.status === 2000) {
               let state = getState()[ADJUSTMENTLISTREDU].set('busCodeData', json.data.list);
                dispatch({ type: ADJUSTMENTLISTREDU, state });
            }
            return json;
        });
    },  
}

export default actions
