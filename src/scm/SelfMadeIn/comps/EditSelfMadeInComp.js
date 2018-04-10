import React, { Component, PropTypes } from "react";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker } from '../../../base/components/AntdComp';
let { observer } = mobxReact;
const FormItem = Form.Item;

import { selfMadeInStore } from '../stores/SelfMadeInStore';
import { editSelfMadeInStore } from '../stores/AddSelfMadeInStore';
import { AddSelfMadeInComp } from './AddSelfMadeInComp';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';

@observer
class EditSelfMadeInComp extends AddSelfMadeInComp {
    constructor(props, context) {
        super(props, context);
        this.title = '编辑自制件入库单';
        this.type = 'edit';
        this.store = editSelfMadeInStore;
    }

    onMessage = () => {
        message.success('编辑成功');
        store.dispatch(TabsAct.TabRemove('editSelfMadeIn', 'selfMadeInList'));
        selfMadeInStore.fetchTableList();
    }
    
}

const options = {
    onValuesChange(props, values) {
        editSelfMadeInStore.setDetail(values)
    }
}
export default Form.create(options)(EditSelfMadeInComp);
