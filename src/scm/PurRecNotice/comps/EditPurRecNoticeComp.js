import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker } from '../../../base/components/AntdComp';
let { observer } = mobxReact;
const FormItem = Form.Item;

import { purRecNoticeStore } from '../stores/PurRecNoticeStore';
import { editPurRecNoticeStore, sourceOrderStore, wareHouseStore, employeeStore, editPurRecNoticeDetailStore } from '../stores/EditPurRecNoticeStore';
import { AddPurRecNoticeComp } from './AddPurRecNoticeComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import EditPurRecNoticeDetailComp from './EditPurRecNoticeDetailComp';

@observer
class EditPurRecNoticeComp extends AddPurRecNoticeComp {
    constructor(props, context) {
        super(props, context);
        this.title = '收货通知单号：';
        this.type = 'edit';
        this.store = editPurRecNoticeStore;
        this.sourceOrderStore = sourceOrderStore;
        this.wareHouseStore = wareHouseStore;
        this.employeeStore = employeeStore;
        this.detailStore = editPurRecNoticeDetailStore;
    }

    onMessage = () => {
        message.success('编辑成功');
        store.dispatch(TabsAct.TabRemove('editPurRecNotice', 'purRecNoticeList'));
        purRecNoticeStore.fetchTableList();
    }

    getDetailComp = () => <EditPurRecNoticeDetailComp />
    
}

const options = {
    onValuesChange(props, values) {
        editPurRecNoticeStore.setDetail(values)
    }
}
export default Form.create(options)(EditPurRecNoticeComp);
