/**
 * Created by MW on 2017/7/19.
 * 其他出库单_列表
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import * as InventoryAdjustmentAddAct  from "../../actions/InventoryModule/InventoryAdjustmentAddAct";
import InventoryAdjustmentAddComp from "../../components/InventoryModule/InventoryAdjustmentAddComp";
import {Form} from '../../../base/components/AntdComp'


let mapStateToProps = (state) => {
    return state.InventoryAdjustmentAddRedu.toJS()
};
let mapDispatchToProps = (dispatch) => ({
    dispatch,
    actions: bindActionCreators(InventoryAdjustmentAddAct, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(InventoryAdjustmentAddComp));
