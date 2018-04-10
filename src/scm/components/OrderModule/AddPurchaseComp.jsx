import React, { Component, PropTypes } from "react";
import moment from "moment";
import { Form, Input, Spin, Button, message, Row, Col, Icon,Select, DatePicker,Checkbox } from '../../../base/components/AntdComp';
import SelectComp from '../../../base/components/SelectComp';
import FormComp from '../../../base/components/FormComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp';
import PurchaseDetailComp from './PurchaseDetailComp';
import { disabledBeforeDate, disabledAfterDate, formatNullStr  } from '../../../base/consts/Utils';
const FormItem = Form.Item;
const Option = Select.Option;
const page = { 'page': 1, 'pageSize': 10 };

class TextItemComp extends Component {
    render() {
        let { value,className} = this.props;
        return <div className={className} dangerouslySetInnerHTML={{ __html: formatNullStr(value) }}></div>
    }
}
class AddPurchaseComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.state = {
            tax: 17,
            taxFlag: 1,
            symbol: '￥',
            shippingAddressList: [],
            receiveAddressList:[],
            contactsList: [],
            purchaseOrgList: [],
            buyerlist: [],
            show: true,
            showMore: false,
        };
        this.supplierCode = '',
        this.orgCode = '';
        this.param = {
            orderType: 1,
            purchaseType: 0,
            supplierCode: "",
            orderDate: moment(),
            deliveryAddressCode: "",
            receiverCode: "",
            receiverTel: "",
            deptCode: "",
            planReceiveDate: "",
            siteCode: "",
            receiveAddressCode: "",
            empCode: "",
            currencyCode: "CH78",
            paymentTerm: "",
            paymentMethod: "",
            invoiceType: "102",
            taxFlag: 1,
            taxRate: "",
            totalAmount: "",
            taxAmount: "",
            netAmount: "",
            freightAmount: "0",
            remark: "",
            sourceOrderType: 1,
            sourceOrderCode: "",
            list: [],
        };
    }

    //业务类型下拉选择
    orderTypeSelect = (value) => {
        if (value == 3) {
            this.setFdv({
                purchaseType: '1'
            })
        } else {
            this.setFdv({
                purchaseType: '0'
            })
        }
    }
    //供应商下拉
    supplierSelect = (value) => {
        let defaultAddress = value.defaultSendGoodsAddress; 
        if (defaultAddress.addressCode) {
            this.props.AddressDetail(defaultAddress.id).then(json => {
                if (json.status === 2000) {
                    let { detailAddress } = json.data;
                    this.setFdv({
                        deliveryAddressDetl: detailAddress,
                        deliveryAddressCode: defaultAddress.addressCode,
                    })
                    this.setState({ 
                        shippingAddressList: [{ 
                            addressCode: defaultAddress.addressCode, 
                            addressName: defaultAddress.addressName,
                            detailAddress,
                         }] 
                    })
                }
            })
        } else {
            this.setState({ shippingAddressList: [] });
            this.setFdv({
                deliveryAddressDetl: '',
                deliveryAddressCode: '',
            })
        }
        this.setFdv({
            taxFlag: '1',
            taxRate:'17.00'
        });
        this.props.DeleteData('supplierCode');
        this.supplierCode = value.supplierCode;
        this.props.getShippingAddressList({ bpCode: this.supplierCode, ...page });  
    }
    supplierSearch = (val) => {
        this.setFdv({
            deliveryAddressCode: '', 
            deliveryAddressDetl: '',
            taxFlag: 1,
            taxRate: '17'
        });
        this.setState({ shippingAddressList: []});
        this.props.DeleteData('supplierCode');
        return this.props.getSupplierList({ supplierCode: val, supplierFull: val, briefCode:val, supplierType:1,...page });
    }
    // 发货地址搜索
    shippingAddressSearch = (val) => {
        this.setFdv({
            deliveryAddressDetl: ''
        })
        if (this.state.shippingAddressList.length > 0) {
            this.setState({ shippingAddressList: [] });
            if (!val) {
                return;
            }
        }
        return this.props.getShippingAddressList({ bpCode: this.getFdv('supplierCode'), detailAddress: val, ...page})
    }
    //采购组织下拉
    purchaseOrgSelect = (value) => {
        // this.setState({ buyerlist: [] });
        // this.props.getBuyerlist({ ...page });
    }
    purchaseOrgSearch = (val) => {
        // this.setState({ buyerlist: [] });
        if (this.state.purchaseOrgList.length > 0) {
            this.setState({ purchaseOrgList: [] });
            if (!val) {
                return;
            }
        }
        return this.props.getPurchaseOrgList({ orgCode: val, orgName: val, ...page });
    }
    // 采购员搜索
    buyerSearch = (val) => {
         if (this.state.buyerlist.length > 0) {
            this.setState({ buyerlist: [] });
            if (!val) {
                return;
            }
        }
        
        return this.props.getBuyerlist({employeeCode:val,employeeName:val,...page})
    }
    // 收货人搜索
    contactsSearch = (val) => {
        this.setFdv({ receiverTel: '',receiverName:'' });
        if (this.state.contactsList.length > 0) {
            this.setState({ contactsList: [] });
            if (!val) {
                return;
            }
        }
        return this.props.getContactsList({ employeeCode: val, employeeName: val, ...page})
    }
     // 站点搜索
    siteSearch = (val) => {
        // this.setFdv({ receiveAddressCode: '',receiveAddressDetl:'' });
        return this.props.getSiteList({ siteCode: val, siteName: val, ...page })
    }
    //站点下拉
    siteSelect = (value) => {
        let { type, purchaseDetail } = this.props;
        if (type == 'add' || (type == 'edit' && purchaseDetail.sourceOrderType != '3')) {
            this.setFdv({
                receiveAddressCode: value.addressCode,
                receiveAddressDetl: value.countryName+value.provinceName+value.cityName+value.countyName+value.addressDetl
            });
            this.props.getReceiveAddressList({ addressCode: value.addressCode, ...page })
        }
    }
    // 收货地址搜索
    receiveAddressSearch = (val) => {
        // if (this.state.receiveAddressList.length > 0) {
        //     this.setState({ receiveAddressList: [] });
        //     if (!val) {
        //         return;
        //     }
        // }
        this.setFdv({ receiveAddressDetl: '' });
        return this.props.getReceiveAddressList({ detailAddress: val, ...page })
    }
    //是否含锐
    handleChangeTax = (e) => {
        if (e.target.checked) {
            this.setState({
                taxFlag: 1
            })
        } else {
            this.setState({
                taxFlag: 0
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.purchaserId != this.props.purchaserId && this.props.type == 'edit') {
            this.setState({ taxFlag: nextProps.purchaseDetail.taxFlag });
            this.resetFds();
        }
        if (nextProps.purchaseDetail != this.props.purchaseDetail && this.props.type == 'edit') {
            this.setState({ taxFlag: nextProps.purchaseDetail.taxFlag });
        }
        if (nextProps.defaultBuyer != this.props.defaultBuyer && this.props.type == 'add' && nextProps.defaultBuyer.empCode != undefined) {
            let { empCode, deptCode, empName, deptName, empPhone } = nextProps.defaultBuyer;
            if (deptCode) {
                this.setState({
                    purchaseOrgList: [{ orgCode: deptCode, orgName: deptName }],
                })
            }
            if (empCode) {
                this.setState({
                    buyerlist: [{ empCode, empName }],
                    contactsList: [{empCode,empName,phone:empPhone}]
                })
            }
        }

    }
    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                data.orderDate = moment(data.orderDate).format('YYYY-MM-DD');
                data.planReceiveDate = moment(data.planReceiveDate).format('YYYY-MM-DD');
                data.taxFlag = Number(data.taxFlag);
                data.orderType = Number(data.orderType);
                data.purchaseType = Number(data.purchaseType);
                data.sourceOrderType = this.props.type=='edit'?this.props.purchaseDetail.sourceOrderType : 1;
                data.orderCode = this.props.type=='edit'?this.props.purchaseDetail.orderCode :'';
                data.orderStatus = this.props.type=='edit'?this.props.purchaseDetail.orderStatus : 0;
                if (!data.freightAmount) {
                    data.freightAmount = 0.00;
                }
                if (data.receiverCode == this.props.purchaseDetail.receiverName) {
                    data.receiverCode = '';
                }
                let netAmount = 0,
                    taxAmount = 0,
                    expenseAmount = 0;
                if (data.list.length === 0) {
                    message.warn('明细项不能为空！')
                    return;
                }else{
                    let flag = false;
                    let lineNumList = [], newAddList = [];
                    Array.isArray(data.list) && data.list.map(item => {
                        if (item.lineNum) {
                            lineNumList.push(item);
                        } else {
                            newAddList.push(item);
                        }
                        netAmount = netAmount + Number(item.netAmount);
                        taxAmount = taxAmount + Number(item.taxAmount);
                        expenseAmount = expenseAmount + Number(item.expenseAmount);
                        if(!item.materialCode){
                            flag = true;
                        }
                        
                    })
                    if(flag){
                        message.warn('明细项物料编码不能为空！')
                        return;
                    }
                    if (netAmount + taxAmount + expenseAmount + Number(data.freightAmount) <= 0) {
                        message.warn('请输入订单金额！')
                        return;
                    }
                    if (this.props.type == 'add') {
                        data.list = newAddList.reverse();
                    } else {
                        data.list = lineNumList.concat(newAddList.reverse());
                        data.list.map(item => { delete item.lineNum });
                    }
                }
                // console.log(data);
                if (!err) {
                    this.props.onOk && this.props.onOk(data);
                }
            });
        }
    }
    render() {
        let formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 13 },
        };
        let { type } = this.props;
        let { getSiteList, getContactsList, getSettleList, getPurchaseOrgList, getSupplierList, getShippingAddressList, getCurList, getBuyerlist, getCostCenterList, getPaymentlist, getInvoiceTypeList, defaultBuyer, purchaseDetail, Record, measurelist } = this.props;
        let list = [];
        let props = this.props;
        if (this.props.type == 'add') {
            if (defaultBuyer.empCode) {
                this.param.empCode = defaultBuyer.empCode;
                this.param.deptCode = defaultBuyer.deptCode;
                this.param.receiverCode = defaultBuyer.empCode; 
                this.param.receiverTel = defaultBuyer.empPhone;
                this.param.receiverName = defaultBuyer.empName;
            }
            purchaseDetail = this.param;
            list = [];
            props = this.props.add;
        }
        if (this.props.type == 'edit') {
            props = this.props.edit;
            // let {netAmount, taxAmount, totalAmount} = purchaseDetail;
            // purchaseDetail.netAmount = netAmount?Number(netAmount).toFixed(2):'';
            // purchaseDetail.taxAmount = taxAmount||taxAmount===0?Number(taxAmount).toFixed(2):'';
            // purchaseDetail.totalAmount = totalAmount?Number(totalAmount).toFixed(2):'';
            switch (purchaseDetail.sourceOrderType) {
                case 1: list = ['orderType'];
                    break;
                case 2: list = ['orderType'];
                    break;
                case 3: list = ['purchaseType', 'supplierCode', 'deliveryAddressCode', 'deptCode', 'empCode', 'orderDate','planReceiveDate','receiveAddressCode','receiverCode','receiverTel','paymentTerm','paymentMethod','invoiceType','currencyCode','taxRate','taxFlag','freightAmount'];
                    break;
                default: list = [];
                    break;
            }
        }
        let { purchaseLoading, supplierList, purchaseOrgList, curList, siteList, shippingAddressList, receiveAddressList,
            contactsList, buyerlist, costCenterList, paymentList, settleList, invoiceTypeList, orgCode } = props;
        
        let { show, showMore } = this.state;
        return (
            <div className='purOrder-wrap'>
                <Spin spinning={purchaseLoading}>
                    <div className='purOrder-head'>
                        <span className="title">{this.props.type=='add'?'新建采购订单':'编辑采购订单'}</span>
                        <Button type='primary' onClick={this.handleSubmit} >
                            <i className="c2mfont c2m-baocun" style={{paddingRight:7,fontSize:'12px'}}></i>
                            保存
                        </Button>
                        <a className="show-more-info" href="#" onClick={() => {
                            this.setState({ show: !show })
                        }}>{show ? '收起' : '展开'}</a>
                    </div> 
                    <Form>
                        <div className="purOrder-base-info" style={{ display: show ? `block` : `none` }}>
                            <Row type='flex' style={{position:'relative'}}>
                                <Col span={8}>
                                    <div className="info-title">
                                        <span><strong>基本信息</strong></span>
                                    </div>
                                    <FormItem label="业务类型" {...formItemLayout}>
                                        {this.getFD('orderType', {
                                            initialValue: purchaseDetail.orderType != undefined ? purchaseDetail.orderType.toString() : null,
                                        })(
                                            <SelectComp
                                            list={window.ENUM.getEnum("purchaseOrderType")}
                                            keyName="catCode"
                                            labelName="catName"
                                            style={{ width: '100%' }}
                                            onSelect={this.orderTypeSelect}
                                            disabled={list.includes('orderType')?true:false}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="采购类型" {...formItemLayout}>
                                        {this.getFD('purchaseType', {
                                            initialValue: purchaseDetail.purchaseType != undefined ? purchaseDetail.purchaseType.toString() : null,
                                        })(
                                            <SelectComp
                                                list={window.ENUM.getEnum("purchaseType")}
                                                keyName="catCode"
                                                labelName="catName"
                                                style={{ width: '100%' }}
                                                disabled
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="供应商" {...formItemLayout}>
                                        {this.getFD('supplierCode', {
                                            initialValue: purchaseDetail.supplierCode || '',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: supplierList,
                                                    keyName: "supplierCode",
                                                },
                                                { required: true, message: '供应商 必填！' }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={supplierList}
                                                onSelect={this.supplierSelect}
                                                onSearch={this.supplierSearch}
                                                displayName={["supplierCode", "supplierFull"]}
                                                keyName={"supplierCode"}
                                                disabled={(this.getFdv('list')&&this.getFdv('list').length>0||list.includes('supplierCode'))}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="发货地址" {...formItemLayout}>
                                        {this.getFD('deliveryAddressCode', {
                                            initialValue: purchaseDetail.deliveryAddressCode||'',
                                            rules: [
                                                {   type:"autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: this.state.shippingAddressList.length>0?this.state.shippingAddressList:shippingAddressList,
                                                    keyName: "addressCode",
                                                }
                                            ],
                                        })(
                                        <AutoSelectComp
                                            key="select"
                                            selectedList={this.state.shippingAddressList.length>0?this.state.shippingAddressList:shippingAddressList}
                                            onSearch={this.shippingAddressSearch}
                                            onSelect={(value) => { this.setFdv({ deliveryAddressDetl: value.detailAddress}) }}
                                            displayName={["detailAddress"]}
                                            keyName={"addressCode"}
                                            format="{0}"
                                            disabled={list.includes('deliveryAddressCode') ? true : false}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem label="发货地址名称" {...formItemLayout} style={{display:'none'}}>
                                        {this.getFD('deliveryAddressDetl', {
                                            initialValue: purchaseDetail.deliveryAddressDetl||'',
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                    <FormItem label="采购部门" {...formItemLayout}>
                                        {this.getFD('deptCode', {
                                            initialValue: purchaseDetail.deptCode||'',
                                            rules: [
                                                {   type:"autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: this.state.purchaseOrgList.length>0?this.state.purchaseOrgList:purchaseOrgList,
                                                    keyName: "orgCode",
                                                },
                                                // {required:true,message: '采购组织 必填！'}
                                            ],
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={this.state.purchaseOrgList.length>0?this.state.purchaseOrgList:purchaseOrgList}
                                                onSearch={this.purchaseOrgSearch}
                                                displayName={["orgCode","orgName"]}
                                                keyName={"orgCode"}
                                                disabled={list.includes('deptCode') ? true : false}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem label="业务员" {...formItemLayout}>
                                        {this.getFD('empCode', {
                                            initialValue: purchaseDetail.empCode || '',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: this.state.buyerlist.length > 0 ? this.state.buyerlist : buyerlist,
                                                    keyName: "empCode",
                                                },
                                                // { required: true, message: '采购员 必填！' }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={this.state.buyerlist.length > 0 ? this.state.buyerlist : buyerlist}
                                                onSearch={this.buyerSearch}
                                                displayName={["empCode", "empName"]}
                                                keyName={"empCode"}
                                                disabled={list.includes('empCode') ? true : false}
                                            />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <div className="info-title">
                                        <span><strong>物流信息</strong></span>
                                    </div>
                                    <FormItem label="订单日期" {...formItemLayout}>
                                        {this.getFD('orderDate', {
                                            initialValue: purchaseDetail.orderDate ? moment(purchaseDetail.orderDate, 'YYYY-MM-DD') : null,
                                            rules: [{ type: 'object', required: true, message: '订单日期 必填！' }],
                                        })(
                                            <DatePicker style={{ width: '100%' }}
                                            disabled={list.includes('orderDate') ? true : false}
                                            onChange={(date, dateString) => { 
                                                let planReceiveDate = this.getFdv('planReceiveDate');
                                                if (planReceiveDate && date && date.valueOf() > planReceiveDate.valueOf()) {
                                                    this.setFdv({planReceiveDate:null})
                                                }
                                            }}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="预计到货日" {...formItemLayout}>
                                        {this.getFD('planReceiveDate', {
                                            initialValue: purchaseDetail.planReceiveDate ? moment(purchaseDetail.planReceiveDate, 'YYYY-MM-DD') : null,
                                            rules: [{ type: 'object', required: true, message: '计划收货日期 必填！' }],

                                        })(
                                            <DatePicker style={{ width: '100%' }}
                                                disabled={list.includes('planReceiveDate') ? true : false}
                                                disabledDate={(c) => {
                                                    let orderDate = this.getFdv('orderDate');
                                                    let compareDate = orderDate&&orderDate.valueOf() >= Date.now() ? orderDate : moment()
                                                    return disabledBeforeDate(c, compareDate);
                                                }}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货站点" {...formItemLayout}>
                                        {this.getFD('siteCode', {
                                            initialValue: purchaseDetail.siteCode || '',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: siteList,
                                                    keyName: "siteCode",
                                                },
                                                { required: true, message: '收货站点 必填!' }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={siteList}
                                                onSelect={this.siteSelect}
                                                onSearch={this.siteSearch}
                                                displayName={["siteCode", "siteName"]}
                                                keyName={"siteCode"}
                                                disabled={list.includes('siteCode') ? true : false}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货地址" {...formItemLayout}>
                                        {this.getFD('receiveAddressCode', {
                                            initialValue: purchaseDetail.receiveAddressCode||'',
                                            rules: [
                                                {   type:"autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: receiveAddressList,
                                                    keyName: "addressCode",
                                                }
                                            ],
                                        })(
                                        <AutoSelectComp
                                            key="select"
                                            selectedList={receiveAddressList}
                                            onSearch={this.receiveAddressSearch}
                                            onSelect={(value) => { this.setFdv({ receiveAddressDetl: value.detailAddress}) }}
                                            displayName={["detailAddress"]}
                                            keyName={"addressCode"}
                                            format='{0}'
                                            disabled={list.includes('receiveAddressCode') ? true : false}
                                            />
                                        )}
                                    </FormItem>
                                    <FormItem label="收货地址名称" {...formItemLayout} style={{display:'none'}}>
                                        {this.getFD('receiveAddressDetl', {
                                            initialValue: purchaseDetail.receiveAddressDetl||'',
                                        })(
                                            <Input disabled/>
                                        )}
                                    </FormItem>
                                    <FormItem label="收货人" {...formItemLayout}>
                                        {this.getFD('receiverCode', {
                                            initialValue: purchaseDetail.receiverCode || (list.includes('receiverCode') ?purchaseDetail.receiverName:''),
                                            rules: [
                                                list.includes('receiverCode') ? {}:{
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: this.state.contactsList.length > 0 ? this.state.contactsList : contactsList,
                                                    keyName: "empCode",
                                                }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={this.state.contactsList.length > 0 ? this.state.contactsList : contactsList}
                                                onSelect={(value) => { this.setFdv({ receiverTel: value.phone,receiverName: value.empName }) }}
                                                onSearch={this.contactsSearch}
                                                displayName={["empCode", "empName"]}
                                                keyName={"empCode"}
                                                disabled={list.includes('receiverCode') ? true : false}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="收货人名称" style={{display:'none'}}>
                                        {this.getFD('receiverName', {
                                            initialValue: purchaseDetail.receiverName,
                                        })(
                                            <Input disabled/>
                                            )}
                                    </FormItem>
                                    <FormItem label="联系电话" {...formItemLayout}>
                                        {this.getFD('receiverTel', {
                                            initialValue: purchaseDetail.receiverTel || '',

                                        })(
                                            <Input disabled={list.includes('receiverTel') ? true : false}/>
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}> 
                                    <div className="info-title">
                                        <span><strong>财务信息</strong></span>
                                    </div>    
                                    <FormItem label="付款条件" {...formItemLayout}>
                                        {this.getFD('paymentTerm', {
                                            initialValue: type=='add'? (paymentList&&paymentList.length>0?paymentList[0].catCode:''):purchaseDetail.paymentTerm,
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: paymentList,
                                                    keyName: "catCode",
                                                }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={paymentList}
                                                onSearch={(val) => getPaymentlist({ subCode: 'C013', status: 1, catCode: val, catName: val, ...page })}
                                                displayName={["catName"]}
                                                keyName={"catCode"}
                                                format="{0}"
                                                disabled={list.includes('paymentTerm') ? true : false}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="结算方式" {...formItemLayout}>
                                        {this.getFD('paymentMethod', {
                                            initialValue: type=='add'?(settleList&&settleList.length>0?settleList[0].settleCode:''):purchaseDetail.paymentMethod,
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: settleList,
                                                    keyName: "settleCode",
                                                }
                                            ],
                                        })(
                                            <AutoSelectComp
                                            key="select"
                                            selectedList={settleList}
                                            onSearch={(val) => getSettleList({ settleCode: val, settleName: val, ...page })}
                                            displayName={["settleName"]}
                                            keyName={"settleCode"}
                                            format="{0}"
                                            disabled={list.includes('paymentMethod') ? true : false}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="发票类型" {...formItemLayout}>
                                        {this.getFD('invoiceType', {
                                            initialValue: type=='add'?(purchaseDetail.invoiceType || '102'):purchaseDetail.invoiceType,
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: invoiceTypeList,
                                                    keyName: "catCode",
                                                }
                                            ],
                                        })(
                                            <AutoSelectComp
                                                key="select"
                                                selectedList={invoiceTypeList}
                                                onSearch={(val) => getInvoiceTypeList({ catCode: val, catName: val, ...page })}
                                                displayName={["catName"]}
                                                keyName={"catCode"}
                                                format="{0}"
                                                disabled={list.includes('invoiceType') ? true : false}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem label="币种" {...formItemLayout}>
                                        {this.getFD('currencyCode', {
                                            initialValue: purchaseDetail.currencyCode || 'CH78',
                                            rules: [
                                                {
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: curList,
                                                    keyName: "curCode",
                                                }
                                            ],
                                        })(
                                            <AutoSelectComp
                                            key="select"
                                            selectedList={curList}
                                            onSearch={(val) => getCurList({ curCode: val, curName: val, ...page })}
                                            displayName={["curName"]}
                                            keyName={"curCode"}
                                            disabled
                                            format='{0}'
                                            />
                                            )}
                                    </FormItem>
                                    <div className='tax-item' style={{overflow:'hidden'}}>
                                        <FormItem label="默认税率" labelCol={{ span: 10 }} wrapperCol={{ span: 12 }} style={{width:'51%',float:'left'}}>
                                        {this.getFD('taxRate', {
                                            initialValue: (purchaseDetail.taxRate || purchaseDetail.taxRate == '0') ? Number(purchaseDetail.taxRate).toFixed(2) : "17.00",
                                            rules: [
                                                { type: "gtEqZero", label: '默认税率', decimal: 2, noRequired: true }
                                             ],  
                                        })(
                                            <Input suffix={`%`} disabled={list.includes('taxRate') ? true : false}/>
                                        )}
                                    </FormItem>
                                    <FormItem label=""  style={{float:'left'}}>
                                        {this.getFD('taxFlag', {
                                            initialValue: purchaseDetail.taxFlag != undefined ? purchaseDetail.taxFlag.toString() : null,
                                            onChange: this.handleChangeTax
                                        })(
                                            <Checkbox checked={this.getFdv('taxFlag')=='0'?false:true} disabled={(list.includes('taxFlag') || (this.getFdv('list')&&this.getFdv('list').length>0))? true : false}>
                                            单价含税
                                        </Checkbox>
                                        )}
                                    </FormItem>
                                    </div>    
                                    <FormItem label="运费" {...formItemLayout}>
                                        {this.getFD('freightAmount', {
                                            initialValue: (purchaseDetail.freightAmount || purchaseDetail.freightAmount == '0') ? Number(purchaseDetail.freightAmount).toFixed(2) : '0.00',
                                            rules: [
                                               { type: "gtEqZero", label: '运费', decimal: 2, noRequired: true }
                                            ],
                                        })(
                                            <Input disabled={list.includes('freightAmount') ? true : false} prefix={'￥'} />
                                            )}
                                    </FormItem>
                                </Col>
                                <a className="show-more-info" href="#" onClick={() => this.setState({ showMore: !showMore })}>{this.state.showMore ? '收起更多隐藏信息' :'展开更多隐藏信息'}</a>
                            </Row>
                            <div className="purOrder-other-info" style={{ display: showMore ? `block` : `none` }}>
                                {purchaseDetail.sourceOrderType == '3'?
                                <Row>
                                    <Col span={8} style={{paddingTop:'12px'}}>
                                        <FormItem label="备注" {...formItemLayout}>
                                            {this.getFD('remark', {
                                                initialValue: purchaseDetail.remark || '',
                                                rules: [{ max: 200, message: '备注不能超过200字符！' }]
                                            })(
                                                <Input type='textarea' style={{ height: '80px',resize:'none' }} >
                                                </Input>
                                                )}
                                        </FormItem>
                                    </Col>  
                                    <Col span={8} style={{paddingTop:'12px'}}>
                                        <FormItem label="给供应商留言" {...formItemLayout}>
                                            {this.getFD('message', {
                                                initialValue: purchaseDetail.message || '',
                                            })(
                                                <TextItemComp className='purchase-message'/>
                                                )}
                                        </FormItem>
                                        </Col>  
                                        <Col span={8} style={{paddingTop:'12px'}}>
                                        <FormItem label="电商备注" {...formItemLayout}>
                                            {this.getFD('ecRemark', {
                                                initialValue: purchaseDetail.ecRemark ||'',
                                            })(
                                                <TextItemComp className='purchase-message'/>
                                                )}
                                        </FormItem>
                                    </Col>          
                                </Row> 
                                :
                                <Row>
                                    <Col span={15} style={{paddingTop:'12px'}}>
                                        <FormItem label="备注" labelCol={{ span: 3 }} wrapperCol={{ span: 16 }}>
                                            {this.getFD('remark', {
                                                initialValue: purchaseDetail.remark || '',
                                                rules: [{ max: 200, message: '备注不能超过200字符！' }]
                                            })(
                                                <Input type='textarea' style={{ height: '72px' }} >
                                                </Input>
                                                )}
                                        </FormItem>
                                    </Col>  
                                </Row>
                                }
                            </div>
                        </div>
                        <div className="purOrder-detail-info">
                            <FormItem wrapperCol={{ span: 24 }}>
                                {this.getFD('list', {
                                    initialValue: purchaseDetail.list || [],
                                    onChange: () => {
                                        if (this.props.type == 'edit') {
                                            let supplierCode = this.getFdv('supplierCode');
                                            getSupplierList({ supplierCode,status:-1,...page });
                                        } else {
                                            getSupplierList({ supplierType:1,...page });
                                        }
                                    }
                                })(
                                    <PurchaseDetailComp
                                    {...this.props}
                                    getMaterialList={this.props.getMaterialList}
                                    getMeasureList={this.props.getMeasureList}
                                    taxRate={this.getFdv('taxRate')}
                                    taxFlag={this.state.taxFlag}
                                    sourceOrderType={purchaseDetail.sourceOrderType}
                                    freightAmount={this.getFdv('freightAmount')}
                                    getExpenseList={this.props.getExpenseList}
                                    supplierCode={this.getFdv('supplierCode')}
                                    />
                                    )}
                            </FormItem>
                        </div>
                    </Form>
                </Spin>
            </div>
        )
    }

}
export default Form.create()(AddPurchaseComp);

