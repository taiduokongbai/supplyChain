import { ReqApi } from '../../../base/services/ReqApi'
import {INVENTORY_ADJUSTMENT_ADD_REDU} from '../../consts/ActTypes';
import { Urls } from '../../consts/InventoryUrls'
import { fromJS} from 'immutable';
import {initState} from '../../reducers/InventoryModule/InventoryAdjustmentAddRedu';
import TabsAct from '../../actions/TabsAct';
import AdjustmentListAct from '../../actions/InventoryModule/AdjustmentListAct';


export let show = () => (dispatch, getState) => {
    dispatch(TabsAct.TabAdd({title:'新建库存调整单', key:'inventoryAdjustmentAdd'}));
    dispatch(init());
    dispatch(fetchEnum());
}

export let init = (state={})=>(dispatch, getState)=>{
    let state = fromJS(initState).merge(state);
    dispatch({ type: INVENTORY_ADJUSTMENT_ADD_REDU, state });
}




export let stepNext = (index)=>(dispatch, getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU];
    let newState =  {};
    if(index){
        newState =  state.set("stepIndex",index);
    }else {
        let stepIndex = state.get('stepIndex')+1;
        newState =  state.set("stepIndex",stepIndex);
    }
    dispatch({ type: INVENTORY_ADJUSTMENT_ADD_REDU, state:newState });
}



export let stepPrevious = (index)=>(dispatch, getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU];
    let newState =  {};
    if(index){
        newState =  state.set("stepIndex",index);
    }else {
        let stepIndex = state.get('stepIndex')-1;
        newState =  state.set("stepIndex",stepIndex);
    }
    dispatch({ type: INVENTORY_ADJUSTMENT_ADD_REDU, state:newState });
}




export let fetchEnum = () => (dispatch,getState)=>{
    dispatch(setLoading(true));
    dispatch(clearAdjustmentBills()).then((json)=>{
        if(json.status === 2000){
            Promise.all([
                dispatch(fetchWarehouseCodeEnum()),
                dispatch(fetchAdjustTypeCodeEnum())
     /*           dispatch(fetchEndLocationCodeEnum()),
                dispatch(fetchStartLocationCodeEnum())*/
            ]).then(values => {
                dispatch(setLoading(false));
            }, reason => {
                dispatch(setLoading(false));
            });

        }else {
            dispatch(setLoading(false));
        }
    })

}




export let setLoading =  (bool) => (dispatch,getState)=>{
    let state =  getState()[INVENTORY_ADJUSTMENT_ADD_REDU].set("loading",bool);
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}




//仓库编码
//获取所属仓库
export let fetchWarehouseCodeEnum=  (val="") => (dispatch,getState)=>{
    let pm = {
        siteName: val,
        siteCode: val,
        page: 1,
        status: 1,
        pageSize: 10,
        isSog:1
    };
    return  ReqApi.post({
        url: Urls.PUB_BASIC_SITE_GETLIST,
        pm,
    }).then((json)=>{
        if(json.status === 2000 && json.data){
            dispatch(setWarehouseCodeEnum(json.data.list));
        }
    });
}


//仓库编码
export let setWarehouseCodeEnum=  (siteCodeEnum=[]) => (dispatch,getState)=>{
    //warehouseCode
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].setIn(["warehouseCodeEnum"],[].concat(siteCodeEnum));
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}






//调整类型编码
//adjustTypeCode
export let fetchAdjustTypeCodeEnum=  (val="") => (dispatch,getState)=>{
    //adjustTypeCode
    let pm = {
        billType: 4,
    };
    return  ReqApi.post({
        url: Urls.PUB_BASIC_BUSINESS_GET_LIST,
        pm,
    }).then((json)=>{
        if(json.status === 2000 && json.data){
            dispatch(setAdjustTypeCodeEnum(json.data.list));
        }
    });
}




export let setAdjustTypeCodeEnum =  (adjustTypeCodeEnum=[]) => (dispatch,getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].setIn(["adjustTypeCodeEnum"],[].concat(adjustTypeCodeEnum));
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}






//即时库存查询
export let fetchDataSource = (pm ={}) => (dispatch,getState)=>{
    dispatch(setLoading(true));
    return  ReqApi.get({
        url: Urls.SCM_INVENTORY_ADJUST_GETALLINVENTORY,
        pm,
    }).then((json)=>{
        if(json.status === 2000 && json.data){
            json.data.timestamp = Date.parse(new Date());
            dispatch(setDataSource(json.data));
        }
        dispatch(setLoading(false));
    });

}






export let setDataSource = (dataSource={}) => (dispatch,getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].set("dataSource",dataSource);
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}












