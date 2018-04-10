import { ReqApi } from '../../../base/services/ReqApi'
import MaterialClassifyUrls from '../../consts/MaterialClassifyUrls';
import { MATERIALCLASSIFYREDU, EDIT_MATERIAL_CLASSIFY } from '../../consts/ActTypes';
import MaterialClassifyAct from './MaterialClassifyAct';

const actions = {
    modalVisible: (bool) => (dispatch, getState) => {
        let state = getState()[EDIT_MATERIAL_CLASSIFY].set("visible", bool);
        dispatch({ type: EDIT_MATERIAL_CLASSIFY, state });
    },
    modalLoading: (bool) => (dispatch, getState) => {
        let state = getState()[EDIT_MATERIAL_CLASSIFY].set("loading", bool);
        dispatch({ type: EDIT_MATERIAL_CLASSIFY, state });
    },
    getCombBoxList: (pm = {}) => (dispatch, getState) => {
        ReqApi.get({
            url: MaterialClassifyUrls.GET_COMBOBOX_LIST,
            pm
        }).then(json => {
            if (json.status === 2000 && json.data) {
                dispatch(actions.comboboxTreeNode(json.data[0]))
            }
        })
    },
    comboboxTreeNode: (val) => (dispatch, getState) => {
        let state = getState()[EDIT_MATERIAL_CLASSIFY].set("comboboxList", val);
        dispatch({ type: EDIT_MATERIAL_CLASSIFY, state });
    },
    getMaterialDetail: (pm = {}) => (dispatch, getState) => {
        dispatch(actions.modalLoading(true));
        return ReqApi.get({
            url: MaterialClassifyUrls.GET_DETAILS,
            pm
        }).then(json => {
            if (json.status === 2000 && json.data) {
                dispatch(actions.detailInfo(json.data))
                dispatch(actions.isUse(json.data.isUse));
                dispatch(actions.nodeLevel(json.data.categoryLevel))
            }
            dispatch(actions.modalLoading(false))
            return json;
        })
    },
    detailInfo: (data) => (dispatch, getState) => {
        let state = getState()[EDIT_MATERIAL_CLASSIFY].set("details", data);
        dispatch({ type: EDIT_MATERIAL_CLASSIFY, state });
    },
    checkIsUse: (bool, pm = {}) => (dispatch, getState) => {
        ReqApi.get({
            url: MaterialClassifyUrls.CHECK_ISUSE,
            pm
        }).then(json => {
            if (json.status === 2000) { // 违背物料使用 可以取消勾选
                dispatch(actions.isUse(0))
            } else if (json.status === 6000) { // 已被使用 不允许取消勾选
                dispatch(actions.isUse(1))
            }
        })
    },
    nodeLevel: (num) => (dispatch, getState) => {
        let state = getState()[EDIT_MATERIAL_CLASSIFY].set("nodeLevel", num);
        dispatch({ type: EDIT_MATERIAL_CLASSIFY, state });
    },
    isUse: (bool) => (dispatch, getState) => {
        let state = getState()[EDIT_MATERIAL_CLASSIFY].set('isUse', bool);
        dispatch({ type: EDIT_MATERIAL_CLASSIFY, state });
    },
    editData: (pm) => (dispatch, getState) => {
        dispatch(actions.modalLoading(true));
        ReqApi.get({
            url: MaterialClassifyUrls.UPDATE,
            pm
        }).then(json => {
            if (json.status == 2000) {
                dispatch(actions.modalVisible(false))
                // 刷新表格 -- 是否隐藏禁用
                let forbiddenStatus = getState()[MATERIALCLASSIFYREDU].get('forbiddenStatus');
                dispatch(MaterialClassifyAct.getList({isHideDisable: forbiddenStatus}))
            }
            dispatch(actions.modalLoading(false));
        })
    }
}

export default actions;