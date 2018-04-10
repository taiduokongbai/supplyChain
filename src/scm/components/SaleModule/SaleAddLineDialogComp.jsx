import React, { Component } from 'react';
import { shouldComponentUpdate } from '../../../base/consts/Utils';
import {Button,Popconfirm, message,Input,Icon,Table,Select,Radio,DatePicker,Form,Row,Col} from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import SelectTableComp from '../../../base/components/SelectTableComp';
import { formatNullStr } from '../../../base/consts/Utils';
import Validate from '../../../base/consts/ValidateList';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SaleAddLineDialogComp extends FormModalComp {
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
                    data.lineNumber = "";
                    data.sellUnitName=this.state.sellUnitName;
                    this.props.setTableElement(data);
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

            });
            this.setState({
                sellUnitName: selectedRows.sellUnitName,
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
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
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
        currVal = '';
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
                                    initialValue: '',
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
                                    initialValue: formatNullStr(),
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
                                    initialValue: '',
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>

                        <Col span={12}>
                            <FormItem label="单位" style={{ display: 'none' }}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('unitName', {
                                    initialValue: formatNullStr(),
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="单位" style={{ display: 'none' }}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('materialUnit', {
                                    initialValue: "",
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
                                    initialValue: formatNullStr(),
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="型号"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('model', {
                                    initialValue: formatNullStr(),
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
                                    initialValue: Number(0.00).toFixed(2),
                                    rules: [
                                        { type: 'gtEqZeroNum', label: '数量' }
                                    ],
                                })(
                                    <Input />
                                    )}<span className="input-right-pos">{this.state.sellUnitName  }</span>
                            </FormItem>
                            <FormItem label="批量价格" className="col-right-pos"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('batchPrice', {
                                    initialValue: Number(0.00).toFixed(2),
                                    rules: [
                                        { type: 'gtEqZeroNum', label: '批量价格' }
                                    ],
                                })(
                                    <Input onBlur={this.total}/>
                                    )}<span className="input-right-pos">元</span>

                            </FormItem>
                            <FormItem label="税率" className="col-right-pos"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('taxRate', {
                                    initialValue: this.props.typePage == "add" ? (Number(this.props.taxRate)).toFixed(2) : (this.props.isTax == '1' ? (17.00).toFixed(2) : (0.00).toFixed(2)),
                                    rules: [
                                        Validate({
                                            type: "gtEqZero",
                                            label: "税率",
                                            decimal: 2,
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
                                    <Input
                                        disabled={this.props.typePage == "add" ? this.props.isTaxAdd != 1 : this.props.isTax != 1} onBlur={this.total}/>
                                    )}<span className="input-right-pos">%</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="备注"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 15 }}>
                                {this.getFD('remark', {
                                    initialValue: "",
                                    rules: [
                                        { message: '描述不能超过200字符', max: 200 }
                                    ],
                                })(
                                    <Input type='textarea' style={{ height: '150px' }} />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className="totalAmount">
                        <Col span={12}>
                            <FormItem label="批量价格含税" className="col-right-pos"
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 15 }}>
                                {this.getFD('totalAmount', {
                                    initialValue: 0,
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

export default Form.create()(SaleAddLineDialogComp);