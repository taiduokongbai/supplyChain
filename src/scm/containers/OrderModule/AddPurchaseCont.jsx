import React, { Component } from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import PurchaseAct from '../../actions/OrderModule/PurchaseAct';
import AddPurchaseComp from '../../components/OrderModule/AddPurchaseComp';
import TabsAct from '../../actions/TabsAct';

class AddPurchaseCont extends Component {
    constructor(props, context) {
        super(props, context);
    }
    handleSubmit = (data) => {
        const { handleSubmit, tabRemove, PurchaseList } = this.props;
        handleSubmit(data).then(json => {
            if (json.status == 2000) {
                message.success('新建成功');
                tabRemove();
                PurchaseList({ page: 1, pageSize: 15 });
            } else {

            };
        });
    }
    render() {
        return (
            <AddPurchaseComp
                {...this.props}
                onOk={this.handleSubmit}
                loading={this.props.add.purchaseLoading}
                />  
        );
    }
}
AddPurchaseCont.defaultProps = {
    type: "add",
}
const mapStateToProps = (state) => {
    return state.PurchaseRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    getShippingAddressList: (pm) => dispatch(PurchaseAct.ShippingAddressList({ status:1,isSog:1,...pm}, 'add')),
    getContactsList: (pm) => dispatch(PurchaseAct.ContactsList({ status: 1, ...pm }, 'add')),
    getBuyerlist: (pm) => dispatch(PurchaseAct.Buyerlist({ status: 1, ...pm }, 'add')),
    getSupplierList: (pm) => dispatch(PurchaseAct.SupplierList({ status:1,...pm}, 'add')),
    getCurList: (pm) => dispatch(PurchaseAct.CurList({ status:1,...pm}, 'add')),
    getSiteList: (pm) => dispatch(PurchaseAct.SiteList({ status:1,...pm}, 'add')),
    getCostCenterList: (pm) => dispatch(PurchaseAct.CostCenterList({ status:1,...pm}, 'add')),
    getSettleList: (pm) => dispatch(PurchaseAct.SettleList({ status:1,...pm}, 'add')),
    getReceiveAddressList: (pm) => dispatch(PurchaseAct.ReceiveAddressList({ status:1,...pm}, 'add')),    
    getPurchaseOrgList: (pm) => dispatch(PurchaseAct.PurchaseOrgList({ status:1,...pm}, 'add')),
    getPaymentlist: (pm) => dispatch(PurchaseAct.Paymentlist({ status:1,...pm}, 'add')),
    getInvoiceTypeList: (pm) => dispatch(PurchaseAct.InvoiceTypeList({ status:1,...pm}, 'add')),
    getMaterialList: (pm) => dispatch(PurchaseAct.MaterialList2(pm)),
    getMeasureList: (pm) => dispatch(PurchaseAct.MeasureList(pm)),
    DeleteData: (value) => dispatch(PurchaseAct.DeleteData(value, 'add')),
    handleSubmit: (data) => dispatch(PurchaseAct.AddPurchase(data)),
    tabRemove: () => {
        dispatch(TabsAct.TabAdd({
            title: "采购订单",
            key: "purchase"
        }));
        dispatch(TabsAct.TabRemove("addPurchase", "purchase"));
    },
    PurchaseList: (pm) => dispatch(PurchaseAct.PurchaseList(pm)),
    showDetailLine: (type, dtype, value) => dispatch(PurchaseAct.DetailLineVisible(type, dtype, value)), 
    ExpenseVisible: (type, dtype, value) => dispatch(PurchaseAct.ExpenseVisible(type, dtype, value)),
    getExpenseList: (pm) => dispatch(PurchaseAct.ExpenseList(pm)),
    MaterialAllUnit: (pm) => dispatch(PurchaseAct.MaterialAllUnit(pm)),
    AddressDetail: (id) => dispatch(PurchaseAct.AddressDetail({id})),
})


export default connect(mapStateToProps, mapDispatchToProps)(AddPurchaseCont);
