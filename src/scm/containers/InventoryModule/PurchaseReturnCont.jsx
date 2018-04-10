/**
 * Created by MW on 2017/4/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import PurchaseReturnHouseComp from '../../components/InventoryModule/PurchaseReturnComp'
import TabsAct from '../../actions/TabsAct'
import PurchaseReturnHouseAct from '../../actions/InventoryModule/PurchaseReturnAct'
import PurchaseReturnOutboundDetailsAct from '../../actions/InventoryModule/PurchaseReturnOutboundDetailsAct'
import PurchaseListAct from '../../actions/InventoryModule/PurchaseListAct'
import SupplierAct from '../../actions/RenterModule/SupplierAct'
import { purReturnViewStore } from '../../purchaseReturn/stores/PurchaseReturnViewStore'
let mapStateToProps = (state) => {
    return state.PurchaseReturnHouseRedu.toJS();
}

let mapDispatchToProps = (dispatch) => ({
    getList: (search) => {
        dispatch(PurchaseReturnHouseAct.getList(search))
    },
    loading: (loading,flag) => {
        dispatch(PurchaseReturnHouseAct.loading(loading,flag))
    },
    newTab: (tab,parameter) => {
        switch (tab) {
            case 'newBuilt':
                dispatch(TabsAct.TabAdd({title:'新建采购退货出库单', key:'inventoryNewPurchaseReturn'}));
                break;
            case 'storeDetails':
                dispatch(TabsAct.TabAdd({title:'采购退货出库单详情', key:'inventoryPurchaseReturnOutboundDetails'}));
                dispatch(PurchaseReturnOutboundDetailsAct.getList(parameter));
                break;
            case 'edit':
                dispatch(PurchaseReturnHouseAct.isLock({orderCode:parameter}));
                break;
            default: return null;
        }
    },
    sidebarVisible: (title,obj) => {
        switch (title) {
            case 'sideDetails':
                dispatch(TabsAct.TabAdd({title:'采购退货单详情', key:'purchaseReturnView'}));
                purReturnViewStore.fetchPurReturnView(obj);
                break;
            case 'sideSupplier':
                dispatch(TabsAct.TabAdd({title:'供应商详情', key:'supplierViewCont'}));
                dispatch(SupplierAct.getSupplierData(obj, 'detail'));
                dispatch(SupplierAct.ContactList({bpCode:obj.supplierCode,page:1,pageSize:10}));
                dispatch(SupplierAct.supplierBaseLoading(true));
                break;
            default:
                return null;
                break;
        }
    },
    confirmDelete: (orderCode) => {
        return dispatch(PurchaseReturnHouseAct.confirmDelete({orderCode:orderCode}))
    },
    GetCodeRule: () => dispatch(PurchaseListAct.GetCodeRule({businessIndex:31})),
})

export default connect(mapStateToProps,mapDispatchToProps)(PurchaseReturnHouseComp)