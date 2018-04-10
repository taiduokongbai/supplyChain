//新增采购明细行
import React, { Component } from "react";
import { Modal, message } from '../../../base/components/AntdComp';
import { connect } from 'react-redux';
import PurchaseAct from '../../actions/OrderModule/PurchaseAct';
import PurExpenseDetailComp from '../../components/OrderModule/PurExpenseDetailComp';

class AddPurExpenseDetailCont extends Component {
    constructor(props, context) {
        super(props, context);

    }
    handleSubmit = (data) => {
        this.handleCancel();
    }
    handleCancel = () => {
        let { ExpenseVisible, type, dtype } = this.props;
        ExpenseVisible(type, dtype, false);
    }
    
    render = () => { 
        let { type, dtype } = this.props;
        let { visible } = this.props[type]['expenseShow'][dtype];
        return (
            visible ?
                <PurExpenseDetailComp {...this.props}  />
                : null
        );
    }
}



export default AddPurExpenseDetailCont;
