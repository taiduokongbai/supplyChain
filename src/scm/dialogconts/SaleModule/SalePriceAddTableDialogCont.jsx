import React, { Component } from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import SaleAddLineDialogComp from '../../components/SaleModule/SaleAddLineDialogComp';
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';

class SalePriceAddTableDialogCont extends Component {
    constructor(props, context) {
        super(props, context);
    }
     handleSubmit = (data) => {
        const { handleSubmit, handleCancel, tablePaging, isFetch, onOK} = this.props;
    }
    render() {
        let { add_table_visiable } = this.props;
        return (
            add_table_visiable ?
                <SaleAddLineDialogComp
                    {...this.props}
                    visible={add_table_visiable}
                    onOk={this.handleSubmit}
                    className="sale-add-line-dialog"
                /> : null
        );
    }
}

SalePriceAddTableDialogCont.defaultProps = {
    title: "添加物料",
    width: 750,
    maskClosable: true
}


const mapStateToProps = (state) => state.SalePriceRedu.toJS();
const mapDispatchToProps = (dispatch) => ({
    handleCancel: () => { dispatch(SalePriceListAct.SaleOrderAddTableVisiable(false,'add')) },
    MaterialList: (pm) => dispatch(SalePriceListAct.MaterialList(pm)),
    // MaterialList: (pm) =>{ return dispatch(SaleOrderAct.MaterialList(pm)) },
    // handleSubmit: (data) => { return dispatch(SaleOrderAct.handleSubmit(data)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(SalePriceAddTableDialogCont);
