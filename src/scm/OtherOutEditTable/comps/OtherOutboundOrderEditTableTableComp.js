import React, {Component} from "react";
import {Table, InputNumber, Popconfirm, Form,message}from '../../../base/components/AntdComp';
import {OtherOutboundOrderEditTableStore} from "../stores/AddEditableTableStore";
import { materialPopStore, searchMaterialStore, materialChooseTableStore} from "../../OtherOutEditTable/stores/SelectEditTableStore";
import SelectEditTableComp from "../../OtherOutEditTable/comps/SelectEditTableComp";
import {OtherOutboundOrderAddEditableTableComp} from "./OtherOutboundOrderAddTableTableComp";
import OperationsComp from '../../../base/mobxComps/OperationsComp';
let { observer } = mobxReact;

@observer
export class OtherOutboundOrderEditTableTableComp extends OtherOutboundOrderAddEditableTableComp {
    tableStore = OtherOutboundOrderEditTableStore;
    constructor(props) {
        super(props);
    }

    handlerAddRow = (newRow)=>{
        if(!(this.tableStore.currentEditableKey) || this.tableStore.currentEditableKey  === null){
            materialPopStore.setVisible(true);
            materialChooseTableStore.fetchTableList();
        }else {
            message.warning('已有行处于编辑状态!');
        }
    }


    getSelectDialog = ()=>{
        return  <SelectEditTableComp/>;
    }

}

export default Form.create({withRef:true})(OtherOutboundOrderEditTableTableComp);