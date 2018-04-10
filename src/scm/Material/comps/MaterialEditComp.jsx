import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col } from '../../../base/components/AntdComp';
import { MaterialAddComp } from './MaterialAddComp';
import { materialTypeStore } from '../stores/MaterialListStore';
import { materialEditStore ,measurestoreSize,measurestoreBase,measurestoreVolume,measurestoreWeight} from '../stores/MaterialEditStore';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
@observer
class MaterialEditComp extends MaterialAddComp {
    constructor(props, context) {
        super(props, context);
        this.title = 'edit';
        this.store = materialEditStore;
        this.measurestoreSize = measurestoreSize;
        this.measurestoreBase = measurestoreBase;
        this.measurestoreVolume = measurestoreVolume;
        this.measurestoreWeight = measurestoreWeight;
        this.materialTypeStore = materialTypeStore;
    }
}
const options = {
    onValuesChange(props, values) {
        materialEditStore.setMaterialDetail(values)
    }
}
export default Form.create()(MaterialEditComp);