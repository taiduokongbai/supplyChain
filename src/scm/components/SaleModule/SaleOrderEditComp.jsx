import React, { Component } from "react";
import { DatePicker, Select, Button, Input, Form, Row, Col, Spin, Icon, message } from '../../../base/components/AntdComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp';
import SaleOrderAddTableComp from "./SaleOrderAddTableComp";
import Validate from '../../../base/consts/ValidateList';
const Option = Select.Option;
const FormItem = Form.Item;
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class SaleOrderEditComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
            show: true,
            tip: '收起',
            tipMore: '展开更多隐藏信息',
            showMore: true,
            disabled: false, //销售员下拉禁
            ship_address_disabled: false, //发货地址下拉禁
            consignee_disabled: false, //收货员下拉禁
            delivery_address_disabled: false, //收货地址下拉禁
            invoice_address_disabled: false, //发票地址下拉禁
            taxRate: 17.00,
            symbol: '￥',
            planDelivery: '',//日期
            isTax: '',//是否含税
            amount: "0.00",
            tax: "0.00",
            totalAmount: "0.00"
        }
        this.param = {
            saleDetails: [],
        };
    }

    componentDidMount() {
        this.props.initData && this.props.initData();
    }
    componentWillUnmount = () => {
        this.props.clearEditVal();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.orderEdit !== nextProps.orderEdit) {
            this.props.initData && this.props.initData()
        }
    };
    //日期
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }
    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };
    startChange = (value) => {
        this.onChange('startValue', value);
    };

    onEndChange = (value) => {
        this.onChange('endValue', value);
        this.setState({
            planDelivery: value
        });
        let saleDetails = this.props.form.getFieldValue('saleDetails');
        saleDetails.map(item => {
            item.planDelivery = value.format('YYYY-MM-DD');
        })
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    };
    /*客户搜索*/
    onSearchCustomer = (value) => {
        this.props.CustomersList({ customerCode: value, customerFull: value, customerAbt: value, page: 1, pageSize: 10 }, 'edit');
    };
    onSelectCustomer = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            customerCode: value.customerCode,
            invoiceTitle: value.customerFull,
            currency: value.currencyCode,
            currencyName: value.currencyName,
            contactsPerson: value.defaultContacts.contactsName,
            contactsPersonCode: value.defaultContacts.contactsCode,
            contactsPhone: value.defaultContacts.phone,
            receiveAddressCode: value.defaultReceiveGoodsAddress.addressCode,
            receiveAddressDetails: value.defaultReceiveGoodsAddress.addressDetl,
            invoiceAddressCode: value.defaultBillingAddress.addressCode,
            invoiceAddressDetails: value.defaultBillingAddress.addressDetl,
        });
        this.props.ContactsList({ bpCode: value.customerCode, contactsCode: value.defaultContacts.contactsCode, contactsName: '', page: 1, pageSize: 10 }, 'edit');
        this.props.ReceiveAddressList({ bpCode: value.customerCode, addressCode: value.defaultReceiveGoodsAddress.addressCode, addressName: '', page: 1, pageSize: 10, isRep: 1 }, 'edit');
        this.props.InvaddressList({ isBil: 1, bpCode: value.customerCode, addressCode: value.defaultBillingAddress.addressCode, addressName: '', page: 1, pageSize: 10 }, 'edit');//发票地址
    };
    handleChangeCustomer = (value) => {
        if (value == '') {
            this.props.ContactsList({ bpCode: '', contactsCode: '', contactsName: '', page: 1, pageSize: 10 }, 'edit');
            this.props.ReceiveAddressList({ bpCode: '', addressCode: '', addressName: '', page: 1, pageSize: 10, isRep: 1 }, 'edit');
            this.props.InvaddressList({ isBil: 1, bpCode: '', addressCode: '', addressName: '', page: 1, pageSize: 10 }, 'edit');//发票地址
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                customerCode: '',
                invoiceTitle: '',
                currency: '',
                currencyName: '',
                contactsPerson: '',
                contactsPersonCode: '',
                contactsPhone: '',
                receiveAddressCode: '',
                receiveAddressDetails: '',
                invoiceAddressCode: '',
                invoiceAddressDetails: '',
            });
        }
        if (this.state.consignee_disabled) {
            this.setState({
                consignee_disabled: false,
                invoice_address_disabled: false,
                delivery_address_disabled: false
            })
        }

    };
    /*收货人搜索*/
    onSearchReceiver = (value) => {
        const { getFieldValue } = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.ContactsList({ bpCode: code, contactsCode: value, contactsName: value, page: 1, pageSize: 10 }, 'edit');
    };
    handleSelectReceiver = (value, option) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            contactsPhone: option.props.value,
        });
    };

    //选择收货人
    onSelectContact = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            contactsPhone: value.phone,
            contactsPersonCode: value.contactsCode,
        });
    };
    //改变收货人
    handleChangeContact = (value) => {
        if (value == '') {
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                contactsPhone: ''
            });
        }

    };
    /*收货地址搜索*/
    onSearchShipAddress = (value) => {
        const { getFieldValue } = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.ReceiveAddressList({ bpCode: code, addressCode: value, addressName: value, page: 1, pageSize: 10, isRep: 1 }, 'edit');
    };
    handleSelectShipAddress = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            receiveAddressDetails: value.addressDetl,
            receiveAddressCode: value.addressCode,
        });
    };
    handleChangeShipAddress = (value) => {
        const { setFieldsValue } = this.props.form;
        if (value == '') {
            setFieldsValue({
                receiveAddressDetails: '',
            });
        }

    }
    /*销售组织搜索*/
    onSearchSaleOrg = (value) => {
        this.props.OrgList({ orgType: 3, orgCode: value, orgName: value, page: 1, pageSize: 10 }, 'edit');
    };
    handleChangeSaleOrg = (value) => {
        if (value == '') {
            this.props.GetEmployeeList('', 'edit')
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                salesmanCode: '',
            })
        }
        if (this.state.disabled) {
            this.setState({
                disabled: false
            })
        }
    };
    handleSelectSaleOrg = (value) => {
        this.props.EmployeeList({ deptCode: value.orgCode, employeeCode: '', employeeName: '', page: 1, pageSize: 10 }, 'edit')
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            salesmanName: '',
            salesmanCode: '',
            saleOrgCode: value.orgCode
        });
    }
    /*销售员搜索*/
    onSearchSaleMan = (value) => {
        const { getFieldValue } = this.props.form;
        let code = getFieldValue('saleOrgCode')
        this.props.EmployeeList({ deptCode: code, employeeCode: value, employeeName: value, page: 1, pageSize: 10 }, 'edit')
    };
    handleSelectSaleMan = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            salesmanCode: value.empCode,
        });
        this.props.SiteList({ status:1,isSog: 1, siteCode: '', siteName: '', page: 1, pageSize: 10 }, 'edit')
    };
    handleChangeSaleMan = (value) => {
        const { setFieldsValue } = this.props.form;
        if (this.state.ship_address_disabled) {
            this.setState({
                ship_address_disabled: false
            })
        }
    };
    /*发货地址搜索*/
    onSearchSite = (value) => {
        this.props.SiteList({ status:1,isSog: 1, siteCode: value, siteName: value, page: 1, pageSize: 10 }, 'edit');
    };
    handleSelectSite = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            shipAddressCode: value.siteCode,
        });
    };
    /*收款条件搜索*/
    onSearchCollection = (value) => {
        this.props.CategoryList({ subCode: 'C013', catCode: value, catName: value, page: 1, pageSize: 10 }, 'edit');
    };
    handleSelectCollection = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            collectionTermsCode: value.catCode,
        });
    };
    /*发票类型搜索*/
    onSearchInvoiceType = (value) => {
        this.props.InvoiceTypeList({ subCode:"C021",catCode: value, catName: value, page: 1, pageSize: 10 }, 'edit');//发发票类型
    };
    handleSelectInvoiceType = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            invoiceTypeCode: value.catCode,
        });
    };
    /*币种搜索*/
    onSearchCurrency = (value) => {
        this.props.CurrencyList({ curName: value, curCode: value, page: 1, pageSize: 10 }, 'edit');
    };
    handleSelectCurrency = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            currency: value.curCode,
        });
    };
    handleChangeCurrency = (value) => {
        const { setFieldsValue } = this.props.form;
        if (value == '') {
            setFieldsValue({
                currency: '',
            });
        }
    };
    /*发票地址搜索*/
    onSearchInvoice = (value) => {
        const { getFieldValue } = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.InvaddressList({ isBil: 1, bpCode: code, addressCode: value, addressName: value, page: 1, pageSize: 10 }, 'edit');//发票地址
    };
    handleSelectInvoice = (value) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            invoiceAddressDetails: value.addressDetl,
            invoiceAddressCode: value.addressCode
        });
    };
    handleChangeInvoice = (value) => {
        const { setFieldsValue } = this.props.form;
        if (value == '') {
            setFieldsValue({
                invoiceAddressDetails: '',
            });
        }

    };
    onTaxChange = (value) => {
        const { setFieldsValue } = this.props.form;
        if (value == 1) {
            setFieldsValue({
                taxRate: 17,
            });
        } else {
            setFieldsValue({
                taxRate: 0,
            });
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (data.saleDetails.length === 0) {
                message.warn('明细项不能为空');
                return;
            } else {
                let flag = false;
                Array.isArray(data.saleDetails) && data.saleDetails.map(item => {
                    if (!item.materialCode || !item.unitPrice || !item.materialNum) {
                        flag = true;
                    }
                })
                if (flag) {
                    message.warn('明细项物料编码，数量，单价不能为空')
                    return;
                }
            }
            if (!err) {
                let obj = Object.assign({}, data, { orderDate: data.orderDate ? data.orderDate.format('YYYY-MM-DD') : '' }, { planDelivery: data.planDelivery.format('YYYY-MM-DD') }, { saleDetails: data.saleDetails.reverse() }, { amount: this.state.amount }, { tax: this.state.tax }, { totalAmount: this.state.totalAmount })
                this.props.Save(obj);
            }
        });
    };
    //日期联动
    onStartChange = (field, val) => {
        this.setState({
            planDelivery: val
        });

    }
    //是否含税
    handleChangeTax = (val) => {
        let taxRate = 0.00;
        if (val == '0') {
            this.setState({
                isTax: '0'
            });
            taxRate = 17.00;
        } else if (val == '1') {
            this.setState({
                isTax: '1'
            });
            taxRate = 0.00;
            this.setState({taxRate});
        }
    }
    //明细项更新
    handleChangeList = (saleDetails) => {
        let taxRate = 0, amount = 0, tax = 0, totalAmount = 0;
        saleDetails.forEach(item => {
            if (item.isDonation == "0") {
                amount = (Number(amount)).toFixed(2);
                tax = (Number(tax)).toFixed(2);
                totalAmount = (Number(totalAmount)).toFixed(2);
            } else {
               /* if (this.props.form.getFieldValue('isTax') == 1) {
                    amount = (Number(amount) + Number(item.amount)).toFixed(2);
                    tax = 0;
                    totalAmount = (Number(totalAmount) + Number(item.totalAmount)).toFixed(2);
                } else {*/
                    amount = (Number(amount) + Number(item.amount)).toFixed(2);
                    tax = (Number(tax) + Number(item.tax)).toFixed(2);
                    totalAmount = (Number(totalAmount) + Number(item.totalAmount)).toFixed(2);
                }
           /* }*/
        });
        this.setState({ saleDetails });
        this.props.changeMXValEdit(amount, tax, totalAmount)
    }
    toggle = () => {
        this.setState({
            tip: this.state.show ? '展开' : '收起',
            show: this.state.show ? false : true
        })
    };
    toggleMore = () => {
        this.setState({
            tipMore: this.state.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息',
            showMore: this.state.showMore ? false : true
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        let { editCustomerSource, editOrgSource, editContactsSource, editCurrencySource, editCategorySource, editInvaddressSource, editSiteSource, editReceiveAddressSource, editEmployeeSource, editInvoiceTypeSource } = this.props;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 10 },
        };
        const { saleOrderInfo, orderEditTotal } = this.props;
        let disabedSelect = saleOrderInfo.businessType == 2 || saleOrderInfo.businessType == 3 ? true : false;
        return (
            <div className="saleOrder-wrap">
                <div className="saleOrder-header">
                    <div className="saleOrder-head-border">
                        <span className="saleOrder-header-title">{this.props.title}</span>
                        <Button className="default-btn save" onClick={this.handleSubmit}>保存</Button>
                        <a className="show-or-hide" href="#" onClick={this.toggle}>{this.state.tip}</a>
                    </div>
                </div>
                <Form className="saleOrder-form" onSubmit={this.handleSubmit}>
                    <div className="saleOrder-body-border" style={{ display: this.state.show ? `block` : `none` }}>
                        <div className="saleOrder-body-top">
                            <Row type="flex" justify="end">
                                <Col className="saleOrder-body-top-borderR" span={8}>
                                    <div className="saleOrder-baseInfo">
                                        <span className="saleOrder-form-baseInfo"><strong>基本信息</strong></span>
                                    </div>
                                    <FormItem FormItem {...formItemLayout} label="销售订单:" style={{ display: `none` }}>
                                        {getFieldDecorator('saleOrderCode', {
                                            initialValue: saleOrderInfo.saleOrderCode,
                                        })(
                                            <Input />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="客户名称:">
                                        {getFieldDecorator('customerCode', {
                                            initialValue: saleOrderInfo.customerCode ? saleOrderInfo.customerCode : '',
                                            rules: [
                                                { type: "string", message: "客户名称为必填", required: true },
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editCustomerSource,
                                                    keyName: "customerCode",
                                                    required: true
                                                }),
                                            ]
                                        })(
                                            <AutoSelectComp
                                                disabled={disabedSelect}
                                                selectedList={editCustomerSource}
                                                onSearch={this.onSearchCustomer}
                                                displayName={["customerCode", "customerFull"]}
                                                keyName={"customerCode"}
                                                onChange={this.handleChangeCustomer}
                                                onSelect={this.onSelectCustomer}
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="订单日期:">
                                        {getFieldDecorator('orderDate', {
                                            initialValue: saleOrderInfo.orderDate ? moment(saleOrderInfo.orderDate) : null,
                                            rules: [
                                                { message: "订单日期为必填", required: true },
                                            ],
                                        })(
                                            <DatePicker
                                                disabled={disabedSelect}
                                                disabledDate={this.disabledStartDate}
                                                format="YYYY-MM-DD"
                                                onChange={this.onStartChange}
                                                onOpenChange={this.handleStartOpenChange}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="收货人:">
                                        {getFieldDecorator('contactsPerson', {
                                            initialValue: saleOrderInfo.contactsPerson,
                                            rules: [
                                                { type: "string", message: "收货人为必填", required: true },
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={editContactsSource}
                                                disabled={disabedSelect}
                                                onSearch={this.onSearchReceiver}
                                                displayName={["contactsCode", "contactsName", "phone"]}
                                                keyName={"contactsName"}
                                                onSelect={this.onSelectContact}
                                                onChange={this.handleChangeContact}
                                                optionLabelProp="value"
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="联系电话:">
                                        {getFieldDecorator('contactsPhone', {
                                            initialValue: saleOrderInfo.contactsPhone ? saleOrderInfo.contactsPhone : '',
                                            rules: [
                                                Validate({
                                                    type: "phone",
                                                    message: "不是有效的手机号码！",
                                                }),
                                            ],
                                        })(
                                            <Input disabled={disabedSelect} />
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="收货站点:">
                                        {getFieldDecorator('receiveAddressCode', {
                                            initialValue: saleOrderInfo.receiveAddressCode ? saleOrderInfo.receiveAddressCode : '',
                                            rules: [
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editReceiveAddressSource,
                                                    keyName: "addressCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={editReceiveAddressSource}
                                                displayName={["addressCode", "addressName"]}
                                                keyName={"addressCode"}
                                                disabled={disabedSelect}
                                                onSearch={this.onSearchShipAddress}
                                                onSelect={this.handleSelectShipAddress}
                                                onChange={this.handleChangeShipAddress}
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="详细地址">
                                        {getFieldDecorator('receiveAddressDetails', {
                                            initialValue: saleOrderInfo.receiveAddressDetails ? saleOrderInfo.receiveAddressDetails : '',
                                            rules: [
                                                { type: "string", message: "详细地址为必填", required: true },
                                            ],
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                </Col>

                                <Col className="saleOrder-body-top-borderR" span={8}>
                                    <div className="saleOrder-baseInfo">
                                        <span className="saleOrder-form-baseInfo"><strong>发货信息</strong></span>
                                    </div>
                                    <FormItem FormItem {...formItemLayout} label="预计交货日期:">
                                        {getFieldDecorator('planDelivery', {
                                            initialValue: saleOrderInfo.planDelivery ? moment(saleOrderInfo.planDelivery) : null,
                                            rules: [{ required: true, message: '预计交货日期为必填' }]
                                        })(
                                            <DatePicker
                                                disabledDate={this.disabledEndDate}
                                                format="YYYY-MM-DD"
                                                onChange={this.onEndChange}
                                                onOpenChange={this.handleStartOpenChange}
                                            />
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="销售组织:">
                                        {getFieldDecorator('saleOrgCode', {
                                            initialValue: saleOrderInfo.saleOrgCode ? saleOrderInfo.saleOrgCode : '',
                                            rules: [
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editOrgSource,
                                                    keyName: "orgCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={editOrgSource}
                                                displayName={["orgCode", "orgName"]}
                                                keyName={"orgCode"}
                                                onSearch={this.onSearchSaleOrg}
                                                onChange={this.handleChangeSaleOrg}
                                                onSelect={this.handleSelectSaleOrg}
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="销售员:">
                                        {getFieldDecorator('salesmanCode', {
                                            initialValue: saleOrderInfo.salesmanCode ? saleOrderInfo.salesmanCode : '',
                                            rules: [
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editEmployeeSource,
                                                    keyName: "empCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={editEmployeeSource}
                                                displayName={["empCode", "empName"]}
                                                keyName={"empCode"}
                                                disabled={this.state.disabled}
                                                onSearch={this.onSearchSaleMan}
                                                onSelect={this.handleSelectSaleMan}
                                                onChange={this.handleChangeSaleMan}

                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="币种:">
                                        {getFieldDecorator('currencyName', {
                                            initialValue: saleOrderInfo.currencyName ? saleOrderInfo.currencyName : '',
                                            rules: [
                                                { message: "币种为必填", required: true },
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editCurrencySource,
                                                    keyName: "curName",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                disabled={disabedSelect}
                                                selectedList={editCurrencySource}
                                                displayName={["curCode", "curName"]}
                                                keyName={"curName"}
                                                onSearch={this.onSearchCurrency}
                                                optionFilterProp="children"
                                                onSelect={this.handleSelectCurrency}
                                                onChange={this.handleChangeCurrency}
                                                optionLabelProp="value"
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="币种编号:" style={{ display: `none` }}>
                                        {getFieldDecorator('currency', {
                                            initialValue: saleOrderInfo.currency,
                                        })(
                                            <Input />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="发货站点:">
                                        {getFieldDecorator('shipAddressCode', {
                                            initialValue: saleOrderInfo.shipAddressCode ? saleOrderInfo.shipAddressCode : '',
                                            rules: [
                                                { type: "string", message: "发货站点为必填", required: true },
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editSiteSource,
                                                    keyName: "siteCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                selectedList={editSiteSource}
                                                displayName={["siteCode", "siteName"]}
                                                keyName={"siteCode"}
                                                disabled={this.state.ship_address_disabled}
                                                onSearch={this.onSearchSite}
                                                onSelect={this.handleSelectSite}
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="合同编号">
                                        {getFieldDecorator('contractCode', {
                                            initialValue: saleOrderInfo.contractCode,
                                            rules: [{ type: "string", message: '合同编号为必填', required: true },
                                            { message: '合同编号不能超过20字符', max: 20 }],
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <div className="saleOrder-baseInfo saleOrder-tit">
                                        <span className="saleOrder-form-baseInfo"><strong>财务信息</strong></span>
                                    </div>

                                    <FormItem FormItem {...formItemLayout} label="收款条件:">
                                        {getFieldDecorator('collectionTermsCode', {
                                            initialValue: saleOrderInfo.collectionTermsCode ? saleOrderInfo.collectionTermsCode : '',
                                            rules: [
                                                { type: "string", message: "收款条件为必填", required: true },
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editCategorySource,
                                                    keyName: "catCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                disabled={disabedSelect}
                                                selectedList={editCategorySource}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                                onSearch={this.onSearchCollection}
                                                optionFilterProp="children"
                                                onSelect={this.handleSelectCollection}

                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="发票类型:">
                                        {getFieldDecorator('invoiceTypeCode', {
                                            initialValue: saleOrderInfo.invoiceTypeCode ? saleOrderInfo.invoiceTypeCode : '',
                                            rules: [
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editInvoiceTypeSource,
                                                    keyName: "catCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                disabled={disabedSelect}
                                                selectedList={editInvoiceTypeSource}
                                                displayName={["catCode", "catName"]}
                                                keyName={"catCode"}
                                                onSearch={this.onSearchInvoiceType}
                                                optionFilterProp="children"
                                                onSelect={this.handleSelectInvoiceType}
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="发票抬头:">
                                        {getFieldDecorator('invoiceTitle', {
                                            initialValue: saleOrderInfo.invoiceTitle ? saleOrderInfo.invoiceTitle : saleOrderInfo.customerFull,
                                            rules: [{ type: "string", message: '发票抬头为必填' },
                                            { message: '发票抬头不能超过50字段', max: 50 }]
                                        }
                                        )(
                                            <Input disabled={disabedSelect} />
                                            )}
                                    </FormItem>

                                    <FormItem FormItem {...formItemLayout} label="发票站点:">
                                        {getFieldDecorator('invoiceAddressCode', {
                                            initialValue: saleOrderInfo.invoiceAddressCode ? saleOrderInfo.invoiceAddressCode : '',
                                            rules: [
                                                Validate({
                                                    type: "autoselect",
                                                    message: "请从下拉列表中选择一项！",
                                                    list: editInvaddressSource,
                                                    keyName: "addressCode",
                                                }),
                                            ],
                                        })(
                                            <AutoSelectComp
                                                disabled={disabedSelect}
                                                selectedList={editInvaddressSource}
                                                displayName={["addressCode", "addressName"]}
                                                keyName={"addressCode"}
                                                onSearch={this.onSearchInvoice}
                                                onSelect={this.handleSelectInvoice}
                                                onChange={this.handleChangeInvoice}
                                            >
                                            </AutoSelectComp>
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="详细地址">
                                        {getFieldDecorator('invoiceAddressDetails', {
                                            initialValue: saleOrderInfo.invoiceAddressDetails,
                                        })(
                                            <Input disabled />
                                            )}
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="是否含税">
                                        {getFieldDecorator('isTax', {
                                            initialValue: saleOrderInfo.isTax,
                                            onChange: this.handleChangeTax
                                        })(
                                            <Select style={{ width: 100 }} onChange={this.handleChangeTax}
                                                disabled={disabedSelect}>
                                                <Option value="0">是</Option>
                                                <Option value="1">否</Option>
                                            </Select>
                                            )}<span>（默认17%）</span>
                                    </FormItem>
                                    <FormItem FormItem {...formItemLayout} label="税率:" style={{ display: `none` }}>
                                        {getFieldDecorator('taxRate', {
                                            initialValue: saleOrderInfo.taxRate,
                                        })(
                                            <Input />
                                            )
                                        }
                                    </FormItem>
                                    <a className="show-and-hide" href="#" onClick={this.toggleMore}>{this.state.tipMore}</a>
                                </Col>
                            </Row>
                        </div>
                        <div className="saleOrder-body-down" style={{ display: this.state.showMore ? `none` : `block` }}>
                            <div className="other-info-form">
                                <div className="saleOrder-baseInfo">
                                    <span className="saleOrder-form-baseInfo"><strong>其他信息</strong></span>
                                </div>
                                <Row type="flex" justify="end">
                                    <Col span={8}>
                                        <FormItem FormItem {...formItemLayout} label="单据类型">
                                            {getFieldDecorator('businessType', {
                                                initialValue: saleOrderInfo.businessType,
                                            })(
                                                <Select disabled>
                                                    <option value="0">产品订单</option>
                                                    <option value="1">服务订单</option>
                                                    <option value="2">商品非标订单</option>
                                                    <option value="3">商品标品订单</option>
                                                </Select>
                                                )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="来源订单号">
                                            {getFieldDecorator('sourceCode', {
                                                initialValue: saleOrderInfo.sourceCode,
                                                rules: [{ message: '来源订单号不能超过20字段', max: 20 }],
                                            })(
                                                <Input disabled={true} />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem FormItem {...formItemLayout} label="备注">
                                            {getFieldDecorator('remark', {
                                                initialValue: saleOrderInfo.remark,
                                                rules: [
                                                    { max: 200, message: '最多允许200字' },
                                                ],
                                            })(
                                                <Input type="textarea" style={{ height: 130, width: 200 }} placeholder="请输入备注" />
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem FormItem {...formItemLayout} label="运输费用">
                                            {getFieldDecorator('transportCosts', {
                                                initialValue: saleOrderInfo.transportCosts,
                                            })(
                                                <Input disabled={true} />
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="saleOrder-mxInfo">
                            <span className="saleOrder-form-baseInfo"><strong>明细信息</strong></span>
                            <span className="saleOrder-mxInfo-r">
                                <span className="saleOrder-mxInfo-l">合计</span>
                                <span className="saleOrder-mxInfo-l">金额：</span><strong className="saleOrder-mxInfo-orange">￥{Number(orderEditTotal.amount).toFixed(2)}</strong>
                                <span className="saleOrder-mxInfo-l">税额：</span><strong className="saleOrder-mxInfo-orange">￥{Number(orderEditTotal.tax).toFixed(2)}</strong>
                                <span className="saleOrder-mxInfo-l">价税合计：</span><strong className="saleOrder-mxInfo-orange">￥{Number(orderEditTotal.totalAmount).toFixed(2)}</strong>
                            </span>
                        </div>
                        <FormItem wrapperCol={{ span: 24 }}>
                            {getFieldDecorator('saleDetails', {
                                initialValue: saleOrderInfo.saleDetails || [],
                                onChange: this.handleChangeList,
                            })(
                                <SaleOrderAddTableComp
                                    businessType={saleOrderInfo.businessType}
                                    typePage={this.props.typePage}
                                    MaterialList={this.props.MaterialList}
                                    MeasureList={this.props.MeasureList}
                                    taxRate={this.state.taxRate}
                                    planDelivery={this.state.planDelivery ? this.state.planDelivery : moment(saleOrderInfo.planDelivery)}
                                    isTax={this.state.isTax ? this.state.isTax : saleOrderInfo.isTax}
                                    SaleOrderAddTableVisiable={this.props.SaleOrderAddTableVisiable}
                                />
                                )}
                        </FormItem>
                    </div>
                </Form>
            </div>
        )
    }
}
SaleOrderEditComp.propTypes = {
    saleOrderData: React.PropTypes.object,
}
export default Form.create()(SaleOrderEditComp);