import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import AddOtherWareHousePageComp from '../../components/InventoryModule/AddOtherWareHousePageComp';
import { connect } from 'react-redux';
import { WareHouseStore } from "../../InventoryCheck/store/CheckPlanStore";
import OtherWarehouseEditAct from '../../actions/InventoryModule/OtherWarehouseEditAct';
import OtherWarehouseEditTableEditComp from '../../components/InventoryModule/OtherWarehouseEditTableEditComp'
import { Spin } from '../../../base/components/AntdComp';

class OtherWarehouseEditCont extends Component {

    constructor(props, context) {
        super(props, context);
        this._warehouseStore = new WareHouseStore();
    }

    componentDidMount() {
        this._warehouseStore.fetchTreeSelectList();   // 请求收货仓库  属性结构  
    }
    

    render() {
        return (
            <div>
                <Spin  spinning={this.props.pageloading}>
                    <AddOtherWareHousePageComp {...this.props} store={this._warehouseStore}/>
                    <OtherWarehouseEditTableEditComp {...this.props} />
                </Spin>

            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return state.OtherWarehouseEditRedu.get('editWareHouse').toJS()
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(OtherWarehouseEditAct, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(OtherWarehouseEditCont)


