import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message, Select } from 'antd';
import FormModalComp from '../../../base/mobxComps/FormModalComp';
import SelectTableComp from '../../../base/mobxComps/SelectTableComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import { formatNullStr } from '../../../base/consts/Utils';

const FormItem = Form.Item;
let { observer } = mobxReact;
import { purReturnAddStore, addPurReturnDetailStore, addMaterialStore } from '../stores/AddPurchaseReturnStore';
import { measureStore } from '../../data/DropDownStore';

class TextItemComp extends Component {
    render() {
        let { value, type, className, curSymbol} = this.props;
        if (type == "measure") {
            value = measureStore.getLabelName(value);
        }
        if (curSymbol) {
            return <div>{curSymbol}{value}</div>
        }
        if (className) {
            return <div  title={value} className={className}>{formatNullStr(value)}</div>
        }
        return <div>{formatNullStr(value)}</div>
    }
}
@observer
class MySelectTableComp extends SelectTableComp{
    componentDidMount() {
        this.props.store.getPurchaseDetailList();
    }
}
@observer
class AddPurReturnAddMatComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = addMaterialStore;
        this.purReturnFormStore = purReturnAddStore;
        this.onMaterialSubmit = addPurReturnDetailStore.onMaterialAdd;
        this.columns = [
            {
                title: '物料编码',
                dataIndex: 'materialCode',
                width: 160,
            },
            {
                title: '物料名称',
                dataIndex: 'materialName',
                width:90,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 92 }} />
                },
                {
                title: '规格',
                dataIndex: 'materialSpec',
                width:90,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 80 }} />
            },
            {
                title: '型号',
                dataIndex: 'model',
                width:90,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 80 }} />
            },
            {
                title: '材料',
                dataIndex: 'materialTexture',
                width: 90,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 80, placement: 'top' }} />
            },
            {
                title: '代号',
                dataIndex: 'materialCodeName',
                width: 90,
                render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 80, placement: 'top' }} />
            },
            // {
            //     title: '单位',
            //     dataIndex: 'purchaseUnitCode',
            //     width: 60,
            //     render: (text, record, index) => measureStore.getLabelName(text),
            // }
        ];
        this.columns2 = [{
            title: '订单行号',
            dataIndex: 'lineNum',
            width: 100,
        }, {
            title: '物料编码',
            dataIndex: 'materialCode',
            width: 140,
        }, {
            title: '物料名称',
            dataIndex: 'materialName',
            render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 92 }} />
        }, {
            title: '规格',
            dataIndex: 'materialSpec',
            render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90 }} />
        }, {
            title: '型号',
            dataIndex: 'materialModel',
            render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90 }} />
        }, {
            title: '可退数量',
            dataIndex: 'returnQty',
            width: 60,
            render: (text, record, index) => (Number(record.receivedQty)-Number(record.returnedQty)).toFixed(2),
        }, {
            title: '单位',
            dataIndex: 'purchaseUnit',
            width: 60,
            render: (text, record, index) => measureStore.getLabelName(text),
        }];
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
        this.state = {
            returnQty: 0,
        }
    }
    onSearch = () => {
        this.store.selectMaterialStore.fetchTableList();
    }
    handleCancel = () => {
        if (!this.store.loading) {
            this.store.setVisible(false);
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.store.loading) {
            this.validateFds((err, data) => {
                if (!err) {
                    if (this.purReturnFormStore.detail.purchaseOrderCode&&this.store.title=='添加行'&&(data.returnQty - this.state.returnQty) > 0) {
                        message.warn('本次退货数量不能超越可退数量,请检查！');
                        return;
                    }
                    if (data.purchaseUnit == data.priceUnit) {
                        if (Number(data.priceQty) > Number(data.returnQty)) {
                            message.warn('计价数量不能大于退货数量');
                            return
                        }
                    }
                    data = Object.assign({}, this.store.detail, data);
                    this.onMaterialSubmit(data);
                    this.handleCancel();
                }
            });
        }
    }
    componentWillReact() {
        // if (this.store.loading) {
        //     this.resetFds();
        // }
    }
    //物料选择带出
    materialSelect = (data) => {
        if (data) {
            let { materialName, materialSpec, model, purchaseUnitCode,materialCode,materialCodeName, materialTexture,purchaseUnitName } = data;
            this.setFdv({
                materialName,
                materialSpec,
                materialQuality: materialTexture,
                standardCode: materialCodeName,
                materialModel: model,
                purchaseUnit: purchaseUnitCode,
                priceUnit: purchaseUnitCode,
                returnQty: '0.00',
                priceQty: '0.00',
                price: '0.00',
                netAmount: '0.00',
                taxAmount: '0.00',
                priceUnitDetl: purchaseUnitName,
                purchaseUnitName,
            });
            this.store.setPriceUnit(purchaseUnitName)
            this.store.setDisableds([]);
            this.store.materialAllUnitStore.fetchSelectList({materialCode})
        }
    }
    //采购订单明细选择带出
    materialSelect2 = (data) => {
        let length = this.store.selectMaterialStore2.dataSource.slice().length;
        if (data&&length>0) {
            let { materialName, materialSpec, materialModel, materialQuality, standardCode,purchaseUnit, priceUnit, price, taxRate, lineNum, receivedQty, returnedQty, materialCode,taxFlag,priceUnitDetl,purchaseUnitName} = data;
            this.setFdv({
                materialCode,
                materialName,
                materialSpec,
                materialModel,
                materialQuality,
                standardCode,
                purchaseUnit,
                priceUnit,
                sourceLineNum: lineNum,
                taxRate,
                price,
                returnQty: (Number(receivedQty) - Number(returnedQty)).toFixed(2),
                priceUnitDetl,
                purchaseUnitName,
            });
            if (purchaseUnit == priceUnit) {
                this.setFdv({ priceQty: (Number(receivedQty) - Number(returnedQty)).toFixed(2) });
                let priceQty = (Number(receivedQty) - Number(returnedQty)).toFixed(2);
                let netAmount = taxFlag == '0' ? Number(priceQty) * Number(price) : Number(priceQty) * Number(price) / (1 + Number(taxRate) / 100);
                let taxAmount = taxFlag == '0' ? Number(priceQty) * Number(price) * (Number(taxRate) / 100) : Number(priceQty) * Number(price) / (1 + Number(taxRate) / 100) * (Number(taxRate) / 100);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                });
            } else {
                this.setFdv({
                    priceQty: '0.00',
                    netAmount: '0.00',
                    taxAmount: '0.00'
                });
            }
            this.setState({
                returnQty: (receivedQty -returnedQty).toFixed(2),
            })
            this.store.setPriceUnit(priceUnitDetl);
            this.store.setDisableds(['purchaseUnit', 'priceUnit', 'taxRate', 'price']);
            this.store.materialAllUnitStore.fetchSelectList({materialCode})
        } else {
            this.setFdv({
                materialCode: ''
            })
        }
    }
    //退货数量变化
    returnQtyChange = (e) => {
        this.props.form.validateFields(["returnQty"], (err, data) => { 
            let taxRate = this.getFdv('taxRate'),
                price = this.getFdv('price'),
                priceQty = this.getFdv('priceQty'),
                priceUnit = this.getFdv('priceUnit'),
                purchaseUnit = this.getFdv('purchaseUnit'),
                taxFlag = this.purReturnFormStore.detail.taxFlag;
            if (!err&&priceQty!==''&&price!==''&&taxRate!==''&&priceUnit==purchaseUnit) {
                let netAmount = taxFlag == '0' ? priceQty * price : priceQty * price / (1 + taxRate/100);
                let taxAmount = taxFlag == '0' ? priceQty * price * (taxRate / 100) : priceQty * price / (1 + taxRate / 100) * (taxRate / 100);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                });
            }
        })
    }
    //计价数量变化
    priceQtyChange = (e) => {
        this.props.form.validateFields(["priceQty"], (err, data) => { 
            let taxRate = this.getFdv('taxRate'),
                price = this.getFdv('price'),
                taxFlag = this.purReturnFormStore.detail.taxFlag;
            if (!err&&e.target.value!==''&&price!==''&&taxRate!=='') {
                let netAmount = taxFlag == '0' ? Number(e.target.value) * Number(price) : Number(e.target.value) * Number(price) / (1 + Number(taxRate)/100);
                let taxAmount = taxFlag == '0' ? Number(e.target.value) * Number(price) * (Number(taxRate) / 100) : Number(e.target.value) * Number(price) / (1 + Number(taxRate) / 100) * (Number(taxRate) / 100);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                });
            } else {
                this.setFdv({
                    netAmount: '0.00',
                    taxAmount: '0.00',
                });
            }
        })
    }
    //单价变化
    priceChange = (e) => {
        this.props.form.validateFields(["price"], (err, data) => { 
            let taxRate = this.getFdv('taxRate'),
                priceQty = this.getFdv('priceQty'),
                taxFlag = this.purReturnFormStore.detail.taxFlag;
            if (!err&&e.target.value!==''&&priceQty!==''&&taxRate!=='') {
                let netAmount = taxFlag == '0' ? Number(priceQty) * Number(e.target.value) : Number(e.target.value) * Number(priceQty) / (1 + Number(taxRate)/100);
                let taxAmount = taxFlag == '0' ? Number(e.target.value) * Number(priceQty) * (Number(taxRate) / 100) : Number(e.target.value) * Number(priceQty) / (1 + Number(taxRate) / 100) * (Number(taxRate) / 100);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                });
            } else {
                this.setFdv({
                    netAmount: '0.00',
                    taxAmount: '0.00',
                });
            }
        })
    }
    //税率变化
    taxRateChange = (e) => {
        this.props.form.validateFields(["taxRate"], (err, data) => { 
            let price = this.getFdv('price'),
                priceQty = this.getFdv('priceQty'),
                taxFlag = this.purReturnFormStore.detail.taxFlag;
            if (!err&&e.target.value!==''&&priceQty!==''&&taxRate!=='') {
                let netAmount = taxFlag == '0' ? Number(priceQty) * Number(price) : Number(price) * Number(priceQty) / (1 + Number(e.target.value)/100);
                let taxAmount = taxFlag == '0' ? Number(price) * Number(priceQty) * (Number(e.target.value) / 100) : Number(price) * Number(priceQty) / (1 + Number(e.target.value) / 100) * (Number(e.target.value) / 100);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                });
            } else {
                this.setFdv({
                    netAmount: '0.00',
                    taxAmount: '0.00',
                });
            }
        })
    }
    getComp = () => {
        let disableds = this.store.disableds;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 },
        };
        let { visible, detail, selectMaterialStore, selectMaterialStore2 } = this.store;
        return (
            <Form>
                <Row>
                    <Col span={13}>
                        <FormItem label="物料编码" {...formItemLayout} className='materialCode-item'>
                            {this.getFD('materialCode', {
                                initialValue: detail.materialCode,
                                rules: [
                                    { required: true, message: '物料编码 必填！' }
                                ],
                            })(
                                this.purReturnFormStore.detail.purchaseOrderCode ?
                                <MySelectTableComp
                                    rowKey='id'
                                    store={selectMaterialStore2}
                                    comps={false}
                                    btnProps={{
                                        disabled: disableds.includes('materialCode'),
                                    }}
                                    columns={this.columns2}
                                    contStyle={{ width: "750px",zIndex:3 }}
                                    onSubmit={this.materialSelect2}
                                    valueKey='materialCode'
                                />
                                :
                                <SelectTableComp
                                    rowKey='materialCode'
                                    store={selectMaterialStore}
                                    comps={this.searchComps}
                                    contStyle={{ width: "720px",zIndex:3 }}
                                    columns={this.columns}
                                    btnProps={{
                                        disabled: disableds.includes('materialCode'),
                                    }}
                                    onSubmit={this.materialSelect}
                                />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label="物料名称" {...formItemLayout2}>
                            {this.getFD('materialName', {
                                initialValue: detail.materialName,
                            })(<TextItemComp className='text-ellipsis'/>)}
                        </FormItem>
                        <FormItem label="源订单号" {...formItemLayout2} style={{display:'none'}}>
                            {this.getFD('sourceLineNum', {
                                initialValue: detail.sourceLineNum,
                            })(<TextItemComp />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row >
                    <Col span={13}>
                        <FormItem label="规格" {...formItemLayout}>
                            {this.getFD('materialSpec', {
                                initialValue: detail.materialSpec,
                            })(<TextItemComp className='text-ellipsis'/>)}
                        </FormItem>
                        <div className='unit-item' style={{overflow:'hidden'}}>
                            <FormItem label="退货数量" {...formItemLayout} style={{width:'72%',float:'left'}}>
                                {this.getFD('returnQty', {
                                    initialValue: detail.returnQty?Number(detail.returnQty).toFixed(2):'',
                                    rules: [
                                        { type: 'gtZero', label: '订单数量', decimal:2, required: true}
                                    ],
                                    onChange: (e) => {
                                        if (this.getFdv('purchaseUnit') == this.getFdv('priceUnit')) {
                                            this.setFdv({ priceQty: e.target.value })
                                        }
                                    },
                                })(
                                    <Input disabled={disableds.includes('returnQty')} onBlur={this.returnQtyChange}/>
                                    )}
                            </FormItem>
                            <FormItem label="" style={{float:'left',maxWidth:'100px',display:this.getFdv('materialCode')?'block':'none'}}>
                                {this.getFD('purchaseUnit', {
                                    initialValue: detail.purchaseUnit,
                                })(
                                    this.purReturnFormStore.detail.purchaseOrderCode ?
                                    <TextItemComp type='measure'/>
                                    :
                                    <Select disabled={disableds.includes('purchaseUnit')}
                                        onSelect={(value) => {
                                            this.setFdv({purchaseUnitName:measureStore.getLabelName(value)})
                                        }}    
                                    >
                                        {this.store.materialAllUnitStore.options}
                                    </Select>
                                    )}
                            </FormItem>  
                        </div> 
                        <div className='unit-item' style={{overflow:'hidden'}}>
                            <FormItem label="计价数量" {...formItemLayout} style={{width:'72%',float:'left'}}>
                                {this.getFD('priceQty', {
                                    initialValue: detail.priceQty?Number(detail.priceQty).toFixed(2):'',
                                    rules: [
                                        { type: 'gtEqZero', label: '计价数量', decimal: 2, required: true },
                                        {
                                            // validator: (rule, value, callback) => {
                                            //     if (value!==''&&this.getFdv('purchaseUnit')==this.getFdv('priceUnit')&&Number(value)>Number(this.getFdv('returnQty'))) {
                                            //         callback('计价数量不能大于退货数量')
                                            //     } else {
                                            //         callback()
                                            //     }
                                            // }
                                        }
                                    ],
                                    
                                })(
                                    <Input disabled={disableds.includes('priceQty')} onBlur={this.priceQtyChange}/>
                                    )}
                            </FormItem>
                            <FormItem label="" style={{float:'left',maxWidth:'100px',display:this.getFdv('materialCode')?'block':'none'}}>
                                {this.getFD('priceUnit', {
                                    initialValue: detail.priceUnit,
                                })(
                                    this.purReturnFormStore.detail.purchaseOrderCode ?
                                    <TextItemComp type='measure'/>
                                    :
                                    <Select
                                        onSelect={(value) => {
                                            this.store.setPriceUnit(measureStore.getLabelName(value))
                                            this.setFdv({priceUnitDetl:measureStore.getLabelName(value)})
                                        }}
                                        disabled={disableds.includes('priceUnit')}
                                    >
                                        {this.store.materialAllUnitStore.options}
                                    </Select>
                                    )}
                            </FormItem>    
                        </div> 
                        <div className='unit-item' style={{overflow:'hidden'}}>
                            <FormItem label="单价" {...formItemLayout} style={{width:'72%',float:'left'}}>
                                {this.getFD('price', {
                                    initialValue: (detail.price||detail.price=='0')?Number(detail.price).toFixed(2):'',
                                    rules: [
                                        { type: 'gtEqZero', label: '单价', decimal:2, required: true }
                                    ],
                                })(
                                    <Input
                                        disabled={disableds.includes('price')}
                                        onBlur={this.priceChange}
                                        prefix={'￥'}
                                    />
                                    )}
                            </FormItem>
                            <div style={{maxWidth:'100px',float:'left',paddingLeft:'6px',lineHeight:'32px'}}><span>{this.getFdv('materialCode')?`/${this.store.priceUnit}`:''}</span></div>
                        </div>
                        <FormItem label="税率" {...formItemLayout} >
                            {this.getFD('taxRate', {
                                initialValue: (detail.taxRate||detail.taxRate=='0')?Number(detail.taxRate).toFixed(2):Number(this.purReturnFormStore.detail.taxRate).toFixed(2),
                                rules: [
                                    { type: 'gtEqZero', label: '税率' ,decimal:2,}
                                ],
                            })(
                                <Input
                                disabled={disableds.includes('taxRate')}
                                onBlur={this.taxRateChange}
                                suffix={'%'}
                                />
                                )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem label="计价单位名称" style={{display:'none'}}>
                            {this.getFD('priceUnitDetl', {
                                initialValue: detail.priceUnitDetl,
                            })(
                                <TextItemComp />
                                )}
                        </FormItem>  
                        <FormItem label="单位名称" style={{display:'none'}}>
                            {this.getFD('purchaseUnitName', {
                                initialValue: detail.purchaseUnitName,
                            })(
                                <TextItemComp />
                                )}
                        </FormItem>     
                        <FormItem label="型号" {...formItemLayout2}>
                            {this.getFD('materialModel', {
                                initialValue: detail.materialModel,
                            })(<TextItemComp className='text-ellipsis'/>)}
                        </FormItem>
                        <FormItem label="材料" {...formItemLayout2}>
                            {this.getFD('materialQuality', {
                                initialValue: detail.materialQuality,
                            })(<TextItemComp className='text-ellipsis'/>)}
                        </FormItem>        
                        <FormItem label="代号" {...formItemLayout2}>
                            {this.getFD('standardCode', {
                                initialValue: detail.standardCode,
                            })(<TextItemComp className='text-ellipsis'/>)}
                        </FormItem>    
                        <FormItem label="金额" {...formItemLayout} >
                            {this.getFD('netAmount', {
                                initialValue: (detail.netAmount||detail.netAmount=='0')?Number(detail.netAmount).toFixed(2):'0.00',
                            })(
                                <TextItemComp curSymbol='￥'/>
                                )}
                        </FormItem>
                        <FormItem label="税额" {...formItemLayout} >
                            {this.getFD('taxAmount', {
                                initialValue: (detail.taxAmount||detail.taxAmount=='0')?Number(detail.taxAmount).toFixed(2):'0.00',
                            })(
                                <TextItemComp curSymbol='￥'/>
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label="备注"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                        >
                            {this.getFD('remark', {
                                initialValue: detail.remark,
                                rules: [
                                    { max: 200, message: "备注不能超过200字符！" }
                                ],
                            })(
                                <Input type="textarea" style={{ height: 72 }} />
                                )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
    
}

const options = {
    onValuesChange(props, values) {
        addMaterialStore.setMaterialDetail(values)
    }
}
export default Form.create(options)(AddPurReturnAddMatComp);
export { AddPurReturnAddMatComp }