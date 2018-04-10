import React, { Component } from "react";
import { Button, Popconfirm, message, Radio, Select, Form } from '../../../base/components/AntdComp';
let { observer } = mobxReact;
import AddSaleDeliveryNoticeDetailComp from './AddSaleDeliveryNoticeDetailComp';
import { editSaleDeliveryNoticeStore, editSaleDeliveryNoticeDetailStore} from '../stores/EditSaleDeliveryNoticeStore';

@observer
export default class EditSaleDeliveryNoticeDetailComp extends AddSaleDeliveryNoticeDetailComp {
    constructor(props, context) {
        super(props, context);
        this.store = editSaleDeliveryNoticeDetailStore;
        this.formStore = editSaleDeliveryNoticeStore;
    }
}
