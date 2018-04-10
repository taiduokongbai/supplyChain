//新增采购明细行
import React, { Component } from "react";
import { Modal, message } from '../../../base/components/AntdComp';
import { connect } from 'react-redux';
import PurchaseAct from '../../actions/OrderModule/PurchaseAct';
import AddPurDetailLineComp from '../../components/OrderModule/AddPurDetailLineComp';

class AddPurDetailLineCont extends Component {
    constructor(props, context) {
        super(props, context);

    }
    handleSubmit = (data) => {
        let { handleSubmit, detail } = this.props;
        let newData = Object.assign({}, detail, data);
        handleSubmit(newData);
        this.handleCancel();
    }
    handleCancel = () => {
        let { showDetailLine, type, dtype } = this.props;
        showDetailLine(type, dtype, false);
    }
    
    render() {
        let { type, dtype } = this.props;
        let { visible } = this.props[type]['dialog'][dtype];
        return (
            visible ?
                <AddPurDetailLineComp
                    {...this.props}
                    onOk={this.handleSubmit}
                    visible={visible}
                    handleCancel={this.handleCancel}
                    type={type}
                /> : null
        );
    }
}

AddPurDetailLineCont.defaultProps = {
    width: 800,
    title: '添加行',
    className: "purOrder-detail-line",
    dtype: 'add',
    detail: {
        // "id": "",
        // "lineNum": "",
        // "purchaseType": "0",
        "materialCode": "",
        "materialQuality": "",
        "standardCode": "",
        "materialName": "",
        "materialSpec": "",
        "materialModel": "",
        "orderQty": "0.00",
        "purchaseUnit": "",
        "priceQty": "0.00",
        "priceUnit": "",
        "priceUnitDetl": "",
        "price": "0.00",
        //"taxRate": "",
        "netAmount": "0.00",
        "taxAmount": "0.00",
        "totalAmount": "0.00",
        "expenseAmount": "",
        "spuCode": "",
        "spuName": "",
        "remark": "",
        "expenses":[],
    },
    disableds:[],
}


export default AddPurDetailLineCont;
