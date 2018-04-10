/**
 * Created by MW on 2017/8/30.
 * 直接调拨单详情
 */
import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls'
import {DIRECT_TRANSFER_DETAILS_REDU} from '../../consts/ActTypes'
import TabsAct from '../TabsAct'
import {message} from '../../../base/components/AntdComp'

let DirectTransferDetailsAct = {
    //loading
    loading: (loading, flag) => (dispatch, getState) => {
        let state = getState()[DIRECT_TRANSFER_DETAILS_REDU].set(loading, flag);
        dispatch({type: DIRECT_TRANSFER_DETAILS_REDU, state});
    },
    details: (pm = {}) => (dispatch, getState) => {
        dispatch(DirectTransferDetailsAct.loading('searchLoading',true));
        Promise.all([
            dispatch(DirectTransferDetailsAct.takeOrderDetailsPm({ allotOrderCode: pm })),
            // dispatch(DirectTransferDetailsAct.takeOrderDetailsListPm({ orderCode: pm, pageFlag: 0,status:2 })),
             dispatch(DirectTransferDetailsAct.takeOrderDetailsMaterialPm({ allotOrderCode: pm, page: 1, pageSize: 10 })),
        ]).then(values => {
            dispatch(DirectTransferDetailsAct.loading('searchLoading',false))
        }, reason => {
            dispatch(DirectTransferDetailsAct.loading('searchLoading',false))
        });
    },
    takeOrderDetailsPm: (pm = {}) => (dispatch, getState) => {//详情传参获取主界面信息
        return ReqApi.get({
            url: Urls.GET_DIRECTTRANSFER_DETAIL,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                let state = getState()[DIRECT_TRANSFER_DETAILS_REDU].set('takeOrderDetailsPm', json.data);
                dispatch({ type: DIRECT_TRANSFER_DETAILS_REDU, state })
            }
            return json;
        });
    },
    // takeOrderDetailsListPm: (pm = {}) => (dispatch, getState) => {//详情传参获取收货记录信息
    //     return ReqApi.get({
    //         url: Urls.GET_PRE_PUT_INFO,
    //         pm
    //     }).then((json) => {
    //         if (json.status === 2000) {
    //             let state = getState()[RECEIPTDETAILSREDU].set('takeOrderDetailsListPm', json.data);
    //             dispatch({ type: RECEIPTDETAILSREDU, state })
    //         }
    //         return json;
    //     });
    // },
    takeOrderDetailsMaterialPm: (pm = {}) => (dispatch, getState) => {//详情传参获取调拨信息
        dispatch(DirectTransferDetailsAct.loading('tableLoading',true));
        return ReqApi.get({
            url: Urls.GET_DIRECTTRANSFER_GETAllTOUTRECORDS,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                let state = getState()[DIRECT_TRANSFER_DETAILS_REDU].set('search', pm).set('dataSource', json.data.list).set('paging', { total: json.data.total, current: json.data.page, pageSize: json.data.pageSize });
                dispatch({ type: DIRECT_TRANSFER_DETAILS_REDU, state });
            }
            dispatch(DirectTransferDetailsAct.loading('tableLoading',false));
            return json;

        });
    },
}

export default DirectTransferDetailsAct