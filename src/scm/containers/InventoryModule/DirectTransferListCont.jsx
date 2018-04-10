/**
 * Created by MW on 2017/8/30.
 * 直接调拨单
 */
import React from 'react'
import {connect} from 'react-redux';
import DirectTransferListComp from '../../components/InventoryModule/DirectTransferListComp'
import TabsAct from '../../actions/TabsAct'
import DirectTransferListAct from '../../actions/InventoryModule/DirectTransferListAct'
import DirectTransferDetailsAct from '../../actions/InventoryModule/DirectTransferDetailsAct'
let mapStateToProps = (state) => {
    return state.DirectTransferListRedu.toJS();
};

let mapDispatchToProps = (dispatch) => ({

    newTab: (allotOrderCode,flag) => {
        if(flag=='details'){
           dispatch(TabsAct.TabAdd({title:'直接调拨单详情', key:'inventoryDirectTransferDetails'})) 
           dispatch(DirectTransferDetailsAct.details(allotOrderCode))
        }else{
            dispatch(TabsAct.TabAdd({title:'新建直接调拨单', key:'inventoryNewDirectTransfer'}))
        }
    },
    PurchaseList: (pm) => {
        dispatch( DirectTransferListAct.PurchaseList(pm) )
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(DirectTransferListComp)