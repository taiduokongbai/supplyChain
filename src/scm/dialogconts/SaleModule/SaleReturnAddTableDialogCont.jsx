import React, { Component } from "react";
import { Modal, message } from "../../../base/components/AntdComp";
import { connect } from 'react-redux';
import SaleReturnAddTableDialogComp from '../../components/SaleModule/SaleReturnAddTableDialogComp';
import SaleReturnAct from '../../actions/SaleModule/SaleReturnAct';

class SaleReturnAddTableDialogCont extends Component {
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
                <SaleReturnAddTableDialogComp
                    {...this.props}
                    visible={add_table_visiable}
                    onOk={this.handleSubmit}
                /> : null
        );
    }
}

SaleReturnAddTableDialogCont.defaultProps = {
    title: "添加物料",
    width: 750,
    maskClosable: true
}


const mapStateToProps = (state) => state.SaleReturnRedu.toJS();

const mapDispatchToProps = (dispatch) => ({
    handleCancel: () => { dispatch(SaleReturnAct.SaleReturnAddTableVisiable(false,'add')) },
    MaterialList: (pm) =>{ return dispatch(SaleReturnAct.MaterialList(pm)) },
    setTable: (data)=>{dispatch(SaleReturnAct.setTable(data))},
    addNewRowToTable: (data,isTax,typePage)=>{dispatch(SaleReturnAct.addNewRowToTable(data,isTax,typePage))},
    OriginalOrderList: (pm) => {
        return dispatch(SaleReturnAct.OriginalOrderList(pm));
    },
    UnitList: (pm) => {
        return dispatch(SaleReturnAct.UnitList(pm));
    },
    addSourceOrder:(pm)=>dispatch(SaleReturnAct.addSourceOrder(pm)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SaleReturnAddTableDialogCont);
