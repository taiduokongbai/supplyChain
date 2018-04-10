import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox, Radio } from '../../../base/components/AntdComp';

import FormComp from '../../../base/mobxComps/FormComp';

import { materialDetailStore,materialDetailDWStore, materialDetailCGStore, materialDetailDWListStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let { observer } = mobxReact;

class MaterialDetailCGComp extends FormComp {
    constructor() {
        super();
        this.store = materialDetailStore;
        this.materialDetailCGStore = materialDetailCGStore;
        this.materialDetailDWListStore = materialDetailDWListStore;
        this.state = {
            flag: false,
            allowPurchase: '',
        }
    }
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    edit = () => {
        this.setState({ flag: true }, () => {
            let purchaseUnit = this.getFdv("purchaseUnit");
            let purchaseUnitName = this.materialDetailDWListStore.getLabelName(purchaseUnit);
            if (purchaseUnit == purchaseUnitName) {
                this.setFdv({ purchaseUnit: '' })
            }
        })
    }
    cancle = () => {
        this.setState({ flag: false })
    }
    handleChangeCG = (e) => {
        this.setState({
            allowPurchase: e.target.value,
        });
    }
    onMessage = () => {
        message.success('保存成功');
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const materialCode = this.store.detail.materialCode;
        this.validateFds((err, data) => {
            if (!err) {
                data = Object.assign({}, this.store.detail.materialPurchaseList.slice()[0], data);
                if (data.allowPurchase === true) {
                    data.allowPurchase = 0
                } else if (data.allowPurchase === false) {
                    data.allowPurchase = 1
                }
                this.materialDetailCGStore.fetchMaterialCGSubmit(data).then(json => {
                    if (json.status === 2000) {
                        this.onMessage();
                        this.setState({ flag: false });
                        this.store.fetchMaterialDetail({ materialCode });
                        materialDetailDWStore.setEditRecord();
                    }
                })
            }
        })
    }
    render() {
        let { detail, loading, dataSource } = this.store;
        return (
            <div>
                <div className="material-body-top material-body-top-borderR" style={{ height: 189 }}>
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>采购信息</strong></span>
                        {
                            this.state.flag ?
                                <span className="materialDetail-kc-btn">
                                    <i className="c2mfont c2m-baocun" onClick={this.handleSubmit} style={{ paddingRight: 7, fontSize: 20 }}></i>
                                    &nbsp;&nbsp;
                                                <i className="c2mfont c2m-quxiao" onClick={this.cancle} style={{ paddingRight: 7, fontSize: 20 }}></i>
                                </span> :
                                <span className="materialDetail-kc-btn">
                                    <i className="c2mfont c2m-bianji" onClick={this.edit} style={{ paddingRight: 7, fontSize: 35 }}></i>
                                </span>
                        }
                    </div>
                    <Form>
                        <div className="material-form-first">
                            <Row>
                                <Col span={12}>
                                    {this.state.flag ?
                                        <FormItem
                                            label="采购许可"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('allowPurchase', {
                                                initialValue: detail.materialPurchaseList[0].allowPurchase+'' || '0',
                                                onChange: this.handleChangeCG
                                            })(
                                                <RadioGroup>
                                                    <Radio value="0">是</Radio>
                                                    <Radio value="1">否</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                        :
                                        <FormItem className="material-label"
                                            label="采购许可"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            <span>{this.getE("materialAgreeSelect", detail.materialPurchaseList.slice()[0].allowPurchase + "")}</span>
                                        </FormItem>

                                    }
                                </Col>
                                <Col span={12}></Col>
                                <div className="material-line"></div>
                            </Row>
                        </div>
                        <Row>
                            <Col span={12}>
                                {this.state.flag ?
                                    <FormItem
                                        label="采购单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('purchaseUnit', {
                                            initialValue: detail.materialPurchaseList[0].purchaseUnit,
                                        })(
                                            <Select
                                                disabled={this.state.allowPurchase !== '' ? (this.state.allowPurchase == 0 ? false : true) : (detail.materialPurchaseList[0].allowPurchase == 0 ? false : true)}
                                            >
                                                {this.materialDetailDWListStore.options ? this.materialDetailDWListStore.options.slice() : []}
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="采购单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{detail.materialPurchaseList[0].purchaseUnitName}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={12}>
                                <FormItem style={{ display: 'none' }}
                                    label="物料编码"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 10 }}
                                >
                                    {this.getFD('materialCode', {
                                        initialValue: detail.materialCode,
                                    })(
                                        <Input />
                                        )}
                                </FormItem>

                            </Col>
                        </Row>
                        <Row>
                            <Col></Col>
                        </Row>
                    </Form>
                </div>
            </div>
        )
    }
}
const options = {
    onValuesChange(props, values) {
        materialDetailStore.setMaterialDetail(values)
    }
}
export default Form.create(options)(MaterialDetailCGComp);