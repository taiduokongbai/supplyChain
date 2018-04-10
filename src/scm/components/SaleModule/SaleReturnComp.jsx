import React, {Component} from 'react';
import moment from 'moment';
import {
    DatePicker,
    Select,
    Button,
    Input,
    Form,
    Row,
    Col,
    Spin,
    Collapse,
    InputNumber,
    message
} from '../../../base/components/AntdComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp';
import SaleReturnAddTableComp from './SaleReturnAddTableComp';
import Validate from '../../../base/consts/ValidateList';

const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

class SaleReturnComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelState: '收起',
            saleReturnAllInfo: {saleOrderCode: ''},
            isCustomerDisabled: false,
            salesmanNull: false,
            showMore: true,
            tipMore: '展开更多隐藏信息',
            isTax: '0',//是否含税
            amount: '',
            tax: '',
            totalAmount: ''
        };
        this.param = {
            list: [],
        };
    }
    componentWillUnmount = () => {
        this.props.clearOrder();
    };
    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (data.saleReturnDetails.length == 0) {
                message.error('明细信息不能为空');
                return;
            } else {
                data.saleReturnDetails.forEach((item) => {
                    if (item.materialCode == "") {
                        message.error('明细信息内容不能为空');
                        err = true
                        return;
                    }
                })
            }
            if (!err) {
                let obj = Object.assign({}, data, {orderDate: data.orderDate.format('YYYY-MM-DD')}, { saleReturnDetails: data.saleReturnDetails.reverse() }, {planReturnDate: data.planReturnDate.format('YYYY-MM-DD')}, {amount: this.state.amount}, {tax: this.state.tax}, {totalAmount: this.state.totalAmount})
                this.props.Save(obj);
            }

        });
    };

    // 来源订单编号文本框值变化时回调
    onSearch = (value) => {
        this.props.InitialSaleOrderList(value, value, 1, 10, '');
    }

    // 来源订单编号选中option事件
    onSelect = (value, option) => {
        let saleOrderCode = value.saleOrderCode;
        this.props.form.setFieldsValue({
            sourceCode: value.saleOrderCode,
            customerCode: value.customerCode,

            contactsPerson: value.contactsPerson,
            contactsPhone: value.contactsPhone,
            // 取货地址是 客户收货地址
            takeDelOfAddress: value.cusReceiveAddressCode,
            takeDelOfDetails: value.cusReceiveAddressDetails,
            salesman: value.salesmanCode,
            saleOrg: value.saleOrgCode,
            receiveAddress: value.supReceiveAddressCode,
            receiveAddressDetails: value.supReceiveAddressDetails,
            currency: value.currency ? value.currency : 'CH78',
            currencyName: value.currencyName ? value.currencyName : 'RMB',
            amount: '',
            tax: '',
            totalAmount: '',
            businessType: '1'
        });

        this.setState({
            saleReturnAllInfo: value,
            isCustomerDisabled: true,
            salesmanNull: false,
            amount: '',
            tax: '',
            totalAmount: ''
        });
        this.props.CustomerList('', '', '', 1, 10);    // 客户列表
        this.props.ReceiveAdrList(1, 1, value.supReceiveAddressCode, value.supReceiveAddressCode, 1, 10);    // 收货站点
        this.props.ContactsList(value.customerCode, '',value.contactsPerson,  1, 10);    // 联系人
        this.props.TakeDelOfAddressList(1, '', value.cusReceiveAddressCode, value.cusReceiveAddressCode, 1, 10);    // 取货站点
        this.props.SalesorgList(3, value.saleOrgCode, value.saleOrgCode, 1, 10);  // 销售组织
        if (value.saleOrgCode) {
            this.props.SalesmanList(value.saleOrgCode, '', 1, 10);     // 销售员
        }
        this.props.ReceiveWarehouseList(value.supReceiveAddressCode, 1, '', '', 1, 10);
        this.props.OriginalOrderList(value.saleOrderCode);
        this.props.form.setFieldsValue({saleReturnDetails: []});
    }
    onChange = (value) => {
        if (value == '') {
            this.props.CustomerList('', '', '', 1, 10);
            this.props.TakeDelOfAddressList(1, '', '', '', 1, 10);
            this.props.ContactsList('', '', '', 1, 10);
            this.props.ReceiveAdrList(1, 1, '', '', 1, 10);    // 收货地址
            this.props.SalesorgList(3, '', '', 1, 10);  // 销售组织
            this.setState({
                saleReturnAllInfo: {},
                isCustomerDisabled: false,
                salesmanNull: true,
                amount: '',
                tax: '',
                totalAmount: ''
            });
            this.props.OriginalOrderList('');
            this.props.form.setFieldsValue({
                customerCode: '',
                contactsPerson: '',
                contactsPhone: '',
                takeDelOfAddress: '',
                takeDelOfDetails: '',
                salesman: '',
                saleOrg: '',
                receiveAddress: '',
                receiveAddressDetails: '',
                currency: 'CH78',
                currencyName: 'RMB',
                amount: '',
                tax: '',
                totalAmount: '',
                saleReturnDetails: [],
                businessType: '2'
            });

        } else {
            this.setState({
                isCustomerDisabled: true
            })
        }
    }

    // 客户列表搜索
    searchCustomer = (value) => {
        this.props.CustomerList(value, value, value, 1, 10);
    }
    // 选择客户名称
    selectCustomer = (value, option) => {
        this.props.form.setFieldsValue({
            contactsPerson: value.defaultContacts.contactsName ? value.defaultContacts.contactsName : '',
            contactsPhone: value.defaultContacts.phone ? value.defaultContacts.phone : '',
            takeDelOfAddress: value.defaultSendGoodsAddress.addressCode ? value.defaultSendGoodsAddress.addressCode : '',
            takeDelOfDetails: value.defaultSendGoodsAddress.addressDetl ? value.defaultSendGoodsAddress.addressDetl : '',
            currency: value.currencyCode ? value.currencyCode : 'CH78',
            currencyName: value.currencyName ? value.currencyName : 'RMB'
        });

        this.props.ContactsList(value.customerCode, value.defaultContacts.contactsName, value.defaultContacts.contactsName, 1, 10);
        this.props.TakeDelOfAddressList(1, value.customerCode, value.defaultSendGoodsAddress.addressCode, value.defaultSendGoodsAddress.addressCode, 1, 10);
    }
    changeCustomer = (value) => {
        if (value == '') {
            this.props.form.setFieldsValue({
                customerCode: '',
                contactsPerson: '',
                contactsPhone: '',
                takeDelOfAddress: '',
                takeDelOfAddressName: '',
                takeDelOfDetails: '',
                currency: value.currencyCode ? value.currencyCode : 'CH78',
                currencyName: value.currencyName ? value.currencyName : 'RMB'
            });
            this.props.ContactsList('', '', '', 1, 10);
            this.props.TakeDelOfAddressList(1, '', '', '', 1, 10);
        }
    }
    // 联系人
    searchContacts = (value) => {
        const {getFieldValue} = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.ContactsList(code, value, value, 1, 10);
    }

    selectContacts = (value, option) => {
        this.props.form.setFieldsValue({
            contactsPerson: value.contactsName,
            contactsPhone: value.phone
        })

    }
    changeContacts = (value) => {
        if (value == '') {
            this.props.form.setFieldsValue({
                contactsPerson: '',
                contactsPhone: ''
            })
        }
    }
    // 取货地址
    searchTakeDelOfAddress = (value) => {
        const {getFieldValue} = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.TakeDelOfAddressList(1, code, value, value, 1, 10);
    }
    selectTakeDelOfAddress = (value, option) => {
        this.props.form.setFieldsValue({
            takeDelOfAddress: value.addressCode,
            // takeDelOfAddressName: value.addressName,
            takeDelOfDetails: value.addressDetl,
        })
    }
    changeTakeDelOfAddress = (value) => {
        if (value == '') {
            this.props.form.setFieldsValue({
                // takeDelOfAddressName: '',
                takeDelOfDetails: '',
            })
        }
    }
    // 销售员
    searchSalesman = (value) => {
        let saleOrg = this.props.form.getFieldValue('saleOrg');
        this.props.SalesmanList(saleOrg, value, 1, 10);
    }

    selectSalesman = (value, option) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            salesman: value.empCode,
        })
    }

    // 销售组织
    searchSalesorg = (value) => {
        this.props.SalesorgList(3, value, value, 1, 10);
    }

    selectSalesorg = (value, option) => {
        const {setFieldsValue} = this.props.form;
        setFieldsValue({
            saleOrg: value.orgCode,
            salesman: '',
        });
        // 选择销售组织后，重置销售员
        this.props.SalesmanList(value.orgCode, '', 1, 10);
    }

    changeSalesorg = (value) => {
        let orgCode = this.props.form.getFieldValue('saleOrg');
        if (value) {
            this.setState({salesmanNull: false});
            this.props.SalesmanList(orgCode, '', 1, 10);
        } else if (value == '') {
            this.setState({salesmanNull: true});
        }
        this.props.form.setFieldsValue({salesman: ''})
    }

    // 收货站点
    searchReceiveAdr = (value) => {
        this.props.form.setFieldsValue(
            {
                receiveAddressDetails: '',
            });
        return this.props.ReceiveAdrList(1, 1, value, value, 1, 10);
    }
    changeReceiveAdr = (value) => {
        this.props.ClearWarehouseList();
        this.props.form.setFieldsValue(
            {
                receivWarehouseCode: ''
            });
    }
    selectReceiveAdr = (value, option) => {
        this.props.form.setFieldsValue({
            receiveAddressDetails: value.addressDetl,
            receivWarehouseCode: ''
        })
        this.props.ReceiveWarehouseList(value.siteCode, 1, '', '', 1, 10);
    }
