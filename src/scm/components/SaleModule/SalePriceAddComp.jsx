import React, { Component, PropTypes } from "react";
import update from 'react/lib/update';
import moment from "moment";
import { Form, Input, Spin, Button, Modal, Row, Col, Select, Icon, DatePicker, Checkbox, message } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import AutoSelectComp from '../../../base/components/AutoSelectComp';
import SalePriceTableComp from './SalePriceTableComp';
import Validate from '../../../base/consts/ValidateList';
import { disabledBeforeDate, disabledBeforeTime } from '../../../base/consts/Utils';
import ImportViewCont from '../../dialogconts/SaleModule/ImportViewCont';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

class SalePriceAddComp extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.param = {
            orderCode: "",
            priceName: "",
            startTime: null,
            endTime: null,
            currencyName: "",
            currency: "",
            isTax: 1,
            remark: "",
            list: [],
        };
        this.state = {
            showform: true,
            showdetail: false,
            taxRate: 17.00,
            symbol: '￥',
            visible: false,
            isTax: 1,
            isTaxAdd: 1,
        };
    }
    componentWillMount() {
        if(this.props.salePriceAddDetail.detail.isTax !=undefined){
            this.setState({
                isTaxAdd: this.props.salePriceAddDetail.detail.isTax 
            });
        }
      
    }
    showModal = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }
    componentDidMount = () => {
        this.props.CurrencyList({ curName: '', curCode: '', page: 1, pageSize: 10 }, 'add');//币种搜索
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            let newData = this.param;
            for (let [key, val] of Object.entries(data)) {
                if (key in newData && val) {
                    newData = update(newData, {
                        [key]: {
                            $set: val
                        }
                    });
                }
            };
            if (!err) {
                if(this.props.salePriceAddDetail.detail.orderStatus == 0){
                    data.orderStatus = 0;
                }
                let obj = Object.assign({}, data, { endTime: data.endTime ? data.endTime.format('YYYY-MM-DD') : '' }, { startTime: data.startTime.format('YYYY-MM-DD') }, { isTax: this.state.isTaxAdd })
                this.props.checkOrderStatus().then(json => {
                    if (json.status == 2000) {
                        this.props.onOk && this.props.onOk(obj);
                    } else if (json.status === 6600) {
                        this.setState({ visible: true })
                    } else {
                        message.error(json.message[0].msg);
                    }
                })
            }
        });
    }
    //弹窗确认
    submitOk = () => {
        this.setState({ visible: false });
        if (!this.props.loading) {
            this.validateFds((err, data) => {
                if(this.props.salePriceAddDetail.detail.orderStatus == 0){
                    data.orderStatus = 0;
                }
                let obj = Object.assign({}, data, { endTime: data.endTime ? data.endTime.format('YYYY-MM-DD') : '' }, { startTime: data.startTime.format('YYYY-MM-DD') }, { isTax: this.state.isTaxAdd })
                this.props.onOk && this.props.onOk(obj);
            })
        }
    }
    showComponentMsg = (componentMsg) => {
        this.props.showComponentMsg(!componentMsg);
    }
    importCallback=(data)=>{
        let nowList = this.getFdv('list');
        data.list.map((item,index)=>{
            nowList.map((item1,index1)=>{
                 if(item.materialCode===item1.materialCode){
                     nowList.splice(index1,1)
                 }
            })
        })
        let list = data.list.concat(nowList);
        this.setFdv({
            list:list
        });
    }
    //是否含锐
    handleChangeTax = (e) => {
        let taxRate = 0.00;
        if (e.target.checked) {
            this.setState({
                isTaxAdd: 1
            });
            taxRate = 17.00;
        } else {
            this.setState({
                isTaxAdd: 0
            });
            taxRate = 0.00;
        }
        this.setState({ taxRate });
    }
    //自动搜索单位
    currencySelectSearch = (val, type) => {
        this.props.getCurrencyList({ "meaName": val, "dimensionality": type, "page": 1, "pageSize": 10 });
    }
    /*币种搜索*/
    onSearchCurrency = (value) => {
        this.props.CurrencyList({ curName: value, curCode: value, page: 1, pageSize: 10 }, 'add');
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
    getMaterialCode = (e) => {
        let val = e.target.value;
        this.setState({
            materialCode: val,
        });
    }
    render() {
        let { salePriceAddDetail, typePage, supplierLoading, curList, salePriceAddDataSource, salePriceInfo, currencySource } = this.props;
        return (
            <div className='salePriceAdd'>
                <Spin spinning={supplierLoading}>
                    <div className='addsaleprice'>
                        <Row style={{ height: '70px', lineHeight: '70px', marginRight: '12px', }}>
                            <Col span={20} style={{ marginLeft: '20px', fontSize: '14px', fontWeight: 'bold' }} >新建销售价格清单</Col>
                            <span>
                                <Button  className="default-btn" onClick={(e) => this.handleSubmit(e)} ><i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: 10 }}></i>保存</Button>
                            </span>
                        </Row>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Form>
                            <Row className='row-1'>
                                <Col span={24} style={{ marginLeft: '20px', marginBottom: '20px', fontSize: '14px', fontWeight: 'bold', marginTop: '20px' }} >价格条件</Col>
                            </Row>

                            <Row>
                                <Col span={8}>
                                    <FormItem
                                        label="价格编码"
                                        labelCol={{ span: 12 }}
                                        wrapperCol={{ span: 12 }}
                                        style={{ display: 'none' }}
                                    >
                                        {this.getFD('orderCode', {
                                            initialValue: '',
                                        })(
                                            <Input />
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>


                            <Row className='row-2'>
                                <Col span={8}>
                                    <DemoBox value={100}>
                                        <FormItem
                                            label="价格名称"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('priceName', {
                                                initialValue: salePriceAddDetail.detail.priceName || '',
                                                rules: [{ required: true, message: '请输入价格名称',max:20 },
                                                    { whitespace:true,message: '价格名称不能为空格!' },
                                                {message: '价格名称只能输入20字符',max:20}],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                        <FormItem FormItem label="币种:"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}>
                                            {this.getFD('currency', {
                                                initialValue: 'RMB',
                                                rules: [
                                                    { message: "币种为必填", required: true },
                                                    Validate({
                                                        type: "autoselect",
                                                        message: "请从下拉列表中选择一项！",
                                                        list: currencySource,
                                                        keyName: "curName",
                                                    }),
                                                ],
                                            })(
                                                <AutoSelectComp
                                                    disabled={true}
                                                    selectedList={currencySource}
                                                    displayName={["curCode", "curName"]}
                                                    keyName={"curName"}
                                                    optionFilterProp="children"
                                                    optionLabelProp="value"
                                                >
                                                </AutoSelectComp>
                                                )}
                                        </FormItem>

                                    </DemoBox>
                                </Col>
                                <Col span={8}>
                                    <DemoBox value={100}>
                                        <FormItem
                                            label="价格生效日期"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('startTime', {
                                                initialValue: salePriceAddDetail.detail.startTime ? moment(salePriceAddDetail.detail.startTime, 'YYYY-MM-DD') : moment(),
                                                rules: [{ required: true, message: '请输入价格生效日期' }],
                                            })(
                                                <DatePicker format="YYYY-MM-DD"
                                                    style={{ width: '100%' }}

                                                    disabledDate={(date) => disabledBeforeDate(date)}
                                                    disabledTime={disabledBeforeTime}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="价格失效日期"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('endTime', {
                                                initialValue: salePriceAddDetail.detail.endTime ? moment(salePriceAddDetail.detail.endTime) : null,
                                                rules: [{ required: true, message: '请输入价格失效日期' }],
                                            })(
                                                <DatePicker format="YYYY-MM-DD"
                                                    style={{ width: '100%' }}
                                                    disabledDate={(date) => disabledBeforeDate(date)}
                                                    disabledTime={disabledBeforeTime}
                                                />
                                                )}
                                        </FormItem>
                                    </DemoBox>
                                </Col>
                                <Col span={8}>
                                    <FormItem
                                        label="备注"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('remark', {
                                            rules: [{ message: '请输入描述' }, { message: '描述不能超过200字符', max: 200 }],
                                            initialValue: '',
                                            onChange: this.handleSelectChange,
                                        })(
                                            <Input type='textarea' style={{ height: '76px' }} >
                                            </Input>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row className='row-3'>
                                <Col span={8}>
                                    <FormItem
                                        label="含税"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 12 }}
                                    >
                                        {this.getFD('isTax', {
                                            valuePropName: 'checked',
                                        })(
                                            <span><Checkbox checked={this.state.isTaxAdd ? 1 : 0} onChange={this.handleChangeTax} /> 是  默认17%</span>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div>
                                <FormItem >
                                    {this.getFD('list', {
                                        initialValue: salePriceAddDetail.detail.list || [],
                                    })(
                                        <SalePriceTableComp
                                            symbol={this.state.symbol}
                                            taxRate={this.state.taxRate}
                                            isTaxAdd={this.state.isTaxAdd}
                                            SaleOrderAddTableVisiable={this.props.SaleOrderAddTableVisiable}
                                            typePage={this.props.typePage}
                                            ImportViewVisiable={this.props.ImportViewVisiable}
                                        />
                                        )}
                                </FormItem>
                            </div>
                        </Form>
                    </div>

                </Spin>
                {this.state.visible ? <Modal
                    title=""
                    visible={this.state.visible}
                    onOk={this.submitOk}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    该销售价格存在已生效的单据，此单据批准时，会关闭原来已生效的单据
                </Modal> : null}
                <ImportViewCont importCallback={this.importCallback}/>
            </div>
        )
    }
}

export default Form.create()(SalePriceAddComp);