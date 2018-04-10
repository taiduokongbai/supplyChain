import React, { Component } from 'react';
import { Button, Popconfirm, message, Input, Icon, Table, Select, Radio, DatePicker, Form, Row, Col } from '../../../base/components/AntdComp';
import TooltipComp from "../../../base/components/TooltipComp";
import FormModalComp from '../../../base/components/FormModalComp';
import SelectTableComp from '../../../base/components/SelectTableComp';
import SelectComp from '../../../base/components/SelectComp';
import Validate from '../../../base/consts/ValidateList';
import { formatNullStr } from '../../../base/consts/Utils';
import moment from 'moment';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SaleOrderEditTableDialogComp extends FormModalComp {
    constructor(props) {
        super(props);
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
            }, {
                title: '销售单位',
                dataIndex: 'sellUnitName',
                key: 'sellUnitName',
                width: 70,
                hidden: true,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '销售单位编码',
                dataIndex: 'sellUnitCode',
                key: 'sellUnitCode',
                width: 70,
                hidden: true
            },
            {
                title: '基本单位编码',
                dataIndex: 'baseUnitCode',
                key: 'baseUnitCode',
                width: 70,
                hidden: true
            },{
                title: '基本单位',
                dataIndex: 'baseUnitName',
                key: 'baseUnitName',
                width: 70,
            }
        ];
        this.searchData = {
            left: [
                {
                    key: "materialCode",
                    val: "物料编码",
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
            unitOfMeasurement: '',
            unitOfMeasurementName: '',
            chargeUnitCode: '',
            chargeUnitName: '',
        }
    }
    componentWillMount() {
        this.setState({
            unitOfMeasurement: this.props.currVal.unitOfMeasurement
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                if (!err) {
                    data.planDelivery = moment(data.planDelivery).format("YYYY-MM-DD");
                    if (data.spuName == '--' || data.spuNum == '--') {
                        data.spuName = '';
                        data.spuNum = ''
                    }
                    if(data.chargeUnitName==data.unitOfMeasurementName&&Number(data.materialNum)!=Number(data.valuationQty)){
                        message.warning('请保持计价数量和销售数量相同！');
                        return false;
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
        this.props.UnitList({materialCode:selectedRows.materialCode});
        const { setFieldsValue } = this.props.form;
        if (selectedRows) {
            if(this.props.businessType!=2){
            if(this.props.isTax==0){
                setFieldsValue({taxRate:'17.00'})
            }else {
                setFieldsValue({taxRate:'0.00'})
            }
            }
            if (this.props.businessType == 2) {
                setFieldsValue({
                    materialName: selectedRows.materialName,
                    model: selectedRows.model,
                    specification: selectedRows.materialSpec,
                    unitOfMeasurement: selectedRows.sellUnitCode,
                    unitOfMeasurementName: selectedRows.sellUnitName,
                    materialCodeName: selectedRows.materialCodeName,
                    materialTexture: selectedRows.materialTexture,
                    chargeUnitCode: selectedRows.sellUnitCode,
                    chargeUnitName: selectedRows.sellUnitName,
                });
                this.setState({
                    show: true,
                    unitOfMeasurement: selectedRows.sellUnitCode,
                    unitOfMeasurementName: selectedRows.sellUnitName,
                })
            } else {
                setFieldsValue({
                    materialName: selectedRows.materialName,
                    model: selectedRows.model,
                    specification: selectedRows.materialSpec,
                    materialCodeName: selectedRows.materialCodeName,
                    materialTexture: selectedRows.materialTexture,
                    unitOfMeasurement: selectedRows.sellUnitCode,
                    unitOfMeasurementName: selectedRows.sellUnitName,
                    chargeUnitCode: selectedRows.sellUnitCode,
                    chargeUnitName: selectedRows.sellUnitName,
                    bom: selectedRows.bom,
                    materialNum:'0.00',
                    valuationQty:'0.00',
                    unitPrice:'0.00',
                    isDonation:'1',
                    amount:'0.00',
                    tax:'0.00',
                    remark:''
                });
                this.setState({
                    show: true,
                    unitOfMeasurement: selectedRows.sellUnitCode,
                    unitOfMeasurementName: selectedRows.sellUnitName,
                    chargeUnitCode: selectedRows.sellUnitCode,
                    chargeUnitName: selectedRows.sellUnitName,
                })
            }

        } else {
            message.warning('请选择一行数据！');
        }
        this.forceUpdate();
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }
    onChangeMaterialNum = (e) => {
        const { setFieldValue, setFieldsValue, getFieldValue } = this.props.form;
        let chargeUnitCode = getFieldValue('chargeUnitCode');
        if (this.state.materialNumUnit == '') {
            message.warning('请先选择物料！');
            setFieldsValue({
                materialNum: '',
            });
            return;
        } else {
            if (this.state.unitOfMeasurement === chargeUnitCode) {
                if (this.props.businessType !== 2) {
                    setFieldsValue({
                        valuationQty: e.target.value,
                    });
                }
            }
        }
    }
    onBlurMaterialNum = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let materialNum = getFieldValue('materialNum');
        let valuationQty = getFieldValue('valuationQty');
        let unitPrice = getFieldValue('unitPrice');
        taxRate = taxRate / 100;
        if (unitPrice) {
            amount = (valuationQty * unitPrice).toFixed(2);//金额
            tax = (amount * taxRate).toFixed(2);//税额
            totalAmount = (Number(amount) + Number(tax)).toFixed(2);//价税合计
            setFieldsValue({
                amount: amount,
                tax: tax,
                totalAmount: totalAmount
            });
        }
    }
    onChangeValuationQty = (e) => {

    }
    onBlurValuationQty = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let materialNum = getFieldValue('materialNum');
        let valuationQty = getFieldValue('valuationQty');
        let unitPrice = getFieldValue('unitPrice');
        let chargeUnitCode = this.state.chargeUnitCode;
        taxRate = taxRate / 100;
        if (this.state.unitOfMeasurement == chargeUnitCode && Number(materialNum) !== Number(valuationQty)) {
            message.warning('请保持和销售数量相同！');
            return;
        }
        if (unitPrice) {
            amount = (valuationQty * unitPrice).toFixed(2);//金额
            tax = (amount * taxRate).toFixed(2);//税额
            totalAmount = (Number(amount) + Number(tax)).toFixed(2);//价税合计
            setFieldsValue({
                amount: amount,
                tax: tax,
                totalAmount: totalAmount
            });
        }
    }
    onChangeUnitPrice = (e) => {

    }
    onBlurUnitPrice = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let materialNum = getFieldValue('materialNum');
        let valuationQty = getFieldValue('valuationQty');
        let unitPrice = getFieldValue('unitPrice');
        taxRate = taxRate / 100;
        if (valuationQty) {
            amount = (valuationQty * unitPrice).toFixed(2);//金额
            tax = (amount * taxRate).toFixed(2);//税额
            totalAmount = (Number(amount) + Number(tax)).toFixed(2);//价税合计
            setFieldsValue({
                amount: amount,
                tax: tax,
                totalAmount: totalAmount
            });
        }
    }
    onChangeTaxRate = (e) => {

    }
    onBlurTaxRate = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let materialNum = getFieldValue('materialNum');
        let valuationQty = getFieldValue('valuationQty');
        let unitPrice = getFieldValue('unitPrice');
        taxRate = taxRate / 100;
        if (unitPrice) {
            amount = (valuationQty * unitPrice).toFixed(2);//金额
            tax = (amount * taxRate).toFixed(2);//税额
            totalAmount = (Number(amount) + Number(tax)).toFixed(2);//价税合计
            setFieldsValue({
                amount: amount,
                tax: tax,
                totalAmount: totalAmount
            });
        }
    }
    handleChange = (value, option) => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let materialNum = getFieldValue('materialNum');
        let valuationQty = getFieldValue('valuationQty');
        let unitPrice = getFieldValue('unitPrice');
        taxRate = taxRate / 100;
        setFieldsValue({
            chargeUnitName: option.props.children,
        });
        this.setState({
            chargeUnitName: option.props.children,
            chargeUnitCode: option.props.eventKey
        });
        let chargeUnitCode = option.props.eventKey;
        if (this.state.unitOfMeasurement == chargeUnitCode &&Number( materialNum) !== Number(valuationQty)) {
            message.warning('请保持和销售数量相同！');
            setFieldsValue({
                totalAmount: ''
            });
            return;
        } else {
            if (unitPrice) {
                amount = (valuationQty * unitPrice).toFixed(2);//金额
                tax = (amount * taxRate).toFixed(2);//税额
                totalAmount = (Number(amount) + Number(tax)).toFixed(2);//价税合计
                setFieldsValue({
                    amount: amount,
                    tax: tax,
                    totalAmount: totalAmount
                });
            }
        }
    }
    componentDidMount = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let materialCode = this.props.form.getFieldValue('materialCode');
        if(materialCode!=""){
            this.props.UnitList({materialCode:materialCode});
            setFieldsValue({chargeUnitCode:this.props.currVal.chargeUnitCode})
        }else{
            setFieldsValue({chargeUnitCode:''})
        }
    }
    getComp = () => {
        let { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        const formItemLayout1 = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 },
        };
        const formItemLayout2 = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
        };
        let { currVal } = this.props;
        return (
            <div className="saleOrderDailog">
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="物料编码">
                                {this.getFD('materialCode', {
                                    initialValue: currVal.materialCode || '',
                                    rules: [{ message: "物料编码为必填", required: true },],
                                })(
                                    <SelectTableComp
                                        style={{}}
                                        columns={this.columns}
                                        rowKey='materialCode' //表格的索引字段
                                        valueKey='materialCode'//返回显示的字段
                                        handleSubmit={this.selectSaleRow}
                                        getDataSource={this.props.MaterialList}
                                        searchData={this.searchData}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="物料名称">
                                {this.getFD('materialName', {
                                    initialValue: formatNullStr(currVal.materialName || ''),
                                })(
                                    <Input className="no-input-style" />
                                    )}
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="型号">
                                {this.getFD('model', {
                                    initialValue: formatNullStr(currVal.model || '')
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="规格">
                                {this.getFD('specification', {
                                    initialValue: formatNullStr(currVal.specification || '')
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="销售数量" className="col-right-pos">
                                {this.getFD('materialNum', {
                                    initialValue: currVal.materialNum + '' || '0.00',
                                    rules: [{ type: "string"},
                                        Validate({
                                            type: "gtZero",
                                            decimal:6,
                                            max:99999999,
                                            label: "销售数量",
                                            required: true
                                        }),],
                                })(
                                    <Input placeholder="请输入数量" onBlur={this.onBlurMaterialNum} onChange={this.onChangeMaterialNum} />
                                    )}<span className="input-right-pos">{this.state.unitOfMeasurementName || currVal.unitOfMeasurementName}</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="SPU名称">
                                {this.getFD('spuName', {
                                    initialValue: formatNullStr(currVal.spuName || ''),
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="计价数量" className="col-right-pos">
                                {this.getFD('valuationQty', {
                                    initialValue: currVal.valuationQty + '' || '0.00',
                                    rules: [{ type: "string"},
                                        Validate({
                                            type: "gtZero",
                                            decimal:6,
                                            max:99999999,
                                            label: "计价数量",
                                            required: true
                                        }),],
                                })(
                                    <Input placeholder="请输入数量" onChange={this.onChangeValuationQty} onBlur={this.onBlurValuationQty} disabled={this.props.businessType == 2 ? true : false} />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout2} className="col-right-pos input-right-pos1">
                                {this.getFD('chargeUnitCode', {
                                    initialValue: currVal.chargeUnitCode,
                                })(
                                    <SelectComp
                                        list={this.props.measureList}
                                        keyName="unitCode"
                                        labelName="unitName"
                                        onSelect={this.handleChange}
                                    />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="计价单位" style={{ display: 'none' }}>
                                {this.getFD('chargeUnitName', {
                                    initialValue: currVal.chargeUnitName || '',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="SPU数量">
                                {this.getFD('spuNum', {
                                    initialValue: formatNullStr(currVal.spuNum || ''),
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="单价" className="col-right-pos">
                                {this.getFD('unitPrice', {
                                    initialValue: currVal.unitPrice + '' || '0.00',
                                    rules: [{ type: "string"},
                                        Validate({
                                            type: "gtZero",
                                            decimal:6,
                                            max:99999999,
                                            label: "单价",
                                            required: true
                                        }),],
                                })(
                                    <Input placeholder="请输入单价" onChange={this.onChangeUnitPrice} onBlur={this.onBlurUnitPrice} disabled={this.props.businessType == 2 ? true : false} />
                                    )}<span className="input-right-pos">元</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="金额">
                                {this.getFD('amount', {
                                    initialValue: currVal.amount || '0.00',

                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="col-right-pos">
                            <FormItem {...formItemLayout} label="税率">
                                {this.getFD('taxRate', {
                                    initialValue: Number(currVal.taxRate).toFixed(2),
                                    rules: [
                                        { type: "string", decimal: 2 },
                                        Validate({
                                            type: "gtEqZero",
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
                                    <Input disabled={this.props.isTax != 0 || this.props.businessType == 2} onChange={this.onChangeTaxRate} onBlur={this.onBlurTaxRate} />
                                    )}<span className="input-right-pos">%</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="税额">
                                {this.getFD('tax', {
                                    initialValue: currVal.tax || '0.00',

                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem></Col>
                    </Row>
                    <Row style={{ display: "none" }}>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="材料">
                                {this.getFD('materialCodeName', {
                                    initialValue:currVal.materialCodeName,
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="代号">
                                {this.getFD('materialTexture', {
                                    initialValue: currVal.materialTexture,
                                })(
                                    <Input />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="销售单位">
                                {this.getFD('unitOfMeasurementName', {
                                    initialValue: currVal.unitOfMeasurementName || '',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="销售单位" style={{ display: 'none' }}>
                                {this.getFD('unitOfMeasurement', {
                                    initialValue: currVal.unitOfMeasurement || '',

                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="销售单位">
                                {this.getFD('unitOfMeasurementName', {
                                    initialValue: currVal.unitOfMeasurementName || '',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="销售单位" style={{ display: 'none' }}>
                                {this.getFD('unitOfMeasurement', {
                                    initialValue: currVal.unitOfMeasurement || '',

                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>

                            {/* <FormItem {...formItemLayout} label="计价单位" style={{ display: 'none' }}>
                            {this.getFD('chargeUnitCode', {
                                initialValue: currVal.chargeUnitCode || '',

                            })(
                                <Input disabled />
                                )}
                        </FormItem> */}
                            <FormItem {...formItemLayout} label="图纸">
                                {this.getFD('drawingUrl', {
                                    initialValue: currVal.drawingUrl || '--',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="附件">
                                {this.getFD('accessoryUrl', {
                                    initialValue: currVal.accessoryUrl || '--',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="品牌">
                                {this.getFD('brand', {
                                    initialValue: currVal.brand || '',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="配置BOM">
                                {this.getFD('bom', {
                                    initialValue: currVal.bom || '',
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="交货日期">
                                {this.getFD('planDelivery', {
                                    initialValue: currVal.planDelivery ? moment(currVal.planDelivery) : null,
                                })(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD"
                                        placeholder="请输入交货日期"

                                    />
                                    )}
                            </FormItem>
                            <FormItem {...formItemLayout} label="SPU">
                                {this.getFD('spuCode', {
                                    initialValue: currVal.spuCode,
                                })(
                                    <Input disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout1} label="赠品">
                            {this.getFD('isDonation', {
                                initialValue: currVal.isDonation || '1',
                                onChange: this.onChange
                            })(
                                <RadioGroup onChange={this.onChange} disabled={this.props.businessType == 2 ? true : false}>
                                    <Radio value="0">是</Radio>
                                    <Radio value="1">否</Radio>
                                </RadioGroup>
                                )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout1} label="备注">
                            {this.getFD('remark', {
                                initialValue: currVal.remark || '',
                                rules: [
                                    { max: 200, message: '最多允许200字' },
                                ],
                            })(
                                <Input type="textarea" style={{ height: 72, width: 562 }} placeholder="请输入备注" disabled={this.props.businessType == 2 ? true : false} />
                                )}
                        </FormItem>
                    </Row>
                    <FormItem {...formItemLayout} label="税价合计" style={{ display: 'none' }}>
                        {this.getFD('totalAmount', {
                            initialValue: currVal.totalAmount || '',

                        })(
                            <Input disabled />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="来源单号" style={{ display: 'none' }}>
                        {this.getFD('sourceCode', {
                            initialValue: '',

                        })(
                            <Input disabled />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="来源行号" style={{ display: 'none' }}>
                        {this.getFD('lineNum', {
                            initialValue: currVal.lineNum || '',

                        })(
                            <Input disabled />
                            )}
                    </FormItem>
                </Form>
            </div>
        )
    }
}
export default Form.create()(SaleOrderEditTableDialogComp);