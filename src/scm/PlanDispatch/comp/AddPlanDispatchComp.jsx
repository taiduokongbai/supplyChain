/**
 * 计划分配
 */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Table, Button, Input, Popconfirm, message, Form, Row, Col, Icon, DatePicker, Select, Menu, Dropdown, Spin } from '../../../base/components/AntdComp';
import { _add_PlanDispatch_Store, _pdEditTableStore, _saleOrderListStore, _datePickerDialogStore } from "../store/AddPlanDispatchStore";
import { TableEditComp } from '../../../base/mobxComps/TableEditComp';
import TooltipComp from '../../../base/mobxComps/TooltipComp';
import OperationsComp from '../../../base/mobxComps/OperationsComp';
import SaleOrderListComp from "./SaleOrderListComp";
import Validate from "../../../base/consts/ValidateList";
import ModalComp from '../../../base/mobxComps/ModalComp';
import { PDEditTableComp } from "./PDEditTableComp";
import moment from 'moment';
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class AddPlanDispatchCont extends Component {
    constructor(props, context) {
        super(props);
        this.store = _add_PlanDispatch_Store;
        _add_PlanDispatch_Store.thisComp = this;
        this.state = {
            visible: false,
        }
    }
    fixedHandler = () => {
        const { details_info } = this.store;
        this.props.form.validateFields((err, data) => {
            if (!err) {
                this.store.setDetails({ planQty: data.planQty })
                data.sellDetailLineNum = details_info.sellDetailLineNum;
                data.planQty *= 1;
                this.store.fix(data)
            }
        });
    }
    confirmSubmit = () => {
        let form = this.refs.PDEditTableComp;
        form.validateFields((err, values) => {
            if (!err) {
                this.store.save().then(json => {
                    if (json.status === 2000) {
                        this.store.submit().then(json => {
                            if (json.status === 2000) this.store.selectedRowKeys = [];
                        })
                    }
                    this.handleVisibleChange(false)
                })
            } else {
                message.error('请确认表格中的数据！')
                return false;
            }
        })
    }
    saleOrderHandler = () => {
        _saleOrderListStore.fetchTableList()
        _saleOrderListStore.visibleHandler(true);
    }
    saveHandler = () => {
        let form = this.refs.PDEditTableComp;
        form.validateFields((err, values) => {
            if (!err) {
                this.store.save().then(json => {
                    if (json.status === 2000) {
                        _pdEditTableStore.fetchTableList();
                        message.success('数据保存成功！');
                    }
                    this.store.selectRows = this.store.selectedRowKeys = [];
                    this.store.loading = false;
                })
            } else {
                message.error('请确认表格中的数据！')
                return false;
            }
        })
    }
    Table = () => {
        let Comp = _pdEditTableStore.Comp;
        let { selectedRowKeys } = this.store;
        /**
         * newCreateFlag  是否点击了新建按钮
         * 当 新建计划分配单时
         * 之前对表格的所有查询内容 清空
         */
        if (this.store.newCreateFlag && _pdEditTableStore.thisComp.props) {
            _pdEditTableStore.thisComp.props.form.setFieldsValue({
                materialName: '',
                materialCode: '',
                materialCategory: '',
                materialSymbol: '',
                materialSpec: '',
                materialTexture: '',
                materialDesc: '',
                predictReceiveDate: '',
            })
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.store.selectRows = selectedRows;
                this.store.selectedRowKeys = selectedRowKeys;
            },
        };
        return <Comp
            {..._pdEditTableStore.Props}
            rowKey={"id"}
            rowSelection={rowSelection}
            className='planDistribution-pd-table'
            ref='PDEditTableComp'
        />
    }
    componentWillUnmount() {
        this.store.thisComp = {}
    }
    datePickerHandleSubmit = () => {
        let { dataSource } = _pdEditTableStore;
        let a = dataSource;
        if (a.length > 0) {
            let form = this.refs.PDEditTableComp, predictDateForm=[];   //predictReceiveDate
            form.resetFields()
            a.map(item => {
                item.predictReceiveDate = item.submitStatus == 1 ? _datePickerDialogStore.dateVal : item.predictReceiveDate;
            })
        }
        runInAction(() => {
            _pdEditTableStore.loading = _datePickerDialogStore.loading = _pdEditTableStore.changedFlag = true;
            _pdEditTableStore.dataSource = a;
        })
        this.datePickerHandleCancel()
    }
    datePickerHandleCancel = () => {
        runInAction(() => {
            _pdEditTableStore.loading = _datePickerDialogStore.loading = _datePickerDialogStore.visible = false;
        })
    }
    handleVisibleChange = (flag) => {
        runInAction(()=>{this.store._submitPopVisible = false})
        this.setState({ visible: flag, });
    }
    showPopconfirm = () => {
        let selectRows = this.store.selectRows;
        let submitDataNum = 0;
        if (selectRows.length) {
            selectRows.forEach(item => {
                item.submitStatus == 1 ? submitDataNum += 1 : null;
            })
            if (submitDataNum) {
                runInAction(()=>{this.store._submitPopVisible = true})
            } else message.info('请选择未提交数据进行提交！')
        } else message.info('请选择需要提交的行！')
    }
    render() {
        const { details_info } = this.store;
        const menu = (
            <Menu>
                <Menu.Item key="1" disabled={details_info.isFixed ? false : true}>
                    <Popconfirm
                        title="请确认是否提交所选择的行计划？"
                        onConfirm={this.confirmSubmit}
                        onCancel={() => this.handleVisibleChange(false)}
                    >
                        <span className='submit-btn' onClick={() => this.showPopconfirm()}>提交</span>
                    </Popconfirm>
                </Menu.Item>
                {/*<Menu.Item key="2" disabled={details_info.isFixed ? false : true}>打印</Menu.Item>*/}
            </Menu>
        )
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const formItemLayout_planAmount = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='planned-distribution'>
                <SaleOrderListComp
                    store={_saleOrderListStore}
                    visible={_saleOrderListStore.visible}
                />
                <DatePickerDialog
                    store={_datePickerDialogStore}
                    handleSubmit={() => this.datePickerHandleSubmit()}
                    handleCancel={() => this.datePickerHandleCancel()}
                />
                <Spin spinning={this.store.loading}>
                    <div className='planDistribution-header'>
                        <div>
                            <span>新建计划单</span>
                            <span>单据号： {details_info.planOrderCode}</span>
                        </div>
                        <div>
                            <Button
                                type='primary'
                                disabled={details_info.isFixed ? false : true}
                                onClick={() => this.saveHandler()}
                                className='save-btn'>
                                <i className="c2mfont c2m-baocun" style={{ paddingRight: 7, fontSize: 10 }}></i>
                                保存
                        </Button>
                            <Dropdown
                                overlay={menu}
                                trigger={['click']}
                                visible={this.state.visible}
                                onVisibleChange={this.handleVisibleChange}
                                getPopupContainer={() => document.getElementsByClassName('planDistribution-header')[0]}
                            >
                                <Button style={{ marginLeft: 10 }} disabled={details_info.isFixed ? false : true}>
                                    更多操作 <Icon type="down" />
                                </Button>
                            </Dropdown>
                        </div>

                    </div>
                    <div className='planDistribution-wrap'>
                        <FormItem label="销售订单号" {...formItemLayout}>
                            {getFieldDecorator('sellOrderCode', {
                                initialValue: details_info.sellOrderCode,
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Input
                                    suffix={<Icon type='down' />}
                                    style={{ width: 200 }}
                                    onClick={() => this.saleOrderHandler()}
                                    disabled={details_info.isFixed ? true : false}
                                    readOnly
                                />
                                )}
                        </FormItem>
                        <div>
                            <span style={{ display: details_info.sellOrderCode ? 'block' : 'none' }}>( 订单明细行号： <span>{details_info.sellDetailLineNum}</span> )</span>
                        </div>
                    </div>
                    <div className='planDistribution-info' style={{ display: details_info.sellOrderCode ? 'block' : 'none' }}>
                        <Row>
                            <Col span={8}>
                                <p><span>合同编号：</span>{details_info.contractCode}</p>
                                <p><span>客户名称：</span>{details_info.customerName}</p>
                            </Col>
                            <Col span={8}>
                                <p><span>产品名称：</span>[{details_info.materialCode}] {details_info.materialName}</p>
                                <p><span>销售数量：</span>{details_info.sellQty + " " + details_info.unitName}</p>
                            </Col>
                            <Col span={8}>
                                <p><span>预计交货日期：</span>{details_info.predictProvideDate}</p>
                                <p><span>累计计划数量：</span>{details_info.sumPlanQty}</p>
                            </Col>
                        </Row>
                    </div>
                    <div className='planDistribution-plan-amount'>
                        <FormItem label="请输入本次计划数量" {...formItemLayout_planAmount}>
                            {getFieldDecorator('planQty', {
                                initialValue: details_info.unplannedQty * 1 || 0,
                                rules: [
                                    Validate({
                                        type: "gtZero",
                                        required: true,
                                        label: '计划数量',
                                        max: details_info.unplannedQty * 1,
                                        decimal: 6,
                                    }),
                                ]
                            })(
                                <Input
                                    style={{ width: 200 }} disabled={details_info.sellOrderCode && !details_info.isFixed ? false : true}
                                />
                                )}
                        </FormItem>
                        <Button
                            onClick={() => this.fixedHandler()}
                            type='primary'
                            disabled={details_info.sellOrderCode && !details_info.isFixed ? false : true}
                        >
                            <i className="c2mfont c2m-guding" style={{ paddingRight: 7, fontSize: 10 }}></i>
                            固定
                    </Button>
                    </div>
                    <p className='planDistribution-letter'>计划分配 ( 标准采购、外协加工、自制生产 )</p>
                    {this.Table()}
                </Spin>
            </div>
        )
    }
}

class DatePickerDialog extends ModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store;
    }
    dateRangeHandler = (date, dateString) => {
        this.store.dateVal = dateString;
    }
    getComp = () => {
        return <div className='planDistribution-datepicker-dialog'>
            <Row>
                <Col span={7}>
                    选择时间：
                </Col>
                <Col span={8}>
                    <DatePicker
                        showTime
                        onChange={this.dateRangeHandler}
                        width='200px'
                    />
                </Col>
            </Row>
        </div>
    }
}

export default Form.create()(AddPlanDispatchCont)
export { DatePickerDialog }

