import React, { Component } from "react";
import { connect } from 'react-redux';
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';
import TabsAct from '../../actions/TabsAct';
import SalePriceDetailComp from '../../components/SaleModule/SalePriceDetailComp';

class SalePriceDetailCont extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchPm: {
                contactCode: '' + props.contactCode, page: 1, pageSize: 20
            }
        };
    }


    render() {
        let { tabLoading } = this.props;
        return (
            <div className="MaterialView-content">
                <SalePriceDetailComp {...this.props} />
            </div>
        );

    }

}
const mapStateToProps = (state) => {
    return Object.assign({}, state.SalePriceRedu.toJS(), state.TabsRedu.toJS());
}

const mapDispatchToProps = (dispatch) => ({
    //  hidden_visible:(val)=>dispatch(MaterialAct.Hidden_visible(val)),
    //  hidden_button:(val)=>dispatch(MaterialAct.Hidden_button(val)),
    EditModul: () => dispatch(TabsAct.TabAdd({
        title: "编辑销售价格清单",
        key: "salePriceEdit"
    })),
    OpenSalePriceAdd: () => dispatch(TabsAct.TabAdd({
        title: "新建销售价格清单",
        key: "salePriceAdd"
    })),
    TabsRemove: () => { dispatch(TabsAct.TabRemove("salePriceDetail", "salePriceList")); },
    getEditData: (orderCode) => dispatch(SalePriceListAct.getSupplierData({ orderCode })),
    SalePriceStatus: (status, orderStatus, orderCode) => { return dispatch(SalePriceListAct.SalePriceStatus(status, { orderStatus, orderCode })) },
    SalePriceCopy: (data) => { dispatch(SalePriceListAct.SalePriceCopy(data)) },
    SalePriceSubmit: (data) => dispatch(SalePriceListAct.SalePriceSubmit(data)),//提交
    checkOrderStatus: () => dispatch(SalePriceListAct.checkOrderStatus()),
    SalePriceList: (pm) => dispatch(SalePriceListAct.SalePriceList(pm)),
    SalePriceRepeal: (data) => dispatch(SalePriceListAct.SalePriceRepeal(data)),//撤回
})
export default connect(mapStateToProps, mapDispatchToProps)(SalePriceDetailCont);
