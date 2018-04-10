/**
 * Created by MW on 2017/9/5.
 */

import React,{Component} from "react";
import { connect } from 'react-redux';
import NewDirectTransferAdvanceComp from '../../components/InventoryModule/NewDirectTransferAdvanceComp';
import NewDirectTransferAct from '../../actions/InventoryModule/NewDirectTransferAct'


class NewDirectTransferAdvanceCont extends Component{
    constructor(props, context) {
        super(props, context);

    }
    render() {
        return (this.props.visibleAdvance ?
            <NewDirectTransferAdvanceComp {...this.props}
                                         handleCancel={this.props.handleCancel}
                                         visible={this.props.visibleAdvance} loading={this.props.AdvanceLoading}/>:null);
    }
}

let mapStateToProps = (state) => state.NewDirectTransferRedu.toJS();
let mapDispatchToProps = (dispatch) => ({
    handleCancel: () => {dispatch(NewDirectTransferAct.loadingOrVisible('visibleAdvance',false))},
});

export default connect(mapStateToProps, mapDispatchToProps)(NewDirectTransferAdvanceCont);