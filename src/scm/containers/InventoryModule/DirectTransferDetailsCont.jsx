/**
 * Created by MW on 2017/8/30.
 * 直接调拨单详情
 */
import React from 'react'
import {connect} from 'react-redux';
import DirectTransferDetailsComp from '../../components/InventoryModule/DirectTransferDetailsComp'
import TabsAct from '../../actions/TabsAct'

let mapStateToProps = (state) => {
    return state.DirectTransferDetailsRedu.toJS();
};

let mapDispatchToProps = (dispatch) => ({
    newTab: (allotOrderCode) => {
        if(allotOrderCode){
            dispatch(TabsAct.TabAdd({title:'直接调拨单详情', key:'inventoryDirectTransferDetails'}));
        } else {
            dispatch(TabsAct.TabAdd({title:'新建直接调拨单', key:'inventoryNewDirectTransfer'}));
        }

    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DirectTransferDetailsComp)