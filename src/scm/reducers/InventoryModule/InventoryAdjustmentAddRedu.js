import {fromJS} from 'immutable';
import {INVENTORY_ADJUSTMENT_ADD_REDU} from '../../consts/ActTypes';

export let initState = fromJS({
    setDataSourceIndex:1,//刷新 dataSource次数
    dataSource:{
        list:[]
    },
    tempDataSource:{
        list:[]
    },
    visible: false,
    loading: false,
    stepIndex:0,
    siteCodeEnum:[],//垃圾
    stepEnum:["one","two","three"],
    warehouseCodeEnum: [],
    adjustTypeCodeEnum:[],

    startLocationCodeEnum:[],//开始仓位
    endLocationCodeEnum:[], //结束仓位
    tableLocationCodeEnum:[],//tba仓位

    searchLocationCodeEnum:[],//批量搜索新仓位
});



export const InventoryAdjustmentAddRedu = (state = initState, action) => {
    switch (action.type) {
        case INVENTORY_ADJUSTMENT_ADD_REDU:
            return action.state;
        default:
            return state;
    }
}


