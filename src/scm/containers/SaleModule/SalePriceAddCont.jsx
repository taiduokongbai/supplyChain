import React, { Component } from "react";
import { connect } from 'react-redux';
import { Modal, message } from "../../../base/components/AntdComp";
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';
import SalePriceAddComp from '../../components/SaleModule/SalePriceAddComp';
import SalePriceListComp from '../../components/SaleModule/SalePriceListComp'
import TabsAct from '../../actions/TabsAct';

class SalePriceAddCont extends Component {
    constructor(props, context) {
        super(props, context);
        this.searchPm = { page: 1, pageSize: 10 };
    };
    handleSubmit = (data) => {
        const { dispatch, loading, handleSubmit, tablePaging, getEditData, Record, getBusinessPartnerData, getCurrencyList, showComponentMsg, supplierloading, GetSalePriceList } = this.props;
     
        handleSubmit(data).then(json => {
            if (json.status == "2000") {
                this.props.tabAdd();
                this.props.tabRemove();
                GetSalePriceList({
                    "page": "1",
                    "pageSize": "10"
                });
                supplierloading(false);
            } else {
            };
        });

    }

    render() {
        const { add_supplier_visiable, supplierLoading } = this.props;

        return (
            <SalePriceAddComp
                {...this.props}
                loading={supplierLoading}
                onOk={this.handleSubmit}
                salePriceInfo={this.props.salePriceAddDetail}
            />
        );
    }
}


SalePriceAddCont.defaultProps = {
    width: 800,
    typePage: 'add'
}
const mapStateToProps = (state) => {
    return state.SalePriceRedu.toJS();
}
const mapDispatchToProps = (dispatch) => ({
    supplierloading: (pm) => { dispatch(SalePriceListAct.supplierLoading(pm)) },
    CurrencyList: (pm, type) => dispatch(SalePriceListAct.CurrencyList(pm, type)),
    SaleOrderAddTableVisiable: (value, type) => dispatch(SalePriceListAct.SaleOrderAddTableVisiable(value, type)),
    SourceEditDilog: (value) => dispatch(SalePriceListAct.SourceEditDilog(value)),
    handleSubmit: (data) => { return dispatch(SalePriceListAct.AddSalePrice(data)) },
    detailPriceList: (data) => dispatch(SalePriceListAct.detailPriceList(data)),
    SalePriceAddDataSource: (data) => dispatch(SalePriceListAct.SalePriceAddDataSource(data)),
    GetSalePriceList: (pm) => dispatch(SalePriceListAct.SalePriceList(pm)),
    checkOrderStatus:()=>{ return dispatch(SalePriceListAct.checkOrderStatus()) },
    tabAdd: () => {
        dispatch(TabsAct.TabAdd({
            title: "销售价格清单",
            key: "salePriceList"
        }));
    },
    dispatch,
    tabRemove: () => {
        dispatch(TabsAct.TabRemove("salePriceAdd", "salePriceList"));
    },
    checkOrderStatus:()=>{ return dispatch(SalePriceListAct.checkOrderStatus()) },
    ImportViewVisiable:(value)=>{dispatch(SalePriceListAct.ImportViewVisiable(value))}, 

})


export default connect(mapStateToProps, mapDispatchToProps)(SalePriceAddCont);
