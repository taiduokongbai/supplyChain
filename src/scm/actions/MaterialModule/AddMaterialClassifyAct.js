import { ReqApi } from '../../../base/services/ReqApi'
import MaterialClassifyUrls from '../../consts/MaterialClassifyUrls';
import { MATERIALCLASSIFYREDU, ADD_MATERIAL_CLASSIFY } from '../../consts/ActTypes';
import MaterialClassifyAct from './MaterialClassifyAct';

const actions = {
    modalVisible: (bool) => (dispatch, getState) => {
        let state = getState()[ADD_MATERIAL_CLASSIFY].set("visible", bool);
        dispatch({ type: ADD_MATERIAL_CLASSIFY, state });
    },
    modalLoading: (bool) => (dispatch, getState) => {
        let state = getState()[ADD_MATERIAL_CLASSIFY].set("loading", bool);
        dispatch({ type: ADD_MATERIAL_CLASSIFY, state });
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
        let state = getState()[ADD_MATERIAL_CLASSIFY].set("comboboxList", val);
        dispatch({ type: ADD_MATERIAL_CLASSIFY, state });
    },
    addData: (pm) => (dispatch, getState) => {
        dispatch(actions.modalLoading(true));
        ReqApi.get({
            url: MaterialClassifyUrls.ADD,
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