/**
 * Created by MW on 2017/7/20.
 * 其它出库单container
 */

import React, {Component} from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import OtherOutboundOrderAddEditFormComp from '../../components/InventoryModule/OtherOutboundOrderAddEditFormComp';
import * as  OtherOutboundOrderAddAct from '../../actions/InventoryModule/OtherOutboundOrderAddAct';
import * as OtherOutAddRowDialogAct from "../../actions/InventoryModule/OtherOutAddRowDialogAct";
import OtherOutSearchMaterialDialogAct from '../../actions/InventoryModule/OtherOutAddSearchMaterialDialogAct';

import OtherOutAddSearchMaterialDialogCon from "../../dialogconts/InventoryModule/OtherOutAddSearchMaterialDialogCon";


import TabsAct from "../../actions/TabsAct";
import OtherOutboundOrderAct from '../../actions/InventoryModule/OtherOutboundOrderAct';
import {Spin,message,Form} from '../../../base/components/AntdComp';



import OtherOutboundOrderAddTableTableComp from "../../OtherOutEditTable/comps/OtherOutboundOrderAddTableTableComp";


import OtherOutAddRowDialogCont from "../../dialogconts/InventoryModule/OtherOutAddRowDialogCont";



import {OtherOutboundOrderAddTableStore} from "../../OtherOutEditTable/stores/AddEditableTableStore";




const OtherOutboundOrderEditFormComp = Form.create({withRef:true})(OtherOutboundOrderAddEditFormComp);

export class OtherOutboundOrderAddCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actionsType:null,
            currentSelect:{},
        }
    }

    validateDetails = (dataSource) => {

        if(dataSource.length > 0){

            if(!(OtherOutboundOrderAddTableStore.currentEditableKey  === null)){
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

        let bool = this.validateDetails(OtherOutboundOrderAddTableStore.dataSource.toJS());

        NavForm.validateFields((err, values) => {

            if ((!err)  && bool ) {

                values.deliveryDate = (values.deliveryDate && values.deliveryDate.format("YYYY-MM-DD HH:mm:ss")) || '';


                values.details = [].concat(OtherOutboundOrderAddTableStore.dataSource.slice(),OtherOutboundOrderAddTableStore.delRowCache.slice());

           /*     values.planAmount = values.planAmount + "";*/








                //提交成功刷新页面
                this.props.actions.setLoading(true);
                this.props.actions.addSubmit(values).then((json)=>{
                    if(json.status === 2000){
                        message.success("新建成功");
                        this.props.dispatch(TabsAct.TabRemove("inventoryOtherOutboundAdd","inventoryOtherOutbound"));
                        this.props.dispatch(OtherOutboundOrderAct.getList());
                    }
                    this.props.actions.setLoading(false);
                });

            }
        });





    }
    handlerBackClick=()=>{
        this.props.dispatch(TabsAct.TabRemove("inventoryOtherOutboundAdd","inventoryOtherOutbound"));
    }

    handleAddSubmitCallBack = (rowData)=>{
        this.props.actions.addRow(rowData);
    }

    handleEditSubmitCallBack=(rowData)=>{
        this.props.actions.editRow(rowData,rowData._index);

    }


    handlerEditRow = (record,index)=>{
        this.setState({
            actionsType:"edit",
        });
        record._index =  index;
        this.props.dispatch(OtherOutAddRowDialogAct.show(record));
    }


    render() {

        return (
            <div>
                <Spin spinning={this.props.loading}>
                    <div className="other-out">
                        <OtherOutboundOrderEditFormComp ref="NavForm" {...this.props} title="新建其他出库单据" onSubmit={this.handlerSubmit} onBackClick={this.handlerBackClick}/>
                        <OtherOutboundOrderAddTableTableComp ref="TableForm" {...this.props}/>
                    </div>
                </Spin>
            </div>
        )
    }
}



let mapStateToProps = (state) => {
    return state.OtherOutboundOrderAddRedu.toJS()
};
let mapDispatchToProps = (dispatch) => ({
    dispatch,
    actions: bindActionCreators(OtherOutboundOrderAddAct, dispatch)
});

//OtherOutAddRowDialogAct
export default connect(mapStateToProps, mapDispatchToProps)(OtherOutboundOrderAddCont);

