import React, { Component, PropTypes } from "react";
import { Form, message, Table } from '../../../base/components/AntdComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp'
import { materialPopStore, searchMaterialStore, materialChooseTableStore} from '../stores/SelectEditTableStore';


import {OtherOutboundOrderEditTableStore} from "../stores/AddEditableTableStore";

import SelectAddTableComp from "./SelectAddTableComp"

let { observer } = mobxReact;

@observer
class SelectEditTableComp extends SelectAddTableComp {

    store = materialPopStore;
    searchMaterialStore = searchMaterialStore;
    materialChooseTableStore = materialChooseTableStore;

    constructor(props){
        super(props);
    }

    handleSubmit = () => {
        if(this.state.selectedRows.length == 0){
            message.error('请先选择物料1');
        }else if(this.state.selectedRows[0].materialCode){
            OtherOutboundOrderEditTableStore.add(Object.assign({},this.state.selectedRows[0],{planAmount:0}));

            materialPopStore.setVisible(false);
        }
    };
}

export default SelectEditTableComp