//获取临时调整单列表
export let fetchTempDataSource = (pm ={}) => (dispatch,getState)=>{
    dispatch(setLoading(true));

    return  ReqApi.get({
        url: Urls.SCM_INVENTORY_ADJUST_GET_TEMP_ADJUST_LIST,
        pm,
    }).then((json)=>{
        if(json.status === 2000 && json.data != null && (json.data.list.length > 0)){

            json.data.timestamp = Date.parse(new Date());
            dispatch(setTempDataSource(json.data));
        }else {
            let newJson = {
                data:Object.assign({
                    timestamp:Date.parse(new Date()),
                    page:1,
                    pageSize:pm.pageSize,
                    total:0,
                    list:[]
                },json.data)
            }

            dispatch(setTempDataSource(newJson.data));
        }
        dispatch(setLoading(false));
    });

}



export let setTempDataSource = (dataSource={}) => (dispatch,getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].set("tempDataSource",dataSource);
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}











//仓位自动补全框查询
export let fetchLocationCode = (val="",warehouseCode="") => (dispatch,getState)=>{
    var pm = {
        stockCode:warehouseCode,
        status:1,
        name:val,
        code:val,
        page:1,
        pageSize:15
    }
    return  ReqApi.get({
        url: Urls.SCM_INVENTORY_FREIGHT_SPACE_GET_LIST,
        pm,
    });
}



//仓位自动补全框查询
export let createAdjustBill = (pm={
    warehouseCode:"0",
    adjustTypeCode:"0"
}) => (dispatch,getState)=>{
    return  ReqApi.post({
        url: Urls.SCM_INVENTORY_ADJUST_CREATE_ADJUST_BILL,
        pm,
    });
}




//开始仓位
export let fetchStartLocationCodeEnum = (val="",warehouseCode="") => (dispatch,getState)=>{
    return dispatch(fetchLocationCode(val,warehouseCode)).then((json)=>{
        if(json.status === 2000 && json.data){
            dispatch(setStartLocationCodeEnum(json.data.list));
        }
        dispatch(setLoading(false));
        return json;
    })
}



export let setStartLocationCodeEnum = (startLocationCodeEnum=[]) => (dispatch,getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].set("startLocationCodeEnum",startLocationCodeEnum);
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}


export let setSearchLocationCodeEnum= (startLocationCodeEnum=[]) => (dispatch,getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].set("startLocationCodeEnum",startLocationCodeEnum);
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}










//结束仓位
export let fetchEndLocationCodeEnum = (val="",warehouseCode="") => (dispatch,getState)=>{
    return dispatch(fetchLocationCode(val,warehouseCode)).then((json)=>{
        if(json.status === 2000 && json.data){
            dispatch(setEndLocationCodeEnum(json.data.list));
        }
        dispatch(setLoading(false));
    });
}

export let setEndLocationCodeEnum = (endLocationCodeEnum=[]) => (dispatch,getState)=>{
    let state = getState()[INVENTORY_ADJUSTMENT_ADD_REDU].set("endLocationCodeEnum",endLocationCodeEnum);
    dispatch({type:INVENTORY_ADJUSTMENT_ADD_REDU, state});
}







//




//批量加入到
export let addMaterialToAdjustmentBills = (pm = {
    adjustTypeCode:"",
    warehouseCode:"",
    list:[]
}) => (dispatch,getState)=>{
    dispatch(setLoading(true));
    return  ReqApi.post({
        url: Urls.SCM_INVENTORY_ADJUST_ADD_MATERIAL_TO_ADJUSTMENT_BILLS,
        pm,
    }).then((json)=>{
        dispatch(setLoading(false));

        return json;
    });
}


export let confirmAdjustment = (pm={}) => (dispatch,getState)=>{
    dispatch(setLoading(true));
    return  ReqApi.post({
        url: Urls.SCM_INVENTORY_ADJUST_CONFIRM_ADJUSTMENT,
        pm,
    }).then((json)=>{
        dispatch(setLoading(false));
        if (json.status === 2000) {
            dispatch(TabsAct.TabRemove('inventoryAdjustmentAdd', 'AdjustmentListCont'));
            dispatch(AdjustmentListAct.PurchaseList({page:1,pageSize:15}));
        }
        return json;
    });
}




export let adjustRemove = (pm={list:[]}) => (dispatch,getState)=>{
    dispatch(setLoading(true));
    return  ReqApi.post({
        url: Urls.SCM_INVENTORY_ADJUST_REMOVE,
        pm,
    }).then((json)=>{
        dispatch(setLoading(false));
        return json;
    });
}






//新增前删除数据
export let clearAdjustmentBills = (pm={list:[]}) => (dispatch,getState)=>{
    dispatch(setLoading(true));
    return  ReqApi.post({
        url: Urls.SCM_INVENTORY_ADJUST_CLEAR_ADJUSTMENT_BILLS,
        pm,
    }).then((json)=>{
        dispatch(setLoading(false));
        return json;
    });
}


