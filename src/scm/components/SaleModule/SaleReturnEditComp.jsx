import React, { Component } from 'react';
import moment from 'moment';
import { DatePicker, Select, Button, Input, Form, Row, Col, Spin, Collapse, message } from '../../../base/components/AntdComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp';
import SaleReturnAddTableComp from './SaleReturnAddTableComp';
import Validate from '../../../base/consts/ValidateList';
const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;

class SaleReturnEditComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelState: '收起',
            isCustomerDisabled: true,
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

    componentDidMount() {
        this.props.initData && this.props.initData();
        this.props.ReceiveAdrList(1, 1, '', '', 1, 10);    // 收货站点
        this.props.SalesorgList(3, '', '', 1, 10);  // 销售组织
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.edit.saleReturnCode !== nextProps.edit.saleReturnCode) {
            this.props.initData && this.props.initData()
        }
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
                let obj = Object.assign({}, data, { orderDate: data.orderDate.format('YYYY-MM-DD') },{ saleReturnDetails: data.saleReturnDetails.reverse() }, { planReturnDate: data.planReturnDate.format('YYYY-MM-DD') }, {amount: this.state.amount}, {tax: this.state.tax}, { totalAmount: this.state.totalAmount})
                this.props.Save(obj);

            }

        });
    };


    // 联系人
    searchContacts = (value) => {
        const { getFieldValue } = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.ContactsList(code, value, value, 1, 10);
    }

    selectContacts = (value, option) => {
        this.props.form.setFieldsValue({
            contactsPerson: value.contactsName,
            contactsPersonFake: value.contactsName,
            contactsPhone: value.phone ? value.phone : ''
        })

    }
    changeContacts = (value) => {
        if (value == '') {
            this.props.form.setFieldsValue({
                contactsPerson: '',
                contactsPersonFake: '',
                contactsPhone: ''
            })
        }
    }
    // 取货地址
    searchTakeDelOfAddress = (value) => {
        const { getFieldValue } = this.props.form;
        let code = getFieldValue('customerCode')
        this.props.TakeDelOfAddressList(1, code, value, value, 1, 10);
    }
    selectTakeDelOfAddress = (value, option) => {
        this.props.form.setFieldsValue({
            takeDelOfDetails: value.addressDetl,
        })
    }
    changeTakeDelOfAddress = (value) => {
        if (value == '') {
            this.props.form.setFieldsValue({
                takeDelOfDetails: '',
            })
        }
    }

    // 收货仓库
    searchReceiveWarehouse = (value) => {
        const {getFieldValue} = this.props.form;
        let code = getFieldValue('receiveAddress')
        this.props.form.setFieldsValue({receiveAddressDetails: ''});
        return this.props.EditReceiveWarehouseList(code, 1, value, value, 1, 10);
    }

    selectReceiveWarehouse = (value, option) => {
        this.props.form.setFieldsValue({
            receiveAddressDetails: value.addressDetl,
        })
    }
    // 销售员
    searchSalesman = (value) => {
        let getFieldsValue = this.props.form.getFieldsValue();
        let saleOrg = this.props.form.getFieldValue('saleOrg');
        if (value) {
            this.props.SalesmanList(saleOrg, value, 1, 10);
        }

    }

    selectSalesman = (value, option) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            salesman: value.empCode,
        })
    }


    // 销售组织
    searchSalesorg = (value) => {
        this.props.SalesorgList(3, value, value, 1, 10);
    }

    selectSalesorg = (value, option) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            saleOrg: value.orgCode,
            salesman: '',
        });
        this.props.SalesmanList(value.orgCode, '', 1, 10);
    }

    changeSalesorg = (value) => {
        let orgCode = this.props.form.getFieldValue('saleOrg');
        if (value) {
            this.setState({ salesmanNull: false });
            this.props.SalesmanList(orgCode, '', 1, 10);
        } else if (value == '') {
            this.setState({ salesmanNull: true });
        }
        this.props.form.setFieldsValue({ salesman: '' })
    }

    // 收货站点
    searchReceiveAdr = (value) => {
        this.props.form.setFieldsValue(
            {
                receiveAddressDetails: '',
            });
        return this.props.ReceiveAdrList(1, 1, value, value, 1, 10);
    }
    changeReceiveAdr= (value) => {
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
        this.props.EditReceiveWarehouseList(value.siteCode, 1, '', '', 1, 10);
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
    formatMoney = (money) => (money === ''|| money === null|| money === undefined)?'0.00':Number(money).toFixed(2);
    //明细项更新
    handleChangeList = (saleReturnDetails) => {
        let taxRate = 0, amount = 0, tax = 0, totalAmount = 0;
        saleReturnDetails.forEach(item => {
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
        this.setState({ saleReturnDetails })
        this.setState({ amount });
        this.setState({ tax });
        this.setState({ totalAmount });
    }

    render() {

        const { saleReturnDetailInfo, originalOrderSource, initialSaleOrderList, customerList, contactsList, receiveAdrList,editReceiveWarehouseList, panelState, saleOrder, salesmanList, takeDelOfAddressList, salesorgList, SaleReturnDialogVisiable } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 10 },
        };
        return (
            <div className="saleReturn-wrap">
                <Form className="saleReturn-form" >
                    <div className="saleReturn-header">
                        <span className="saleReturn-header-title">{this.props.title}</span>
                        <Button className="default-btn save" onClick={this.handleSubmit}>保存</Button>
                        {/*<Button className="default-btn back" onClick={this.back}>返回</Button>*/}
                    </div>
                    <div className="saleReturn-form-content">

                        <Collapse bordered={false} defaultActiveKey={['1']} onChange={this.panelChange} >
                            <Panel header={this.state.panelState} key="1">
                                <Row type="flex" justify="center">

                                    <Col span={12}>
                                        <div className="saleReturn-baseInfo">
                                            <span className="saleReturn-form-baseInfo">基本信息</span>
                                        </div>
                                        <FormItem style={{ margin: 0 }} label="">

                                            {getFieldDecorator('saleReturnCode', {
                                                initialValue: saleReturnDetailInfo.saleReturnCode ? saleReturnDetailInfo.saleReturnCode : '',
                                            })(
                                                <Input type="hidden"></Input>
                                                )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="来源订单编号:">
                                            {getFieldDecorator('sourceCode', {
                                                initialValue: saleReturnDetailInfo.sourceCode ? saleReturnDetailInfo.sourceCode : '',
                                            })(
                                                <AutoSelectComp
                                                    displayName={["saleOrderCode", "detailId"]}
                                                    keyName={"detailId"}
                                                    disabled={this.state.isCustomerDisabled}
                                                >
                                                </AutoSelectComp>
                                                )}
                                        </FormItem>
                                        <FormItem style={{ margin: 0 }} label="">

                                            {getFieldDecorator('sourceCode', {
                                                initialValue: saleReturnDetailInfo.sourceCode ? saleReturnDetailInfo.sourceCode : '',
                                            })(
                                                <Input type="hidden"></Input>
                                                )}
                                        </FormItem>
                                        <FormItem style={{ margin: 0 }} label="">

                                            {getFieldDecorator('customerCode', {
                                                initialValue: saleReturnDetailInfo.customerCode ? saleReturnDetailInfo.customerCode : '',
                                            })(
                                                <Input type="hidden"></Input>
                                                )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="客户名称:">
                                            {getFieldDecorator('customerName', {
                                                initialValue: saleReturnDetailInfo.customerName ? saleReturnDetailInfo.customerName : '',
                                                rules: [{ required: true, message: '客户名称为必填' }]
                                            })(

                                                <AutoSelectComp
                                                    selectedList={customerList}
                                                    displayName={['customerCode', 'customerFull']}
                                                    keyName={"customerCode"}
                                                    onSearch={this.searchCustomer}
                                                    onSelect={this.selectCustomer}
                                                    disabled={this.state.isCustomerDisabled}
                                                >
                                                </AutoSelectComp>

                                                )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="单据日期:">
                                            {getFieldDecorator('orderDate', {
                                                initialValue: saleReturnDetailInfo.orderDate ? moment(saleReturnDetailInfo.orderDate) : moment(),
                                                rules: [{ type: 'object', message: '请选择单据日期', required: true }],
                                            })(
                                                <DatePicker
                                                    disabledDate={this.disabledStartDate}
                                                    showTime
                                                    format="YYYY-MM-DD"
                                                    onChange={this.onStartChange}
                                                    onOpenChange={this.handleStartOpenChange}
                                                />
                                                )}
                                        </FormItem>

                                        <FormItem style={{ margin: 0 }} label="">

                                            {getFieldDecorator('contactsPerson', {
                                                initialValue: saleReturnDetailInfo.contactsPersonName ? saleReturnDetailInfo.contactsPersonName : '',
                                            })(
                                                <Input type="hidden"></Input>
                                                )}
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="联系人:">
                                            {getFieldDecorator('contactsPersonFake', {
                                                initialValue: saleReturnDetailInfo.contactsPersonName ? saleReturnDetailInfo.contactsPersonName : '',
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
                                                initialValue: saleReturnDetailInfo.takeDelOfAddressCode ? saleReturnDetailInfo.takeDelOfAddressCode : '',
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
                                                rules: [{ message: '详细地址为必填', required: true }],
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
                                                rules: [{ message: '预计退货日期为必填', required: true }],
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
                                                initialValue: saleReturnDetailInfo.saleOrgCode ? saleReturnDetailInfo.saleOrgCode : '',
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
                                                initialValue: saleReturnDetailInfo.salesmanCode ? saleReturnDetailInfo.salesmanCode : '',
                                                rules: [
                                                    { message: '请输入销售员' },
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
                                                initialValue: saleReturnDetailInfo.receiveAddressCode ? saleReturnDetailInfo.receiveAddressCode : '',
                                                rules: [
                                                    {message: '收货站点为必填', required: true },
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
                                                initialValue: saleReturnDetailInfo.receivWarehouseCode ? saleReturnDetailInfo.receivWarehouseCode : '',
                                                rules: [
                                                    {
                                                        message: '请输入收货站点'
                                                    },
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: editReceiveWarehouseList,
                                                        keyName: "stockCode",
                                                    })

                                                ],

                                            })(
                                                <AutoSelectComp
                                                    selectedList={editReceiveWarehouseList}
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
                                                initialValue: saleReturnDetailInfo.receiveAddressDetails ? saleReturnDetailInfo.receiveAddressDetails : '',
                                                rules: [{ message: '详细地址为必填', required: true }],
                                            })(
                                                <Input disabled></Input>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row type="flex" justify="end" className="more-info-btn">
                                    <a className="show-and-hide" href="#" onClick={this.toggleMore}>{this.state.tipMore}</a>
                                </Row>
                                <Row type="flex" justify="center" className="saleReturn-otherInfo" style={{ display: this.state.showMore ? `none` : `block` }}>
                                    <Col span={12}>
                                        <div className="saleReturn-baseInfo">
                                            <span className="saleReturn-form-baseInfo">其他信息</span>
                                        </div>
                                        <FormItem FormItem {...formItemLayout} label="单据类型">
                                            {getFieldDecorator('businessType', {
                                                initialValue: saleReturnDetailInfo.businessType,
                                            })(
                                                <Select disabled>
                                                    <Option key="1">有来源</Option>
                                                    <Option key="2">无来源</Option>
                                                </Select>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="币种编码" style={{ display: `none` }}>
                                            {getFieldDecorator('currency', {
                                                initialValue: saleReturnDetailInfo.currency ? saleReturnDetailInfo.currency : '',

                                            })(
                                                <Input />
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
                                        <FormItem FormItem {...formItemLayout} label="金额">
                                            {getFieldDecorator('amount', {
                                                initialValue: saleReturnDetailInfo.amount ? saleReturnDetailInfo.amount : '',
                                            })(
                                                <Input disabled></Input>
                                                )
                                            }
                                        </FormItem>
                                        <FormItem FormItem {...formItemLayout} label="税额">
                                            {getFieldDecorator('tax', {
                                                initialValue: saleReturnDetailInfo.tax ? saleReturnDetailInfo.tax : '',
                                            })(
                                                <Input disabled></Input>
                                                )
                                            }
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem FormItem {...formItemLayout} label="税价合计">
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
                                                    { max: 200, message: '最多允许200字符' },
                                                ]
                                            })(
                                                <Input type="textarea" style={{ height: 130, width: 200 }} placeholder="请输入备注" />
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
                                <span>金额：<span>¥{this.formatMoney(this.state.amount?this.state.amount:saleReturnDetailInfo.amount)}</span></span>
                                <span>纳税：<span>¥{this.formatMoney(this.state.tax?this.state.tax:saleReturnDetailInfo.tax)}</span></span>
                                <span>税价合计：<span>¥{this.formatMoney(this.state.totalAmount?this.state.totalAmount:saleReturnDetailInfo.totalAmount)}</span></span>
                            </Col>
                        </Row>
                        <FormItem wrapperCol={{ span: 24 }}>
                            {getFieldDecorator('saleReturnDetails', {
                                initialValue: saleReturnDetailInfo.saleReturnDetails || [],
                                onChange: this.handleChangeList,
                            })(
                                <SaleReturnAddTableComp
                                    saleOrderCode={this.props.saleOrderCode}
                                    originalOrderSource={this.props.originalOrderSource}
                                    MaterialList={this.props.MaterialList}
                                    SaleReturnAddTableVisiable={this.props.SaleReturnAddTableVisiable}
                                    saleReturnDetailInfo={this.props.saleReturnDetailInfo}
                                    type={this.props.type}
                                    saleReturnAllInfo={this.props.sourceOrderInfo}
                                />
                                )}
                        </FormItem>
                    </div>

                </Form>
            </div>
        )
    }
}
export default Form.create()(SaleReturnEditComp);