// 收货仓库
    searchReceiveWarehouse = (value) => {
        const {getFieldValue} = this.props.form;
        let code = getFieldValue('receiveAddress')
        this.props.form.setFieldsValue({receiveAddressDetails: ''});
        return this.props.ReceiveWarehouseList(code, 1, value, value, 1, 10);
    }

    selectReceiveWarehouse = (value, option) => {
        this.props.form.setFieldsValue({
            receiveAddressDetails: value.addressDetl,
        })
    }
    // 点击切换 隐藏/打开补充信息
    panelChange = (key) => {
        if (key.length == 0) {
            this.setState({
                panelState: '展开'
            })
        } else {
            this.setState({
                panelState: '收起'
            })
        }
    }
    // 点击展开/收起更多隐藏信息
    toggleMore = () => {
        this.setState({
            tipMore: this.state.showMore ? '收起更多隐藏信息' : '展开更多隐藏信息',
            showMore: this.state.showMore ? false : true
        })
    }
    formatMoney = (money) => (money === '' || money === null || money === undefined) ? '0.00' : Number(money).toFixed(2);

    //明细项更新
    handleChangeList = (saleReturnDetails) => {
        let taxRate = 0, amount = 0, tax = 0, totalAmount = 0;
        saleReturnDetails.forEach(item => {
            // 如果不是物料不是赠品则进行更新
            if (item.isDonation == "1") {
                amount = (Number(amount) + Number(item.amount)).toFixed(2);
                tax = (Number(tax) + Number(item.tax)).toFixed(2);
                totalAmount = (Number(totalAmount) + Number(item.totalAmount)).toFixed(2);
            } else if (item.isDonation == "0") {
                amount = (Number(amount)).toFixed(2);
                tax = (Number(tax)).toFixed(2);
                totalAmount = (Number(totalAmount)).toFixed(2);
            }
        });
        this.setState({saleReturnDetails})
        this.setState({amount});
        this.setState({tax});
        this.setState({totalAmount});

    }

    render() {

        const {saleReturnDetailInfo, originalOrderSource, initialSaleOrderList, customerList, contactsList, receiveAdrList, receiveWarehouseList, saleOrder, salesmanList, takeDelOfAddressList, salesorgList, SaleReturnDialogVisiable} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 10},
        };
        return (
            <div className="saleReturn-wrap">
                <Form className="saleReturn-form">
                    <div className="saleReturn-header">
                        <span className="saleReturn-header-title">{this.props.title}</span>
                        <Button className="default-btn save" onClick={this.handleSubmit}>保存</Button>
                    </div>
                    <div className="saleReturn-form-content">

                        <Collapse bordered={false} defaultActiveKey={['1']} onChange={this.panelChange}>
                            <Panel header={this.state.panelState} key="1">
                                <Row type="flex" justify="center">

                                    <Col span={12}>
                                        <div className="saleReturn-baseInfo">
                                            <span className="saleReturn-form-baseInfo">基本信息</span>
                                        </div>
                                        <FormItem style={{margin: 0}} label="">

                                            {getFieldDecorator('saleReturnCode', {
                                                initialValue: saleReturnDetailInfo.saleReturnCode ? saleReturnDetailInfo.saleReturnCode : '',
                                            })(
                                                <Input type="hidden"></Input>
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="来源订单编号:">
                                            {getFieldDecorator('sourceCode', {
                                                initialValue: saleReturnDetailInfo.sourceCode ? saleReturnDetailInfo.sourceCode : '',
                                                rules: [
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: initialSaleOrderList,
                                                        keyName: "saleOrderCode",
                                                    }),
                                                ],
                                            })(
                                                <AutoSelectComp
                                                    selectedList={initialSaleOrderList}
                                                    displayName={["saleOrderCode"]}
                                                    keyName={"saleOrderCode"}
                                                    onSearch={this.onSearch}
                                                    onSelect={this.onSelect}
                                                    onChange={this.onChange}
                                                    format="{0}"
                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>


                                        <FormItem FormItem {...formItemLayout} label="客户名称:">
                                            {getFieldDecorator('customerCode', {
                                                initialValue: '',
                                                rules: [
                                                    {message: '客户名称为必填', required: true},
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: customerList,
                                                        keyName: "customerCode",
                                                    })
                                                ],
                                            })(
                                                <AutoSelectComp
                                                    selectedList={customerList}
                                                    displayName={['customerCode', 'customerFull']}
                                                    keyName={"customerCode"}
                                                    onSearch={this.searchCustomer}
                                                    onSelect={this.selectCustomer}
                                                    onChange={this.changeCustomer}
                                                    disabled={this.state.isCustomerDisabled}
                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="单据日期:">
                                            {getFieldDecorator('orderDate', {
                                                initialValue: moment(saleReturnDetailInfo.orderDate),
                                                rules: [{type: 'object', message: '请选择单据日期', required: true}],
                                            })(
                                                <DatePicker
                                                    disabledDate={this.disabledStartDate}
                                                    format="YYYY-MM-DD"
                                                    onChange={this.onStartChange}
                                                    onOpenChange={this.handleStartOpenChange}
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="联系人:">
                                            {getFieldDecorator('contactsPerson', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        message: '请输入联系人'
                                                    },
                                                ],
                                            })(
                                                <AutoSelectComp
                                                    selectedList={contactsList}
                                                    displayName={['contactsCode', 'contactsName']}
                                                    keyName={"contactsName"}
                                                    onSearch={this.searchContacts}
                                                    onSelect={this.selectContacts}
                                                    onChange={this.changeContacts}
                                                    optionLabelProp="value"
                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="联系电话">
                                            {getFieldDecorator('contactsPhone', {
                                                initialValue: saleReturnDetailInfo.contactsPhone ? saleReturnDetailInfo.contactsPhone : '',
                                                rules: [
                                                    Validate({
                                                        type: "phone",
                                                        message: "不是有效的手机号码！",
                                                    }),
                                                ],
                                            })(
                                                <Input></Input>
                                            )}

                                        </FormItem>

                                        <FormItem FormItem {...formItemLayout} label="取货站点:">
                                            {getFieldDecorator('takeDelOfAddress', {
                                                initialValue: saleReturnDetailInfo.takeDelOfAddressName ? saleReturnDetailInfo.takeDelOfAddressName : '',
                                                rules: [
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: takeDelOfAddressList,
                                                        keyName: "addressCode",
                                                    })
                                                ],
                                            })(
                                                <AutoSelectComp
                                                    selectedList={takeDelOfAddressList}
                                                    displayName={['addressCode', 'addressName']}
                                                    keyName={"addressCode"}
                                                    onSearch={this.searchTakeDelOfAddress}
                                                    onSelect={this.selectTakeDelOfAddress}
                                                    onChange={this.changeTakeDelOfAddress}
                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>

                                        <FormItem FormItem {...formItemLayout} label="详细地址">
                                            {getFieldDecorator('takeDelOfDetails', {

                                                initialValue: saleReturnDetailInfo.takeDelOfDetails ? saleReturnDetailInfo.takeDelOfDetails : '',
                                                rules: [{message: '详细地址为必填', required: true}],
                                            })(
                                                <Input disabled></Input>
                                            )
                                            }
                                        </FormItem>

                                    </Col>
                                    <Col span={12}>
                                        <div className="saleReturn-baseInfo">
                                            <span className="saleReturn-form-baseInfo">地址信息</span>
                                        </div>
                                        <FormItem FormItem {...formItemLayout} label="预计退货日期:">
                                            {getFieldDecorator('planReturnDate', {
                                                initialValue: saleReturnDetailInfo.planReturnDate ? moment(saleReturnDetailInfo.planReturnDate) : null,
                                                rules: [{message: '预计退货日期为必填', required: true}],
                                            })(
                                                <DatePicker
                                                    format="YYYY-MM-DD"
                                                    onChange={this.onStartChange}
                                                    onOpenChange={this.handleStartOpenChange}
                                                />
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="销售组织:">
                                            {getFieldDecorator('saleOrg', {
                                                initialValue: '',
                                                rules: [
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: salesorgList,
                                                        keyName: "orgCode",
                                                    }),
                                                ],
                                            })(
                                                <AutoSelectComp
                                                    selectedList={salesorgList}
                                                    displayName={['orgCode', 'orgName']}
                                                    keyName={"orgCode"}
                                                    onSearch={this.searchSalesorg}
                                                    onSelect={this.selectSalesorg}
                                                    onChange={this.changeSalesorg}

                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>

                                        <FormItem FormItem {...formItemLayout} label="销售员:">

                                            {getFieldDecorator('salesman', {
                                                initialValue: '',
                                                rules: [
                                                    {message: '请输入销售员'},
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项!",
                                                        list: salesmanList,
                                                        keyName: "empCode"
                                                    })

                                                ],
                                            })(
                                                <AutoSelectComp
                                                    selectedList={this.state.salesmanNull ? '' : salesmanList}
                                                    displayName={['empCode', 'empName']}
                                                    keyName={"empCode"}
                                                    onSearch={this.searchSalesman}
                                                    onSelect={this.selectSalesman}
                                                >
                                                </AutoSelectComp>
                                            )}

                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="收货站点:">
                                            {getFieldDecorator('receiveAddress', {
                                                initialValue: '',
                                                rules: [
                                                    {message: '收货站点为必填', required: true},
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: receiveAdrList,
                                                        keyName: "siteCode",
                                                    })

                                                ],

                                            })(
                                                <AutoSelectComp
                                                    selectedList={receiveAdrList}
                                                    displayName={['siteCode', 'siteName']}
                                                    keyName={"siteCode"}
                                                    onSearch={this.searchReceiveAdr}
                                                    onSelect={this.selectReceiveAdr}
                                                    onChange={this.changeReceiveAdr}
                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="收货仓库:">
                                            {getFieldDecorator('receivWarehouseCode', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        message: '请输入收货站点'
                                                    },
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: receiveWarehouseList,
                                                        keyName: "stockCode",
                                                    })

                                                ],

                                            })(
                                                <AutoSelectComp
                                                    selectedList={receiveWarehouseList}
                                                    displayName={['stockCode', 'stockName']}
                                                    keyName={"stockCode"}
                                                    onSearch={this.searchReceiveWarehouse}
                                                    onSelect={this.selectReceiveWarehouse}

                                                >
                                                </AutoSelectComp>
                                            )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="详细地址">
                                            {getFieldDecorator('receiveAddressDetails', {
                                                initialValue: '',
                                                rules: [{message: '详细地址为必填', required: true}],
                                            })(
                                                <Input disabled></Input>
                                            )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="end" className="more-info-btn">
                                    <a className="show-and-hide" href="#"
                                       onClick={this.toggleMore}>{this.state.tipMore}</a>
                                </Row>
                                <Row type="flex" justify="center" className="saleReturn-otherInfo"
                                     style={{display: this.state.showMore ? `none` : `block`}}>
                                    <Col span={12}>
                                        <div className="saleReturn-baseInfo">
                                            <span className="saleReturn-form-baseInfo">其他信息</span>
                                        </div>
                                        <FormItem FormItem {...formItemLayout} label="单据类型">
                                            {getFieldDecorator('businessType', {
                                                initialValue: '2',
                                            })(
                                                <Select disabled>
                                                    <Option key="1"> 有来源</Option>
                                                    <Option key="2"> 无来源</Option>
                                                </Select>
                                            )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="币种编码" style={{display: `none`}}>
                                            {getFieldDecorator('currency', {
                                                initialValue: saleReturnDetailInfo.currency ? saleReturnDetailInfo.currency : '',

                                            })(
                                                <Input/>
                                            )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="币种">
                                            {getFieldDecorator('currencyName', {
                                                initialValue: saleReturnDetailInfo.currencyName ? saleReturnDetailInfo.currencyName : 'RMB',

                                            })(
                                                <Select disabled>
                                                    <Option key="RMB">RMB</Option>
                                                </Select>
                                            )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="金额" style={{display: `none`}}>
                                            {getFieldDecorator('amount', {
                                                initialValue: saleReturnDetailInfo.amount ? saleReturnDetailInfo.amount : '',
                                            })(
                                                <Input disabled></Input>
                                            )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="税额" style={{display: `none`}}>
                                            {getFieldDecorator('tax', {
                                                initialValue: saleReturnDetailInfo.tax ? saleReturnDetailInfo.tax : '',
                                            })(
                                                <Input disabled></Input>
                                            )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem FormItem {...formItemLayout} label="税价合计" style={{display: `none`}}>
                                            {getFieldDecorator('totalAmount', {
                                                initialValue: saleReturnDetailInfo.totalAmount ? saleReturnDetailInfo.totalAmount : '',
                                            })(
                                                <Input disabled></Input>
                                            )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="备注">
                                            {getFieldDecorator('remark', {
                                                initialValue: saleReturnDetailInfo.remark ? saleReturnDetailInfo.remark : '',
                                                rules: [
                                                    {max: 200, message: '最多允许200字符'},
                                                ],
                                            })(
                                                <Input type="textarea" style={{height: 130, width: 200}}
                                                       placeholder="请输入备注"/>
                                            )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Panel>
                        </Collapse>

                    </div>


                    <div>
                        <Row>
                            <Col span={12}><span className="saleReturn-detailinfo-title">明细信息</span></Col>
                            <Col span={12} className="detailinfo-right">
                                <span>合计</span>
                                <span>金额：<span>¥{this.formatMoney(this.state.amount)}</span></span>
                                <span>纳税：<span>¥{this.formatMoney(this.state.tax)}</span></span>
                                <span>税价合计：<span>¥{this.formatMoney(this.state.totalAmount)}</span></span>
                            </Col>
                        </Row>
                        <FormItem wrapperCol={{span: 24}}>
                            {getFieldDecorator('saleReturnDetails', {
                                initialValue: saleReturnDetailInfo.saleReturnDetails || [],
                                onChange: this.handleChangeList,
                            })(
                                <SaleReturnAddTableComp
                                    saleOrderCode={this.props.saleOrderCode}
                                    originalOrderSource={this.props.originalOrderSource}
                                    saleReturnAllInfo={this.state.saleReturnAllInfo}
                                    MaterialList={this.props.MaterialList}
                                    SaleReturnAddTableVisiable={this.props.SaleReturnAddTableVisiable}
                                    saleReturnDetailInfo={this.props.saleReturnDetailInfo}
                                    type={this.props.type}
                                />
                            )}
                        </FormItem>
                    </div>

                </Form>
            </div>
        )
    }
}

export default Form.create()(SaleReturnComp);



