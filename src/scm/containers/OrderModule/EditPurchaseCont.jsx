import React, { Component } from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import PurchaseAct from '../../actions/OrderModule/PurchaseAct';
import TabsAct from '../../actions/TabsAct';
import EditPurchaseComp from '../../components/OrderModule/EditPurchaseComp';

class EditPurchaseCont extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            data: {}
        };

    }
    initData = (record) => {
        // let {PurchaseDetail, purchaseLoading, purchaserId} = this.props;
        // if ( purchaserId ) {
        //     PurchaseDetail(purchaserId);
        // }
        this.setState({data:record})
    }

    handleSubmit = (data) => {
        const { handleSubmit, tabRemovePurchaseList, tabRemovePurchaseView, PurchaseList, sourceType, PurchaseCode, purchaserId } = this.props;
        handleSubmit(data).then(json => {
            if (json.status == 2000) {
                message.success('编辑成功');
                // if (sourceType == 'purchaseList') {
                    tabRemovePurchaseList();
                    PurchaseList({ page: 1, pageSize: 15 });
                // }
                // if (sourceType == 'purchaseView') {
                    // tabRemovePurchaseView();
                    // PurchaseCode(purchaserId);
                    // PurchaseList({ page: 1, pageSize: 15 });
                // }
            } else {

            };
        });
    }

    render() {
        return (
            <EditPurchaseComp
                {...this.props}
                onOk={this.handleSubmit}
                initData={this.initData}
            />
        );
    }
}

EditPurchaseCont.defaultProps = {
    type: "edit",
}
const mapStateToProps = (state) => {
    return state.PurchaseRedu.toJS();
}
const mapDispatchToProps = (dispatch, ownProps) => ({
    PurchaseDetail: (purchaserId) => dispatch(PurchaseAct.PurchaseDetail({ orderCode: purchaserId })),
    getShippingAddressList: (pm) => dispatch(PurchaseAct.ShippingAddressList({ status:1,isSog:1,...pm}, 'edit')),
    getContactsList: (pm) => dispatch(PurchaseAct.ContactsList({ status: 1, ...pm }, 'edit')),
    getSettleList: (pm) => dispatch(PurchaseAct.SettleList({ status:1,...pm}, 'edit')),
    getReceiveAddressList: (pm) => dispatch(PurchaseAct.ReceiveAddressList({ status:1,...pm}, 'edit')), 
    getBuyerlist: (pm) => dispatch(PurchaseAct.Buyerlist({ status: 1, ...pm }, 'edit')),
    getSupplierList: (pm) => dispatch(PurchaseAct.SupplierList({ status:1,...pm}, 'edit')),
    getCurList: (pm) => dispatch(PurchaseAct.CurList({ status:1,...pm}, 'edit')),
    getSiteList: (pm) => dispatch(PurchaseAct.SiteList({ status:1,...pm}, 'edit')),
    getCostCenterList: (pm) => dispatch(PurchaseAct.CostCenterList({ status:1,...pm}, 'edit')),
    getPurchaseOrgList: (pm) => dispatch(PurchaseAct.PurchaseOrgList({ status:1,...pm}, 'edit')),
    getPaymentlist: (pm) => dispatch(PurchaseAct.Paymentlist({ status:1,...pm}, 'edit')),
    getInvoiceTypeList: (pm) => dispatch(PurchaseAct.InvoiceTypeList({ status:1,...pm}, 'edit')),
    DeleteData: (value) => { dispatch(PurchaseAct.DeleteData(value, 'edit')) },
    getMaterialList: (pm) => dispatch(PurchaseAct.MaterialList2(pm)),
    getMeasureList: (pm) => dispatch(PurchaseAct.MeasureList(pm)),
    handleSubmit: (data) => dispatch(PurchaseAct.EditPurchase(data)),
    PurchaseList: (pm) => dispatch(PurchaseAct.PurchaseList(pm)),
    tabRemovePurchaseList: () => {
        dispatch(TabsAct.TabAdd({
            title: "采购订单",
            key: "purchase"
        }));
        dispatch(TabsAct.TabRemove("editPurchase", "purchase"));
    },
    tabRemovePurchaseView: () => {
        dispatch(TabsAct.TabRemove("editPurchase", "purchaseViewCont"));
    },
    PurchaseCode: (orderCode) => dispatch(PurchaseAct.PurchaseCode(orderCode)),
    showDetailLine: (type, dtype, value) => dispatch(PurchaseAct.DetailLineVisible(type, dtype, value)),
    ExpenseVisible: (type, dtype, value) => dispatch(PurchaseAct.ExpenseVisible(type, dtype, value)),
    getExpenseList: (pm) => dispatch(PurchaseAct.ExpenseList(pm)),
    ExpenseDetailVisible: (value) => dispatch(PurchaseAct.ExpenseDetailVisible('edit', value)),
    MaterialAllUnit: (pm) => dispatch(PurchaseAct.MaterialAllUnit(pm)),
    AddressDetail: (id) => dispatch(PurchaseAct.AddressDetail({id})),
})


export default connect(mapStateToProps, mapDispatchToProps)(EditPurchaseCont);
