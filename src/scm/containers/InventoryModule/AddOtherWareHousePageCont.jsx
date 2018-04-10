import React, { Component } from "react";
import { bindActionCreators } from 'redux';
import AddOtherWareHousePageComp from '../../components/InventoryModule/AddOtherWareHousePageComp';
import AddOtherWareHousePageTableComp from '../../components/InventoryModule/AddOtherWareHousePageTableComp';
import { connect } from 'react-redux';
import { WareHouseStore } from "../../InventoryCheck/store/CheckPlanStore";
import AddOtherWareHousePageAct from '../../actions/InventoryModule/AddOtherWareHousePageAct';
import { Spin } from '../../../base/components/AntdComp';

class AddOtherWareHousePageCont extends Component {
    constructor(props, context) {
        super(props, context);
        this._warehouseStore = new WareHouseStore();
    }
    componentDidMount() {
        this._warehouseStore.fetchTreeSelectList().then(json => {
            if (json.status === 2000) {
                this.props.actions.storeInitOrderInfo();
                this.props.actions.getInfo();
            }else {
                this.props.actions.storeInitOrderInfo();
                this.props.actions.getInfo();
            }
        })
    }
    render() {
        return (
            <div>
                <Spin spinning={this.props.listLoading}>
                    <AddOtherWareHousePageComp {...this.props} store={this._warehouseStore} />
                    <AddOtherWareHousePageTableComp {...this.props} />
                </Spin>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state.AddOtherWareHousePageRedu.get('addWareHouse').toJS()
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(AddOtherWareHousePageAct, dispatch)
})
export default connect(mapStateToProps, mapDispatchToProps)(AddOtherWareHousePageCont)


