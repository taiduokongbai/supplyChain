import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox, Radio } from '../../../base/components/AntdComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { formatNullStr } from '../../../base/consts/Utils';

import { materialDetailStore, materialDetailSXStore,materialDetailDWStore, materialDetailDWListStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let { observer } = mobxReact;

class MaterialDetailSXComp extends FormComp {
    constructor() {
        super();
        this.store = materialDetailStore;
        this.materialDetailSXStore = materialDetailSXStore;
        this.materialDetailDWListStore = materialDetailDWListStore;
        this.state = {
            flag: false,
            allowSell: '',
        }
    }
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    edit = () => {
        this.setState({ flag: true }, () => {
            let sellUnit = this.getFdv("sellUnit");
            let sellUnitName = this.materialDetailDWListStore.getLabelName(sellUnit);
            if (sellUnit == sellUnitName) {
                this.setFdv({ sellUnit: '' })
            }
        })
    }
    cancle = () => {
        this.setState({ flag: false })
    }
    handleChangeSX = (e) => {
        this.setState({
            allowSell: e.target.value,
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
                data = Object.assign({}, data);
                if (data.allowSell === true) {
                    data.allowSell = 0
                } else if (data.allowSell === false) {
                    data.allowSell = 1
                }
                this.materialDetailSXStore.fetchMaterialSXSubmit(data).then(json => {
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
                <div className="material-body-top material-body-top-borderR">
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>销售信息</strong></span>
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
                                            label="销售许可"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('allowSell', {
                                                initialValue: detail.materialSellList[0].allowSell+'' || '0',
                                                onChange: this.handleChangeSX
                                            })(
                                                <RadioGroup>
                                                    <Radio value="0">是</Radio>
                                                    <Radio value="1">否</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                        :
                                        <FormItem className="material-label"
                                            label="销售许可"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            <span>{this.getE("materialAgreeSelect", detail.materialSellList[0].allowSell + "")}</span>
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
                                        label="起订量"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('minOrder', {
                                            initialValue: detail.materialSellList[0].minOrder,
                                            rules: [{ type: 'gtEqZeroNum', label: '起订量' }],
                                        })(
                                            <Input disabled={this.state.allowSell !== '' ? (this.state.allowSell == 0 ? false : true) : (detail.materialSellList[0].allowSell == 0 ? false : true)} />
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="起订量"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialSellList[0].minOrder)}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem
                                        label="销售单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('sellUnit', {
                                            initialValue: detail.materialSellList[0].sellUnit,
                                        })(
                                            <Select
                                                disabled={this.state.allowSell !== '' ? (this.state.allowSell == 0 ? false : true) : (detail.materialSellList[0].allowSell == 0 ? false : true)}
                                            >
                                                {this.materialDetailDWListStore.options ? this.materialDetailDWListStore.options.slice() : []}
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="销售单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{detail.materialSellList[0].sellUnitName}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={12}>
                            </Col>
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
export default Form.create(options)(MaterialDetailSXComp);