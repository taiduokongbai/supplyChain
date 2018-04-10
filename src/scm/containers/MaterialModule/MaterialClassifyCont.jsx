/**
 * 物料分类
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Spin } from '../../../base/components/AntdComp';
import MaterialClassifyAct from '../../actions/MaterialModule/MaterialClassifyAct';
import EditMaterialClassifyAct from '../../actions/MaterialModule/EditMaterialClassifyAct';
import MaterialClassifyComp from '../../components/MaterialModule/MaterialClassifyComp';
import AddMaterialClassifyAct from '../../actions/MaterialModule/AddMaterialClassifyAct';
class MaterialClassifyCont extends Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div className="material-classify">
                <MaterialClassifyComp {...this.props} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    state: state.MaterialClassifyRedu.toJS()
})

const mapDispatchToProps = (dispatch, getState) => ({
    getList: (pm) => dispatch(MaterialClassifyAct.getList(pm)),
    expandedRowKeys: (val) => dispatch(MaterialClassifyAct.expandedRowKeys(val)),
    forbiddenCheckbox: (bool) => dispatch(MaterialClassifyAct.forbiddenCheckbox(bool)),
    updateOrderStatus: (pm, str) => dispatch(MaterialClassifyAct.updateOrderStatus(pm, str)),
    delete: (pm) => dispatch(MaterialClassifyAct.delete(pm)),
    getDetails: (pm) => dispatch(MaterialClassifyAct.getDetails(pm)),  //详情
    checkChildren: (pm, str) => dispatch(MaterialClassifyAct.checkChildren(pm, str)),
    checkChildrenIndex: (index) => dispatch(MaterialClassifyAct.checkChildrenIndex(index)),
    modalVisible: (bool) => dispatch(EditMaterialClassifyAct.modalVisible(bool)),
    getMaterialDetail: (pm) => dispatch(EditMaterialClassifyAct.getMaterialDetail(pm)),
    addModalVisible: (bool) => dispatch(AddMaterialClassifyAct.modalVisible(bool)),
    addExpandedRow: (val) => dispatch(MaterialClassifyAct.addExpandedRow(val)),
    deleteExpandedRow: (val) => dispatch(MaterialClassifyAct.deleteExpandedRow(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(MaterialClassifyCont)





