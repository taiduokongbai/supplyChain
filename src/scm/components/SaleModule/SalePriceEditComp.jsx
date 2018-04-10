import React, { Component, PropTypes } from "react";
import update from 'react/lib/update';
import moment from "moment";
import { Form, Input, Spin, Button, Modal, Row, Col, Select, Icon, DatePicker, Checkbox } from '../../../base/components/AntdComp';
import FormModalComp from '../../../base/components/FormModalComp';
import SalePriceTableComp from './SalePriceTableComp';
import { disabledBeforeDate, disabledBeforeTime } from '../../../base/consts/Utils';
import ImportViewCont from '../../dialogconts/SaleModule/ImportViewCont';
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

class SalePriceEditComp extends FormModalComp {
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
            isTax: '',
        };
    }
    componentWillMount() {
        this.setState({
            isTax: this.props.salePriceInfo.isTax
        })
    }
    showModal = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (this.props.typePage == 'add') {
                data.receiveOrgCode = "";

            }

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
                let obj = Object.assign({}, data, { endTime: data.endTime ? data.endTime.format('YYYY-MM-DD') : '' }, { startTime: data.startTime.format('YYYY-MM-DD') }, { isTax: this.props.isTax });
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
            this.validateFds((err, data) => {
                if(this.props.salePriceInfo.orderStatus == 0){
                    data.orderStatus = 0;
                }
                let obj = Object.assign({}, data, { endTime: data.endTime ? data.endTime.format('YYYY-MM-DD') : '' }, { startTime: data.startTime.format('YYYY-MM-DD') }, { isTax: this.props.isTax })
                this.props.onOk && this.props.onOk(obj);
            })
    }
    showComponentMsg = (componentMsg) => {
        this.props.showComponentMsg(!componentMsg);
    }
    //是否含锐
    handleChangeTax = (e) => {
        let taxRate = 0.00;
        if (e.target.checked) {
            this.setFdv({
                isTax: 1
            });
            this.setState({
                isTax: 1
            });
            this.props.CheckIsTax(1)
            taxRate = 17.00;
        } else {
            this.setFdv({
                isTax: 0
            });
            this.setState({
                isTax: 0
            })
            this.props.CheckIsTax(0)
            taxRate = 0.00;
        }
        this.setState({ taxRate });

    }
    //自动搜索单位
    currencySelectSearch = (val, type) => {
        this.props.getCurrencyList({ "meaName": val, "dimensionality": type, "page": 1, "pageSize": 10 });
    }
    getMaterialCode = (e) => {
        let val = e.target.value;
        this.setState({
            materialCode: val,
        });
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
    render() {
        let { typePage, supplierBaseLoading, curList, salePriceAddDataSource, salePriceInfo, isTax } = this.props;
        return (
            <div className='SalePriceAdd'>
                <Spin spinning={supplierBaseLoading}>
                    <div className='addsaleprice'>
                        <Row style={{ height: '70px', lineHeight: '70px', marginRight: '12px', }}>
                            <Col span={20} style={{ marginLeft: '20px', fontSize: '14px', fontWeight: 'bold' }} >编辑销售价格清单</Col>
                            <span>
                                <Button type='primary' onClick={(e) => this.handleSubmit(e)} ><i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: 10 }}></i>保存</Button>
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
                                            initialValue: salePriceInfo.orderCode ? salePriceInfo.orderCode.toString() : null,
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
                                                initialValue: salePriceInfo.priceName ? salePriceInfo.priceName.toString() : null,
                                                rules: [{ required: true, message: '请输入价格名称',max:20 },
                                                {message: '价格名称只能输入20字符',max:20}],
                                            })(
                                                <Input />
                                                )}
                                        </FormItem>
                                        <FormItem
                                            label="币种Code"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}
                                            style={{ display: 'none' }}
                                        >
                                            {this.getFD('currency', {
                                                initialValue: salePriceInfo.currency ? salePriceInfo.currency + "" : "0",
                                            })(
                                                <Select ></Select>
                                                )}
                                        </FormItem>

                                        <FormItem
                                            label="币种"
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}
                                        >
                                            {this.getFD('currencyName', {
                                                initialValue: salePriceInfo.currencyName ? salePriceInfo.currencyName + "" : "0",
                                            })(
                                                <Select >
                                                    {
                                                        window.ENUM.getEnum("currencyType").map(currencyType => {
                                                            return <Select.Option value={currencyType.catCode.toString()} key={currencyType.catCode}>{currencyType.catName}</Select.Option>
                                                        })
                                                    }
                                                </Select>
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
                                                initialValue: salePriceInfo.startTime ? moment(salePriceInfo.startTime) : moment(undefined),
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
                                                initialValue: salePriceInfo.endTime ? moment(salePriceInfo.endTime) : null,
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
                                            initialValue: salePriceInfo.remark || null,
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
                                            <span><Checkbox checked={isTax ? 1 : 0} onChange={this.handleChangeTax} /> 是  默认17%</span>
                                            )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div>
                                <FormItem >
                                    {this.getFD('list', {
                                        initialValue: salePriceInfo.list || [],
                                    })(
                                        <SalePriceTableComp
                                            symbol={this.state.symbol}
                                            taxRate={this.state.taxRate}
                                            isTax={this.props.isTax}
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

export default Form.create()(SalePriceEditComp);