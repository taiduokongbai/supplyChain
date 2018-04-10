import React, { Component } from "react";
import { Table, Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp'
import EditPurReturnAddMatComp from './EditPurReturnAddMatComp';
import EditPurReturnEditMatComp from './EditPurReturnEditMatComp';
import AddPurReturnDetailComp from './AddPurReturnDetailComp';
import { enumStore } from '../../../base/stores/EnumStore';
let { observer } = mobxReact;
import { purReturnEditStore, editPurReturnDetailStore, addMaterialStore, editMaterialStore } from '../stores/EditPurchaseReturnStore';
import { measureStore } from '../../data/DropDownStore';

@observer
export default class EditPurReturnDetailComp extends AddPurReturnDetailComp {
    constructor(props, context) {
        super(props, context);
        this.store = editPurReturnDetailStore;
        this.purReturnFormStore = purReturnEditStore;
        this.addMaterialStore = addMaterialStore;
        this.editMaterialStore = editMaterialStore;
    }

    getMaterialCont = () => (<div>
        <EditPurReturnAddMatComp />
        <EditPurReturnEditMatComp />
    </div>
    )
}
