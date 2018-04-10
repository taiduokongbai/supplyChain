import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox, Radio } from '../../../base/components/AntdComp';
import SearchBarComp from '../../../base/mobxComps/SearchBarComp';
import { enumStore } from '../../../base/stores/EnumStore';
import FormComp from '../../../base/mobxComps/FormComp';
import { formatNullStr } from '../../../base/consts/Utils';
//redux的store 和 tab标签页action
import { store } from '../../data/StoreConfig';
import TabsAct from '../../actions/TabsAct';
import { materialDetailStore, measureStore, materialDetailJHStore,materialDetailDWStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;

class MaterialDetailJHComp extends FormComp {
    constructor() {
        super();
        this.store = materialDetailStore;
        this.measureStore = measureStore;
        this.materialDetailJHStore = materialDetailJHStore;
        this.state = {
            flag: false,
            enabledPlanManage: '',
        }
    }
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    edit = () => {
        this.setState({ flag: true })
    }
    cancle = () => {
        this.setState({ flag: false })
    }
    onMessage = () => {
        message.success('保存成功');
    }
    handleChangeJH = (e) => {
        this.setState({
            enabledPlanManage: e.target.value,
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const materialCode = this.store.detail.materialCode;
        this.validateFds((err, data) => {
            if (!err) {
                data = Object.assign({}, data);
                this.materialDetailJHStore.fetchMaterialJHSubmit(data).then(json => {
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
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    render() {
        let { detail, loading, dataSource } = this.store;
        return (
            <div>
                <div className="material-body-top material-body-top-borderR">
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>计划信息</strong></span>
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
                                <Col span={8}>
                                    {this.state.flag ?
                                        <FormItem
                                            label="计划管理"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('enabledPlanManage', {
                                                initialValue: detail.materialPlanList[0].enabledPlanManage +'' || '0',
                                                onChange: this.handleChangeJH
                                            })(
                                                <RadioGroup>
                                                    <Radio value="0">是</Radio>
                                                    <Radio value="1">否</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                        :
                                        <FormItem className="material-label"
                                            label="计划管理"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            <span>{this.getE("materialStatusSelect", detail.materialPlanList[0].enabledPlanManage + "")}</span>
                                        </FormItem>

                                    }
                                </Col>
                                <Col span={12}></Col>
                                <div className="material-lineJH"></div>
                            </Row>
                        </div>
                        <Row>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem
                                        label="计划属性："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialProperty', {
                                            initialValue: detail.materialPlanList[0].materialProperty + "" || '0',
                                        })(
                                            <Select
                                                disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)}
                                            >
                                                {
                                                    window.ENUM.getEnum("materialPro").map(nature => {
                                                        return <Select.Option value={nature.catCode.toString()} key={nature.catCode}>{nature.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="计划属性："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{this.getE('materialPro', detail.materialPlanList[0].materialProperty + "")}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem
                                        label="计划策略："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('planStrategy', {
                                            initialValue: detail.materialPlanList[0].planStrategy + "",
                                        })(
                                            <Select
                                                allowClear={true}
                                                disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)}
                                            >
                                                {
                                                    window.ENUM.getEnum("planStrategy").map(nature => {
                                                        return <Select.Option value={nature.catCode.toString()} key={nature.catCode}>{nature.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="计划策略："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(this.getE("planStrategy", detail.materialPlanList[0].planStrategy + ""))}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem
                                        label="补货方式："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('repMethod', {
                                            initialValue: detail.materialPlanList[0].repMethod + "",
                                        })(
                                            <Select
                                                allowClear={true}
                                                disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)}
                                            >
                                                {
                                                    window.ENUM.getEnum("repMethod").map(nature => {
                                                        return <Select.Option value={nature.catCode.toString()} key={nature.catCode}>{nature.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="补货方式："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(this.getE("repMethod", detail.materialPlanList[0].repMethod + ""))}</span>
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="固定制造提前期："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('fixMakeAdvance', {
                                            initialValue: detail.materialPlanList[0].fixMakeAdvance || null,
                                            rules: [{ type: 'day', label: '固定制造提前期' }],
                                        })(
                                            <Input
                                                disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)}
                                            />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>天</span>
                                    </FormItem>
                                    : <FormItem
                                        label="固定制造提前期："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].fixMakeAdvance)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].fixMakeAdvance ? '天' : ''}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="固定采购提前期："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('fixPurchaseAdvance', {
                                            initialValue: detail.materialPlanList[0].fixPurchaseAdvance || '',
                                            rules: [{ type: 'day', label: '固定采购提前期' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>天</span>
                                    </FormItem>
                                    : <FormItem
                                        label="固定采购提前期："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].fixPurchaseAdvance)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].fixPurchaseAdvance ? '天' : ''}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="固定配送提前期："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('fixDispatchAdvance', {
                                            initialValue: detail.materialPlanList[0].fixDispatchAdvance || '',
                                            rules: [{ type: 'day', label: '固定配送提前期' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>天</span>
                                    </FormItem>
                                    : <FormItem
                                        label="固定配送提前期："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].fixDispatchAdvance)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].fixDispatchAdvance ? '天' : ''}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="最大订单量："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('maxOrderQuantity', {
                                            initialValue: detail.materialPlanList[0].maxOrderQuantity,
                                            rules: [{ type: 'gtEqZeroNum', label: '最大订单量' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>{detail.baseUnitName ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                    : <FormItem
                                        label="最大订单量："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].maxOrderQuantity)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].maxOrderQuantity ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="最小订单量："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('minOrderQuantity', {
                                            initialValue: detail.materialPlanList[0].minOrderQuantity,
                                            rules: [{ type: 'gtEqZeroNum', label: '最小订单量' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>{detail.baseUnitName ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                    : <FormItem
                                        label="最小订单量："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].minOrderQuantity)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].minOrderQuantity ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="最小批量："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('minBatch', {
                                            initialValue: detail.materialPlanList[0].minBatch,
                                            rules: [{ type: 'gtEqZeroNum', label: '最小批量' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>{detail.baseUnitName ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                    : <FormItem
                                        label="最小批量："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].minBatch)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].minBatch ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="最小库存："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('minInventory', {
                                            initialValue: detail.materialPlanList[0].minInventory,
                                            rules: [{ type: 'gtEqZeroNum', label: '最小库存' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>{detail.baseUnitName ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                    : <FormItem
                                        label="最小库存："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].minInventory)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].minInventory ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                }{this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="安全库存："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('safeInventory', {
                                            initialValue: detail.materialPlanList[0].safeInventory,
                                            rules: [{ type: 'gtEqZeroNum', label: '安全库存' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>{detail.baseUnitName ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                    : <FormItem
                                        label="安全库存："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].safeInventory)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].safeInventory ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="最大库存："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('maxInventory', {
                                            initialValue: detail.materialPlanList[0].maxInventory,
                                            rules: [{ type: 'gtEqZeroNum', label: '最大库存' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>{detail.baseUnitName ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                    : <FormItem
                                        label="最大库存："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].maxInventory)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].maxInventory ? detail.baseUnitName : ''}</span>
                                    </FormItem>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>
                                {this.state.flag ?
                                    <FormItem className="col-right-pos"
                                        label="订单合并期间："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('orderPeriod', {
                                            initialValue: detail.materialPlanList[0].orderPeriod,
                                            rules: [{ type: 'day', label: '订单合并期间' }],
                                        })(
                                            <Input disabled={this.state.enabledPlanManage !== '' ? (this.state.enabledPlanManage == 0 ? false : true) : (detail.materialPlanList[0].enabledPlanManage == 0 ? false : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>天</span>
                                    </FormItem>
                                    : <FormItem
                                        label="订单合并期间："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.materialPlanList[0].orderPeriod)}</span><span style={{ paddingLeft: 5 }}>{detail.materialPlanList[0].orderPeriod ? '天' : ''}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={8}></Col>
                            <Col span={8}></Col>
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
export default Form.create()(MaterialDetailJHComp);