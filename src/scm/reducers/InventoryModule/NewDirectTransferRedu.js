/**
 * Created by MW on 2017/8/30.
 * 新建直接调拨单
 */
import { fromJS, Record,List } from 'immutable';
import { NEW_DIRECT_TRANSFER_REDU } from '../../consts/ActTypes';
let initState = fromJS({
    //调出仓库
    allotOutSiteCode: '',
    //调出仓库是否禁用
    disOutSiteCode: false,
    //调出仓库列表
    outSiteList: [],
    //调入仓库列表
    inSiteList: [],
    //添加调出物料信息
    initialOrderInfo: [],
    index: 0,
    //添加物料信息
    checkedList:'',
    //调出信息
    outData: [],
    //调入信息
    inData: [],
    //预收货信息
    advanceData: [],
    //调拨信息
    changeData: [],
    loading: false,
    totalLoading: false,
    tableLoading: true,
    //添加物料的弹窗
    visible: false,
    //预收货信息弹窗
    visibleAdvance:false,
    //弹窗loading
    popupSearchLoading: false,
    //下方三个表格切换
    tableOne:true,
    tableTwo:false,
    tableThree:false,
    AdvanceLoading:false,
});

const NewDirectTransferRedu = (state = initState, action) => {
    switch (action.type) {
        case NEW_DIRECT_TRANSFER_REDU:
            return action.state;
        default:
            return state;
    }
}

export default NewDirectTransferRedu