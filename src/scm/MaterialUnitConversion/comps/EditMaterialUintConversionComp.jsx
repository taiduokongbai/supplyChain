import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, Row, Col } from '../../../base/components/AntdComp';
import { enumStore } from '../../../base/stores/EnumStore';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import SelectTableComp from '../../../base/mobxComps/SelectTableComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import Validate from '../../../base/consts/ValidateList';
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
//物料单位换算新建和搜索store
import { AddMaterialUintConversionComp } from './AddMaterialUintConversionComp';
import { editMaterialUintConversionStore } from '../stores/MaterialUintConversionListStore';
import MeasureComp from '../../../base/mobxComps/MeasureComp';
import Measurestore from '../../../base/stores/Measurestore';
let Option = Select.Option;
const FormItem = Form.Item;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
class EditMaterialUintConversionComp extends AddMaterialUintConversionComp {
    constructor(props, context) {
        super(props, context);
        this.store = editMaterialUintConversionStore;
        this.title='edit';
        this.measurestore = new Measurestore();
        this.businessUnitMeasurestore = new Measurestore();
        this.props.form.getFieldDecorator('keys', { initialValue: [1] });
        this.number = 1;
    }
}
export default Form.create()(EditMaterialUintConversionComp)
