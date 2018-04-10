import { ReqApi } from '../../../base/services/ReqApi'
import MaterialClassifyUrls from '../../consts/MaterialClassifyUrls';
import { MATERIALCLASSIFYREDU } from '../../consts/ActTypes';
import { message } from '../../../base/components/AntdComp';

// 是否隐藏禁用物料分类
let getForbiddenStatus = (getState) => {
    return getState()[MATERIALCLASSIFYREDU].get('forbiddenStatus');
}

const actions = {
    tableLoading: (bool) => (dispatch, getState) => {
        let state = getState()[MATERIALCLASSIFYREDU].set("tableLoading", bool);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
    getList: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.tableLoading(true));
        return ReqApi.get({
            url: MaterialClassifyUrls.GET_LIST,
            pm
        }).then(json => {
            if (json.status === 2000 && json.data) {
                (pm.categoryLevel || pm.categoryLevel == '') && json.data.length > 0 ? dispatch(actions.initialExpandedRowKeys(pm, json.data)) : dispatch(actions.getAllList(json.data, true));
                if (pm.hasOwnProperty('categoryCode') || pm.hasOwnProperty('categoryName') || pm.hasOwnProperty('orderStatus')) {
                    dispatch(actions.categoryLevel(pm, json.data))
                }
            }
            dispatch(actions.tableLoading(false));
        })
    },
    getAllDataList: (data) => (dispatch, getState) => {   // 所有的list
        let state = getState()[MATERIALCLASSIFYREDU].set("allList", data);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
    getAllList: (data) => (dispatch, getState) => {          // 获取列表
        let state = getState()[MATERIALCLASSIFYREDU].set("dataSource", data);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
    expandedRowKeys: (val = []) => (dispatch, getState) => {  //表格收起层级
        let state = getState()[MATERIALCLASSIFYREDU].set('expandedRowKeys', [].concat(val));
        dispatch({ type: MATERIALCLASSIFYREDU, state })
    },
    initialExpandedRowKeys: (pm, val) => (dispatch, getState) => {
        dispatch(actions.getAllList(val))
        let init_rowKeys = getState()[MATERIALCLASSIFYREDU].get('expandedRowKeys');
        let arr_rowKeys = init_rowKeys;
        dispatch(actions.categoryLevel(pm, val, arr_rowKeys));
    },
    categoryLevel: (pm, val, arr_rowKeys = []) => (dispatch, getState) => {
        if (Array.isArray(val)) {
            val.map((item, index) => {
                pm.categoryLevel ? (item.categoryLevel <= pm.categoryLevel * 1 - 1 ? arr_rowKeys.push(item.categoryCode) : null) : arr_rowKeys.push(item.categoryCode);
                dispatch(actions.expandedRowKeys(arr_rowKeys))
                item.children ? dispatch(actions.categoryLevel(pm, item.children, arr_rowKeys)) : null;
            })
        }
    },
    addExpandedRow: (val = []) => (dispatch, getState) => {
        let init_rowKeys = getState()[MATERIALCLASSIFYREDU].get('expandedRowKeys');
        let arr_rowKeys = [].concat(init_rowKeys).concat(val);
        dispatch(actions.expandedRowKeys(arr_rowKeys))
    },
    deleteExpandedRow: (val = '') => (dispatch, getState) => {
        let init_rowKeys = getState()[MATERIALCLASSIFYREDU].get('expandedRowKeys');
        let arr_rowKeys = [].concat(init_rowKeys)
        for (var i = arr_rowKeys.length - 1; i >= 0; i--) {
            if (arr_rowKeys[i] == val) {
                arr_rowKeys.splice(i, 1);
            }
        }
        dispatch(actions.expandedRowKeys(arr_rowKeys))
    },
    updateOrderStatus: (pm = {}, str = '') => (dispatch, getState) => {
        return ReqApi.get({
            url: MaterialClassifyUrls.UPDATA_ORDER_STATUS,
            pm
        }).then(json => {
            if (json.status === 2000) {
                getForbiddenStatus(getState) ? dispatch(actions.getList({ isHideDisable: 1 })) : dispatch(actions.getList({ isHideDisable: 0 }));
                message.success(str + '成功');
            }
        })
    },
    checkChildren: (pm = {}, str = '启用') => (dispatch, getState) => { // 启用 -- 是否存在子节点
        return ReqApi.get({
            url: MaterialClassifyUrls.CHECK_CHILDREN,
            pm,
            callBack: true
        }).then(json => {
            if (json.status === 2000) {  // 没有子节点
                dispatch(actions.updateOrderStatus({ categoryCode: pm.categoryCode, orderStatus: 1 }, '启用'))
                dispatch(actions.checkChildrenIndex(null));
            } else if (json.status === 6010) {
                dispatch(actions.checkChildrenIndex(pm.categoryCode));
            } else {
                message.error(json.message[0].msg);
            }
            return json
        })
    },
    checkChildrenIndex: (index) => (dispatch, getState) => {
        let state = getState()[MATERIALCLASSIFYREDU].set("checkChildrenIndex", index);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
    delete: (pm = {}) => (dispatch, getState) => {
        return ReqApi.get({
            url: MaterialClassifyUrls.DELETE,
            pm
        }).then(json => {
            if (json.status === 2000) {
                getForbiddenStatus(getState) ? dispatch(actions.getList({ isHideDisable: 1 })) : dispatch(actions.getList({ isHideDisable: 0 }));
                message.success('删除成功');
            }
            return json
        })
    },
    getDetails: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.getDetailsModalLoading(true))
        return ReqApi.get({
            url: MaterialClassifyUrls.GET_DETAILS,
            pm
        }).then(json => {
            if (json.status === 2000 && json.data) {
                dispatch(actions.getDetailsValue(json.data))
            }
            dispatch(actions.getDetailsModalLoading(false))
            return json;
        })
    },
    getDetailsValue: (val) => (dispatch, getState) => {
        let state = getState()[MATERIALCLASSIFYREDU].set("details", val);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
    getDetailsModalLoading: (bool) => (dispatch, getState) => {
        let state = getState()[MATERIALCLASSIFYREDU].set("detailsModalLoading", bool);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
    forbiddenCheckbox: (int) => (dispatch, getState) => {  // first->false
        let state = getState()[MATERIALCLASSIFYREDU].set("forbiddenStatus", int);
        dispatch({ type: MATERIALCLASSIFYREDU, state });
    },
}

export default actions;