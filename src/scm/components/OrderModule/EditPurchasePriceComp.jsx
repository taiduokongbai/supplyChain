import React, { Component } from "react";
import AddPurchasePriceComp from './AddPurchasePriceComp';


class EditPurchasePriceComp extends AddPurchasePriceComp {
    componentDidMount() {
        this.props.initData && this.props.initData();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.edit.current != this.props.edit.current) {
            this.props.initData && this.props.initData();
        }
    }
}

export default EditPurchasePriceComp;
