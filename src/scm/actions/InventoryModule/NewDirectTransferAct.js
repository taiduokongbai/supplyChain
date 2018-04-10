/**
 * Created by MW on 2017/8/30.
 * 新建直接调拨单
 */
import { ReqApi } from '../../../base/services/ReqApi'
import { fromJS, toJS } from 'immutable';
import { Urls } from '../../consts/InventoryUrls'
import {NEW_DIRECT_TRANSFER_REDU} from '../../consts/ActTypes'
import TabsAct from '../TabsAct'
import {message} from '../../../base/components/AntdComp'

let NewDirectTransferAct = {
    //loading && popup
    loadingOrVisible: (loading, flag) => (dispatch, getState) => {
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set(loading, flag);
        dispatch({type: NEW_DIRECT_TRANSFER_REDU, state});
    },
    //搜索物料的弹窗
    searchMaterial: (pm = {}) => (dispatch, getState) => {
        dispatch(NewDirectTransferAct.loadingOrVisible('visible',true));
    },

    //弹窗选中数据
    checked: (pm = {}) => (dispatch, getState) => {
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('checkedList',pm);
        dispatch({type: NEW_DIRECT_TRANSFER_REDU, state});
        dispatch(NewDirectTransferAct.loadingOrVisible('visible',false));
        dispatch(NewDirectTransferAct.dataChange(pm))
    },

    checkedTableList: (val) => (dispatch, getState) => {
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('checkedList', val);
        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
        dispatch(NewDirectTransferAct.dataChange(val))
    },

    dataChange: (val) => (dispatch, getState) => { // 表格数据回填
        let index = getState()[NEW_DIRECT_TRANSFER_REDU].get('index');
        let dataSource = getState()[NEW_DIRECT_TRANSFER_REDU].get('initialOrderInfo');
        if (dataSource[index]) {
            dataSource[index].materialCode = val.materialCode;
            dataSource[index].materialName = val.materialName;
            dataSource[index].materialSpec = val.materialSpec;
            dataSource[index].materialModel = val.materialModel;
            dataSource[index].allotOutLocationCode = val.freightSpaceName;
            dataSource[index].allotOutBatchCode = val.batchCode;
            dataSource[index].amount = val.amount;
            dataSource[index].allotInQty = 0;
            dataSource[index].measureUnitName = val.measureUnitName;
        }
        // dispatch(NewDirectTransferAct.changeOrderInfo(dataSource))
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('initialOrderInfo', dataSource);
        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
    },

    changeOrderInfo: (dataSource) => (dispatch, getState) => { // 表格数据回填
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('initialOrderInfo', dataSource);
        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
    },

    //初始化表格数据为空
    storeInitOrderInfo: (data) => (dispatch, getState) => {
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('initialOrderInfo', []);
        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
    },

    // 添加调出信息
    tableData: (index,count,record) => (dispatch, getState) => {
        let state =  getState()[NEW_DIRECT_TRANSFER_REDU].set('outData',
            record ?
                getState()[NEW_DIRECT_TRANSFER_REDU].get('outData').splice(index,count,record)
                :
                getState()[NEW_DIRECT_TRANSFER_REDU].get('outData').splice(index,count)
        )
        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
        dispatch(NewDirectTransferAct.disabled());
        dispatch(NewDirectTransferAct.getInData());
    },

    //调入信息获取

    getInData: () => (dispatch, getState) => {
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('inData',[].concat(
            getState()[NEW_DIRECT_TRANSFER_REDU].get('outData').toJS()));
        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
    },

    //预收货信息
    advance: (record) => (dispatch, getState) => {
        dispatch(NewDirectTransferAct.loadingOrVisible('visibleAdvance',true));
    },


    //调出仓库是否禁用
    disabled: () => (dispatch, getState) => {
        let state = getState()[NEW_DIRECT_TRANSFER_REDU].get('outData').toJS().length ?
            getState()[NEW_DIRECT_TRANSFER_REDU].set('disOutSiteCode',true).set('outSiteList',[].concat(
                getState()[NEW_DIRECT_TRANSFER_REDU].get('outSiteList')
            ))
        :
           getState()[NEW_DIRECT_TRANSFER_REDU].set('disOutSiteCode',false).set('outSiteList', [].concat(
                getState()[NEW_DIRECT_TRANSFER_REDU].get('outSiteList')));

        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
    },

    tableChange: (index) => (dispatch, getState) => {
        let state;
        switch (index) {
            case 1:
                state = getState()[NEW_DIRECT_TRANSFER_REDU].set('tableOne',true).set('tableTwo',false).set('tableThree',false);
                break;
            case 2:
                state = getState()[NEW_DIRECT_TRANSFER_REDU].set('tableTwo',true).set('tableOne',false).set('tableThree',false);
                break;
            case 3:
                state = getState()[NEW_DIRECT_TRANSFER_REDU].set('tableThree',true).set('tableOne',false).set('tableTwo',false);
                break;
            default:
                console.log(12346);
        }



        dispatch({ type: NEW_DIRECT_TRANSFER_REDU, state });
    },




























    //自动搜索
    onSearchOut: (pm ={}) => (dispatch, getState) => {
        ReqApi.get({
            url: Urls.PUB_BASIC_SITE_GETLIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('outSiteList',json.data.list);
                dispatch({type:NEW_DIRECT_TRANSFER_REDU,state});
            }
        });
    },

    onSelectOut: (pm ={}) => (dispatch, getState) => {
        ReqApi.get({
            url: Urls.PUB_BASIC_SITE_GETLIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                let state = getState()[NEW_DIRECT_TRANSFER_REDU].set('allotOutSiteCode',json.data.list[0].siteCode);
                dispatch({type:NEW_DIRECT_TRANSFER_REDU,state});
            }
        });
    },
}

export default NewDirectTransferAct