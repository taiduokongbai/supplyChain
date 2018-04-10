import React, { Component } from 'react';
import { shouldComponentUpdate } from '../../../base/consts/Utils';
import {
    Button,
    Popconfirm,
    message,
    Input,
    Icon,
    Table,
    Select,
    Radio,
    DatePicker,
    Form,
    Row,
    Col
} from '../../../base/components/AntdComp';
import TooltipComp from "../../../base/components/TooltipComp";
import FormModalComp from '../../../base/components/FormModalComp';
import SelectTableComp from '../../../base/components/SelectTableComp';
import SelectComp from '../../../base/components/SelectComp';
import Validate from '../../../base/consts/ValidateList';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class SaleReturnEditTableDialogComp extends FormModalComp {
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
                dataIndex: 'specification',
                key: 'specification',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
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
                title: '单位',
                dataIndex: 'unitOfMeasurementName',
                key: 'unitOfMeasurementName',
                width: 70,
                hidden: true,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '单位',
                dataIndex: 'unitOfMeasurement',
                key: 'unitOfMeasurement',
                width: 140,
                hidden: true
            },
            {
                title: '基本单位编码',
                dataIndex: 'baseUnitCode',
                key: 'baseUnitCode',
                width: 70,
                hidden: true
            }, {
                title: '基本单位',
                dataIndex: 'baseUnitName',
                key: 'baseUnitName',
                width: 70,
            }
        ];
        this.columns2 = [
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
                dataIndex: 'specification',
                key: 'specification',
                width: 70,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '型号',
                dataIndex: 'materialModel',
                key: 'materialModel',
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
                title: '单位',
                dataIndex: 'measureUnitName',
                key: 'measureUnitName',
                width: 70,
                hidden: true,
                render: (txt, index, record) => <TooltipComp attr={{ text: txt, wid: 70, placement: 'left' }} />
            }, {
                title: '单位',
                dataIndex: 'measureUnit',
                key: 'measureUnit',
                width: 70,
                hidden: true
            }, {
                title: '基本单位编码',
                dataIndex: 'baseUnitCode',
                key: 'baseUnitCode',
                width: 70,
                hidden: true
            }, {
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
            canRetNum: 999999,
            unitOfMeasurement: '',
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
                    if (data.chargeUnitName == data.unitOfMeasurementName && Number(data.returnNum) != Number(data.valuationQty)) {
                        message.warning('请保持计价数量和退货数量相同！');
                        return false;
                    }

                    if (Number(data.canRetNum) != NaN) {
                        if (Number(data.canRetNum) < Number(data.returnNum)) {
                            message.warning('退货数量要小于或等于可退数量！');
                            return false;
                        }
                    }
                    let { returnNum, unitPrice, taxRate } = data;
                    data.returnNum = Number(returnNum);
                    data.unitPrice = Number(unitPrice).toFixed(2);
                    data.materialModel = data.model;
                    if (data.canRetNum === '--') {
                        data.canRetNum = '';
                    }
                    if (data.saleOrderLineNum === '--') {
                        data.saleOrderLineNum = '';
                    }
                    if (data.lineNum === '--') {
                        data.lineNum = '';
                    }
                    if (data.saleOrderCode === '--') {
                        data.saleOrderCode = '';
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
        let { saleOrderCode } = this.props;
        if (selectedRows) {
            if (selectedRows.canRetNum === '') {
                setFieldsValue({ canRetNum: '--' })
            } else {
                setFieldsValue({ canRetNum: selectedRows.canRetNum })
            }
            if (selectedRows.lineNum === '') {
                setFieldsValue({ saleOrderLineNum: '--' })
            } else {
                setFieldsValue({ saleOrderLineNum: selectedRows.lineNum })
            }
            if (selectedRows.saleOrderCode === '') {
                setFieldsValue({ saleOrderCode: '--' })
            } else {
                setFieldsValue({ saleOrderCode: selectedRows.saleOrderCode })
            }
            setFieldsValue({
                materialName: selectedRows.materialName,
                model: selectedRows.materialModel ? selectedRows.materialModel : selectedRows.model,
                specification: selectedRows.specification ? selectedRows.specification : selectedRows.materialSpec,
                returnNum: selectedRows.canRetNum ? Number(selectedRows.canRetNum) + '' : '',
                taxRate: selectedRows.taxRate ? Number(selectedRows.taxRate).toFixed(2) : '',
                unitPrice: selectedRows.unitPrice ? Number(selectedRows.unitPrice).toFixed(2) : '',
                chargeUnitCode: selectedRows.unitOfMeasurement,
                unitOfMeasurementName: selectedRows.unitOfMeasurementName,
                chargeUnitName: selectedRows.unitOfMeasurementName,
                amount: '',
                tax: '',
                remark: '',
                valuationQty: '0.00',
                isDonation: '1',
            });
            if (saleOrderCode) {
                setFieldsValue({
                    canRetNum: Number(selectedRows.canRetNum).toFixed(2)
                })
            }
            if (selectedRows.canRetNum > 0) {
                this.setState({ canRetNum: selectedRows.canRetNum });
            }
            this.setState({
                unit: selectedRows.unitOfMeasurementName,
                unitOfMeasurement: selectedRows.unitOfMeasurement
            })
        } else {
            message.warning('请选择一行数据！');
        }
        this.forceUpdate();
    }
    // 如果有来源订单，则筛选物料列表；反之则返回全部
    getMaterialList = () => {
        let { saleOrderCode } = this.props;
        if (saleOrderCode) {
            return this.props.OriginalOrderList({ saleOrderCode: saleOrderCode });
        } else {
            return this.props.MaterialList();
        }
    }
    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }
    onChangeMaterialNum = (e) => {
        const { setFieldValue, setFieldsValue, resetFields ,getFieldValue} = this.props.form;
        let chargeUnitCode = getFieldValue('chargeUnitCode');
        if (this.state.unitOfMeasurement === '') {
            message.warning('请先选择物料！');
            return;
        } else {
            if (this.state.unitOfMeasurement === chargeUnitCode) {
                setFieldsValue({
                    valuationQty: e.target.value,
                });
            }
        }
    }
    onBlurMaterialNum = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let returnNum = getFieldValue('returnNum');
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
        let returnNum = getFieldValue('returnNum');
        let valuationQty = getFieldValue('valuationQty');
        let unitPrice = getFieldValue('unitPrice');
        let chargeUnitCode = getFieldValue('chargeUnitCode');
        taxRate = taxRate / 100;
        if (this.state.unitOfMeasurement === chargeUnitCode && Number(returnNum) !== Number(valuationQty)) {
            message.warning('请保持和退货数量相同！');
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
    onChangeUnitPrice = (e) => {

    }
    onBlurUnitPrice = () => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let returnNum = getFieldValue('returnNum');
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
        let returnNum = getFieldValue('returnNum');
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
    handleSelect = (value, option) => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        let amount = 0, tax = 0, totalAmount = 0;
        let taxRate = getFieldValue('taxRate');
        let returnNum = getFieldValue('returnNum');
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
        if (this.state.unitOfMeasurement == chargeUnitCode && Number(returnNum) !== Number(valuationQty)) {
            message.warning('请保持和退货数量相同！');
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
        let materialCode = this.props.form.getFieldValue('materialCode');
        let saleOrderLineNum = this.props.form.getFieldValue('saleOrderLineNum');
        this.props.OriginalOrderList({ materialCode: materialCode, lineNum: saleOrderLineNum });
        this.props.UnitList({materialCode:materialCode});
    }

    getComp = () => {
        let { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 11 },
        };
        const formItemLayout1 = {
            labelCol: { span: 3 },
            wrapperCol: { span: 12 },
        };
        const formItemLayout2 = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
        };
        let { currVal, originalOrderSource, saleOrderCode, saleReturnAllInfo } = this.props;
        return (
            <div className="saleReturn-modal">
                <Form>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="物料编码">
                                {getFieldDecorator('materialCode', {
                                    initialValue: currVal.materialCode || '',
                                    rules: [{ message: "物料编码为必填", required: true },],
                                })(
                                    <SelectTableComp
                                        style={{}}
                                        columns={saleOrderCode ? this.columns : this.columns2}
                                        rowKey='detailId' //表格的索引字段
                                        valueKey='materialCode'//返回显示的字段
                                        handleSubmit={this.selectSaleRow}
                                        getDataSource={this.props.OriginalOrderList}
                                        exPm={{ saleOrderCode }}
                                        searchData={this.searchData}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="物料名称">
                                {getFieldDecorator('materialName', {
                                    initialValue: currVal.materialName || '--',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="规格">
                                {getFieldDecorator('specification', {
                                    initialValue: currVal.specification || '--',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="型号">
                                {getFieldDecorator('model', {
                                    initialValue: currVal.materialModel || '--',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="col-right-pos">
                            <FormItem {...formItemLayout} label="退货数量">
                                {getFieldDecorator('returnNum', {
                                    initialValue: currVal.returnNum + '' || '0.00',
                                    rules: [{ type: "string"},
                                        Validate({
                                            type: "gtZero",
                                            decimal:6,
                                            max:99999999,
                                            label: "退货数量",
                                            required: true
                                        }),],
                                })(
                                    <Input onBlur={this.onBlurMaterialNum} onChange={this.onChangeMaterialNum} />
                                    )}
                                {/*     <div className="input-right-div">{currVal.unitOfMeasurementName}</div>*/}
                            </FormItem>
                            <FormItem {...formItemLayout2} className="col-right-pos input-right-pos1">
                                {this.getFD('unitOfMeasurementName', {
                                    initialValue: currVal.unitOfMeasurementName,
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="可退数量">
                                {getFieldDecorator('canRetNum', {
                                    initialValue: currVal.canRetNum + '' || '--',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="计价数量">
                                {getFieldDecorator('valuationQty', {
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
                                    <Input onChange={this.onChangeValuationQty} onBlur={this.onBlurValuationQty} />
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
                                        onSelect={this.handleSelect}
                                    />
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="金额">
                                {getFieldDecorator('amount', {
                                    initialValue: currVal.amount || '0.00',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="col-right-pos">
                            <FormItem {...formItemLayout} label="单价">
                                {getFieldDecorator('unitPrice', {
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
                                    <Input onChange={this.onChangeUnitPrice} onBlur={this.onBlurUnitPrice} />
                                    )}
                                <span className="input-right-pos">元</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="税额">
                                {getFieldDecorator('tax', {
                                    initialValue: currVal.tax + '' || '0.00',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12} className="col-right-pos">
                            <FormItem {...formItemLayout} label="税率">
                                {getFieldDecorator('taxRate', {
                                    initialValue: currVal.taxRate + '' || '0.00',
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
                                    <Input placeholder="请输入税率" onChange={this.onChangeTaxRate}
                                        onBlur={this.onBlurTaxRate} />
                                    )}
                                <span className="input-right-pos">%</span>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="销售订单号">
                                {getFieldDecorator('saleOrderCode', {
                                    initialValue: saleReturnAllInfo.saleOrderCode || '--',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="赠品">
                                {getFieldDecorator('isDonation', {
                                    initialValue: currVal.isDonation || '1',
                                    onChange: this.onChange
                                })(
                                    <RadioGroup>
                                        <Radio value="0">是</Radio>
                                        <Radio value="1">否</Radio>
                                    </RadioGroup>
                                    )}
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formItemLayout} label="销售订单行号">
                                {getFieldDecorator('saleOrderLineNum', {
                                    initialValue: currVal.saleOrderLineNum || '--',
                                })(
                                    <Input className="no-input-style" disabled />
                                    )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout1} label="备注">
                            {getFieldDecorator('remark', {
                                initialValue: currVal.remark || '',
                                rules: [
                                    { max: 200, message: '最多允许200字' },
                                ],
                            })(
                                <Input type="textarea" style={{ height: 72, width: 562 }} placeholder="请输入备注" />
                                )}
                        </FormItem>
                    </Row>
                    <FormItem {...formItemLayout} label="计价单位" style={{ display: 'none' }}>
                        {this.getFD('chargeUnitName', {
                            initialValue: currVal.chargeUnitName,

                        })(
                            <Input disabled />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="税价合计" style={{ display: 'none' }}>
                        {this.getFD('totalAmount', {
                            initialValue: currVal.totalAmount,

                        })(
                            <Input disabled />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="退货单位" style={{ display: 'none' }}>
                        {this.getFD('unitOfMeasurement', {
                            initialValue: currVal.unitOfMeasurement || '',

                        })(
                            <Input disabled />
                            )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="行号" style={{ display: 'none' }}>
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

export default Form.create()(SaleReturnEditTableDialogComp);