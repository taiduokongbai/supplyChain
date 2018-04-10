import React, { Component } from "react";
import { Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
let { observer } = mobxReact;
import AddPurRecNoticeDetailComp from './AddPurRecNoticeDetailComp';
import { editPurRecNoticeStore, editPurRecNoticeDetailStore} from '../stores/EditPurRecNoticeStore';

@observer
export default class EditPurRecNoticeDetailComp extends AddPurRecNoticeDetailComp {
    constructor(props, context) {
        super(props, context);
        this.store = editPurRecNoticeDetailStore;
        this.formStore = editPurRecNoticeStore;
    }
}
