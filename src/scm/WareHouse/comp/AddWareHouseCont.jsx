import React, { Component } from 'react';
import { Table, Button, Input, Popconfirm, message, Form, Select, Row, Col, Icon } from '../../../base/components/AntdComp';
import FormModalComp from "../../../base/mobxComps/FormModalComp";
import AddNewAddrComp from "./AddNewAddrComp";
import { wareHouseListStore } from "../store/WareHouseListStore";
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
const Option = Select.Option;
const FormItem = Form.Item;



@observer
class AddWareHouseCont extends FormModalComp {
    constructor(props, context) {
        super(props, context);
        this.store = this.props.store;
    }

    handleCancel = () => {
        if (!this.store.loading) {
            this.store.changeVisible(false);
            this.store.resetStockDetails()
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (!this.store.loading) {
            this.validateFds((err, data) => {
                if (!err) {
                    this.store.setDetail(data);
                    this.store.saveStock().then(json => {
                        this.store.loading = false;
                        if (json.status === 2000) {
                            this.handleCancel();
                            this.store.resetStockDetails();
                            // 刷新列表
                            wareHouseListStore.fetchTableList();
                        }
                    })
                }
            });
        }
    }

    handleClickAddress = () => {
        runInAction(() => {
            this.store.newaddrstore.visible = true;
        })
    }

    onOkHandler = (data) => {
        this.store.newaddrstore.setDetailsInfo(data);
        runInAction(() => {
            this.store.newaddrstore.loading = true
        })
        this.store.newaddrstore.addNewAddr(data).then(json => { // 存储数据
            if (json.status === 2000) {
                runInAction(() => {
                    this.store.newaddrstore.loading = false;
                    this.store.newaddrstore.visible = false;
                })
                this.store.addrliststore.fetchSelectList() // 重新查询地址
                let a = { addressCode: json.data.addressCode };
                this.store.setDetail(a);
            }
        })
    }

    handleCancleToAddress = () => {
        runInAction(() => {
            this.store.newaddrstore.visible = false;
        })
    }

    siteChange = (value) => {
        this.store.changeAddrBySite(value);
    }

    addrChange = (value) => {
        this.store.addrliststore.addrChange(value)
    }

    getComp = () => {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        let details = this.store.stockDetails;
        return (
            <Form>
                <FormItem label="编码" {...formItemLayout}>
                    {this.getFD('stockCode', {
                        initialValue: details.stockCode || '',
                        rules: [
                            { required: true, message: '必填！' },
                            {
                                validator: (rule, val, callback) => {
                                    let vali = /^[\w\d-_]{0,20}$/;
                                    if (val.length > 20) {
                                        callback('不能超过20个字符')
                                    } else if (!vali.test(val)) {
                                        callback('只能输入字母、数字、_ 或 - ')
                                    } else {
                                        callback();
                                    }
                                }
                            }
                        ],
                    })(
                        <Input disabled={this.store.curModal == 'edit' ? true : false} placeholder='请输入编码'/>
                        )}
                </FormItem>
                <FormItem label="名称" {...formItemLayout}>
                    {this.getFD('stockName', {
                        initialValue: details.stockName || '',
                        rules: [
                            { required: true, message: '必填' },
                            { max: 30, message: '不能超过30个字符' }
                        ],
                    })(
                        <Input  placeholder='请输入名称'/>
                        )}
                </FormItem>
                <FormItem label="所属站点" {...formItemLayout}>
                    {this.getFD('siteCode', {
                        initialValue: details.siteCode || '',
                        rules: [
                            { required: true, message: '必填！' }
                        ],
                    })(
                        <Select
                            onChange={this.siteChange}
                            placeholder="请选择所属站点"
                        >
                            {this.store.sitestore.options}
                        </Select>
                        )}
                </FormItem>
                <FormItem label="负责人" {...formItemLayout}>
                    {this.getFD('headCode', {
                        initialValue: details.headCode || '',
                    })(
                        <Select>
                            {this.store.memberstore.options}
                        </Select>
                        )}
                </FormItem>
                <FormItem label="地址" {...formItemLayout}>
                    <Select
                        value={details.addressCode || ''}
                        onChange={this.addrChange}
                    >
                        {this.store.addrliststore.options}
                    </Select>
                </FormItem>
                <Row>
                    <Col span={6}>
                        <AddNewAddrComp
                            isFetch
                            handleNewAddress={this.handleOkToAddress}
                            visible={this.store.newaddrstore.visible}
                            loading={this.store.newaddrstore.loading}
                            handleCancel={this.handleCancleToAddress}
                            onOk={this.onOkHandler}
                            width={750}
                        />
                    </Col>
                    <Col span={14} style={{marginBottom: '12px'}}>
                        <a href="#" onClick={() => this.handleClickAddress()}><i className='c2mfont c2m-tianjia' style={{marginRight: '5px'}}></i>添加新地址</a>
                    </Col>
                </Row>
                <FormItem label="备注" {...formItemLayout}>
                    {this.getFD('remark', {
                        initialValue: details.remark || '',
                        rules: [{ max: 200, message: '备注不能超过200字符！' }]
                    })(
                        <Input type='textarea' style={{height: '60px'}}/>
                        )}
                </FormItem>
            </Form>
        )


    }


}

const options = {
    onValuesChange(props, values) {

    }
}
export default Form.create(options)(AddWareHouseCont);
export { AddWareHouseCont };