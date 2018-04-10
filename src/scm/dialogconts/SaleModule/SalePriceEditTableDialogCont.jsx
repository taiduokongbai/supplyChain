import React, { Component } from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import SaleEidtLineDialogComp from '../../components/SaleModule/SaleEditLineDialogComp';
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';

class SalePriceEditTableDialogCont extends Component {
    constructor(props, context) {
        super(props, context);
    }
     handleSubmit = (data) => {
        const { handleSubmit, handleCancel, tablePaging, isFetch, onOK} = this.props;
       this.props.setTable(data);
    }
    render() {
        let { edit_table_visiable } = this.props;
        return (
            edit_table_visiable ?
                <SaleEidtLineDialogComp
                    {...this.props}
                    visible={edit_table_visiable}
                    onOk={this.handleSubmit}
                    className="sale-add-line-dialog"
                /> : null
        );
    }
}

SalePriceEditTableDialogCont.defaultProps = {
    title: "编辑物料",
    width: 750,
    maskClosable: true
}


const mapStateToProps = (state) => state.SalePriceRedu.toJS();
const mapDispatchToProps = (dispatch) => ({
    handleCancel: () => { dispatch(SalePriceListAct.SaleOrderAddTableVisiable(false,'edit')) },
    MaterialList: (pm) => dispatch(SalePriceListAct.MaterialList(pm)),
    

    // handleSubmit: (data) => { return dispatch(SaleOrderAct.handleSubmit(data)) },
})

export default connect(mapStateToProps, mapDispatchToProps)(SalePriceEditTableDialogCont);
