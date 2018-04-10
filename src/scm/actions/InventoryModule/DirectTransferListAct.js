/**
 * Created by MW on 2017/8/30.
 * 直接调拨单
 */

import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls'
import { DIRECT_TRANSFER_LIST_REDU } from '../../consts/ActTypes'
import TabsAct from '../TabsAct'
import { message } from '../../../base/components/AntdComp'

let DirectTransferListAct = {
    //loading
    loading: (loading, flag) => (dispatch, getState) => {
        let state = getState()[DIRECT_TRANSFER_LIST_REDU].set(loading, flag);
        dispatch({ type: DIRECT_TRANSFER_LIST_REDU, state });
    },
    GetPurchaseList: (data, pm) => (dispatch, getState) => {
        let { list, total, page, pageSize } = data;
        let state = getState()[DIRECT_TRANSFER_LIST_REDU].set('search', pm).set('dataSource', list)
            .set("paging", { total, current: page, pageSize });
        dispatch({ type: DIRECT_TRANSFER_LIST_REDU, state });
    },
    PurchaseList: (pm = {}) => (dispatch, getState) => {
        dispatch(DirectTransferListAct.loading('tableLoading',true));
        return ReqApi.get({
            url: Urls.GET_DIRECTTRANSFER_LIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                dispatch(DirectTransferListAct.GetPurchaseList(json.data, pm));
            }
            dispatch(DirectTransferListAct.loading('tableLoading',false));
            return json;
        });
    },
}

export default DirectTransferListAct
