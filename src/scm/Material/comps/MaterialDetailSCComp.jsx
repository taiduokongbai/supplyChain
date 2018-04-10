import React, { Component } from 'react';
import { Form, Table, Button, Select, Input, Popconfirm, message, TreeSelect, Spin, Row, Col, AutoComplete, InputNumber, Checkbox, Radio } from '../../../base/components/AntdComp';

import FormComp from '../../../base/mobxComps/FormComp';
import { formatNullStr } from '../../../base/consts/Utils';
//redux的store 和 tab标签页action
import { materialDetailStore,materialDetailDWStore, materialDetailSCStore, materialDetailDWListStore } from '../stores/MaterialDetailStore';
let Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
let { observer } = mobxReact;

class MaterialDetailSCComp extends FormComp {
    constructor() {
        super();
        this.store = materialDetailStore;
        this.materialDetailSCStore = materialDetailSCStore;
        this.materialDetailDWListStore = materialDetailDWListStore;
        this.state = {
            flag: false,
            allowOverquota: '',
            enabledProduceManage: ''
        }
    }
    edit = () => {
        this.setState({ flag: true }, () => {
            let produceUnit = this.getFdv("produceUnit");
            let produceUnitName = this.materialDetailDWListStore.getLabelName(produceUnit);
            if (produceUnit == produceUnitName) {
                this.setFdv({ produceUnit: '' })
            }
        })
    }
    cancle = () => {
        this.setState({ flag: false })
    }
    handleChangeCF = (e) => {
        if (e.target.checked) {
            this.setState({
                allowOverquota: 0
            });
        } else {
            this.setState({
                allowOverquota: 1
            })
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
                data = Object.assign({}, this.store.detail.scmMaterialProduceList.slice()[0], data);
                if (data.allowOverquota === true) {
                    data.allowOverquota = 0
                } else if (data.allowOverquota === false) {
                    data.allowOverquota = 1
                }
                this.materialDetailSCStore.fetchMaterialSCSubmit(data).then(json => {
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
    handleChangeSC = (e) => {
        this.setState({
            enabledProduceManage: e.target.value,
        });
    }
    render() {
        let { detail, loading, dataSource } = this.store;
        return (
            <div>
                <div className="material-body-top-borderR">
                    <div className="material-baseInfo">
                        <span className="material-form-baseInfo"><strong>生产信息</strong></span>
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
                                            label="生产管理"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            {this.getFD('enabledProduceManage', {
                                                initialValue: detail.scmMaterialProduceList[0].enabledProduceManage+''|| '0',
                                                onChange: this.handleChangeSC
                                            })(
                                                <RadioGroup>
                                                    <Radio value="0">是</Radio>
                                                    <Radio value="1">否</Radio>
                                                </RadioGroup>
                                                )}
                                        </FormItem>
                                        :
                                        <FormItem className="material-label"
                                            label="生产管理"
                                            labelCol={{ span: 6 }}
                                            wrapperCol={{ span: 10 }}
                                        >
                                            <span>{this.getE("materialStatusSelect", detail.scmMaterialProduceList.slice()[0].enabledProduceManage + "")}</span>
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
                                        label="发料方式"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('issueWay', {
                                            initialValue: detail.scmMaterialProduceList.slice()[0].issueWay + "",
                                        })(
                                            <Select
                                                allowClear={true}
                                                disabled={this.state.enabledProduceManage !== '' ? (this.state.enabledProduceManage == 0 ? false : true) : (detail.scmMaterialProduceList[0].enabledProduceManage == 0 ? false : true)}
                                            >
                                                {
                                                    window.ENUM.getEnum("materialProduceIssueWay").map(nature => {
                                                        return <Select.Option value={nature.catCode.toString()} key={nature.catCode}>{nature.catName}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="发料方式"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(this.getE("materialProduceIssueWay", detail.scmMaterialProduceList.slice()[0].issueWay + ""))}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem
                                        label="最小发料批量"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('minIssue', {
                                            initialValue: detail.scmMaterialProduceList[0].minIssue || '',
                                            rules: [
                                                { type: 'gtEqZeroNum', label: '最小发料批量' },
                                            ],
                                        })(
                                            <Input disabled={this.state.enabledProduceManage !== '' ? (this.state.enabledProduceManage == 0 ? false : true) : (detail.scmMaterialProduceList[0].enabledProduceManage == 0 ? false : true)} />
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="最小发料批量"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{formatNullStr(detail.scmMaterialProduceList[0].minIssue)}</span>
                                    </FormItem>
                                }
                            </Col>
                            <Col span={12}>

                                {this.state.flag ?
                                    <FormItem
                                        label="超发"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('allowOverquota', {
                                            initialValue: detail.scmMaterialProduceList[0].allowOverquota || '1',
                                        })(
                                            <Checkbox
                                                disabled={this.state.enabledProduceManage !== '' ? (this.state.enabledProduceManage == 0 ? false : true) : (detail.scmMaterialProduceList[0].enabledProduceManage == 0 ? false : true)}
                                                checked={this.state.allowOverquota !== '' ? (this.state.allowOverquota == 0 ? true : false) : (detail.scmMaterialProduceList[0].allowOverquota == 0 ? true : false)} onChange={this.handleChangeCF} />
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="超发"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                    <span>{this.getE("materialAgreeSelect", detail.scmMaterialProduceList[0].allowOverquota + "")}</span>
                                    </FormItem>
                                }
                                {this.state.flag ?
                                    <FormItem
                                        label="生产单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        {this.getFD('produceUnit', {
                                            initialValue: detail.scmMaterialProduceList[0].produceUnit,
                                        })(
                                            <Select
                                                disabled={this.state.enabledProduceManage !== '' ? (this.state.enabledProduceManage == 0 ? false : true) : (detail.scmMaterialProduceList[0].enabledProduceManage == 0 ? false : true)}
                                            >
                                                {this.materialDetailDWListStore.options ? this.materialDetailDWListStore.options.slice() : []}
                                            </Select>
                                            )}
                                    </FormItem>
                                    :
                                    <FormItem
                                        label="生产单位"
                                        labelCol={{ span: 6 }}
                                        wrapperCol={{ span: 10 }}
                                    >
                                        <span>{detail.scmMaterialProduceList[0].produceUnitName}</span>
                                    </FormItem>
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
export default Form.create(options)(MaterialDetailSCComp);