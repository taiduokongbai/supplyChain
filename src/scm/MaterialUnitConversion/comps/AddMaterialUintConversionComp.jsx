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
import { materialUintConversionListStore, addMaterialUintConversionStore } from '../stores/MaterialUintConversionListStore';
import MeasureComp from '../../../base/mobxComps/MeasureComp';
import Measurestore from '../../../base/stores/Measurestore';
let Option = Select.Option;
const FormItem = Form.Item;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
class AddMaterialUintConversionComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = addMaterialUintConversionStore;
        this.measurestore = new Measurestore();
        this.businessUnitMeasurestore = new Measurestore();
        this.materialUintConversionListStore = materialUintConversionListStore;
        this.props.form.getFieldDecorator('keys', { initialValue: [1] });
        this.number = 1;
        this.state = {
            dimensionality: '',
            meaSystem: '',
            meaCode: '',
            show: true
        }
        this.columns = [
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '材料',
                dataIndex: 'materialTexture',
                key: 'materialTexture',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '代号',
                dataIndex: 'materialCodeName',
                key: 'materialCodeName',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }
        ];
        this.searchComps = {
            left: {
                select: {
                    list: [
                        {
                            key: "materialCode",
                            label: "物料编码",
                            type: "string"
                        },
                        {
                            key: "materialName",
                            label: "物料名称",
                            type: "string",
                        }
                    ]
                },
                button: {
                    label: "查询",
                    fn: this.onSearch,
                }
            },
        };
    }
    componentWillReact() {
        if (this.store.loading) {
            this.resetFds();
        }

    }
    onSearch = () => {
        this.store.selectMaterialStore.fetchTableList();
    }
    componentWillUnmount = () => {
        this.resetFds();
        this.store.resetDetail()
        this.forceUpdate()
    }
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
            this.props.form.setFieldsValue({
                keys: [1],
            });
            this.resetFds();
            this.setState({
                dimensionality: '',
                meaSystem: '',
                meaCode: '',
                show: true
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, data) => {
            let materialCode = data.materialCode, materialName = data.materialName, endData = null;
            let { detail } = this.store;
            delete data.keys;
            delete data.materialCode;
            delete data.materialName;
            if (!err) {
                var newArr = [];
                for (let i in data) {
                    let m = i.split('_')[0];
                    let n = Number(i.split('_')[1]);
                    var c = {};
                    c[m] = data[i];
                    if (typeof newArr[n - 1] == 'undefined') {
                        newArr[n - 1] = {}
                    }
                    newArr[n - 1][m] = data[i];
                }
                newArr.map((item, index) => {
                    if (this.title == 'edit') {
                        if (item.businessUnit.dimensionality === 1 || item.businessUnit.dimensionality === 0) {
                            if (item.businessUnit.meaCode == '') {
                                item.businessUnit = item.businessUnit.meaSystem;
                            } else {
                                item.businessUnit = item.businessUnit.meaCode;
                            }
                            if (item.measureUnit.meaCode == '') {
                                item.measureUnit = item.measureUnit.meaSystem;
                            } else {
                                item.measureUnit = item.measureUnit.meaCode;
                            }
                        } else {
                            item.businessUnit = item.businessUnit.meaCode;
                            item.measureUnit = item.measureUnit.meaCode;
                        }
                    } else {
                        if (item.businessUnit.dimensionality === 1 || item.businessUnit.dimensionality === 0) {
                            item.businessUnit = item.businessUnit.meaSystem;
                            item.measureUnit = item.measureUnit.meaCode;
                        } else {
                            item.businessUnit = item.businessUnit.meaCode;
                            item.measureUnit = item.measureUnit.meaCode;
                        }
                    }

                })
                for (var i = 0; i < newArr.length; i++) {
                    if (newArr[i] == "" || typeof (newArr[i]) == "undefined") {
                        newArr.splice(i, 1);
                        i = i - 1;
                    }
                }
                if (this.title == 'edit') {
                    endData = Object.assign({},
                        { materialCode: materialCode },
                        { materialName: materialName },
                        { businessNumber: newArr.slice()[0].businessNumber },
                        { businessUnit: newArr.slice()[0].businessUnit },
                        { measureNumber: newArr.slice()[0].measureNumber },
                        { measureUnit: newArr.slice()[0].measureUnit },
                        { id: detail.id },
                    );
                } else {
                    endData = Object.assign({}, { materialCode: materialCode }, { materialName: materialName }, { list: newArr });
                }
                this.store.fetchMaterialUintConversionSubmit(endData).then(json => {
                    if (json.status === 2000) {
                        this.store.loading = true;
                        this.materialUintConversionListStore.fetchTableList();
                        this.store.setVisible(false);
                        setTimeout(() => {
                            this.store.loading = false;
                        }, 1000)
                    }
                })
            }
        });
    };
    materialSelect = (data) => {
        if (data) {
            this.props.form.setFieldsValue({
                keys: [1],
            });
            this.resetFds();
            let { materialCode, materialName, baseUnitSystem, baseDimensionality, baseUnitCode } = data;
            this.setFdv({
                materialName, materialCode
            });
            this.setState({
                dimensionality: baseDimensionality,
                meaSystem: baseUnitSystem,
                meaCode: baseUnitCode,
                show: false
            }, () => {
                this.measurestore.initData();
            });
        } else {
            message.warning('请选择一行数据！');
        }
        this.forceUpdate();
    }
    onAddForm = () => {
        this.number++;
        let keys = this.props.form.getFieldValue('keys');
        let nextKeys = keys.concat(this.number);
        this.props.form.setFieldsValue({
            keys: nextKeys,
        });
    }
    remove = (k) => {
        let keys = this.props.form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        this.setFdv({
            keys: keys.filter(key => key !== k),
        });
    };
    getFormItems = () => {
        let keys = this.props.form.getFieldValue('keys');
        let { visible, detail, selectMaterialStore } = this.store;
        let strBusiness = {}, str = {};
        if (this.title == 'edit') {
            if (detail.businessDimensionality == 1 || detail.businessDimensionality == 0) {
                strBusiness = {
                    dimensionality: detail.businessDimensionality,
                    meaCode: detail.businessUnit
                }
            } else {
                strBusiness = {
                    dimensionality: detail.businessDimensionality,
                    meaSystem: detail.businessSystem,
                    meaCode: detail.businessUnit
                }
            }
        } else {
            if (this.state.dimensionality == 1 || this.state.dimensionality == 0) {
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
        }
        if (this.title == 'edit') {
            if (detail.measureDimensionality == 1 || detail.measureDimensionality == 0) {
                str = {
                    dimensionality: detail.measureDimensionality,
                    meaCode: detail.measureUnit
                }
            } else {
                str = {
                    dimensionality: detail.measureDimensionality,
                    meaSystem: detail.measureSystem,
                    meaCode: detail.measureUnit
                }
            }
        } else {
            if (this.state.dimensionality == 1 || this.state.dimensionality == 0) {
                str = {
                    dimensionality: this.state.dimensionality,
                    meaCode: this.state.meaCode
                }
            } else {
                str = {
                    dimensionality: this.state.dimensionality,
                    meaSystem: this.state.meaSystem,
                    meaCode: this.state.meaCode
                }
            }
        }
        return keys.map((k) => {
            return (
                <div key={k} className="material-uint-add">
                    <Row type="flex" justify="end" className="material-uint-addRow" >
                        <Col span={6}>
                            <label className="ant-form-item-required"></label>
                            <FormItem className="uintconversion-formitem1">
                                {this.getFD(`businessNumber_${k}`, {
                                    initialValue: detail.businessNumber ? detail.businessNumber + '' : '',
                                    rules: [
                                        { type: "string", decimal: 2 },
                                        Validate({
                                            type: "gtEqZeroNumMUC",
                                            label: "业务数量",
                                            required: true
                                        }),
                                    ]
                                })(
                                    <Input disabled={this.title == 'edit' ? false : this.state.show} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem className="uintconversion-formitem2">
                                {this.getFD(`businessUnit_${k}`, {
                                    initialValue: strBusiness,
                                    rules: [{
                                        required: true,
                                        validator: (rule, value, callback) => {
                                            if (value.dimensionality === '') {
                                                callback('单位 为必填')
                                            } else {
                                                if (value.dimensionality === 0 || value.dimensionality == 1) {
                                                    if (value.meaSystem === '') {
                                                        callback('单位 为必填')
                                                    } else {
                                                        if (this.title == 'edit') {
                                                            if (value.meaSystem == detail.measureUnit) {
                                                                callback('业务单位不能和基本单位一致！')
                                                            } else {
                                                                callback()
                                                            }
                                                        } else {
                                                            if (value.meaSystem == this.state.meaCode) {
                                                                callback('业务单位不能和基本单位一致！')
                                                            } else {
                                                                callback()
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (value.meaSystem === '' || value.meaCode == '') {
                                                        callback('单位 为必填')
                                                    } else {
                                                        if (this.title == 'edit') {
                                                            if (value.meaCode == detail.measureUnit) {
                                                                callback('业务单位不能和基本单位一致！')
                                                            } else {
                                                                callback()
                                                            }
                                                        } else {
                                                            if (value.meaCode == this.state.meaCode) {
                                                                callback('业务单位不能和基本单位一致！')
                                                            } else {
                                                                callback()
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }],
                                })(
                                    <MeasureComp disabled={this.title == 'edit' ? false : this.state.show} status="new" str={str} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={7}>
                            <span className="c2mfont c2m-zhuanhuan uintconversion-zhuanhuan"></span>
                            <FormItem className="uintconversion-formitem">
                                {this.getFD(`measureNumber_${k}`, {
                                    initialValue: detail.measureNumber ? detail.measureNumber + '' : '',
                                    rules: [
                                        { type: "string", decimal: 2 },
                                        Validate({
                                            type: "gtEqZeroNumMUC",
                                            label: "基本数量",
                                            required: true
                                        }),
                                    ]
                                })(
                                    <Input disabled={this.title == 'edit' ? false : this.state.show} />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem>
                                {this.getFD(`measureUnit_${k}`, {
                                    initialValue: str,
                                })(
                                    <MeasureComp store={this.measurestore}  disabled={true} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    {keys.length > 1 ? (
                        <div className="delete">
                            <i className="c2mfont c2m-shanchu1"></i>
                            <a onClick={() => this.remove(k)}>删除</a>
                        </div>
                    ) : null}
                </div>
            )
        })
    }
    getComp = () => {
        let { getFieldDecorator } = this.props.form;
        let { visible, detail, selectMaterialStore } = this.store;
        return (
            <div className="uintconversion">
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="物料编码"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.getFD('materialCode', {
                                    initialValue: detail.materialCode,
                                    rules: [{ message: "物料编码为必填", required: true },],
                                })(
                                    <SelectTableComp
                                        rowKey='materialCode'
                                        store={selectMaterialStore}
                                        comps={this.searchComps}
                                        searchData={this.searchData}
                                        columns={this.columns}
                                        btnProps={{
                                            disabled: this.title == 'edit' ? true : false,
                                        }}
                                        onSubmit={this.materialSelect}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="物料名称"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.getFD('materialName', {
                                    initialValue: detail.materialName,
                                })(
                                    <Input disabled={true} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row type="flex" justify="end">
                        <Col span={6} className="uintconversion-col1">
                            <span>业务数量</span>
                        </Col>
                        <Col span={5}>
                            <span>业务单位</span>
                        </Col>
                        <Col span={5} className="uintconversion-col1">
                            <span>基本数量</span>
                        </Col>
                        <Col span={8} className="uintconversion-col1">
                            <span>基本单位</span>
                        </Col>
                    </Row>
                    {this.getFormItems()}
                    {
                        //disabled={this.title == 'edit' ? false : this.state.show}
                        this.title == 'edit' || this.state.show ?
                            null : <div className="add-line">
                                <a className="add" onClick={this.onAddForm}>新建物料单位换算</a>
                            </div>
                    }

                </Form>
            </div>
        )
    }
}
const options = {
    onValuesChange(props, values) {
        // addMaterialUintConversionStore.setMaterialDetail(values)
    }
}
export { AddMaterialUintConversionComp }
export default Form.create(options)(AddMaterialUintConversionComp);