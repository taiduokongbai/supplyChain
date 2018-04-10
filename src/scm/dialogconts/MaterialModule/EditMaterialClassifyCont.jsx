/**
 * 编辑物料分类
 */
import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import { Form, message } from '../../../base/components/AntdComp';
import { bindActionCreators } from 'redux';
import EditMaterialClassifyComp from '../../components/MaterialModule/EditMaterialClassifyComp';
import EditMaterialClassifyAct from '../../actions/MaterialModule/EditMaterialClassifyAct';

class EditMaterialClassifyCont extends Component {
    constructor(props, context) {
        super(props, context);
    }

    handleSubmit = (data) => {
        this.props.actions.editData(data);
    }

    handleCancel = () => {
        this.props.actions.modalVisible(false);
    }

    render() {
        let { visible } = this.props;
        return (
            visible ?
                <EditMaterialClassifyComp
                    className='material-classify-dialog'
                    {...this.props}
                    onOk={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    handleSubmit={this.handleSubmit}
                /> : null
        );
    }


}

EditMaterialClassifyComp.defaultProps = {
    title: "编辑物料分类",
    width: 750
}

let mapStateToProps = (state) => {
    return state.EditMaterialClassifyRedu.toJS()
}

let mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(EditMaterialClassifyAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMaterialClassifyCont);