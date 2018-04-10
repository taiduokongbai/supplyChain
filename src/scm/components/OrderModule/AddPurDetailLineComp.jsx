import React, { Component, PropTypes } from "react";
import { Form, Input, Spin, Button, Modal, Row, Col, message} from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import SelectComp from '../../../base/components/SelectComp';
import SelectTableComp from '../../../base/components/SelectTableComp';
import TooltipComp from '../../../base/components/TooltipComp';
import PurExpenseDetailComp from './PurExpenseDetailComp';
import AddPurExpenseDetailCont from '../../dialogconts/OrderModule/AddPurExpenseDetailCont'
import { formatNullStr } from '../../../base/consts/Utils';

const FormItem = Form.Item,
    page = { 'page': 1, 'pageSize': 10 },
    columns = [{
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 140,
    }, {
        title: '物料名称',
        dataIndex: 'materialName',
        width:90,
        render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 92, placement: 'top' }} />
    }, {
        title: '规格',
        dataIndex: 'materialSpec',
        width:90,
        render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90, placement: 'top' }} />
    }, {
        title: '型号',
        dataIndex: 'model',
        width:90,
        render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90, placement: 'top' }} />
    }, {
        title: '材料',
        dataIndex: 'materialTexture',
        width:90,
        render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90, placement: 'top' }} />
    }, {
        title: '代号',
        dataIndex: 'materialCodeName',
        width:90,
        render: (text, index, record) => <TooltipComp attr={{ text: text, wid: 90, placement: 'top' }} />
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

class TextItemComp extends Component {
    render() {
        let { value, list, keyName, labelName, style ,className} = this.props;
        if (list && keyName && labelName) {
            if (Array.isArray(list) && list.length > 0) {
                list.forEach(item => {
                    if (item[keyName] === value) {
                        value = item[labelName];
                    }
                })
            }
        }
        if (this.props.curSymbol) {
            return <div style={{ ...style }}>{this.props.curSymbol}{value}</div>
        }
        if (this.props.className) {
            return <div style={{ ...style }} title={value} className={className}>{formatNullStr(value)}</div>
        }
        return <div style={{ ...style }} >{formatNullStr(value)}</div>
    }
}

class AddPurDetailLineComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.state = {
            // visibel: props.dtype == 'add' ? 'none' : 'block',
            visibel: 'block',
            priceUnit: props.detail.priceUnit&&this.getUnitName(props.detail.priceUnit),
        }
        this.materialDetail = {};
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.validateFds((err, formData) => {
            if (!err) {
                if (formData.purchaseUnit == formData.priceUnit) {
                    if (Number(formData.priceQty) > Number(formData.orderQty)) {
                        message.warn('计价数量不能大于订单数量');
                        return
                    }
                }
                this.props.onOk && this.props.onOk(formData);
            }
        });
    }
    materialSelect = (data) => {
        if (data) {
            let { materialName, materialSpec, model, purchaseUnitCode, materialCode, materialCodeName, materialTexture } = data;
            this.props.MaterialAllUnit({ materialCode });
            if (this.props.sourceOrderType == '1'||this.props.sourceOrderType=='2') {
                this.setFdv({
                    priceUnit: purchaseUnitCode,
                    priceUnitDetl: this.getUnitName(purchaseUnitCode),
                    orderQty: '0.00',
                    priceQty: '0.00',
                    price: '0.00',
                    netAmount: '0.00',
                    taxAmount: '0.00',
                    totalAmount:'0.00',
                })
                this.setState({ visibel: 'block',priceUnit: this.getUnitName(purchaseUnitCode)});
            }
            this.setFdv({
                materialName,
                materialSpec,
                materialModel: model,
                purchaseUnit: purchaseUnitCode,
                materialQuality: materialTexture,
                standardCode: materialCodeName,
            });
            this.materialDetail = {
                materialCode,
                materialName,
                materialSpec,
                materialModel: model,
            }
        } 
    }
    getUnitName(value) {
        let { measureList } = this.props;
        let keyName = 'meaCode', labelName = 'meaName';
        if (measureList && keyName && labelName) {
            if (Array.isArray(measureList) && measureList.length > 0) {
                measureList.forEach(item => {
                    if (item[keyName] === value) {
                        value = item[labelName];
                    }
                })
            }
        }
        return value;
    };
    
    componentWillMount() {
        if (this.props.dtype == 'edit'&&this.props.detail.materialCode) {
            let materialCode = this.props.detail.materialCode;
            this.props.MaterialAllUnit({ materialCode });
        }
    }
    
    componentDidMount() {
        if (this.props.dtype == 'add') {
            this.props.detail.expenses = [];
        }
    }
    
    openExpense = () => {
        let { type, ExpenseVisible, dtype } = this.props;
        ExpenseVisible(type,dtype,true)
    }

    //订单数量变化
    orderQtyChange = (e) => {
        this.props.form.validateFields(["orderQty"], (err, data) => { 
            let taxRate = this.getFdv('taxRate'),
                price = this.getFdv('price'),
                priceQty = this.getFdv('priceQty'),
                expenseAmount = this.getFdv('expenseAmount') || 0,
                taxFlag = this.props.taxFlag,
                purchaseUnit = this.getFdv('purchaseUnit'),
                priceUnit = this.getFdv('priceUnit');
            if (!err&&priceQty!==''&&price!==''&&taxRate!==''&&purchaseUnit == priceUnit) {
                let netAmount = taxFlag == '0' ? priceQty * price : priceQty * price / (1 + taxRate/100);
                let taxAmount = taxFlag == '0' ? priceQty * price * (taxRate / 100) : priceQty * price / (1 + taxRate / 100) * (taxRate / 100);
                let totalAmount = netAmount + taxAmount + Number(expenseAmount);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                    totalAmount: totalAmount.toFixed(2)
                });
            } 
        })
    }
    //计价数量变化
    priceQtyChange = (e) => {
        this.props.form.validateFields(["priceQty"], (err, data) => { 
            let taxRate = this.getFdv('taxRate'),
                price = this.getFdv('price'),
                expenseAmount = this.getFdv('expenseAmount')||0,
                taxFlag = this.props.taxFlag;
            if (!err&&e.target.value!==''&&price!==''&&taxRate!=='') {
                let netAmount = taxFlag == '0' ? Number(e.target.value) * Number(price) : Number(e.target.value) * Number(price) / (1 + Number(taxRate)/100);
                let taxAmount = taxFlag == '0' ? Number(e.target.value) * Number(price) * (Number(taxRate) / 100) : Number(e.target.value) * Number(price) / (1 + Number(taxRate) / 100) * (Number(taxRate) / 100);
                let totalAmount = netAmount + taxAmount + Number(expenseAmount);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                    totalAmount: totalAmount.toFixed(2)
                });
            } else {
                this.setFdv({
                    netAmount: '0.00',
                    taxAmount: '0.00',
                    totalAmount: '0.00'
                });
            }
        })
    }
    //单价变化
    priceChange = (e) => {
        this.props.form.validateFields(["price"], (err, data) => { 
            let taxRate = this.getFdv('taxRate'),
                priceQty = this.getFdv('priceQty'),
                expenseAmount = this.getFdv('expenseAmount')||0,
                taxFlag = this.props.taxFlag;
            if (!err&&e.target.value!==''&&priceQty!==''&&taxRate!=='') {
                let netAmount = taxFlag == '0' ? Number(priceQty) * Number(e.target.value) : Number(e.target.value) * Number(priceQty) / (1 + Number(taxRate)/100);
                let taxAmount = taxFlag == '0' ? Number(e.target.value) * Number(priceQty) * (Number(taxRate) / 100) : Number(e.target.value) * Number(priceQty) / (1 + Number(taxRate) / 100) * (Number(taxRate) / 100);
                let totalAmount = netAmount + taxAmount + Number(expenseAmount);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                    totalAmount: totalAmount.toFixed(2)
                });
            } else {
                this.setFdv({
                    netAmount: '0.00',
                    taxAmount: '0.00',
                    totalAmount: '0.00'
                });
            }
        })
    }
    //税率变化
    taxRateChange = (e) => {
        this.props.form.validateFields(["taxRate"], (err, data) => { 
            let price = this.getFdv('price'),
                priceQty = this.getFdv('priceQty'),
                expenseAmount = this.getFdv('expenseAmount')||0,
                taxFlag = this.props.taxFlag;
            if (!err&&e.target.value!==''&&priceQty!==''&&taxRate!=='') {
                let netAmount = taxFlag == '0' ? Number(priceQty) * Number(price) : Number(price) * Number(priceQty) / (1 + Number(e.target.value)/100);
                let taxAmount = taxFlag == '0' ? Number(price) * Number(priceQty) * (Number(e.target.value) / 100) : Number(price) * Number(priceQty) / (1 + Number(e.target.value) / 100) * (Number(e.target.value) / 100);
                let totalAmount = netAmount + taxAmount + Number(expenseAmount);
                this.setFdv({
                    netAmount: netAmount.toFixed(2),
                    taxAmount: taxAmount.toFixed(2),
                    totalAmount: totalAmount.toFixed(2)
                });
            } else {
                this.setFdv({
                    netAmount: '0.00',
                    taxAmount: '0.00',
                    totalAmount: '0.00'
                });
            }
        })
    }
    onCallBack = (data) => {
        let netAmount = this.getFdv('netAmount'),
            taxAmount = this.getFdv('taxAmount');
        this.setFdv({
            expenseAmount: Number(data).toFixed(2),
            totalAmount: (Number(netAmount)+Number(taxAmount)+Number(data)).toFixed(2)
        })
    }
    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout2 = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 },
        };
        let { detail, taxRate, getMaterialList, materialList, measureList, disableds, type, sourceOrderType,measureAll } = this.props;
        if (detail && detail.materialCode) {
            materialList = [detail];
            this.materialDetail = detail;
        };
        // columns[columns.length - 1].render = (text, record, index) => this.getUnitName(text);
        return (
            <div>
                <div>
                    <Form>
                        <Row>
                            <Col span={13}>
                                <FormItem label="物料编码" {...formItemLayout}>
                                    {this.getFD('materialCode', {
                                        initialValue: detail.materialCode,
                                        rules: [
                                            { required: true, message: '物料编码 必填！' }
                                        ],
                                    })(
                                        <SelectTableComp
                                            columns={columns}
                                            rowKey='materialCode'
                                            valueKey='materialCode'
                                            handleSubmit={this.materialSelect}
                                            getDataSource={getMaterialList}
                                            searchData={searchData}
                                            contStyle={{ width: "700px",zIndex:3 }}
                                            style={{ width: '200px' }}
                                            btnProps={{
                                                disabled: disableds.includes('materialCode')||detail.matchedFlag=='1'?true:false
                                            }}
                                            tableProps={{

                                            }}
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
                            </Col>
                        </Row>
                        <Row >
                            <Col span={13}>
                                <FormItem label="规格" {...formItemLayout}>
                                    {this.getFD('materialSpec', {
                                        initialValue: detail.materialSpec,
                                    })(<TextItemComp className='text-ellipsis'/>)}
                                </FormItem>
                            </Col>
                            <Col span={11}>
                                <FormItem label="型号" {...formItemLayout2}>
                                    {this.getFD('materialModel', {
                                        initialValue: detail.materialModel,
                                    })(<TextItemComp className='text-ellipsis'/>)}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={13}>
                                <div className='unit-item' style={{overflow:'hidden'}}>
                                    <FormItem label="订单数量" {...formItemLayout} style={{width:'72%',float:'left'}}>
                                        {this.getFD('orderQty', {
                                            initialValue: detail.orderQty?Number(detail.orderQty).toFixed(2):'0.00',
                                            rules: [
                                                { type: 'gtZero', label: '订单数量', decimal:2, required: true}
                                            ],
                                            onChange: (e) => {
                                                if (this.getFdv('purchaseUnit') == this.getFdv('priceUnit')) {
                                                    this.setFdv({ priceQty: e.target.value })
                                                }
                                            },
                                        })(
                                            <Input disabled={disableds.includes('orderQty')} onBlur={this.orderQtyChange}/>
                                            )}
                                    </FormItem>
                                    <FormItem label="" style={{float:'left',maxWidth:'100px'}}>
                                        {this.getFD('purchaseUnit', {
                                            initialValue: detail.purchaseUnit,
                                            // onChange: (e) => this.setFdv({ priceQty: e.target.value }),
                                        })(
                                            <SelectComp
                                                list={measureAll}
                                                keyName="unitCode"
                                                labelName="unitName"
                                                style={{display:this.getFdv('materialCode')?'block':'none'}} 
                                            />
                                            )}
                                    </FormItem>    
                                </div>  
                                <div className='unit-item' style={{overflow:'hidden'}}>
                                    <FormItem label="计价数量" {...formItemLayout} style={{width:'72%',float:'left'}}>
                                        {this.getFD('priceQty', {
                                            initialValue: (detail.priceQty||detail.priceQty=='0')?Number(detail.priceQty).toFixed(2):'',
                                            rules: [
                                                { type: 'gtEqZero', label: '计价数量', decimal: 2, required: true },
                                                {
                                                    // validator: (rule, value, callback) => {
                                                    //     if (value!==''&&this.getFdv('purchaseUnit')==this.getFdv('priceUnit')&&Number(value)>Number(this.getFdv('orderQty'))) {
                                                    //         callback('计价数量不能大于订单数量')
                                                    //     } else {
                                                    //         callback()
                                                    //     }
                                                    // }
                                                }
                                            ]
                                        })(<Input
                                            onBlur={this.priceQtyChange}
                                            disabled={disableds.includes('priceQty')}
                                            />)}
                                    </FormItem>
                                    <FormItem label="" style={{ maxWidth: '100px', float: 'left',display:sourceOrderType!='3'?'block':'none' }} >
                                        {this.getFD('priceUnit', {
                                            initialValue: detail.priceUnit,
                                        })(
                                        // sourceOrderType=='3'?
                                        // <TextItemComp
                                        //     list={measureList}
                                        //     keyName="meaCode"
                                        //     labelName="meaName"
                                        //     style={{paddingLeft:'7px'}}    
                                        // />
                                        // :
                                         <SelectComp
                                            list={measureAll}
                                            keyName="unitCode"
                                            labelName="unitName"
                                            onSelect={(value) => {
                                                this.setState({ priceUnit: this.getUnitName(value) });
                                                this.setFdv({priceUnitDetl: this.getUnitName(value)})
                                            }}
                                            style={{display:this.getFdv('materialCode')?'block':'none'}}    
                                            /> 
                                        )}
                                    </FormItem>
                                    <FormItem label="" style={{maxWidth: '100px', float: 'left',display:sourceOrderType=='3'?'block':'none'}}>
                                        {this.getFD('priceUnitDetl', {
                                            initialValue: detail.priceUnitDetl,
                                        })(
                                        <TextItemComp
                                            list={measureList}
                                            keyName="meaCode"
                                            labelName="meaName"
                                            style={{paddingLeft:'7px'}}    
                                        />
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
                                    <div style={{maxWidth:'100px',float:'left',paddingLeft:'6px',lineHeight:'32px'}}><span>{this.getFdv('materialCode')||sourceOrderType=='3'?`/${this.state.priceUnit}`:''}</span></div>
                                </div>
                                <div className="tax">    
                                    <FormItem label="税率" {...formItemLayout} >
                                        {this.getFD('taxRate', {
                                            initialValue: (detail.taxRate||detail.taxRate=='0')?Number(detail.taxRate).toFixed(2):Number(taxRate).toFixed(2),
                                            rules: [
                                                { type: 'gtEqZero', label: '税率' ,decimal:2, noRequired: true}
                                            ],
                                        })(
                                            <Input
                                            disabled={disableds.includes('taxRate')}
                                            onBlur={this.taxRateChange}
                                            suffix={'%'}
                                            />
                                            )}
                                    </FormItem>
                                </div>
                                <div className='tax'>
                                    <FormItem label="附加费" {...formItemLayout} >
                                        {this.getFD('expenseAmount', {
                                            initialValue: (detail.expenseAmount||detail.expenseAmount=='0')?Number(detail.expenseAmount).toFixed(2):'',
                                        })(
                                            <TextItemComp curSymbol={this.getFdv('expenseAmount')===''?'':'￥'}/>
                                            )}
                                    </FormItem>
                                    <div className="tax-info">
                                        {sourceOrderType!='3' ?
                                            <Button onClick={this.openExpense}
                                                disabled={this.getFdv('materialCode') ? false : true}
                                                className='expenceBtn'
                                            >设置</Button>
                                        : <div></div>}  
                                    </div>
                                </div>    
                            </Col>
                            <Col span={11}>
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
                                        initialValue: (detail.netAmount||detail.netAmount=='0')?Number(detail.netAmount).toFixed(2):'',
                                    })(
                                        <TextItemComp curSymbol='￥'/>
                                        )}
                                </FormItem>
                                <FormItem label="税额" {...formItemLayout} >
                                    {this.getFD('taxAmount', {
                                        initialValue: (detail.taxAmount||detail.taxAmount=='0')?Number(detail.taxAmount).toFixed(2):'',
                                    })(
                                        <TextItemComp curSymbol='￥'/>
                                        )}
                                </FormItem>
                                <FormItem label="合计金额" {...formItemLayout} >
                                    {this.getFD('totalAmount', {
                                        initialValue: (detail.totalAmount||detail.totalAmount=='0')?Number(detail.totalAmount).toFixed(2):'',
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
                                        <Input type="textarea" style={{ height: 72}}/>
                                        )}
                                </FormItem>
                            </Col>   
                        </Row>
                    </Form>
                </div>
                {this.props[this.props.type]['expenseShow'][this.props.dtype].visible ?
                    <PurExpenseDetailComp {...this.props} materialDetail={this.materialDetail} title='费用明细' className='purOrder-expense-cont' onCallBack={this.onCallBack} expenseAmount={this.getFdv('expenseAmount')}/> : null}
            </div>    
        )
    }
}
AddPurDetailLineComp.defaultProps = {
    loading:false,
}

export default Form.create()(AddPurDetailLineComp);


