/**
 * Created by MW on 2017/7/20.
 * 其它出库单container
 */

import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import OtherOutboundOrderAddEditFormComp from '../../components/InventoryModule/OtherOutboundOrderAddEditFormComp';
import * as  OtherOutboundOrderEditAct from '../../actions/InventoryModule/OtherOutboundOrderEditAct';
// import * as OtherOutEditRowDialogAct from "../../actions/InventoryModule/OtherOutEditRowDialogAct";
import OtherOutEditSearchMaterialDialogAct from '../../actions/InventoryModule/OtherOutEditSearchMaterialDialogAct';

// import OtherOutEditSearchMaterialDialogCon from "../../dialogconts/InventoryModule/OtherOutEditSearchMaterialDialogCon";
import OtherOutboundOrderEditTableTableComp from  "../../OtherOutEditTable/comps/OtherOutboundOrderEditTableTableComp";

import TabsAct from "../../actions/TabsAct";
import OtherOutboundOrderAct from '../../actions/InventoryModule/OtherOutboundOrderAct';

import {Spin, Form,message } from '../../../base/components/AntdComp';

// import OtherOutEditRowDialogCont from "../../dialogconts/InventoryModule/OtherOutEditRowDialogCont";



import {OtherOutboundOrderEditTableStore} from "../../OtherOutEditTable/stores/AddEditableTableStore";

const OtherOutboundOrderEditFormComp = Form.create({withRef:true})(OtherOutboundOrderAddEditFormComp);

class OtherOutboundOrderEditCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionsType:null,
            currentSelect:{},
        }
    }
    componentWillMount() {

    }
    handlerMaterialCodeRowClick=(e,text, record, index)=>{
        this.props.dispatch(OtherOutEditSearchMaterialDialogAct.show());
        this.setState({
            currentSelect:{
                text, record, index
            }
        })

    }

    validateDetails = (dataSource) => {

        if(dataSource.length > 0){

            if(!(OtherOutboundOrderEditTableStore.currentEditableKey  === null)){
                message.error("表格处于编辑状态不能提交.");
                return false;
            }

            for (var i = 0; i < dataSource.length; i++) {
                let row = dataSource[i];
                if (row.materialCode.length <= 0) {
                    /*   message.error(`验证错误${i + 1}行,物料编码必填。`);*/
                    message.error("明细项物料编码、计划数量不能为空.");
                    return false;
                }

                if (!(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(row.planAmount))) {
                    message.error(`验证错误${i + 1}行,计划数量必须输入整数。`);
                    return false;
                }
                if (!(row.planAmount > 0)) {
                    message.error("明细项物料编码、计划数量不能为空.");
                    /*   message.error(`验证错误${i + 1}行,输入值不能小于 0。`);*/
                    return false;
                }
                if (!(row.planAmount <= 99999999)) {
                    message.error(`验证错误${i + 1}行,输入值不能大于 99999999。`);
                    return false;
                }
            }


        }else {
            message.error(`明细项不能为空.。`);
            return false;
        }

        return true;
    }



    handlerSubmit=()=>{

        let NavForm = this.refs.NavForm.refs.wrappedComponent.props.form;
        let TableForm = this.refs.TableForm.refs.wrappedComponent.props.form;

        let bool = this.validateDetails(OtherOutboundOrderEditTableStore.dataSource.toJS());

        NavForm.validateFields((err, values) => {

            if ((!err)  && bool ) {

                values.deliveryDate = (values.deliveryDate && values.deliveryDate.format("YYYY-MM-DD HH:mm:ss")) || '';


                values.details = [].concat(OtherOutboundOrderEditTableStore.dataSource.slice(),OtherOutboundOrderEditTableStore.delRowCache.slice());

                /*     values.planAmount = values.planAmount + "";*/








                //提交成功刷新页面
                this.props.actions.setLoading(true);
                this.props.actions.editSubmit(values).then((json)=>{
                    if(json.status === 2000){
                        message.success("保存成功");
                        this.props.dispatch(TabsAct.TabRemove("inventoryOtherOutboundEdit","inventoryOtherOutbound"));
                        this.props.dispatch(OtherOutboundOrderAct.getList());
                    }
                    this.props.actions.setLoading(false);
                });

            }
        });

    }



    handlerBackClick=()=>{
        this.props.dispatch(TabsAct.TabRemove("inventoryOtherOutboundEdit","inventoryOtherOutbound"));
    }


    handleAddSubmitCallBack = (rowData)=>{
        this.props.actions.addRow(rowData);
    }

    handleEditSubmitCallBack=(rowData)=>{
        this.props.actions.editRow(rowData,rowData._index);

    }



    render() {

        return (
            <div>
                <Spin spinning={this.props.loading}>
                    <div className="other-out">
                        <OtherOutboundOrderEditFormComp ref="NavForm" {...this.props}  title="其他出库单据编辑" onSubmit={this.handlerSubmit} onBackClick={this.handlerBackClick}/>
                        <OtherOutboundOrderEditTableTableComp ref="TableForm"  {...this.props} />
                    </div>
                </Spin>
            </div>
        )
    }
}


let OtherOutboundOrderEditFromCont = Form.create()(OtherOutboundOrderEditCont);


let mapStateToProps = (state) => {
    return state.OtherOutboundOrderEditRedu.toJS()
};
let mapDispatchToProps = (dispatch) => ({
    dispatch,
    actions: bindActionCreators(OtherOutboundOrderEditAct, dispatch)
});


export default connect(mapStateToProps, mapDispatchToProps)(OtherOutboundOrderEditFromCont);

