/**
 * 新建物料分类
 */
import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux';
import { Form, message } from '../../../base/components/AntdComp';
import { bindActionCreators } from 'redux';
import AddMaterialClassifyComp from '../../components/MaterialModule/AddMaterialClassifyComp';
import AddMaterialClassifyAct from '../../actions/MaterialModule/AddMaterialClassifyAct';

class AddMaterialClassifyCont extends Component {
    constructor(props, context) {
        super(props, context);
    }

    handleSubmit = (data) => {
        this.props.actions.addData(data);
    }

    handleCancel = () => {
        this.props.actions.modalVisible(false);
    }

    render() {
        let { visible } = this.props;
        return (
            visible ?
                <AddMaterialClassifyComp
                    className='material-classify-dialog'
                    {...this.props}
                    onOk={this.handleSubmit}
                    handleCancel={this.handleCancel}
                    handleSubmit={this.handleSubmit}
                /> : null
        );
    }


}

AddMaterialClassifyComp.defaultProps = {
    title: "新建物料分类",
    width: 750
}

let mapStateToProps = (state) => {
    return state.AddMaterialClassifyRedu.toJS()
}

let mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(AddMaterialClassifyAct, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AddMaterialClassifyCont);