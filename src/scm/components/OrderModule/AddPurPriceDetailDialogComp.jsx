import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Row, Col } from '../../../base/components/AntdComp.js';
import FormModalComp from '../../../base/components/FormModalComp';
import SelectTableComp from '../../../base/components/SelectTableComp'; 
import TooltipComp from '../../../base/components/TooltipComp'; 
import SelectComp  from '../../../base/components/SelectComp'; 
import { formatNullStr } from '../../../base/consts/Utils';
const FormItem = Form.Item;
const columns = [{
        title: '物料编码',
        key: 'materialCode',
        dataIndex: 'materialCode',
        width: 140
    }, {
        title: '物料名称',
        key: 'materialName',
        dataIndex: 'materialName',
        width: 88,
        render: (txt, index, record) => {
            return <TooltipComp attr={{text:txt, wid: 90, placement: 'top'}}/>
        }
    }, {
        title: '规格',
        key: 'materialSpec',
        dataIndex: 'materialSpec',
        width: 88,
        render: (txt, index, record) => {
            return <TooltipComp attr={{text:txt, wid: 90, placement: 'top'}}/>
        }
    }, {
        title: '型号',
        key: 'model',
        dataIndex: 'model',
        width: 88,
        render: (txt, index, record) => {
            return <TooltipComp attr={{text:txt, wid: 90, placement: 'top'}}/>
        }
    }, {
        title: '材料',
        key: 'materialTexture',
        dataIndex: 'materialTexture',
        width: 88,
        render: (txt, index, record) => {
            return <TooltipComp attr={{text:txt, wid: 90, placement: 'top'}}/>
        }
    },{
        title: '代号',
        key: 'materialCodeName',
        dataIndex: 'materialCodeName',
        width: 88,
        render: (txt, index, record) => {
            return <TooltipComp attr={{text:txt, wid: 90, placement: 'top'}}/>
        }
    },{
        title: '单位',
        key: 'purchaseUnitCode',
        dataIndex: 'purchaseUnitCode',
        hidden: true
    },{
        title: '单位',
        key: 'purchaseUnitName',
        dataIndex: 'purchaseUnitName',
        hidden: true
    }],
    searchData = {
        left: [
            {
                key: "materialCode",
                val: "物料编码",
                type: "string"
            },
            {
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
    }
class TextItemComp extends Component {
    render() {
        let { value, style } = this.props;
        return <div style={{...style}} title={value}>{formatNullStr(value)}</div>
    }
}
class AddPurPriceDetailDialogComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.data = props.list;
        this.state = {
            totalAmountDisabled: props.dtype=='edit'?props.material.taxRate==0?true:false:(props.taxRate?false:true),   
            batchPriceDisabled: props.dtype=='edit'?props.material.taxRate==0?false:true:(props.taxRate?true:false),
            taxDisabled: props.dtype=='edit'?props.material.taxRate==0?true:false:(props.taxRate?false:true),
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                if (this.props.type == 'edit') {
                    data.lineNumber = this.props.material.lineNumber;
                } else {
                    data.lineNumber=''
                }
                data.currencySymbol = this.props.symbol;
                data.batchPrice = Number(data.batchPrice).toFixed(2);
                data.totalAmount = Number(data.totalAmount).toFixed(2);
                data.materialQty = Number(data.materialQty).toFixed(2);
                this.props.handleSubmit(data);
                this.props.handleCancel();
             }
        })
    }
    //物料选择
    materialSelect = (data) => {
        if (data) {
            this.setFdv({
                materialCode: data.materialCode,
                materialName: data.materialName,
                materialSpec: data.materialSpec,
                materialModel: data.model,
                materialUnitCode: data.purchaseUnitCode,
                materialUnitName: data.purchaseUnitName
            })
            this.props.MaterialAllUnit(data.materialCode)
        }
    }
    //批量价格变化
    handleChangeBatchPrice = (e) => {
        this.setFdv({batchPrice:e.target.value})
        this.props.form.validateFields(["batchPrice"], (err, data) => { 
            let taxRate = this.getFdv('taxRate');
            if (!err&&e.target.value!=='') {
                let totalAmount = Number(e.target.value) * (1+Number(taxRate)/100);
                this.setFdv({
                    totalAmount: totalAmount.toFixed(2)
                });
                this.setState({
                    // totalAmountDisabled: true
                }) 
            } else {
                this.setState({
                    // totalAmountDisabled: false
                })
                this.setFdv({
                    totalAmount: ''
                });
            }
        })
        
    }
    //批量价格失焦小数位自动补0
    onbatchPriceBlur = (e) => {
        this.props.form.validateFields(["batchPrice"], (err, data) => { 
            if (!err && e.target.value !== '') {
                if (/\./.test(e.target.value)) {
                    if (/\.\d{1}$/.test(e.target.value)) {
                        this.setFdv({ batchPrice: `${e.target.value}0` })
                    } else if (/\.$/.test(e.target.value)) {
                        this.setFdv({ batchPrice: `${e.target.value}00` })
                    }
                } else {
                    this.setFdv({ batchPrice: `${e.target.value}.00` })
                }
            }
        })    
    }
    //税率变化
    handleChangeTax = (e) => {
        let batchPrice = this.getFdv('batchPrice');
        let totalAmount = this.getFdv('totalAmount');
        // if (e.target.value!==''&&batchPrice) {
        //     totalAmount = Number(batchPrice) * (1 + Number(e.target.value) / 100);
        //     this.setFdv({ totalAmount: totalAmount.toFixed(2) });
        //     return;
        // }
        if (e.target.value!==''&&totalAmount) {
            batchPrice = Number(totalAmount) / (1 + Number(e.target.value) / 100);
            this.setFdv({ batchPrice: batchPrice.toFixed(2)});
            return;
        }
    }
    //税率失焦小数位自动补0
    onTaxBlur = (e) => {
        this.props.form.validateFields(["taxRate"], (err, data) => { 
            if (!err && e.target.value !== '') {
                if (/\./.test(e.target.value)) {
                    if (/\.\d{1}$/.test(e.target.value)) {
                        this.setFdv({ taxRate: `${e.target.value}0` })
                    } else if (/\.$/.test(e.target.value)) {
                        this.setFdv({ taxRate: `${e.target.value}00` })
                    }
                } else {
                    this.setFdv({ taxRate: `${e.target.value}.00` })
                }
            }
        })    
    }
    //数量失焦小数位自动补0
    onMaterialQtyBlur = (e) => {
        this.props.form.validateFields(["materialQty"], (err, data) => { 
            if (!err && e.target.value !== '') {
                if (/\./.test(e.target.value)) {
                    if (/\.\d{1}$/.test(e.target.value)) {
                        this.setFdv({ materialQty: `${e.target.value}0` })
                    } else if (/\.$/.test(e.target.value)) {
                        this.setFdv({ materialQty: `${e.target.value}00` })
                    }
                } else {
                    this.setFdv({ materialQty: `${e.target.value}.00` })
                }
            }
        })    
    }
    //批量价格（含税）变化
    handleChangeTotalAmount = (e) => {
        this.setFdv({totalAmount:e.target.value})
        this.props.form.validateFields(["totalAmount"], (err, data) => { 
            let taxRate = this.getFdv('taxRate');
            if (!err && e.target.value !== '') {
                let batchPrice = Number(e.target.value) / (1+Number(taxRate)/100);
                this.setFdv({
                    batchPrice: batchPrice.toFixed(2)
                });
                this.setState({
                    // batchPriceDisabled: true
                }) 
            } else {
                this.setState({
                    // batchPriceDisabled: false
                })
                this.setFdv({
                    batchPrice: ''
                });
            }
        })
    }
    //批量价格(含税)失焦小数位自动补0
    onTotalAmountBlur = (e) => {
        this.props.form.validateFields(["totalAmount"], (err, data) => { 
            if (!err && e.target.value !== '') {
                if (/\./.test(e.target.value)) {
                    if (/\.\d{1}$/.test(e.target.value)) {
                        this.setFdv({ totalAmount: `${e.target.value}0` })
                    } else if (/\.$/.test(e.target.value)) {
                        this.setFdv({ totalAmount: `${e.target.value}00` })
                    }
                } else {
                    this.setFdv({ totalAmount: `${e.target.value}.00` })
                }
            }
        })    
    }
    getUnitName(value) {
        let { measureAll } = this.props;
        let keyName = 'unitCode', labelName = 'unitName';
        if (measureAll && keyName && labelName) {
            if (Array.isArray(measureAll) && measureAll.length > 0) {
                measureAll.forEach(item => {
                    if (item[keyName] === value) {
                        value = item[labelName];
                    }
                })
            }
        }
        return value;
    };
    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 12 },
        };
        const formItemLayout2 = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout3 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        const {  type, symbol, taxRate, material, measureAll } = this.props;
        if (type == 'add') {
            material.taxRate = Number(taxRate).toFixed(2);
        }
        let {materialCode, materialUnitName, materialModel, materialSpec, materialName, materialUnitCode} = material;
        let selectedRows = [{ materialCode, materialName, model:materialModel, materialSpec, purchaseUnitCode: materialUnitCode, purchaseUnitName:materialUnitName }]
        let excepts = this.props.list.map(item => item.materialCode);
        return (
            <Form className='purPrice-material-dialog'>
                <Row>
                    <Col span={13}>
                        <FormItem {...formItemLayout} label='物料编码' style={{marginBottom:'10px'}}>
                            {this.getFD('materialCode', {
                                initialValue: material.materialCode,
                                rules: [
                                    { required: true, message: '物料编码 必填！' },
                                ],
                            })(
                                <SelectTableComp
                                    columns={columns}
                                    rowKey='materialCode'
                                    valueKey='materialCode'
                                    handleSubmit={this.materialSelect}
                                    getDataSource={this.props.MaterialList}
                                    searchData={searchData}
                                    contStyle={{ width: "700px",zIndex:5}}
                                    style={{ width: '100%' }}
                                    excepts={excepts}
                                    selectedRowKeys={[material.materialCode]}
                                    selectedRows={selectedRows}
                                />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='型号' className='materailform-item-text'>
                            {this.getFD('materialModel', {
                                initialValue: formatNullStr(material.materialModel),
                            })(
                                <TextItemComp style={{width:'200px',textOverflow:'ellipsis',overflow: 'hidden',whiteSpace: 'nowrap',cursor: 'pointer'}}/>
                                )}
                        </FormItem>
                        <div style={{overflow:'hidden'}}>
                            <FormItem {...formItemLayout3} label='数量' style={{float:'left',width:'75%'}}>
                                {this.getFD('materialQty', {
                                    initialValue: (material.materialQty||material.materialQty=='0')?Number(material.materialQty).toFixed(2):'',
                                    rules: [
                                        { type: 'gtZero', label: '数量', decimal: 2,max: '99999999999999.99',required: true}
                                    ],
                                })(
                                    <Input onBlur={this.onMaterialQtyBlur}/>
                                    )}
                            </FormItem>
                            <FormItem label='' style={{float:'left',maxWidth:'100px',minWidth:'50px'}} className='material-unitName'>
                                {this.getFD('materialUnitCode', {
                                    initialValue: material.materialUnitCode,
                                    
                                })(
                                    <SelectComp
                                    list={measureAll}
                                    keyName="unitCode"
                                    labelName="unitName"
                                    onSelect={(value) => {
                                        this.setFdv({ materialUnitName: this.getUnitName(value) })
                                    }}
                                    style={{display:this.getFdv('materialCode')?'block':'none'}}
                                    />
                                )}
                            </FormItem>
                            </div>
                       <FormItem {...formItemLayout} label='单位' style={{display:'none'}}>
                            {this.getFD('materialUnitName', {
                                initialValue: material.materialUnitName,
                                
                            })(
                                <Input disabled/>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='批量价格'>
                            {this.getFD('batchPrice', {
                                initialValue: (material.batchPrice||material.batchPrice=='0')?Number(material.batchPrice).toFixed(2):'',
                                rules: [
                                    { type: 'gtZero', label: '批量价格', decimal: 2,max: '99999999999999.99', required: true}
                                ],
                                onChange: this.handleChangeBatchPrice
                            })(
                                <Input prefix={symbol} disabled={this.state.batchPriceDisabled} onBlur={this.onbatchPriceBlur}/>
                                )}
                        </FormItem>
                    </Col>
                    <Col span={11}>
                        <FormItem {...formItemLayout2} label='物料名称' className='materailform-item-text'>
                            {this.getFD('materialName', {
                                initialValue: formatNullStr(material.materialName),
                            })(
                                <TextItemComp style={{width:'200px',textOverflow:'ellipsis',overflow: 'hidden',whiteSpace: 'nowrap',cursor: 'pointer'}}/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout2} label='规格' className='materailform-item-text'>
                            {this.getFD('materialSpec', {
                                initialValue: formatNullStr(material.materialSpec),
                            })(
                                <TextItemComp style={{width:'200px',textOverflow:'ellipsis',overflow: 'hidden',whiteSpace: 'nowrap',cursor: 'pointer'}}/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout2} label='税率'>
                            {this.getFD('taxRate', {
                                initialValue: (material.taxRate||material.taxRate=='0')?Number(material.taxRate).toFixed(2):'',
                                rules: [
                                    this.state.taxDisabled ?  { required:true,message:'税率 必填' } :
                                    { type: 'gtZero', label: '税率', decimal: 2,max: '99999999999999.99', required: true }    
                                ],
                                onChange: this.handleChangeTax
                            })(
                                <Input suffix={`%`} disabled={this.state.taxDisabled} onBlur={this.onTaxBlur}/>
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout2} label='批量价格(含税)'>
                            {this.getFD('totalAmount', {
                                initialValue: (material.totalAmount||material.totalAmount=='0')?Number(material.totalAmount).toFixed(2):'',
                                rules: [
                                    { type: 'gtZero', label: '批量价格(含税)', decimal: 2,max: '99999999999999.99', required: true}
                                ],
                                onChange: this.handleChangeTotalAmount
                            })(
                                <Input prefix={symbol} disabled={this.state.totalAmountDisabled} onBlur={this.onTotalAmountBlur}/>
                                )}
                        </FormItem>
                    </Col>
                </Row>
               
            </Form> 
        )
    }
}
AddPurPriceDetailDialogComp.defaultProps = {
    material: {
        materialCode: "",
        materialName: "",
        materialSpec: "",
        materialModel: "",
        materialUnitCode: "",
        materialQty: "",
        batchPrice: "",
        taxRate: "",
        totalAmount: "",
        materialUnitName:""
    }
}
AddPurPriceDetailDialogComp.propTypes = {
    material: PropTypes.object,
}

export default Form.create()(AddPurPriceDetailDialogComp);


