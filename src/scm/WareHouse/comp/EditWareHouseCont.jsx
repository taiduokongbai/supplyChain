import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Form, Select, Row, Col } from '../../../base/components/AntdComp';
import FormModalComp from "../../../base/mobxComps/FormModalComp";
import AddNewAddrComp from "./AddNewAddrComp";
import { AddWareHouseCont } from "./AddWareHouseCont";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const Option = Select.Option;
const FormItem = Form.Item;

@observer
class EditWareHouseCont extends AddWareHouseCont{
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store;
    }

    
}

const options = {
    onValuesChange(props, values) {

    }
}

export default Form.create(options)(EditWareHouseCont); 
