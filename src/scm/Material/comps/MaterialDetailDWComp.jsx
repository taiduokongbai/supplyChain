import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox } from '../../../base/components/AntdComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import MeasureComp from '../../../base/mobxComps/MeasureComp';
import Measurestore from '../../../base/stores/Measurestore';
import { materialDetailStore, materialDetailDWStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const FormItem = Form.Item;
let { observer } = mobxReact;

@observer
class MaterialDWTableEdit extends TableEditComp {
    constructor(props) {
        super(props);
        this.measurestore = new Measurestore();
        this.materialDetailStore = materialDetailStore;
        this.materialDetailDWStore = materialDetailDWStore;
        this.measurestoreBusiness = materialDetailDWStore.measurestoreBusiness;
        this.measurestoreBase = materialDetailDWStore.measurestoreBase;
        this.measurestoreBusiness.type = 'all';
        this.measurestoreBase.type = 'all';
        this.columns = props.columns;
        this.columns.forEach((item) => {
            if (props.disableds.includes(item.dataIndex)) {
                item.render = this.textColRender(item.dataIndex, item.obj);
            } else if (props.inputCell.includes(item.dataIndex)) {
                item.render = this.inputColRender(item.dataIndex, item.obj);
            } else if (props.inputNumberCell.includes(item.dataIndex)) {
                item.render = this.inputNumberColRender(item.dataIndex, item.obj);
            } else if (props.selectCell.includes(item.dataIndex)) {
                item.render = this.selectColRender(item.dataIndex, item.obj);
            } else if (props.autoCompleteCell.includes(item.dataIndex)) {
                item.render = this.autoCompleteColRender(item.dataIndex, item.obj);
            } else if (props.radioCell.includes(item.dataIndex)) {
                item.render = this.radioColRender(item.dataIndex, item.obj);
            } else if (props.datePickerCell.includes(item.dataIndex)) {
                item.render = this.datePickerColRender(item.dataIndex, item.obj);
            } else if (props.selectBusinessDWCell.includes(item.dataIndex)) {
                item.render = this.selectBusinessDWCell(item.dataIndex, item.obj);
            } else if (props.selectBaseDWCell.includes(item.dataIndex)) {
                item.render = this.selectBaseDWCell(item.dataIndex, item.obj);
            } else {
                item.render = this.textColRender(item.dataIndex, item.obj);
            }
        });
        this.columns[this.columns.length - 1].render = this.optColRender;
    }
    componentWillUnmount = () => {
        let {editingIndex} = this.props;
        editingIndex=null;
        materialDetailDWStore.setEditRecord()
    }
    //操作列使用的Render
    optColRender = (txt, record, index) => {
        let { editingRecord, editingIndex, recordKey, disableds,
            handleSave, onCancel, onEdit, onDelete
        } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let opts = [
            {
                title: '确定',
                fun: () => this.validateFds((err, data) => {
                    if (!err) {
                        handleSave(data);
                    }
                }),
                show,
            },
            {
                title: '取消',
                fun: () => onCancel(),
                show,
            },
            {
                title: '编辑',
                fun: () => onEdit(record, index),
                show: editingIndex == null,
            },
            {
                title: "删除",
                titleText: ['确认要删除该明细项吗？'],
                fun: () => onDelete(record, index),
                show: editingIndex == null,
            },
        ];
        return <OperationsComp operations={opts} />;
    }
    //业务单位使用的render
    selectBusinessDWCell = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let { detail, loading } = this.materialDetailStore;
        let strBusiness = {};
        if (this.materialDetailDWStore.editingRecord.businessUnit == '') {
            if (detail.baseDimensionality == 1 || detail.baseDimensionality == 0) {
                strBusiness = {
                    dimensionality: '',
                    meaCode: ''
                }
            } else {
                strBusiness = {
                    dimensionality: '',
                    meaSystem: '',
                    meaCode: ''
                }
            }
        } else {
            if (this.materialDetailDWStore.editingRecord.businessDimensionality == 1 || this.materialDetailDWStore.editingRecord.businessDimensionality == 0) {
                strBusiness = {
                    dimensionality: this.materialDetailDWStore.editingRecord.businessDimensionality,
                    meaCode: this.materialDetailDWStore.editingRecord.businessUnit
                }
            } else {
                strBusiness = {
                    dimensionality: this.materialDetailDWStore.editingRecord.businessDimensionality,
                    meaSystem: this.materialDetailDWStore.editingRecord.businessSystem,
                    meaCode: this.materialDetailDWStore.editingRecord.businessUnit
                }
            }
        }
        if (show) {
            let changeEvent = (e) => {
                if (onChange) {
                    let value = e.target.value;
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD('businessUnit', {
                            initialValue: strBusiness,
                            rules: [{
                                validator: (rule, value, callback) => {
                                    if (value.dimensionality === '') {
                                        callback('单位 为必填')
                                    } else {
                                        if (value.dimensionality === 0 || value.dimensionality == 1) {
                                            if (value.meaSystem === '') {
                                                callback('单位 为必填')
                                            } else {
                                                if (value.meaSystem == detail.measureUnit) {
                                                    callback('业务单位不能和基本单位一致！')
                                                } else {
                                                    callback()
                                                }
                                            }
                                        } else {
                                            if (value.meaSystem === '' || value.meaCode == '') {
                                                callback('单位 为必填')
                                            } else {
                                                if (value.meaCode == detail.measureUnit) {
                                                    callback('业务单位不能和基本单位一致！')
                                                } else {
                                                    callback()
                                                }
                                            }
                                        }
                                    }
                                }
                            }],
                        })(
                            <MeasureComp store={this.measurestoreBusiness} />
                            )}
                    </FormItem>
                </div>
            )
        } else if (render) {
            if (render.wid) {
                return <TooltipComp attr={{ text: text, ...render }} />
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
    //基本单位使用的render
    selectBaseDWCell = (dataIndex, obj = {}) => (text, record, index) => {
        let { textStyle, rules, render, onChange, ...inputProps } = obj;
        let { editingRecord, recordKey } = this.props;
        let show = editingRecord[recordKey] == record[recordKey];
        let { detail, loading } = this.materialDetailStore;
        let strBase = {}
        if (detail.baseDimensionality == 1 || detail.baseDimensionality == 0) {
            strBase = {
                dimensionality: detail.baseDimensionality,
                meaCode: detail.baseUnitCode
            }
        } else {
            strBase = {
                dimensionality: detail.baseDimensionality,
                meaSystem: detail.baseUnitSystem,
                meaCode: detail.baseUnitCode
            }
        }
        if (show) {
            let changeEvent = (e) => {
                if (onChange) {
                    let value = e.target.value;
                    this.setFdv(onChange(value));
                }
            };
            return (
                <div>
                    <FormItem>
                        {this.getFD('measureUnit', {
                            initialValue: strBase,
                        })(
                            <MeasureComp store={this.measurestoreBase} disabled={true} />
                            )}
                    </FormItem>
                </div>
            )
        } else if (render) {
            if (render.wid) {
                return <TooltipComp attr={{ text: text, ...render }} />
            }
        } else {
            return <div style={textStyle}>{text}</div>;
        }
    }
}

let options = {
    onValuesChange(props, values) {
        props.setEditingRecord(values)
    }
}
let MaterialDWTableEditComp = Form.create(options)(MaterialDWTableEdit);
@observer
class MaterialDetailDWComp extends Component {
    constructor(props) {
        super(props);
        this.store = materialDetailStore;
        // this.measureStore = measureStore;
        this.materialDetailDWStore = materialDetailDWStore;
        this.state = {
            flag: false,
        }
        this.columns = [
            {
                title: '业务数量',
                dataIndex: 'businessNumber',
                key: 'businessNumber',
                width: 150,
                obj: {
                    rules: [{
                        validator(rule, value, callback) {
                            if (value === "" || value === undefined) {
                                callback(`业务数量必填`);
                            } else {
                                let num;
                                try {
                                    num = Number(value);
                                } catch (ex) {
                                    callback(`业务数量请输入数字类型！`)
                                };
                                if (isNaN(num)) {
                                    callback(`业务数量请输入数字类型！`)
                                } else if (/^0\d+/.test(value + "")) {
                                    callback(`业务数量请输入数字类型！`)
                                } else if (Number(value) == 0) {
                                    callback(`业务数量不能等于0！`)
                                } else if (value < 0) {
                                    callback(`业务数量不能小于0！`)
                                } else if (!/^\d{0,12}(\.\d{0,2})?$/g.test(value + "")) {
                                    callback(`业务数量只能输入12位整数和2位小数！`)
                                } else { callback() };
                            }
                        }
                    }]
                }
            }, {
                title: '业务单位',
                dataIndex: 'businessUnitName',
                key: 'businessUnitName',
                width: 185
            }, {
                title: '基本数量',
                dataIndex: 'measureNumber',
                key: 'measureNumber',
                width: 150,
                obj: {
                    rules: [{
                        validator(rule, value, callback) {
                            if (value === "" || value === undefined) {
                                callback(`基本数量必填`);
                            } else {
                                let num;
                                try {
                                    num = Number(value);
                                } catch (ex) {
                                    callback(`基本数量请输入数字类型！`)
                                };
                                if (isNaN(num)) {
                                    callback(`基本数量请输入数字类型！`)
                                } else if (/^0\d+/.test(value + "")) {
                                    callback(`基本数量请输入数字类型！`)
                                } else if (Number(value) == 0) {
                                    callback(`基本数量不能等于0！`)
                                } else if (value < 0) {
                                    callback(`基本数量不能小于0！`)
                                } else if (!/^\d{0,12}(\.\d{0,2})?$/g.test(value + "")) {
                                    callback(`基本数量只能输入12位整数和2位小数！`)
                                } else { callback() };
                            }
                        }
                    }]
                }
            }, {
                title: '基本单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName',
                width: 185
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: 80
            }
        ];
    }
    // componentWillUnmount = () => {
    //     this.props.form.resetFields();
    // }
    render() {
        let { detail, loading } = this.store;
        return (
            <div>
                <div className="material-body-top material-body-top-borderR">
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>单位换算</strong></span>
                        <a className="material-form-add" onClick={this.materialDetailDWStore.onAdd}><i className='c2mfont c2m-tianjia' style={{ paddingRight: 5 }} />添加行</a>
                    </div>
                    <div style={{ paddingLeft: 15, paddingRight: 15 }}>
                        <Form>
                            <MaterialDWTableEditComp
                                {...this.materialDetailDWStore.Props}
                                rowKey='id'
                                columns={this.columns}
                                pagination={false}
                                className='material-uint'
                            />
                        </Form>
                    </div>

                </div>
            </div>
        )
    }
}
export default MaterialDetailDWComp;