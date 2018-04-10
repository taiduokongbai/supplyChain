/**
 * Created by MW on 2017/8/31.
 */

import React,{Component} from "react";
import { connect } from 'react-redux';
import NewDirectTransferDialogComp from '../../components/InventoryModule/NewDirectTransferDialogComp';
import NewDirectTransferAct from '../../actions/InventoryModule/NewDirectTransferAct'


class NewDirectTransferDialogCont extends Component{
    constructor(props, context) {
        super(props, context);

    }
    render() {
        return (this.props.visible ?
            <NewDirectTransferDialogComp {...this.props}
                                         handleCancel={this.props.handleCancel}
                                         visible={this.props.visible} loading={this.props.popupSearchLoading}/>:null);
    }
}

let mapStateToProps = (state) => state.NewDirectTransferRedu.toJS();
let mapDispatchToProps = (dispatch) => ({
    handleCancel: () => {dispatch(NewDirectTransferAct.loadingOrVisible('visible',false))},
    checked: (record) => dispatch(NewDirectTransferAct.checked(record)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewDirectTransferDialogCont);