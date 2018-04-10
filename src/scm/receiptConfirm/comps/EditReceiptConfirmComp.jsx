import React, { Component, PropTypes } from "react";
import moment from "moment";
import { AutoComplete, Form, Input, Spin, Button, message, Row, Col, Icon, Select, DatePicker, TreeSelect } from '../../../base/components/AntdComp';
import FormComp from '../../../base/mobxComps/FormComp';
import RadioComp from '../../../base/mobxComps/RadioComp';
import { disabledBeforeDate, disabledAfterDate, debounce } from '../../../base/consts/Utils';
import ReceiptConfirmDetailComp from './ReceiptConfirmDetailComp';
//mobx store
import { editReceiptConfirmStore, purchaseOrgStore, purchaserStore, receiverStore, receivingAddressStore, receiptConfirmDetailStore } from '../stores/EditReceiptConfirmStore';
import { receiptConfirmListStore } from '../stores/ReceiptConfirmStore';
import { enumStore } from '../../../base/stores/EnumStore';
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
const FormItem = Form.Item;
const Option = Select.Option;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

@observer
class EditReceiptConfirmComp extends FormComp {
    constructor(props, context) {
        super(props, context);
        this.onReceivingAddressSearch = debounce(this.onReceivingAddressSearch, 500);
        this.onReceiverSearch = debounce(this.onReceiverSearch, 500);

    }
    componentWillReact() {
        if(editReceiptConfirmStore.loading){
            this.resetFds();
        }
    }
    componentWillUnmount() {
        editReceiptConfirmStore.resetDetail();
    }
   onReceiverSearch = (value) => {
        receiverStore.loading = true;
        return receiverStore.fetchSelectList(value, { status:1});
   }
   onReceivingAddressSearch = (value) => {
        receivingAddressStore.loading = true;
        return receivingAddressStore.fetchSelectList({detailAddress:value,status:1});
    }
   handleSubmit = (e) => {
       e.preventDefault();
       this.validateFds((err, data) => {
            if (!err) {
                if (editReceiptConfirmStore.contactsName == this.getFdv('reveiver')) {
                    data.reveiver = "";
                } 
                if (editReceiptConfirmStore.receiveAddressName == this.getFdv('receiveAddress')) {
                    data.receiveAddress = "";
                }
                data.receiveAffirmCode = editReceiptConfirmStore.detail.receiveAffirmCode;
                data.receiveStatus = editReceiptConfirmStore.detail.receiveStatus;
                data.planReceiveDate = moment(data.planReceiveDate).format('YYYY-MM-DD');
                data.sourceOrderType = Number(data.sourceOrderType);
                data.detailList = receiptConfirmDetailStore.dataSource.slice();
                // console.log(data);
                editReceiptConfirmStore.fetchReceiptConfirmSubmit(data).then(json => {
                    if (json.status == 2000) {
                        message.success('操作成功');
                        store.dispatch(TabsAct.TabRemove('editReceiptConfirm', 'receiptConfirm'));
                        receiptConfirmListStore.fetchTableList();
                    }
                })
            }
        });
    }
    render() {
        let formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 13 },
        };
        const { detail, loading } = editReceiptConfirmStore;
        return (
            <div className='editReceiptConfirm-cont'>
                <Spin spinning={loading}>
                    <div className='editReceiptConfirm-title'>
                        <Row>
                            <Col span={22} >
                                <h4>收货确认单：{detail.receiveAffirmCode }</h4>
                                <p>
                                    <span>收货状态：<em style={{color:detail.receiveStatus===0?'#D0011B':(detail.receiveStatus===1?    '#F6A623':'#417505'),fontStyle:'normal'}}>{detail.receiveStatus!==undefined&&window.ENUM.getEnum("receiveStatus", (detail.receiveStatus) + '')}</em></span>
                                    <span style={{padding:'0 20px'}}>供应商：{detail.supplierName}</span>
                                </p>
                            </Col>
                            <Col span={2}>
                                <Button type='primary' onClick={this.handleSubmit} className="saveBtn"><i className="c2mfont c2m-fahuo"></i>收货</Button>
                            </Col>
                        </Row>
                    </div>
                    <Form>
                        <div>
                            <div className="editReceiptConfirm-col">
                                <Row className='editReceiptConfirm-stitle'>
                                    <Col span={24} >基本信息</Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="来源通知单号" {...formItemLayout}>
                                            {this.getFD('sourceOrderCode', {
                                                initialValue: detail.sourceOrderCode,
                                            })(
                                                <Input disabled/>
                                                )}
                                        </FormItem>
                                        <FormItem label="采购类型" {...formItemLayout}>
                                            {this.getFD('sourceOrderType', {
                                                initialValue: String(detail.sourceOrderType),
                                            })(
                                                <Select
                                                    disabled
                                                >
                                                    {enumStore.getOptions('purchaseType')}
                                                </Select>
                                                )}
                                        </FormItem>
                                        <FormItem label="收货人" {...formItemLayout}>
                                            {this.getFD('reveiver', {
                                                initialValue: detail.reveiver || editReceiptConfirmStore.contactsName,
                                                rules: [
                                                    { required: true, message: '收货人 必填' },
                                                    this.getFdv('reveiver') == editReceiptConfirmStore.contactsName ? {}:{
                                                        type: "autoselect",
                                                        list: receiverStore.selectList.slice(),
                                                        keyName: "empCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    }
                                                ],
                                            })(
                                                <AutoComplete
                                                {...receiverStore.Props}
                                                onSearch={this.onReceiverSearch}
                                                onSelect={(value, option) => this.setFdv({ 'reveiverName':option.props.data.empName})}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="收货人名称" style={{display:'none'}}>
                                            {this.getFD('reveiverName', {
                                                initialValue: detail.reveiverName,
                                            })(
                                                <Input disabled/>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="采购部门" {...formItemLayout}>
                                            {this.getFD('deptCode', {
                                                initialValue: detail.deptCode ,
                                                // rules: [
                                                //     {
                                                //         type: "autoselect",
                                                //         list: this.purchaseOrgStore.selectList.slice(),
                                                //         keyName: "orgCode",
                                                //         message: "请从下拉列表中选择一项！",
                                                //     }
                                                // ],
                                            })(
                                                <AutoComplete
                                                    disabled
                                                    {...purchaseOrgStore.Props}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="采购人" {...formItemLayout}>
                                            {this.getFD('purchaserCode', {
                                                initialValue: detail.purchaserCode ,
                                                // rules: [
                                                //     {
                                                //         type: "autoselect",
                                                //         message: "请从下拉列表中选择一项！",
                                                //         list: this.state.buyerlist.length>0?this.state.buyerlist:buyerlist,
                                                //         keyName: "empCode",
                                                //     },
                                                //     { required: true, message: '采购员 必填！' }
                                                // ],
                                            })(
                                                <AutoComplete
                                                    disabled
                                                    {...purchaserStore.Props}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="收货地址" {...formItemLayout}>
                                            {this.getFD('receiveAddress', {
                                                initialValue: detail.receiveAddress || editReceiptConfirmStore.receiveAddressName ,
                                                rules: [
                                                    { required: true, message: '收货地址 必填' },
                                                    this.getFdv('receiveAddress') == editReceiptConfirmStore.receiveAddressName ? {}:{
                                                        type: "autoselect",
                                                        list: receivingAddressStore.selectList.slice(),
                                                        keyName: "addressCode",
                                                        message: "请从下拉列表中选择一项！",
                                                    }
                                                ]
                                            })(
                                                <AutoComplete
                                                {...receivingAddressStore.Props}
                                                onSearch={this.onReceivingAddressSearch}
                                                onSelect={(value, option) => this.setFdv({ 'receiveAddressName':option.props.data.detailAddress})}
                                                />
                                                )}
                                        </FormItem>
                                        <FormItem label="收货地址名称" style={{display:'none'}}>
                                            {this.getFD('receiveAddressName', {
                                                initialValue: detail.receiveAddressName,
                                            })(
                                                <Input disabled/>
                                                )}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="供应商名称" {...formItemLayout}>
                                            {this.getFD('supplierName', {
                                                initialValue: detail.supplierName,
                                            })(
                                                <Input disabled/>
                                                )}
                                        </FormItem>
                                        <FormItem label="计划收货日期" {...formItemLayout}>
                                            {this.getFD('planReceiveDate', {
                                                initialValue: detail.planReceiveDate 
                                            })(
                                                <DatePicker style={{ width: '100%' }} disabled/>
                                                )}
                                        </FormItem>
                                    </Col>
                                    
                                </Row>
                                <Row>
                                    <Col span={20}>
                                        <FormItem label="备注" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                            {this.getFD('remark', {
                                                initialValue: detail.remark,
                                                rules:[{max:200, message:'备注不能超过200字符！'}]
                                            })(
                                                <Input type='textarea' style={{ height: '56px' }} ></Input>
                                                )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Form>
                    <div>
                        <Row>
                            <Col span={24} style={{fontSize:'14px',padding:'20px 0 10px',fontWeight:'600'}}>明细信息</Col>
                        </Row>
                        <ReceiptConfirmDetailComp/>
                    </div>                          
                </Spin>
            </div>
        )
    }

}
const options = {
    onValuesChange(props, values) {
        editReceiptConfirmStore.setReceiptConfirmDetail(values)
    }
}
export default Form.create(options)(EditReceiptConfirmComp);