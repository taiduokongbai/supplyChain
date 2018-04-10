import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox, Radio } from '../../../base/components/AntdComp';
import FormComp from '../../../base/mobxComps/FormComp';
import { formatNullStr } from '../../../base/consts/Utils';
import Measurestore from '../../../base/stores/measurestore';

import { materialDetailStore, measureStore,materialDetailDWStore, materialDetailKCStore, materialDetailDWListStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
let { observable, action, computed, runInAction, toJS } = mobx;
let { observer } = mobxReact;
@observer
class MaterialDetailKCComp extends FormComp {
    constructor() {
        super();
        this.store = materialDetailStore;
        this.measureStore = new Measurestore();
        this.materialDetailKCStore = materialDetailKCStore;
        this.materialDetailDWListStore = materialDetailDWListStore;
        this.state = {
            flag: false,
            usingWarehouse: '',
            usingBatch: '',
            usingExpiration: ''
        }
    }
    edit = () => {
        this.setState({ flag: true }, () => {
            let inventoryUnit = this.getFdv("inventoryUnit");
            let inventoryUnitName = this.materialDetailDWListStore.getLabelName(inventoryUnit);
            if (inventoryUnit == inventoryUnitName) {
                this.setFdv({ inventoryUnit: '' })
            }
        })
    }
    cancle = () => {
        this.setState({ flag: false })
    }
    handleChangeCC = (e) => {
        this.setState({
            usingWarehouse: e.target.value,
        });
    }
    handleChangePC = (e) => {
        if (e.target.checked) {
            // this.setFdv({
            //     usingBatch: 0
            // });
            this.setState({
                usingBatch: 0
            });
        } else {
            this.setState({
                usingBatch: 1
            })
        }
    }
    handleChangeBZQ = (e) => {
        const { setFieldsValue, getFieldValue } = this.props.form;
        if (e.target.checked) {
            this.setState({
                usingExpiration: 0
            });
        } else {
            this.setState({
                usingExpiration: 1
            });
        }
    }
    getE = (key, val) => {
        if (val !== undefined && val !== null && val !== "" && val !== "undefined") {
            return window.ENUM.getEnum(key, val)
        }
    };
    onMessage = () => {
        message.success('保存成功');
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const materialCode = this.store.detail.materialCode;
        this.validateFds((err, data) => {
            if (!err) {
                data = Object.assign({}, data);
                if (data.usingBatch === true) {
                    data.usingBatch = 0
                } else if (data.usingBatch === false) {
                    data.usingBatch = 1
                }
                if (data.usingExpiration === true) {
                    data.usingExpiration = 0
                } else if (data.usingExpiration === false) {
                    data.usingExpiration = 1
                }
                if (data.usingWarehouse === true) {
                    data.usingWarehouse = 0
                } else if (data.usingWarehouse === false) {
                    data.usingWarehouse = 1
                } else if (data.shelfLife === undefined) {
                    data.shelfLife = ''
                }
                if (data.materialInventoryType == undefined) {
                    data.materialInventoryType = ''
                }
                delete data.shelfLife2;
                this.materialDetailKCStore.fetchMaterialKCSubmit(data).then(json => {
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
        const { getFieldValue } = this.props.form;
        let usingWarehouse = getFieldValue('usingWarehouse');
        let usingExpiration = getFieldValue('usingExpiration');
        return (
            <div>
                <div className="material-body-top-borderR">
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>库存信息</strong></span>
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
                                            label="仓储管理"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('usingWarehouse', {
                                                initialValue: detail.materialInventoryList[0].usingWarehouse + '' || '0',
                                                onChange: this.handleChangeCC
                                            })(
                                                <RadioGroup>
                                                    <Radio value="0">是</Radio>
                                                    <Radio value="1">否</Radio>
                                                </RadioGroup>
                                                /* <Checkbox checked={this.state.usingWarehouse !== '' ? (this.state.usingWarehouse == 0 ? true : false) : (detail.materialInventoryList[0].usingWarehouse == 0 ? true : false)} onChange={this.handleChangeCC} /> */
                                                )}
                                        </FormItem>
                                        :
                                        <FormItem className="material-label"
                                            label="仓储管理"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            <span>{this.getE("materialStatusSelect", detail.materialInventoryList.slice()[0].usingWarehouse + "")}</span>
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
                                        label="存货类别："
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('materialInventoryType', {
                                            initialValue: detail.materialInventoryList.slice()[0].materialInventoryType && detail.materialInventoryList.slice()[0].materialInventoryType + "",
                                        })(
                                            <Select
                                                allowClear={true}
                                                disabled={this.state.usingWarehouse !== '' ? (this.state.usingWarehouse == 0 ? false : true) : (detail.materialInventoryList[0].usingWarehouse == 0 ? false : true)}
                                            >
                                                {
                                                    window.ENUM.getEnum("materialInventoryType").map(nature => {
                                                        return <Select.Option
                                                            value={nature.catCode.toString()} key={nature.catCode}>{nature.catName}
                                                        </Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="存货类别"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(this.getE("materialInventoryType", detail.materialInventoryList.slice()[0].materialInventoryType + ""))}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem
                                        label="库存单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('inventoryUnit', {
                                            initialValue: detail.materialInventoryList.slice()[0].inventoryUnit,
                                        })(
                                            <Select
                                                onSelect={this.onSelect}
                                                disabled={this.state.usingWarehouse !== '' ? ((detail.status == 1 || detail.status == 2) ? true : (this.state.usingWarehouse == 0 ? false : true)) : ((detail.status == 1 || detail.status == 2) ? true : (detail.materialInventoryList[0].usingWarehouse == 0 ? false : true))}
                                            >
                                                {this.materialDetailDWListStore.options ? this.materialDetailDWListStore.options.slice() : []}
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="库存单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{detail.materialInventoryList.slice()[0].inventoryUnitName}</span>
                                    </FormItem>
                                }

                            </Col>
                            <Col span={12}>
                                {this.state.flag ?
                                    <FormItem
                                        label="批次管理"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('usingBatch', {
                                            initialValue: detail.materialInventoryList[0].usingBatch,
                                        })(
                                            <Checkbox
                                                disabled={this.state.usingWarehouse !== '' ? (this.state.usingWarehouse == 0 ? false : true) : (detail.materialInventoryList[0].usingWarehouse == 0 ? false : true)}
                                                checked={this.state.usingBatch !== '' ? (this.state.usingBatch == 0 ? true : false) :
                                                    (detail.materialInventoryList[0].usingBatch == 0 ? true : false)}
                                                onChange={this.handleChangePC} />
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="批次管理"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{this.getE("materialStatusSelect", detail.materialInventoryList.slice()[0].usingBatch + "")}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem
                                        className="material-bzq"
                                        label="保质期管理"
                                        labelCol={{ span: 16 }}
                                        wrapperCol={{ span: 6 }}
                                    >
                                        {this.getFD('usingExpiration', {
                                            initialValue: detail.materialInventoryList ? detail.materialInventoryList[0].usingExpiration.toString() : '1',
                                        })(
                                            <Checkbox
                                                disabled={this.state.usingWarehouse !== '' ? (this.state.usingWarehouse == 0 ? false : true) : (detail.materialInventoryList[0].usingWarehouse == 0 ? false : true)}
                                                checked={this.state.usingExpiration !== '' ? (this.state.usingExpiration == 0 ? true : false) : (detail.materialInventoryList[0].usingExpiration == 0 ? true : false)} onChange={this.handleChangeBZQ}
                                            />
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="保质期管理"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{this.getE("materialStatusSelect", detail.materialInventoryList.slice()[0].usingExpiration + "")}</span>
                                    <span>{detail.materialInventoryList[0].shelfLife?("，保质期:"+formatNullStr(detail.materialInventoryList[0].shelfLife)):''}</span><span style={{ paddingLeft: 5 }}>{detail.materialInventoryList[0].shelfLife ? '天' : ''}</span>
                                    </FormItem>
                                }
                                {this.state.flag ? ((getFieldValue('usingExpiration') === false || (getFieldValue('usingExpiration') === '1')) ?
                                    <FormItem className="col-right-poskc">
                                        {this.getFD('shelfLife2', {
                                            initialValue: this.state.usingExpiration !== '' ? (this.state.usingExpiration == 0 ? detail.materialInventoryList[0].shelfLife : '') : (detail.materialInventoryList[0].usingExpiration == 0 ? detail.materialInventoryList[0].shelfLife : ''),
                                        })(
                                            <Input className="input-small" min={0} max={1000000}
                                                disabled={true} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>天</span>
                                    </FormItem> :
                                    <FormItem className="col-right-poskc">
                                        {this.getFD('shelfLife', {
                                            initialValue: detail.materialInventoryList[0].shelfLife,
                                            rules: [{ type: 'shelfLifeDay', label: '保质期' }],
                                        })(
                                            <Input className="input-small" min={0} max={1000000}
                                                disabled={this.state.usingWarehouse !== '' ?
                                                    (this.state.usingWarehouse == 0 ? (this.state.usingExpiration !== '' ?
                                                        (this.state.usingExpiration == 0 ? false : true) :
                                                        (detail.materialInventoryList[0].usingExpiration == 0 ? false : true)) : true) :
                                                    (detail.materialInventoryList[0].usingWarehouse == 0 ?
                                                        (this.state.usingExpiration !== '' ? (this.state.usingExpiration == 0 ? false : true) :
                                                            (detail.materialInventoryList[0].usingExpiration == 0 ? false : true)) : true)} />
                                            )}<span className="input-right-pos" style={{ paddingLeft: 5 }}>天</span>
                                    </FormItem>

                                ) : null
                                }
                            </Col>
                        </Row>
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
export default Form.create(options)(MaterialDetailKCComp);