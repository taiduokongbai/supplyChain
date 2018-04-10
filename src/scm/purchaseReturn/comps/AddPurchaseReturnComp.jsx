import React, { Component, PropTypes } from "react";
import moment from "moment";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect, Checkbox  } from '../../../base/components/AntdComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { disabledBeforeDate, disabledAfterDate, debounce } from '../../../base/consts/Utils';

import AddPurReturnDetailComp from './AddPurReturnDetailComp';
//mobx store  
import { purReturnAddStore, addPurReturnDetailStore, supplierStore, deptStore, purOrderStore, employeesStore, siteStore, warehouseStore, receivingAddressStore, receiverStore, invoiceTypeStore, paymentStore, settleMethodStore, currencyStore } from '../stores/AddPurchaseReturnStore';
import { purReturnListStore, searchBarStore } from '../stores/PurchaseReturnStore';
import { enumStore } from '../../../base/stores/EnumStore';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
const FormItem = Form.Item;
const Option = Select.Option;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
class AddPurchaseReturnComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.title = '新建采购退货单';
        this.store = purReturnAddStore;
        this.detailStore = addPurReturnDetailStore;
        this.supplierStore = supplierStore;
        this.deptStore = deptStore;
        this.purOrderStore = purOrderStore;
        this.employeesStore = employeesStore;
        this.siteStore = siteStore;
        this.warehouseStore = warehouseStore;
        this.receivingAddressStore = receivingAddressStore;
        this.receiverStore = receiverStore;
        this.invoiceTypeStore = invoiceTypeStore;
        this.paymentStore = paymentStore;
        this.settleMethodStore = settleMethodStore;
        this.currencyStore = currencyStore;
        
        this.onSupplierSearch = debounce(this.onSupplierSearch, 500);
        this.onPurOrgSearch = debounce(this.onPurOrgSearch, 500);

        this.state = {
            show: true,
            showMore: false,
        };
    }
    
    componentWillReact() {
        if(this.store.loading){
            this.resetFds();
        }
    }
    componentWillUnmount() {
        this.store.resetDetail();
    }
    
    //供应商下拉
    onSupplierSelect = (value, option) => {
        let { defaultReceiveGoodsAddress, defaultContacts, paymentCode, settlementCode, invoiceTypeCode } = option.props.data;
        if (defaultReceiveGoodsAddress.addressCode) {
            this.store.addressDetail(defaultReceiveGoodsAddress.id).then(json => {
                if (json.status === 2000) {
                    this.setFdv({
                        receivingAddressDetl: json.data.detailAddress,
                        receivingAddress: defaultReceiveGoodsAddress.addressCode,
                    })
                }
            })
        } else {
            this.setFdv({
                receivingAddress: '',
                receivingAddressDetl: '',
            })
        }
        this.setFdv({
            receiverName: defaultContacts.contactsName,
            receiverCode: defaultContacts.contactsCode,
            receiverTel: defaultContacts.phone,
            paymentTerm: paymentCode,
            invoiceType: invoiceTypeCode,
            paymentMethod: settlementCode,
            purchaseOrderCode: '',
            taxRate: '17.00',
            taxFlag: '1',
            purchaseType: '0'
        });
        this.receivingAddressStore.fetchSelectList(value, '', { addressCode: defaultReceiveGoodsAddress.addressCode,status:1 });
        this.receiverStore.fetchSelectList(value, defaultContacts.contactsCode, {status:1});
        this.purOrderStore.fetchSelectList(value,'')
        
    }

    //供应商搜索
    onSupplierSearch = (value) => {
        this.supplierStore.loading = true;
        this.setFdv({
            receivingAddress: '',
            receivingAddressDetl: '',
            receiverName:'',
            receiverCode: '',
            purchaseOrderCode: '',
            receiverTel: '',
            paymentTerm: this.paymentStore.selectList.slice()[0].catCode,
            invoiceType: '102',
            paymentMethod: this.settleMethodStore.selectList.slice()[0].settleCode,
            taxRate: '17',
            taxFlag: '1',
            purchaseType: '0',
        });
        return this.supplierStore.fetchSelectList(value, { briefCode: value, supplierType: 1, status:1 });
    }
    //业务类型选择
    onOrderTypeSelect = (value) => {
        if (value == "2") {
            if (!this.getFD('supplier')) {
                this.setFdv({
                    paymentTerm: this.paymentStore.selectList.slice()[0].catCode,
                    invoiceType: '102',
                    paymentMethod: this.settleMethodStore.selectList.slice()[0].settleCode,
                })
            }
            this.setFdv({
                purchaseOrderCode: '',
                siteCode: '',
                warehouseCode:'',
                taxRate: '17.00',
                taxFlag: 1,
                purchaseType: '0',
            })
        }
    }

    //源订单号下拉
    onPurOrderSelect = (value, option) => {
        this.store.purchaseDetail(value).then(json => {
            if (json.status === 2000) {
                let { purchaseType, siteCode, taxRate, taxFlag, paymentTerm, paymentMethod, invoiceType } = json.data;
                this.setFdv({
                    siteCode,
                    taxRate,
                    taxFlag: taxFlag+'',
                    paymentTerm,
                    paymentMethod,
                    invoiceType,
                    purchaseType: purchaseType+'',
                })
                this.siteStore.fetchSelectList(siteCode, { status: 1 });
                this.warehouseStore.fetchSelectList(siteCode, '', { status: 1 });
            }
        })
    }

    //源订单号搜索
    onPurOrderSearch = (value) => {
        this.purOrderStore.loading = true;
        this.setFdv({
            siteCode: '',
            taxRate: '',
            taxFlag: '',
            paymentTerm: '',
            paymentMethod: '',
            invoiceType: '',
            purchaseType: '0',
        });
        return this.purOrderStore.fetchSelectList(this.getFdv('supplierCode'),value);
    }

    //采购部门搜索
    onDeptSearch = (value) => {
        this.deptStore.loading = true;
        return this.deptStore.fetchSelectList(value, { orgName:value, status:1 });
    }
    //业务员搜索
    onEmployeesSearch = (value) => {
        this.employeesStore.loading = true;
        return this.employeesStore.fetchSelectList(value, { employeeName:value,status:1 });
    }

    //站点下拉
    onSiteSelect = (value, option) => {
        this.warehouseStore.fetchSelectList(value, '',{status:1})
    }
    //站点搜索
    onSiteSearch = (value) => {
        this.siteStore.loading = true;
        return this.siteStore.fetchSelectList(value, { siteName:value,status:1 });
    }

    //仓库搜索
    onWarehouseSearch = (value) => {
        this.warehouseStore.loading = true;
        return this.warehouseStore.fetchSelectList( this.getFdv('siteCode'),value, { warehouseName:value,status:1 });
    }

    //收货地址搜素
    onReceivingAddressSearch = (value) => {
        this.setFdv({
            receivingAddressDetl:''
        })
        this.receivingAddressStore.loading = true;
        return this.receivingAddressStore.fetchSelectList(this.getFdv('supplierCode'), value, {isRep:1,status:1});
    }
    onReceivingAddressSelect= (value, option) => {
        let { detailAddress } = option.props.data;
        this.setFdv({
            receivingAddressDetl: detailAddress,
        })
    }
    //收货人搜素
    onReceiverSearch = (value) => {
        this.setFdv({
            receiverName:'',
        })
        this.receiverStore.loading = true;
        return this.receiverStore.fetchSelectList(this.getFdv('supplierCode'), value, {contactsName:value,status:1});
    }
    //收货人下拉
    onReceiverSelect = (value, option) => {
        let { phone,contactsName } = option.props.data;
        this.setFdv({
            receiverTel: phone,
            receiverName: contactsName
        })
    }

    //付款条件搜素
    onPaymentSearch = (value) => {
        this.paymentStore.loading = true;
        return this.paymentStore.fetchSelectList(value, {status:1});
    }
    //结算方式搜素
    onSettleSearch = (value) => {
        this.settleMethodStore.loading = true;
        return this.settleMethodStore.fetchSelectList(value, {status:1});
    }
    //发票类型搜素
    onInvoiceTypeSearch = (value) => {
        this.invoiceTypeStore.loading = true;
        return this.invoiceTypeStore.fetchSelectList(value, {status:1});
    }

    getDetailComp = () => (
        <div>
            <AddPurReturnDetailComp />
        </div>
    )
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.orderDate = moment(data.orderDate).format('YYYY-MM-DD');
                data.planReturnDate = moment(data.planReturnDate).format('YYYY-MM-DD');
                data.taxFlag = Number(data.taxFlag); 
                data.orderType = Number(data.orderType);
                data.purchaseType = Number(data.purchaseType);
                data = Object.assign({}, this.store.detail, data);
                data.list = this.detailStore.dataSource.slice();
                let lineNumList = [], newAddList = [];
                if (!data.freightAmount) {
                    data.freightAmount = 0.00;
                }
                // console.log(data);
                if (!data.list.length > 0) {
                    message.warn("明细信息不能为空！");
                    return;
                }
                let netAmount = 0,
                    taxAmount = 0;
                if (Array.isArray(data.list) && data.list.length > 0) {
                    data.list.map(item => {
                        if (item.lineNum) {
                            lineNumList.push(item);
                        } else {
                            newAddList.push(item);
                        }
                        netAmount = netAmount + Number(item.netAmount);
                        taxAmount = taxAmount + Number(item.taxAmount);
                    });
                    if (netAmount + taxAmount + Number(data.freightAmount) <= 0) {
                        message.warn('请输入订单金额！')
                        return;
                    }
                    if (this.title == '新建采购退货单') {
                        data.list = newAddList.reverse();
                    } else {
                        data.list = lineNumList.concat(newAddList.reverse());
                    }
                    data.list.map(item => { delete item.lineNum });
                }
                if (!err) {
                    this.store.purReturnSubmit(data).then(json => {
                        if (json.status == 2000) {
                            this.onMessage();
                        }
                    })
                }
            });
        }
    }
    onMessage = () => {
        message.success('新建成功');
        store.dispatch(TabsAct.TabRemove('addPurchaseReturn', 'purchaseReturn'));
        purReturnListStore.fetchTableList();
    }
    render() {
        let formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 13 },
        };
        const { detail, loading } = this.store;
        let length = this.detailStore.dataSource&&this.detailStore.dataSource.slice().length;
        return (
            <div className='purRetOrder-wrap'>
                <Spin spinning={loading}>
                    <div className='purRetOrder-head'>
                        <span className="title">{this.title}</span>
                        <Button type='primary' onClick={this.handleSubmit} >
                            <i className="c2mfont c2m-baocun" style={{paddingRight:7,fontSize:'12px'}}></i>
                            保存
                        </Button>
                        <a  href="#" className="show-more-info"
                            onClick={() => {this.setState({ show: !this.state.show })
                        }}>
                            {this.state.show ? '收起' : '展开'}
                        </a>
                    </div>
                    <Form>
                        <div>
                            <div className="purRetOrder-base-info" style={{display: this.state.show ? `block` : `none`}}>
                                <Row type='flex' style={{position:'relative'}}>
                                    <Col span={8}>
                                        <div className="info-title">
                                            <span><strong>基本信息</strong></span>
                                        </div>    
                                        <FormItem label="供应商" {...formItemLayout}>
                                            {this.getFD('supplierCode', {
                                                initialValue: detail.supplierCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.supplierStore.selectList.slice(),
                                                        keyName: "supplierCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                    { required: true, message: '供应商 必填！' }
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.supplierStore.Props}
                                                    onSelect={this.onSupplierSelect}
                                                    onSearch={this.onSupplierSearch}
                                                    disabled={this.store.disableds.includes('supplierCode')||length>0}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="采购类型" {...formItemLayout} style={{display:'none'}}>
                                            {this.getFD('purchaseType', {
                                                initialValue: String(detail.purchaseType),
                                            })(
                                                <Select
                                                >
                                                    {enumStore.getOptions('purchaseType')}
                                                </Select>
                                                )}
                                        </FormItem>
                                        <FormItem label="业务类型" {...formItemLayout}>
                                            {this.getFD('orderType', {
                                                initialValue: String(detail.orderType),
                                            })(
                                                <Select
                                                onSelect={this.onOrderTypeSelect}
                                                disabled={this.store.disableds.includes('orderType')||length>0}
                                                >
                                                    {enumStore.getOptions('returnOrderType')}
                                                </Select>
                                                )}
                                        </FormItem>
                                        <FormItem label="源订单号" {...formItemLayout}>
                                            {this.getFD('purchaseOrderCode', {
                                                initialValue: detail.purchaseOrderCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.purOrderStore.selectList.slice(),
                                                        keyName: "orderCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                    { required: this.getFdv('orderType') == "1" ? true : '', message: '源订单号 必填！' }
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.purOrderStore.Props}
                                                    onSelect={this.onPurOrderSelect}
                                                    onSearch={this.onPurOrderSearch}
                                                    disabled={this.getFdv('orderType') == "2"||this.store.disableds.includes('purchaseOrderCode')||length>0 ? true : false}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="下单日期" {...formItemLayout}>
                                            {this.getFD('orderDate', {
                                                initialValue: detail.orderDate,
                                                rules: [{ type: 'object', required: true, message: '下单日期 必填！' }],
                                            })(
                                                <DatePicker style={{ width: '100%' }}
                                                onChange={(date, dateString) => { 
                                                    let planReturnDate = this.getFdv('planReturnDate');
                                                    if (planReturnDate && date && date.valueOf() > planReturnDate.valueOf()) {
                                                        this.setFdv({planReturnDate:null})
                                                    }
                                                }}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="业务部门" {...formItemLayout}>
                                            {this.getFD('deptCode', {
                                                initialValue: detail.deptCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.deptStore.selectList.slice(),
                                                        keyName: "orgCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.deptStore.Props}
                                                    onSearch={this.onDeptSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="业务员" {...formItemLayout}>
                                            {this.getFD('empCode', {
                                                initialValue: detail.empCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.employeesStore.selectList.slice(),
                                                        keyName: "empCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.employeesStore.Props}
                                                    onSearch={this.onEmployeesSearch}
                                                />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <div className="info-title">
                                            <span><strong>物流信息</strong></span>
                                        </div>     
                                        <FormItem label="预计退货日" {...formItemLayout}>
                                            {this.getFD('planReturnDate', {
                                                initialValue: detail.planReturnDate,
                                                rules: [{ type: 'object', required: true, message: '预计退货日 必填！' }],
                                            })(
                                                <DatePicker style={{ width: '100%' }}
                                                disabledDate={(c) => {
                                                    let orderDate = this.getFdv('orderDate');
                                                        let compareDate=orderDate&&orderDate.valueOf()>=Date.now()?orderDate:moment()
                                                        return disabledBeforeDate(c, compareDate);
                                                    } }
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="发货站点" {...formItemLayout}>
                                            {this.getFD('siteCode', {
                                                initialValue: detail.siteCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.siteStore.selectList.slice(),
                                                        keyName: "siteCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                    { required: true, message: '发货站点 必填！' }
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.siteStore.Props}
                                                    onSelect={this.onSiteSelect}
                                                    onSearch={this.onSiteSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="发货仓库" {...formItemLayout}>
                                            {this.getFD('warehouseCode', {
                                                initialValue: detail.warehouseCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.warehouseStore.selectList.slice(),
                                                        keyName: "stockCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.warehouseStore.Props}
                                                    onSearch={this.onWarehouseSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="收货地址" {...formItemLayout}>
                                            {this.getFD('receivingAddress', {
                                                initialValue: detail.receivingAddress,
                                                rules: [
                                                    { required: true, message: '收货地址 必填！' },
                                                    {
                                                        type: "autoselect",
                                                        list: this.receivingAddressStore.selectList.slice(),
                                                        keyName: "addressCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                {...this.receivingAddressStore.Props}
                                                onSearch={this.onReceivingAddressSearch}
                                                onSelect={this.onReceivingAddressSelect}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="收货地址详情" {...formItemLayout} style={{display:'none'}}>
                                            {this.getFD('receivingAddressDetl', {
                                                initialValue: detail.receivingAddressDetl,
                                            })(
                                                <Input/>
                                                )}
                                        </FormItem>
                                        <FormItem label="收货人" {...formItemLayout}>
                                            {this.getFD('receiverCode', {
                                                initialValue: detail.receiverCode,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.receiverStore.selectList.slice(),
                                                        keyName: "contactsCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.receiverStore.Props}
                                                    onSelect={this.onReceiverSelect}
                                                    onSearch={this.onReceiverSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="收货人名称" {...formItemLayout} style={{display:'none'}}>
                                            {this.getFD('receiverName', {
                                                initialValue: detail.receiverName,
                                            })(
                                                <Input/>
                                                )}
                                        </FormItem>
                                        <FormItem label="联系电话" {...formItemLayout}>
                                            {this.getFD('receiverTel', {
                                                initialValue: detail.receiverTel,

                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <div className="info-title">
                                            <span><strong>财务信息</strong></span>
                                        </div>     
                                        <FormItem label="付款条件" {...formItemLayout}>
                                            {this.getFD('paymentTerm', {
                                                initialValue: detail.paymentTerm,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.paymentStore.selectList.slice(),
                                                        keyName: "catCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.paymentStore.Props}
                                                    onSearch={this.onPaymentSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="结算方式" {...formItemLayout}>
                                            {this.getFD('paymentMethod', {
                                                initialValue: detail.paymentMethod,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.settleMethodStore.selectList.slice(),
                                                        keyName: "settleCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.settleMethodStore.Props}
                                                    onSearch={this.onSettleSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="发票类型" {...formItemLayout}>
                                            {this.getFD('invoiceType', {
                                                initialValue: detail.invoiceType,
                                                rules: [
                                                    {
                                                        type: "autoselect",
                                                        list: this.invoiceTypeStore.selectList.slice(),
                                                        keyName: "catCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    },
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.invoiceTypeStore.Props}
                                                    onSearch={this.onInvoiceTypeSearch}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="币种" {...formItemLayout}>
                                            {this.getFD('currency', {
                                                initialValue: detail.currency || 'CH78',
                                                rules: [
                                                    // {
                                                    //     type: "autoselect",
                                                    //     message: "请从下拉列表中选择一项！",
                                                    //     list: curList,
                                                    //     keyName: "curCode",
                                                    // }
                                                ],
                                            })(
                                                <AutoComplete
                                                    {...this.currencyStore.Props}
                                                    disabled
                                                />
                                                )}
                                        </FormItem>
                                        <div className='tax-item' style={{overflow:'hidden'}}>
                                            <FormItem label="默认税率" labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} style={{width:'51%',float:'left'}}>
                                            {this.getFD('taxRate', {
                                                    initialValue:  (detail.taxRate || detail.taxRate == '0') ? Number(detail.taxRate).toFixed(2) : "17.00",
                                                    rules: [
                                                        { type: "gtEqZero", label: '默认税率', decimal: 2, noRequired: true }
                                                     ],      
                                            })(
                                                <Input suffix={`%`}/>
                                            )}
                                        </FormItem>
                                        <FormItem label="" style={{float:'left'}}>
                                            {this.getFD('taxFlag', {
                                                initialValue: detail.taxFlag != undefined ? detail.taxFlag.toString() : null,
                                            })(
                                            <Checkbox
                                                checked={this.getFdv('taxFlag') == '0' ? false : true}
                                                disabled={this.store.disableds.includes('taxFlag')||length>0||this.getFdv('purchaseOrderCode')}
                                            >
                                                单价含税
                                            </Checkbox>
                                            )}
                                        </FormItem>
                                        </div>    
                                        <FormItem label="运费" {...formItemLayout}>
                                            {this.getFD('freightAmount', {
                                                initialValue: (detail.freightAmount || detail.freightAmount == '0') ? Number(detail.freightAmount).toFixed(2) : '0.00',
                                                rules: [
                                                   { type: "gtEqZero", label: '运费', decimal: 2, noRequired: true }
                                                ],
                                            })(
                                                <Input  prefix={'￥'}/>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <a className="show-more-info" href="#" onClick={() => this.setState({ showMore: !this.state.showMore })}>{this.state.showMore ? '收起更多隐藏信息' :'展开更多隐藏信息'}</a>
                                </Row>
                                <div className="purRetOrder-other-info" style={{ display: this.state.showMore ? `block` : `none` }}>
                                    <Row type='flex'>
                                        <Col span={8} style={{paddingTop:'12px',borderRight:'1px solid #e2e2e2'}}>
                                            <FormItem label="退货原因" {...formItemLayout}>
                                                {this.getFD('returnReason', {
                                                    initialValue: detail.returnReason || '',
                                                    rules: [{ max: 200, message: '退货原因不能超过200字符！' }]
                                                })(
                                                    <Input type='textarea' style={{ height: '72px' }} >
                                                    </Input>
                                                    )}
                                            </FormItem>
                                        </Col> 
                                        <Col span={15} style={{paddingTop:'12px'}}>
                                            <FormItem label="备注" labelCol={{ span: 3 }} wrapperCol={{ span: 19 }}>
                                                {this.getFD('remark', {
                                                    initialValue: detail.remark || '',
                                                    rules: [{ max: 200, message: '备注不能超过200字符！' }]
                                                })(
                                                    <Input type='textarea' style={{ height: '72px' }} >
                                                    </Input>
                                                    )}
                                            </FormItem>
                                        </Col>  
                                    </Row>
                                </div>
                            </div>
                            
                        </div>
                    </Form>
                    <div className="purRetOrder-detail-info">
                        {
                            this.getDetailComp()
                        }
                    </div>
                </Spin>
            </div>
        )
    }

}
const options = {
    onValuesChange(props, values) {
        purReturnAddStore.setPurReturnDetail(values)
    }
}
export default Form.create(options)(AddPurchaseReturnComp);
export { AddPurchaseReturnComp }