import { ReqApi } from '../../../base/services/ReqApi'
import { Urls } from '../../consts/InventoryUrls'
import { ADDOTHERWAREHOUSWPAGEREDU, TABSREDU } from '../../consts/ActTypes'
import TabsAct from '../TabsAct'
import OtherWareHousePageAct from './OtherWareHousePageAct'
import { message } from '../../../base/components/AntdComp'

let getStateFun = (getState) => {
    return getState()[TABSREDU];
}
const actions = {
    loading: (loading, value) => (dispatch, getState) => {
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', loading], value);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
    },
    getInfo: () => (dispatch, getState) => { // 新建 初始化  获取站点和单据类型
        Promise.all([
            dispatch(actions.getOrderTypes({ billType: 0, status: 1 })), // 3、--- 获取其他入库单据类型
        ]).then(values => {

        }, reason => {

        })
    },
    onAutochange: (pm = {}) => (dispatch, getState) => {//站点自动补全
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'autoDataSource'], []);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
        ReqApi.get({
            url: Urls.PUB_BASIC_SITE_GETLIST,
            pm
        }).then((json) => {
            if (json.status === 2000) {
                let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'searchSource'], json.data.list);
                dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
            }
        });
    },
    sendSave: (pm = {}) => (dispatch, getState) => {
        pm.orderCode="";
        pm.status = 1;
        let tableDataList = getState()[ADDOTHERWAREHOUSWPAGEREDU].getIn(['addWareHouse', 'tableData']);
        let temp, x = tableDataList;
        if(x.length==0){
           message.info('明细项不能为空');
        }else if (x.some((item) => {
            return item.isEdit == 1
        })) {
            message.info('请确认订单信息');
        }else if (x.some((item) => {
            return item.materialCode == ""||item.planAmount==""
        })) {
            message.info('明细项物料编码,计划数量不能为空');
        }else {
            dispatch(actions.loading('listLoading', true));
            pm.details = [].concat(x)
            ReqApi.post({
                url: Urls.OTHER_SAVE,
                pm
            }).then((json) => {
                if (json.status === 2000) {
                    dispatch(TabsAct.TabRemove('inventoryAddOtherWareHousePageCont', 'inventoryOtherWareHousePageCont'));
                    if (getStateFun(getState).get('tabs').some((tab) => {
                        return tab.key == 'inventoryOtherWareHousePageCont'
                    })) {
                        dispatch(OtherWareHousePageAct.PurchaseList({ page: 1, pageSize: 15, sourceOrderType: 89 }));
                    }
                    dispatch(TabsAct.TabAdd({ title: '其他入库单', key: 'inventoryOtherWareHousePageCont' }));
                    message.success('保存成功');
                }
                dispatch(actions.loading('listLoading', false));
                dispatch(actions.loading('saveLoading', false));
            });
        }
    },
    getOrderTypes: (pm = {}) => (dispatch, getState) => {//其他入库类型
        ReqApi.post({
            url: Urls.PUB_BASIC_BUSINESS_GETLIST,   // inventory/put/getDetail
            pm
        }).then(json => {
            if (json.status === 2000) {
                dispatch(actions.storeOrderTypes(json.data.list))
            }
        })
    },
    storeOrderTypes: (val) => (dispatch, getState) => {
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'orderTypes'], val);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
    },
    addOredit: (val) => (dispatch, getState) => {//判断标题是新增还是编辑
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'addOredit'], val);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
    },
    checkedTableList: (val) => (dispatch, getState) => {
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'checkedTableList'], val);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
        dispatch(actions.dataChange(val))
    },
    // 添加订单信息
    tableData: (val) => (dispatch, getState) => {
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'tableData'], val);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
    },
    indexVal: (index) => (dispatch, getState) => {  //选中行 index
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'index'], index);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
    },
    dataChange: (val) => (dispatch, getState) => { // 表格数据回填
        let index = getState()[ADDOTHERWAREHOUSWPAGEREDU].getIn(['addWareHouse', 'index']);
        let dataSource = getState()[ADDOTHERWAREHOUSWPAGEREDU].getIn(['addWareHouse', 'tableData']);
        if (dataSource[index]) {
            dataSource[index].materialCode = val.materialCode;
            dataSource[index].materialName = val.materialName;
            dataSource[index].materialSpec = val.materialSpec;
            dataSource[index].materialModel = val.model;
            dataSource[index].measureUnitName = val.materialInventory?val.materialInventory.inventoryUnitName:'';
            dataSource[index].materialUnitCode = val.materialInventory?val.materialInventory.inventoryUnitCode:'';
        }
        dispatch(actions.tableData(dataSource))
    },
    storeInitOrderInfo: (data) => (dispatch, getState) => {
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'tableData'], []);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
        dispatch(actions.tableData([]))
    },
    returnButton: () => (dispatch, getState) => {//返回按钮
        dispatch(TabsAct.TabRemove('inventoryAddOtherWareHousePageCont', 'inventoryOtherWareHousePageCont'));
        if (getStateFun(getState).get('tabs').some((tab) => {
            return tab.key == 'inventoryOtherWareHousePageCont'
        })) {
            dispatch(OtherWareHousePageAct.PurchaseList({ page: 1, pageSize: 10, sourceOrderType: 89 }));
        }
        dispatch(TabsAct.TabAdd({ title: '其他入库单', key: 'inventoryOtherWareHousePageCont' }));
    },
     // 清除当前新建行
    removeNewRow: () => (dispatch, getState) => {
        let list = getState()[ADDOTHERWAREHOUSWPAGEREDU].getIn(['addWareHouse', 'tableData']),
            removeNewRowFlag = getState()[ADDOTHERWAREHOUSWPAGEREDU].getIn(['addWareHouse', 'isRemoveNewRow']);
        if (list.length > 0 && list[0].lineNum < 0  && list[0].materialCode == "") {
            removeNewRowFlag = !removeNewRowFlag;
            list.shift();
            dispatch(actions.tableData(list));
            dispatch(actions.isRemoveNewRow(removeNewRowFlag))
        }
    },
    // 是否取消新建行
    isRemoveNewRow: (val) => (dispatch, getState) => {
        let state = getState()[ADDOTHERWAREHOUSWPAGEREDU].setIn(['addWareHouse', 'isRemoveNewRow'], val);
        dispatch({ type: ADDOTHERWAREHOUSWPAGEREDU, state });
    }
}

export default actions
