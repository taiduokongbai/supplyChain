/**
 * Created by MW on 2017/8/30.
 * 新建直接调拨单
 */
import React from 'react'
import {connect} from 'react-redux';
import NewDirectTransferComp from '../../components/InventoryModule/NewDirectTransferComp'
import TabsAct from '../../actions/TabsAct'
import NewDirectTransferAct from '../../actions/InventoryModule/NewDirectTransferAct'

let mapStateToProps = (state) => {
    return state.NewDirectTransferRedu.toJS();
};

let mapDispatchToProps = (dispatch) => ({
    newTab: (orderCode) => {
        if(orderCode){
            dispatch(TabsAct.TabAdd({title:'直接调拨单详情', key:'inventoryDirectTransferDetails'}));
        } else {
            dispatch(TabsAct.TabAdd({title:'新建直接调拨单', key:'inventoryNewDirectTransfer'}));
        }
    },
    searchMaterial: () => {
        dispatch(NewDirectTransferAct.searchMaterial());
    },
    storeInitOrderInfo: () => {
        dispatch(NewDirectTransferAct.storeInitOrderInfo());
    },
    onSelectOut: (value) => {
        dispatch(NewDirectTransferAct.onSelectOut({siteCode:value}));
    },
    onSearchOut: (value) => {
        dispatch(NewDirectTransferAct.onSearchOut({page:1,pageSize:10,siteCode:value,status:1}));
    },

    tableChange: (index) => {
        dispatch(NewDirectTransferAct.tableChange(index));
    },

    advance: (record) => {
        dispatch(NewDirectTransferAct.advance(record));
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(NewDirectTransferComp)