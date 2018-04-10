import React, { Component } from 'react';
import { shouldComponentUpdate } from '../../../base/consts/Utils';
import { Button, Popconfirm, message, Input, Icon, Table, Select, Radio, DatePicker, Form, Row, Col } from '../../../base/components/AntdComp';
import EditableTableComp from '../../../base/components/EditableTableComp';
import TooltipComp from "../../../base/components/TooltipComp";
import FormModalComp from '../../../base/components/FormModalComp';
import SelectTableComp from '../../../base/components/SelectTableComp';
import SalePriceListAct from '../../actions/SaleModule/SalePriceListAct';
import Validate from '../../../base/consts/ValidateList';
import { formatNullStr } from '../../../base/consts/Utils';
import moment from 'moment';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SaleEditLineDialogComp extends FormModalComp {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                key: 'metarialCode',
                width: 300,
            }, {
                title: '物料名称',
                dataIndex: 'materialName',
                key: 'materialName',
                width: 240,
            }, {
                title: '规格',
                dataIndex: 'materialSpec',
                key: 'materialSpec',
                width: 140,
            }, {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                width: 140,
            }, {
                title: '单位',
                dataIndex: 'measureUnit',
                key: 'measureUnit',
                width: 140,
                hidden: true
            }, {
                title: '单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName',
                width: 140,  
            }
        ];
        this.searchData = {
            left: [
                {
                    key: "materialCode",
                    val: "物料编码",
                    type: "string"
                }, {
                    key: "materialName",
                    val: "物料名称",
                    type: "string",
                },
                {
                    key: "materialSpec",
                    val: "规格",
                    type: "string"
                },
                {
                    key: "model",
                    val: "型号",
                    type: "string"
                }
            ],
            center: [
                {
                    title: "查询",
                    Func: null,
                    style: {},
                    type: "button"
                }
            ]
        };
        this.state = {
            value: 1,
            show: false,
            sellUnitName:''
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                if (!err) {
                    let { taxRate } = data
                    let newTaxRate = (1 + (taxRate / 100));
                    data.batchPrice = Number(data.batchPrice).toFixed(2);
                    data.materialQty = Number(data.materialQty).toFixed(2);
                    //批量含税价格
                    data.totalAmount = Number(data.batchPrice * newTaxRate).toFixed(2);
                    if(this.state.sellUnitName===""){
                        data.sellUnitName=this.props.currVal.sellUnitName;
                    }else {
                        data.sellUnitName=this.state.sellUnitName;
                    }
                    this.props.setEditTableElement(data);
                    this.handleCancel(e);
                }
            });
        }
    }
    handleCancel = (e) => {
        e.preventDefault();
        let { loading, handleCancel } = this.props;
        if (!loading) {
            handleCancel(e);
        }
    }
    selectSaleRow = (selectedRows) => {
        const { setFieldsValue } = this.props.form;
        if (selectedRows) {
            setFieldsValue({
                materialName: selectedRows.materialName,
                model: selectedRows.model,
                materialSpec: selectedRows.materialSpec,
                unitName: selectedRows.measureUnitName,
                materialUnit: selectedRows.measureUnit,
                sellUnitName: selectedRows.sellUnitName,
            });
            this.setState({ sellUnitName:selectedRows.sellUnitName,
                show: true })
        } else {
            message.warning('请选择一行数据！');
        }
        this.forceUpdate();
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    };
    total = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let taxRate = getFieldValue('taxRate');
        let batchPrice = getFieldValue('batchPrice');
        let newTaxRate = (1 + (taxRate / 100));
        let total= Number(newTaxRate * batchPrice).toFixed(2);
        setFieldsValue({
            totalAmount:total
        })
    };
    getComp = () => {
        let { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 },
        };
        const formItemLayout1 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        let { currVal, planDelivery } = this.props;
        let excepts = this.props.list.map(item => item.materialCode);
        return (
            <div className="saleOrder">
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem label="物料编码"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('materialCode', {
                                    initialValue: currVal.materialCode || '',
                                    rules: [{ message: "物料编码为必填", required: true },],
                                })(
                                    <SelectTableComp
                                        style={{}}
                                        contStyle={{}}
                                        columns={this.columns}
                                        searchData={this.searchData}
                                        rowKey='materialCode' //表格的索引字段
                                        valueKey='materialCode'//返回显示的字段
                                        handleSubmit={this.selectSaleRow}
                                        getDataSource={this.props.MaterialList} //promise
                                        excepts={excepts}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="物料名称"
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 15 }}>
                                {this.getFD('materialName', {
                                    initialValue: formatNullStr(currVal.materialName) || formatNullStr(''),
                                })(
                                    <Input className="no-input-style" disabled />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="行号"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}
                                style={{ display: 'none' }}
                            >

                                {this.getFD('lineNumber', {
                                    initialValue: currVal.lineNumber || '',
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>

                        <Col span={12}>
                            <FormItem label="单位"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}
                                style={{ display: 'none' }}>
                                {this.getFD('unitName', {
                                    initialValue: formatNullStr(currVal.unitName) || formatNullStr(""),
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="单位" style={{display:'none'}}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('materialUnit', {
                                    initialValue: currVal.materialUnit || "",
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <FormItem label="规格"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('materialSpec', {
                                    initialValue: formatNullStr(currVal.materialSpec) || formatNullStr(""),
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="型号"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}>
                                {this.getFD('model', {
                                    initialValue: formatNullStr(currVal.model) || formatNullStr(""),
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="数量" className="col-right-pos"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('materialQty', {
                                    initialValue: currVal.materialQty || Number(0.00).toFixed(2),
                                    rules: [
                                        { type: 'gtZero', label: '数量' }
                                    ],
                                })(
                                    <Input />
                                    )}<span className="input-right-pos">{this.state.sellUnitName||currVal.sellUnitName  }</span>
                            </FormItem>
                            <FormItem label="批量价格" className="col-right-pos"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('batchPrice', {
                                    initialValue: currVal.batchPrice || Number(0.00).toFixed(2),
                                    rules: [
                                        { type: 'gtZero', label: '批量价格' }
                                    ],
                                })(
                                    <Input onBlur={this.total}/>
                                    )}<span className="input-right-pos">元</span>
                            </FormItem>
                            <FormItem label="税率" className="col-right-pos"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('taxRate', {
                                    initialValue: (Number(currVal.taxRate)).toFixed(2),
                                    rules: [
                                        Validate({
                                            type: "gtEqZero",
                                            decimal: 2,
                                            label: "税率",
                                            required: true
                                        }),
                                        {
                                            validator: (rule, val, callback) => {
                                                if (val > 100) {
                                                    callback(`税率必须小于100`);
                                                } else {
                                                    callback()
                                                }
                                            },
                                        }
                                    ]
                                })(
                                    <Input onBlur={this.total} disabled={currVal.taxRate == 0.00} />
                                    )}<span className="input-right-pos">%</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="备注"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('remark', {
                                    initialValue: currVal.remark || "",
                                    rules: [
                                        { message: '描述不能超过200字段', max: 200 }
                                    ],
                                })(
                                    <Input type='textarea' style={{ height: '150px' }} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="批量价格含税"  className="col-right-pos"
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 15 }}>
                                {this.getFD('totalAmount', {
                                    initialValue: currVal.totalAmount,
                                })(
                                    <Input className="no-input-style"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}
export default Form.create()(SaleEditLineDialogComp);